"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Heading from './Heading'

export default function Game() {
  const canvasRef = useRef(null);
  const [gameWon, setGameWon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discordUser, setDiscordUser] = useState<{id: string, username: string, display_name?: string} | null>(null);
  const [userWallet, setUserWallet] = useState<string>('');
  const [showServerJoin, setShowServerJoin] = useState(false);
  const [serverCheckCount, setServerCheckCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [isInServer, setIsInServer] = useState(false);
  const [tokenSent, setTokenSent] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameInitialized, setGameInitialized] = useState(false);
  const gameStateRef = useRef({
    characterPosition: null,
    gameWon: false,
    initialized: false
  });

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let character: THREE.Mesh;
  let fireEffect: THREE.Mesh;
  let goal: THREE.Object3D;
  let fireParticles: THREE.Points;
  
  let tiltX = 0, tiltZ = 0;
  let characterVelocity = new THREE.Vector3();
  let walls: THREE.Mesh[] = [];
  let maze: THREE.Group;
  let floor: THREE.Mesh;
  const particleCount = 30;

  const WALL_HEIGHT = 3;
  const WALL_SIZE = 12; 
  const BALL_HEIGHT = WALL_HEIGHT + 3; // Much higher - float above walls
  const BALL_RADIUS = 1.8;
  const FLOOR_Y = 0;
  const MAZE_SIZE = 15 * WALL_SIZE / 2;

  const mazeLayout = {
    layout: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,1,1,0,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
      [1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    start: { x: 1, z: 1 },
    goal: { x: 13, z: 13 }
  };

  useEffect(() => {
    // Check URL params immediately on mount
    const urlParams = new URLSearchParams(window.location.search);
    const discordId = urlParams.get('discord_id');
    
    // Only show intro if user is NOT logged in and game is NOT won
    if (!discordId && !gameWon) {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x330066, 15, 80);

    const isMobileDevice = window.innerWidth <= 768;
    camera = new THREE.PerspectiveCamera(
      isMobileDevice ? 90 : 75, // Wider FOV on mobile
      window.innerWidth / window.innerHeight, 
      0.05, 
      1000
    );
    camera.position.set(
      0, 
      isMobileDevice ? 35 : 20, // Higher camera on mobile
      isMobileDevice ? 35 : 20  // Further back on mobile
    );
    camera.lookAt(0, 0, 0);

    if (!canvasRef.current) {
      throw new Error('Canvas ref is not assigned');
    }
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1a0033);
    renderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 10);
    scene.add(ambientLight);

    const neonLight = new THREE.PointLight(0xffffff, 3, 50);
    neonLight.position.set(-10, 15, -10);
    scene.add(neonLight);

    // Dedicated light for the goal area
    const goalLight = new THREE.PointLight(0xffffff, 1.5, 30);
    goalLight.position.set(
      (mazeLayout.goal.x - mazeLayout.layout.length / 2) * WALL_SIZE,
      BALL_HEIGHT + 10,
      (mazeLayout.goal.z - mazeLayout.layout[0].length / 2) * WALL_SIZE
    );
    scene.add(goalLight);

    createMaze();
    createCharacter();

    if (gameStateRef.current.characterPosition && gameStateRef.current.initialized) {
      character.position.copy(gameStateRef.current.characterPosition);
      fireEffect.position.set(
        character.position.x, 
        BALL_HEIGHT - 0.7, 
        character.position.z
      );
      setGameWon(gameStateRef.current.gameWon);
    }
    setGameInitialized(true);

    createGoal();
    setupControls();

    const animate = () => {
      updateCharacterPhysics();
      fireEffect.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      const time = Date.now() * 0.001;
      if (goal && goal.position) {
        goal.position.y = BALL_HEIGHT + 0.5 + Math.sin(time) * 0.2; // Float at ball level
      }
      const cameraOffset = isMobile ? new THREE.Vector3(0, 40, 40) : new THREE.Vector3(0, 25, 25);
      const targetCameraPos = character.position.clone().add(cameraOffset);
      camera.position.lerp(targetCameraPos, 0.08);
      
      const lookTarget = character.position.clone().add(new THREE.Vector3(0, 2, 0));
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      
      camera.fov = newIsMobile ? 90 : 75;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
      }, []);

    useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Check if there's a stored scroll position
    const storedScrollPosition = history.state?.scrollPosition;
    if (storedScrollPosition) {
      window.scrollTo(0, storedScrollPosition);
    }
    
    return () => {
      // Re-enable scroll restoration when component unmounts
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  function createMaze() {
    maze = new THREE.Group();
    walls = [];

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xb133ff,
      emissive: 0xb133ff,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aafa,
      emissive: 0x00aafa,
      emissiveIntensity: 1.0,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9
    });

    for (let x = 0; x < mazeLayout.layout.length; x++) {
      for (let z = 0; z < mazeLayout.layout[x].length; z++) {
        if (mazeLayout.layout[x][z] === 1) {
          const wallGeometry = new THREE.BoxGeometry(WALL_SIZE, WALL_HEIGHT, WALL_SIZE);
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(
            (x - mazeLayout.layout.length / 2) * WALL_SIZE,
            WALL_HEIGHT / 2,
            (z - mazeLayout.layout[x].length / 2) * WALL_SIZE
          );
          wall.castShadow = true;
          maze.add(wall);
          walls.push(wall);
        }
      }
    }

    const floorGeometry = new THREE.PlaneGeometry(
      mazeLayout.layout.length * WALL_SIZE,
      mazeLayout.layout[0].length * WALL_SIZE
    );
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    maze.add(floor);
    scene.add(maze);
  }

  function createCharacter() {
    const characterGeometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const characterMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc2e0,
    fog: false
  });

    character = new THREE.Mesh(characterGeometry, characterMaterial);
    character.position.set(
      (mazeLayout.start.x - mazeLayout.layout.length / 2) * WALL_SIZE,
      BALL_HEIGHT,
      (mazeLayout.start.z - mazeLayout.layout[0].length / 2) * WALL_SIZE
    );
    character.castShadow = true;
    scene.add(character);

    const fireGeometry = new THREE.ConeGeometry(0.5, 1, 16);
    const fireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    });
    fireEffect = new THREE.Mesh(fireGeometry, fireMaterial);
    fireEffect.position.set(
      character.position.x,
      BALL_HEIGHT - 0.7,
      character.position.z
    );
    fireEffect.rotation.x = Math.PI;
    scene.add(fireEffect);

    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = -Math.random() * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    fireParticles = new THREE.Points(particles, particleMaterial);
    scene.add(fireParticles);
  }

  function createGoal() {
    const loader = new FBXLoader();
    
    loader.load('/lfp.fbx', 
      (object3d) => {
        goal = object3d;
        goal.scale.set(0.07, 0.07, 0.07); // Scale up the model
        goal.position.set(
          (mazeLayout.goal.x - mazeLayout.layout.length / 2) * WALL_SIZE,
          BALL_HEIGHT + 0.5,
          (mazeLayout.goal.z - mazeLayout.layout[0].length / 2) * WALL_SIZE
        );
        
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/texture.png', 
      (texture) => {
        goal.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              map: texture,
              color: 0xffffff,
              transparent: false
            });
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        // Fallback to golden material if texture fails
        goal.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: 0xffd700
            });
          }
        });
      }
    );
        
        maze.add(goal);
      },
      (progress) => {
      },
      (error) => {
        console.error('Error loading FBX:', error);
        createFallbackGoal();
      }
    );
  }

  function createFallbackGoal() {
    const goalGeometry = new THREE.BoxGeometry(1, 1, 1);
    const goalMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.2
    });
    
    goal = new THREE.Mesh(goalGeometry, goalMaterial);
    goal.position.set(
      (mazeLayout.goal.x - mazeLayout.layout.length / 2) * WALL_SIZE,
      BALL_HEIGHT + 0.5,
      (mazeLayout.goal.z - mazeLayout.layout[0].length / 2) * WALL_SIZE
    );
    
    maze.add(goal);
  }

  function setupControls() {
    const keys: { [key: string]: boolean } = { ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobile && keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isMobile && keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Simple direct movement update loop
    const updateMovement = () => {
      const moveSpeed = 0.09;

      // Reset movement forces
      let moveX = 0;
      let moveZ = 0;

      // Direct movement - no tilt
      if (keys['ArrowUp'] || document.getElementById('tiltUp')?.dataset.active === 'true') moveZ -= moveSpeed;
      if (keys['ArrowDown'] || document.getElementById('tiltDown')?.dataset.active === 'true') moveZ += moveSpeed;
      if (keys['ArrowLeft'] || document.getElementById('tiltLeft')?.dataset.active === 'true') moveX -= moveSpeed;
      if (keys['ArrowRight'] || document.getElementById('tiltRight')?.dataset.active === 'true') moveX += moveSpeed;

      // Apply movement directly to velocity
      characterVelocity.x += moveX;
      characterVelocity.z += moveZ;

      requestAnimationFrame(updateMovement);
    };
    updateMovement();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }

  function updateCharacterPhysics() {
    if (gameWon) return;

    const friction = 0.92;
    const maxVelocity = 0.8;
    
    // Cap velocity 
    characterVelocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, characterVelocity.x));
    characterVelocity.z = Math.max(-maxVelocity, Math.min(maxVelocity, characterVelocity.z));
    
    // Apply friction
    characterVelocity.multiplyScalar(friction);

    // Store old position
    const oldPos = character.position.clone();
    
    // Calculate new position
    const newPos = oldPos.clone();
    newPos.x += characterVelocity.x;
    newPos.z += characterVelocity.z;

    // Check if new position collides with any wall
    let hasCollision = false;
    
    for (let wall of walls) {
      const wallPos = wall.position;
      const halfWall = WALL_SIZE / 2;
      const totalRadius = BALL_RADIUS + 0.1; // Small buffer
      
      // Check if ball overlaps with wall
      if (newPos.x + totalRadius > wallPos.x - halfWall &&
          newPos.x - totalRadius < wallPos.x + halfWall &&
          newPos.z + totalRadius > wallPos.z - halfWall &&
          newPos.z - totalRadius < wallPos.z + halfWall) {
        
        hasCollision = true;
        break;
      }
    }
    
    if (hasCollision) {
      // Try moving only in X direction
      const testX = oldPos.clone();
      testX.x += characterVelocity.x;
      
      let canMoveX = true;
      for (let wall of walls) {
        const wallPos = wall.position;
        const halfWall = WALL_SIZE / 2;
        const totalRadius = BALL_RADIUS + 0.1;
        
        if (testX.x + totalRadius > wallPos.x - halfWall &&
            testX.x - totalRadius < wallPos.x + halfWall &&
            testX.z + totalRadius > wallPos.z - halfWall &&
            testX.z - totalRadius < wallPos.z + halfWall) {
          canMoveX = false;
          break;
        }
      }
      
      // Try moving only in Z direction
      const testZ = oldPos.clone();
      testZ.z += characterVelocity.z;
      
      let canMoveZ = true;
      for (let wall of walls) {
        const wallPos = wall.position;
        const halfWall = WALL_SIZE / 2;
        const totalRadius = BALL_RADIUS + 0.1;
        
        if (testZ.x + totalRadius > wallPos.x - halfWall &&
            testZ.x - totalRadius < wallPos.x + halfWall &&
            testZ.z + totalRadius > wallPos.z - halfWall &&
            testZ.z - totalRadius < wallPos.z + halfWall) {
          canMoveZ = false;
          break;
        }
      }
      
      // Apply movement that doesn't cause collision
      if (canMoveX) {
        character.position.x = testX.x;
      } else {
        characterVelocity.x *= -0.2; // Small bounce
      }
      
      if (canMoveZ) {
        character.position.z = testZ.z;
      } else {
        characterVelocity.z *= -0.2;   
      }
    } else {
      // No collision, move freely
      character.position.x = newPos.x;
      character.position.z = newPos.z;
    }

    // Boundary checks
    const maxX = MAZE_SIZE - BALL_RADIUS - 1;
    const maxZ = MAZE_SIZE - BALL_RADIUS - 1;
    
    if (character.position.x < -maxX) {
      character.position.x = -maxX;
      characterVelocity.x = Math.abs(characterVelocity.x) * 0.3;
    }
    if (character.position.x > maxX) {
      character.position.x = maxX;
      characterVelocity.x = -Math.abs(characterVelocity.x) * 0.3;
    }
    if (character.position.z < -maxZ) {
      character.position.z = -maxZ;
      characterVelocity.z = Math.abs(characterVelocity.z) * 0.3;
    }
    if (character.position.z > maxZ) {
      character.position.z = maxZ;
      characterVelocity.z = -Math.abs(characterVelocity.z) * 0.3;
    }
    
    // FORCE ball to stay at exact height - never move up or down
    character.position.y = BALL_HEIGHT;
    
    // Log position to catch weird behavior
    if (character.position.y !== BALL_HEIGHT) {
      console.log("Ball Y position was wrong:", character.position.y, "fixing to:", BALL_HEIGHT);
    }

    // Update fire effect and particles
    fireEffect.position.set(character.position.x, BALL_HEIGHT - 0.7, character.position.z);

    const positions = fireParticles.geometry.attributes.position.array;
    const velocities = fireParticles.geometry.attributes.velocity.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 1] < BALL_HEIGHT - 1.5) {
        positions[i * 3] = character.position.x;
        positions[i * 3 + 1] = BALL_HEIGHT - 0.7;
        positions[i * 3 + 2] = character.position.z;
        velocities[i * 3] = (Math.random() - 0.5) * 0.2;
        velocities[i * 3 + 1] = -Math.random() * 0.5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      }
    }
    fireParticles.geometry.attributes.position.needsUpdate = true;

    // Check for win condition - 3x bigger win area (only if goal exists)
    if (goal && goal.position && character.position.distanceTo(goal.position) < 12.0) { // 3x bigger area
      setGameWon(true);
    }
  }

  function resetGame() {
    character.position.set(
      (mazeLayout.start.x - mazeLayout.layout.length / 2) * WALL_SIZE,
      BALL_HEIGHT,
      (mazeLayout.start.z - mazeLayout.layout[0].length / 2) * WALL_SIZE
    );
    fireEffect.position.set(character.position.x, BALL_HEIGHT - 0.7, character.position.z);
    const positions = fireParticles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = character.position.x;
      positions[i * 3 + 1] = BALL_HEIGHT - 0.7;
      positions[i * 3 + 2] = character.position.z;
    }
    fireParticles.geometry.attributes.position.needsUpdate = true;
    characterVelocity.set(0, 0, 0);
    tiltX = 0;
    tiltZ = 0;
    setGameWon(false);
  }

  const handleButton = (direction: string, active: boolean) => {
    const button = document.getElementById(direction);
    if (button) button.dataset.active = active.toString();
  };

  const handleDiscordLogin = () => {
  // Store current scroll position before opening popup
  sessionStorage.setItem('preLoginScroll', window.scrollY.toString());
  
  const popup = window.open(
    '/api/discord', 
    'discord-login', 
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );
  
  // Listen for messages from popup
  const messageHandler = (event: MessageEvent) => {
    // Make sure the message is from your domain
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'DISCORD_LOGIN_SUCCESS') {
      // Login successful, update state
      setShowIntro(false);
      setDiscordUser({
        id: event.data.discord_id,
        username: event.data.discord_username,
        display_name: event.data.discord_display_name
      });
      setIsLoggedIn(true);
      setIsInServer(event.data.is_in_server || false);
      
      if (!event.data.is_in_server) {
        setShowServerJoin(true);
      }
      
      // Close popup and cleanup
      popup?.close();
      window.removeEventListener('message', messageHandler);
    }
  };
  
  window.addEventListener('message', messageHandler);
  
  // Fallback: check if popup closed manually
  const checkClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkClosed);
      window.removeEventListener('message', messageHandler);
    }
  }, 1000);
};

  useEffect(() => {
  if (isLoggedIn) {
    const storedScroll = sessionStorage.getItem('preLoginScroll');
    if (storedScroll) {
      const scrollPosition = parseInt(storedScroll);
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
        sessionStorage.removeItem('preLoginScroll');
      });
    }
  }
}, [isLoggedIn]);

const checkServerMembership = async () => {
  if (!discordUser) return;
  
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch(`/api/check-server?discord_id=${discordUser.id}`);
    const data = await response.json();
    
    
    if (data.isInServer) {
      setIsInServer(true);
      setShowServerJoin(false);
      setError('');
      setServerCheckCount(0); 
    } else {
      setServerCheckCount(prev => prev + 1);
      if (serverCheckCount >= 2) { 
        setError('Please make sure you\'ve joined the server and try again. It may take a few minutes to sync.');
      } else {
        setError('Server membership not detected yet. Please wait a moment and try again.');
      }
    }
  } catch (err) {
    console.error('Server check error:', err);
    setError('Failed to verify server membership. Please try again.');
  }
  
  setLoading(false);
};

const handleWalletSubmit = async () => {
  if (!discordUser) {
    setError('Please login with Discord first');
    return;
  }
  
  // If wallet already exists and timeLeft > 0, they can't claim yet
  if (walletAddress && timeLeft > 0) {
    setError(`Please wait ${Math.floor(timeLeft / 60)}h ${timeLeft % 60}m before claiming again.`);
    return;
  }
  
  // If no wallet set, require wallet input
  if (!walletAddress && !userWallet.trim()) {
    setError('Please enter a valid wallet address');
    return;
  }
  
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    const response = await fetch('/api/submit-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discord_id: discordUser.id,
        wallet_address: walletAddress || userWallet.trim(),
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setSuccess(`TX: ${data.transaction_hash}`);
      setTransactionHash(data.transaction_hash);
      setTokenSent(true);
      if (!walletAddress) {
        setWalletAddress(userWallet.trim());
      }
      // 24 hours = 1440 minutes
      setTimeLeft(1440);
    } else {
      if (data.timeLeft) {
        const hours = Math.floor(data.timeLeft / 60);
        const minutes = data.timeLeft % 60;
        setTimeLeft(data.timeLeft);
        setError(`Please wait ${hours}h ${minutes}m before claiming again.`);
      } else {
        setError(data.error || 'Failed to send tokens');
      }
    }
  } catch (err) {
    setError('Network error occurred');
  }
  
  setLoading(false);
};

useEffect(() => {
  let interval: NodeJS.Timeout;
  let attempts = 0;
  
  if (showServerJoin && discordUser && !loading) {
    const checkFrequency = attempts < 5 ? 5000 : 10000; // 5s first 5 times, then 10s
    
    interval = setInterval(() => {
      attempts++;
      checkServerMembership();
    }, checkFrequency);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [showServerJoin, discordUser, loading, serverCheckCount]);

useEffect(() => {
  if (discordUser && isInServer) {
    checkWalletStatus();
  }
}, [discordUser, isInServer]);

useEffect(() => {
  if (isLoggedIn || gameWon) {
    setShowIntro(false);
  }
}, [isLoggedIn, gameWon]);

useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer reached 0, user can claim again
          setTokenSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [timeLeft]);

const checkWalletStatus = async () => {
  if (!discordUser) return;
  
  try {
    const response = await fetch(`/api/check-wallet?discord_id=${discordUser.id}`);
    const data = await response.json();
    
    if (data.wallet_address) {
      setWalletAddress(data.wallet_address);
      
      if (data.timeLeft && data.timeLeft > 0) {
        setTimeLeft(data.timeLeft);
        setTokenSent(true); // They have claimed recently
      } else {
        setTokenSent(false); // They can claim now
        setTimeLeft(0);
      }
      
      if (data.transaction_hash) {
        setTransactionHash(data.transaction_hash);
        if (data.timeLeft && data.timeLeft > 0) {
          setSuccess(`TX: ${data.transaction_hash}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to check wallet status:', error);
  }
};

  return (
    <div className="font-['Orbitron']">
    
      <section id="game" className="">
        <Heading text="LFP MAZE GAME" className="mt-1 mb-1"/>

        <div className="flex items-center justify-center bg-gray-300 relative w-full h-[70vh] max-h-[700px] md:h-screen bg-gradient-to-b from-[#1a0033] to-[#330066] overflow-hidden">
          
        {showIntro && !isLoggedIn && !gameWon && (
          <div 
            className="absolute top-0 left-0 w-full h-full bg-[#1a0033]/95 flex items-center justify-center backdrop-blur-sm z-50 p-4"
            onClick={() => setShowIntro(false)}
          >
            <div className="relative bg-gradient-to-br from-[#2a0040] via-[#1a0033] to-[#0a0020] text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-[0_0_60px_rgba(212,0,255,0.8),inset_0_0_30px_rgba(0,255,204,0.2)] border-2 border-[#d400ff] max-w-sm sm:max-w-md md:max-w-lg w-full transform">
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#d400ff] via-[#00ffcc] to-[#d400ff] opacity-75 blur-sm"></div>
              <div className="relative bg-gradient-to-br from-[#2a0040] via-[#1a0033] to-[#0a0020] rounded-2xl p-4 sm:p-6 md:p-8">
              
                <button 
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#00ffcc] hover:text-[#d400ff] hover:scale-125 transition-all duration-300 text-xl sm:text-2xl font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowIntro(false);
                  }}
                >
                  ✕
                </button>
                
                {/* Mission */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-[#d400ff]/20 to-[#00ffcc]/20 rounded-lg border-2 border-[#ffaa00] shadow-[0_0_20px_rgba(255,170,0,0.5)]">
                    <span className="text-xl sm:text-2xl animate-bounce">🏆</span>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base">
                        <span className="text-white">Find the </span>
                        <span className="font-black text-[#ffaa00] text-base sm:text-lg">🦶 Golden LFP!</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Game instructions */}
                <div className="space-y-3 sm:space-y-4">
                  {!isMobile && (
                  <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-[#1a0033]/50 rounded-lg border border-[#d400ff]/30">
                    <span className="text-xl sm:text-2xl">💻</span>
                    <div className="text-sm sm:text-base">
                      <span className="font-bold text-[#00ffcc]">Desktop:</span>
                      <span className="text-white ml-2">Use arrow keys/buttons.</span>
                    </div>
                  </div>)}
                  {isMobile && (
                  <div className="flex items-center space-x-2 sm:space-x-3 p-0 bg-[#1a0033]/50 rounded-lg border border-[#d400ff]/30">
                    <span className="text-xl sm:text-2xl">📱</span>
                    <div className="text-sm sm:text-base">
                      <span className="font-bold text-[#00ffcc]">Mobile:</span>
                      <span className="text-white ml-2">Tap & Hold buttons.</span>
                    </div>
                  </div>)}
                </div>
                
                {/* Start */}
                <div className="text-center mt-4 sm:mt-6">
                  <button 
                    className="bg-gradient-to-r from-[#d400ff] to-[#00ffcc] text-[#1a0033] font-black px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(212,0,255,0.8)] text-base sm:text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIntro(false);
                    }}
                  >
                    START
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}

          <canvas ref={canvasRef} className="w-full h-full" />
          
          {/* Control buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1e003c]/70 p-2 rounded-lg shadow-[0_0_20px_rgba(212,0,255,0.5)] flex flex-row gap-2">
            <button
              id="tiltLeft"
              onMouseDown={() => handleButton('tiltLeft', true)}
              onMouseUp={() => handleButton('tiltLeft', false)}
              onTouchStart={() => handleButton('tiltLeft', true)}
              onTouchEnd={() => handleButton('tiltLeft', false)}
              className="bg-[#d400ff]/20 border-2 border-[#d400ff] text-[#d400ff] px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-[#d400ff]/40 hover:scale-105 transition-all text-sm md:text-base"
            >
              ⬅️
            </button>
            <button
              id="tiltUp"
              onMouseDown={() => handleButton('tiltUp', true)}
              onMouseUp={() => handleButton('tiltUp', false)}
              onTouchStart={() => handleButton('tiltUp', true)}
              onTouchEnd={() => handleButton('tiltUp', false)}
              className="bg-[#d400ff]/20 border-2 border-[#d400ff] text-[#d400ff] px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-[#d400ff]/40 hover:scale-105 transition-all text-sm md:text-base"
            >
              ⬆️
            </button>
            <button
              id="tiltDown"
              onMouseDown={() => handleButton('tiltDown', true)}
              onMouseUp={() => handleButton('tiltDown', false)}
              onTouchStart={() => handleButton('tiltDown', true)}
              onTouchEnd={() => handleButton('tiltDown', false)}
              className="bg-[#d400ff]/20 border-2 border-[#d400ff] text-[#d400ff] px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-[#d400ff]/40 hover:scale-105 transition-all text-sm md:text-base"
            >
              ⬇️
            </button>
            <button
              id="tiltRight"
              onMouseDown={() => handleButton('tiltRight', true)}
              onMouseUp={() => handleButton('tiltRight', false)}
              onTouchStart={() => handleButton('tiltRight', true)}
              onTouchEnd={() => handleButton('tiltRight', false)}
              className="bg-[#d400ff]/20 border-2 border-[#d400ff] text-[#d400ff] px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-[#d400ff]/40 hover:scale-105 transition-all text-sm md:text-base"
            >
              ➡️
            </button>
          </div>
          
          {/* Dialog 1: Win screen - Not logged in */}
          {gameWon && !isLoggedIn && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-gradient-to-br from-[#d400ff] to-[#00ffcc] text-[#1a0033] p-3 sm:p-4 md:p-6 rounded-lg shadow-[0_0_40px_rgba(212,0,255,0.7)] border-2 border-[#d400ff] w-full max-w-sm">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">✨ Triumph! ✨</h2>
                <p className="italic mb-4 text-sm sm:text-base text-center">Login to claim $LFP tokens!</p>
                <div className="text-center">
                  <button
                    onClick={handleDiscordLogin}
                    className="bg-[#5865F2] text-white px-4 py-2 rounded-md hover:bg-[#4752C4] active:bg-[#4752C4] transition-all text-sm sm:text-base font-bold flex items-center gap-2 mx-auto touch-manipulation"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span className="whitespace-nowrap">Login</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dialog 2: Join server prompt */}
          {gameWon && isLoggedIn && showServerJoin && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-gradient-to-br from-[#d400ff] to-[#00ffcc] text-[#1a0033] p-3 sm:p-4 md:p-6 rounded-lg shadow-[0_0_40px_rgba(212,0,255,0.7)] border-2 border-[#d400ff] w-full max-w-sm">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center mb-3 sm:mb-4">Join LFP Server</h2>
                <p className="text-xs sm:text-sm md:text-base text-center mb-3 sm:mb-4 leading-tight">Please join our Discord server to claim your reward!</p>
                
                <div className="text-center space-y-3">
                  <a 
                    href={`https://discord.gg/JaCarQdwEK`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-[#5865F2] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-[#4752C4] active:bg-[#4752C4] transition-all text-xs sm:text-sm md:text-base font-bold touch-manipulation min-h-[44px] flex items-center justify-center"
                  >
                    Join Discord Server
                  </a>
                  
                  <button
                    onClick={checkServerMembership}
                    disabled={loading}
                    className="block w-full bg-[#1a0033] text-[#d400ff] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-[#1a0033]/80 active:bg-[#1a0033]/80 transition-all text-xs sm:text-sm md:text-base font-bold disabled:opacity-50 touch-manipulation min-h-[44px]"
                  >
                    {loading ? 'Checking...' : 'I\'ve Joined - Check Again'}
                  </button>
                  
                  {error && (
                    <p className="text-red-600 text-xs sm:text-sm mt-2 break-words px-2">{error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dialog 3: Wallet address input */}
          {gameWon && isLoggedIn && isInServer && !tokenSent && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-gradient-to-br from-[#d400ff] to-[#00ffcc] text-[#1a0033] p-3 sm:p-4 md:p-6 rounded-lg shadow-[0_0_40px_rgba(212,0,255,0.7)] border-2 border-[#d400ff] w-full max-w-sm max-h-[80%] overflow-y-auto">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center mb-3 sm:mb-4">
                  Hello {discordUser?.display_name && discordUser.display_name.length > 12 
                    ? `${discordUser.display_name.slice(0, 12)}...` 
                    : discordUser?.display_name}!
                </h2>
                <p className="text-xs sm:text-sm text-center mb-3 sm:mb-4 leading-tight px-1">Enter your wallet address to receive $LFP tokens:</p>

                {walletAddress ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-green-700 text-xs sm:text-sm mb-2 font-bold break-all px-2">
                        ✅ Wallet set: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </p>
                    </div>
                    
                    {timeLeft > 0 ? (
                      <div className="text-center px-2">
                        <p className="text-orange-600 text-xs sm:text-sm mb-2 leading-tight">
                          Next claim available in: {Math.floor(timeLeft / 60)}h {timeLeft % 60}m
                        </p>
                        <p className="text-gray-600 text-xs leading-tight">Come back later to claim more tokens!</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleWalletSubmit}
                        disabled={loading}
                        className="w-full bg-[#1a0033] text-[#d400ff] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-[#1a0033]/80 active:bg-[#1a0033]/80 transition-all text-xs sm:text-sm font-bold disabled:opacity-50 touch-manipulation min-h-[44px]"
                      >
                        {loading ? 'Sending Tokens...' : 'Claim Tokens'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={userWallet}
                      onChange={(e) => setUserWallet(e.target.value)}
                      placeholder="Enter your wallet address"
                      className="w-full px-3 py-2 sm:py-3 border border-[#1a0033] rounded-md text-[#1a0033] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d400ff] focus:border-transparent min-h-[44px]"
                    />
                    <button
                      onClick={handleWalletSubmit}
                      disabled={loading || !userWallet.trim()}
                      className="w-full bg-[#1a0033] text-[#d400ff] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-[#1a0033]/80 active:bg-[#1a0033]/80 transition-all text-xs sm:text-sm font-bold disabled:opacity-50 touch-manipulation min-h-[44px]"
                    >
                      {loading ? 'Sending Tokens...' : 'Submit & Claim Tokens'}
                    </button>
                  </div>
                )}
                
                {error && (
                  <p className="text-red-600 text-xs sm:text-sm text-center mt-2 break-words px-2 leading-tight">{error}</p>
                )}
              </div>
            </div>
          )}

          {/* Dialog 4: Success message */}
          {gameWon && isLoggedIn && isInServer && tokenSent && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-gradient-to-br from-[#d400ff] to-[#00ffcc] text-[#1a0033] p-3 sm:p-4 md:p-6 rounded-lg shadow-[0_0_40px_rgba(212,0,255,0.7)] border-2 border-[#d400ff] w-full max-w-sm">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center mb-3 sm:mb-4">🎉 $LFP Sent!</h2>
                <div className="text-center space-y-3">
                  <p className="text-xs sm:text-sm leading-tight">Thanks for playing! Tokens have been sent to your wallet.</p>
                  
                  {success && success.includes('TX:') && (
                    <div className="space-y-2">
                      <p className="text-green-600 text-xs sm:text-sm font-bold">Transaction Successful!</p>
                      <a 
                        href={`https://testnet.monadexplorer.com/tx/${success.split('TX: ')[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#1a0033] text-[#d400ff] px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-[#1a0033]/80 active:bg-[#1a0033]/80 transition-all text-xs sm:text-sm font-bold touch-manipulation min-h-[44px] flex items-center justify-center"
                      >
                        View Transaction
                      </a>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-[#1a0033]/20">
                    <p className="text-xs sm:text-sm text-[#1a0033]/70 leading-tight">Come back in 24 hours for more tokens!</p>
                    {timeLeft > 0 && (
                      <p className="text-xs text-[#1a0033]/60 mt-1 leading-tight">
                        Next claim: {Math.floor(timeLeft / 60)}h {timeLeft % 60}m
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
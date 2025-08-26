"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import Heading from './Heading'

interface SelectedTraits {
  Accessories: string[];
  Cap: string;
  Eyes: string;
  Background: string;
  Foot: string;
  Glasses: string;
  Hair: string;
  Mouth: string;
  Slipper: string;
}

interface Traits {
  Accessories: string[];
  Cap: string[];
  Eyes: string[];
  Background: string[];
  Foot: string[];
  Glasses: string[];
  Hair: string[];
  Mouth: string[];
  Slipper: string[];
}

const traits: Traits = {
  Accessories: [
    "McBox", "Dress", "Horn", "Piercing", "Headband", "Joker_Nose",
    "Mask", "Moustache", "Sweat", "Fries", "Ankle_Tattoo", "Heel_Tattoo"
  ],
  Cap: ["Adidas", "Beanie", "Black", "Joker", "Red"],
  Eyes: ["Annoyed", "Blue", "Confused", "Cute", "Irritated", "Red", "Single"],
  Background: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33"],
  Foot: ["Foot_1", "Foot_2", "Foot_3", "Foot_4", "Foot_5", "Foot_6"],
  Glasses: ["Cool", "Heart", "Mike", "Old", "Purple", "Spectacles", "Transparent"],
  Hair: ["Hair_1", "Hair_2", "Hair_3", "Hair_4", "Hair_5", "Hair_6", "Hair_7", "Hair_8", "Hair_9", "Hair_10", "Hair_11", "Hair_12"],
  Mouth: ["Mouth_1", "Mouth_2", "Mouth_3", "Mouth_4", "Mouth_5", "Mouth_6", "Mouth_7", "Mouth_8", "Mouth_9", "Mouth_10", "Mouth_11", "Mouth_12", "Mouth_13", "Mouth_14", "Mouth_16", "Mouth_17"],
  Slipper: ["Belt", "Hearts", "Lace", "Sandal", "Shiny", "Simple"]
};

const PFPs = () => {
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({
    Accessories: [""],
    Cap: "",
    Eyes: "",
    Background: "7",
    Foot: "Foot_1",
    Glasses: "",
    Hair: "",
    Mouth: "",
    Slipper: ""
  });
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundAlpha, setBackgroundAlpha] = useState(1);
  const [imageErrors, setImageErrors] = useState(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef<{ [key: string]: HTMLImageElement }>({}); 

  const layerOrder: (keyof SelectedTraits | string)[] = [
    "Foot",
    "Accessories:Heel_Tattoo",
    "Accessories:Ankle_Tattoo",
    "Slipper",
    "Mouth",
    "Hair",
    "Eyes",
    "Accessories:Headband",
    "Cap",
    "Accessories:Others",
    "Accessories:Dress",
    "Accessories:McBox",
    "Glasses",
    "Accessories:Joker_Nose",
    "Accessories:Mask"
  ];
  const accessoriesOrder = [
    "McBox", "Dress", "Horn", "Piercing", "Mask", "Moustache", "Sweat", "Fries"
  ]; 

  const normalizeFileName = useCallback((name: string) => {
    return name.replace(/ /g, "_");
  }, []);

  const getImagePath = useCallback((category: string, value: string, isPreview: boolean = false) => {
    const normalizedValue = normalizeFileName(value);
    if (category === "Background") {
      return `/pfp/${category}/${normalizedValue}.png`; 
    }
    const suffix = isPreview ? ".png" : "_.png";
    return `/pfp/${category}/${normalizedValue}${suffix}`;
  }, [normalizeFileName]);

  const loadImage = useCallback((src: string) => {
    if (imageCache.current[src]) {
      return Promise.resolve(imageCache.current[src]);
    }
    return new Promise<HTMLImageElement | null>((resolve) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        imageCache.current[src] = img;
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        setImageErrors((prev) => new Set([...prev, src]));
        resolve(null);
      };
    });
  }, []);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }, []);

  useDeepCompareEffect(() => {
  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasSize = 1461;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Background 
    if (selectedTraits.Background) {
      let bgImgSrc = getImagePath("Background", selectedTraits.Background, false);
      let bgImg = await loadImage(bgImgSrc);
      
      if (bgImg) {
        ctx.globalAlpha = backgroundAlpha;
        ctx.drawImage(bgImg, 0, 0, canvasSize, canvasSize);
        ctx.globalAlpha = 1;
      } else {
        const rgbColor = hexToRgb(backgroundColor);
        ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${backgroundAlpha})`;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }
    } else {
      const rgbColor = hexToRgb(backgroundColor);
      ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${backgroundAlpha})`;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    const drawLayers = async () => {
      for (const layer of layerOrder) {
        if (layer.startsWith("Accessories:")) {
          const accessory = layer.split(":")[1];
          if (accessory === "Others") {
            for (const acc of accessoriesOrder) {
              if (selectedTraits.Accessories.includes(acc)) {
                let imgSrc = getImagePath("Accessories", acc, false);
                let img = await loadImage(imgSrc);

                if (!img) {
                  imgSrc = getImagePath("Accessories", acc, true);
                  img = await loadImage(imgSrc);
                }

                if (img) {
                  ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
                }
              }
            }
          } else if (selectedTraits.Accessories.includes(accessory)) {
            let imgSrc = getImagePath("Accessories", accessory, false);
            let img = await loadImage(imgSrc);

            if (!img) {
              imgSrc = getImagePath("Accessories", accessory, true);
              img = await loadImage(imgSrc);
            }

            if (img) {
              ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
            }
          }
        } else {
          const key = layer as keyof SelectedTraits;
          const value = selectedTraits[key];
          if (typeof value === "string" && value) {
            let imgSrc = getImagePath(layer, value, false);
            let img = await loadImage(imgSrc);

            if (!img) {
              imgSrc = getImagePath(layer, value, true);
              img = await loadImage(imgSrc);
            }

            if (img) {
              ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
            }
          }
        }
      }
    };

    await drawLayers();
  };

  renderCanvas();
}, [selectedTraits, backgroundColor, backgroundAlpha, loadImage, getImagePath, hexToRgb]);

  const handleTraitChange = useCallback((category: keyof SelectedTraits, value: string) => {
    setSelectedTraits((prev) => {
      if (category === "Accessories") {
        const newAccessories = prev.Accessories.includes(value)
          ? prev.Accessories.filter((item) => item !== value)
          : [...prev.Accessories, value];
        if (newAccessories.sort().join() === prev.Accessories.sort().join()) {
          return prev;
        }
        return { ...prev, Accessories: newAccessories };
      } else {
        if (prev[category] === value) {
          return { ...prev, [category]: "" };
        }
        if (prev[category] === value) {
          return prev;
        }
        return { ...prev, [category]: value };
      }
    });
  }, []);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (newColor !== backgroundColor) {
      setBackgroundColor(newColor);
    }
  }, [backgroundColor]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `pfp-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const handleReset = useCallback(() => {
    const defaultTraits = {
      Accessories: [],
      Cap: "",
      Eyes: "",
      Background: "",
      Foot: "",
      Glasses: "",
      Hair: "",
      Mouth: "",
      Slipper: ""
    };
    setSelectedTraits((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(defaultTraits) && backgroundColor === "#ffffff" && backgroundAlpha === 1) {
        return prev;
      }
      setBackgroundColor("#ffffff");
      setBackgroundAlpha(1);
      return defaultTraits;
    });
  }, [backgroundColor, backgroundAlpha]);

  const handleRandomize = useCallback(() => {
  const randomTraits: Partial<SelectedTraits> = {};
  Object.entries(traits).forEach(([category, options]) => {
    const typedCategory = category as keyof Traits;
    const typedOptions = options as string[];
      if (category === "Accessories") {
        const numAccessories = 1;
        const shuffled = [...(options as string[])].sort(() => 0.5 - Math.random());
        randomTraits.Accessories = shuffled.slice(0, numAccessories);
      } else {
        randomTraits[category as Exclude<keyof SelectedTraits, "Accessories">] =
          (options as string[])[Math.floor(Math.random() * options.length)];
      }
  });

  const newAlpha = Math.round((0.5 + Math.random() * 0.5) * 10) / 10; // 0.5 to 1.0

  setSelectedTraits((prev) => {
    if (JSON.stringify(prev) === JSON.stringify(randomTraits) && backgroundAlpha === newAlpha) {
      return prev;
    }
    setBackgroundAlpha(newAlpha);
    return randomTraits as SelectedTraits; // Assert complete SelectedTraits
  });
}, [backgroundAlpha]);

  const customizationOrder = ["Foot", "Mouth", "Hair", "Eyes", "Glasses", "Slipper", "Cap", "Accessories"];

  return (
<section id="pfp" className="min-h-screen sm:min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    <Heading text="PFP GENERATOR" className="mt-1"/>
      <div className="max-w-7xl mx-auto mt-1">
        <div className="flex flex-col sm:flex-row gap-8 items-start p-4 sm:p-6 lg:p-8">
          {/* Left: PFP Preview */}
          <div className="w-full sm:w-1/2 xl:w-2/5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <canvas
                ref={canvasRef}
                width={1461}
                height={1461}
                className="w-full h-auto rounded-2xl border-4 border-white shadow-2xl bg-white"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  imageRendering: 'high-quality' 
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="no-scrollbar flex flex-nowrap gap-2 mt-4 justify-center">
              <button
                onClick={handleDownload}
                className="px-2 py-1 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-base font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Download
              </button>
              <button
                onClick={handleRandomize}
                className="px-2 py-1 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs sm:text-base font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Randomize
              </button>
              <button
                onClick={handleReset}
                className="px-2 py-1 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs sm:text-base font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right: Customization Options */}
          <div className="w-full sm:w-1/2 xl:w-3/5">
            <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col h-[60vh] sm:h-[calc(400px+2rem+80px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-2 md:col-span-2">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    🖼️ Background
                  </h3>
                  
                  {/* Background Images Grid */}
                  <div className="mb-4">
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-11 gap-2 max-h-32 overflow-y-auto">
                      {traits.Background.map((bg) => {
                        const isSelected = selectedTraits.Background === bg;
                        const imgSrc = `/pfp/Background/${bg}.png`; // Thumbnail without underscore
                        
                        return (
                          <button
                            key={bg}
                            onClick={() => handleTraitChange("Background", bg)}
                            className={`relative w-full aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden group ${
                              isSelected
                                ? "border-purple-500 bg-purple-100 shadow-lg scale-105"
                                : "border-gray-300 hover:border-purple-300 hover:shadow-md hover:scale-102"
                            }`}
                            title={`Background ${bg}`}
                          >
                            <Image
                              src={imgSrc}
                              alt={`Background ${bg}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-200"
                              style={{ imageRendering: 'pixelated' }} // For pixel art scaling
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Picker and Alpha Controls */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Solid Color:</p>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={handleColorChange}
                          className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer shadow-md"
                        />
                        <button
                          onClick={() => setSelectedTraits(prev => ({ ...prev, Background: "" }))}
                          className="px-3 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white hover:bg-gray-300 rounded-lg transition-colors"
                        >
                          Use Color
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Alpha:</p>
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={backgroundAlpha}
                          onChange={(e) => setBackgroundAlpha(parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm font-sm min-w-12">
                          {Math.round(backgroundAlpha * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Trait Categories */}
                {customizationOrder.map((category) => (
                  <div key={category} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-4 capitalize">
                      {category === "Accessories" ? "🎭" : category === "Cap" ? "🧢" : category === "Eyes" ? "👀" :
                       category === "Foot" ? "🦶" : category === "Glasses" ? "👓" : category === "Hair" ? "💇" :
                       category === "Mouth" ? "👄" : "👡"} {category}
                    </h3>

                    {category === "Accessories" && selectedTraits.Accessories.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          Selected: {selectedTraits.Accessories.join(", ")}
                        </p>
                      </div>
                    )}

                    <div className={`grid gap-2 ${category === "Accessories" ? "grid-cols-4 sm:grid-cols-6 lg:grid-cols-6" : "grid-cols-4 sm:grid-cols-5 lg:grid-cols-6"}`}>                      {traits[category as keyof Traits].map((option) => {

                        const isSelected = category === "Accessories"
                          ? selectedTraits.Accessories.includes(option)
                          : selectedTraits[category as keyof SelectedTraits] === option;

                        const imgSrc = getImagePath(category, option, true);
                        const imgSrcAlt = getImagePath(category, option, false);

                        return (
                          <button
                            key={option}
                            onClick={() => handleTraitChange(category as keyof SelectedTraits, option)}
                            className={`relative w-full aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden group ${
                              isSelected
                                ? "border-purple-500 bg-purple-100 shadow-lg scale-105"
                                : "border-gray-300 hover:border-purple-300 hover:shadow-md hover:scale-102"
                            }`}
                            title={option}
                          >
                            <Image
                              src={imgSrc}
                              alt={option}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = imgSrcAlt;
                              }}

                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/*imageErrors.size > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Some images couldn't be loaded. This might be due to missing files or incorrect naming conventions.
                  </p>
                </div>
              )*/}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PFPs;
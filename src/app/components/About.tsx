"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ImageData {
  src: string;
  alt: string;
  href: string;
}

const About = () => {
  const [imageData, setImageData] = useState<ImageData[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/links.txt');
        if (!response.ok) {
          throw new Error(`Failed to fetch links.txt: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();

        const lines = text.trim().split('\n');
        if (lines.length !== 5) {
          throw new Error(`Expected 5 lines in links.txt, got ${lines.length}`);
        }

        const urlArrays = lines.map((line, index) => {
          const urls = line.split(',').map(url => url.trim());
          if (urls.length !== 21) {
            console.warn(`Line ${index + 1} does not contain exactly 21 URLs, got ${urls.length}`);
          }
          return urls;
        });

        const parsedData = Array.from({ length: 21 }, (_, rowIndex) => [
          {
            src: `/images/image${rowIndex + 1}-col1.jpg`,
            alt: `Image ${rowIndex + 1} Col 1`,
            href: urlArrays[0][rowIndex] || '#',
          },
          {
            src: `/images/image${rowIndex + 1}-col2.jpg`,
            alt: `Image ${rowIndex + 1} Col 2`,
            href: urlArrays[1][rowIndex] || '#',
          },
          {
            src: `/images/image${rowIndex + 1}-col3.jpg`,
            alt: `Image ${rowIndex + 1} Col 3`,
            href: urlArrays[2][rowIndex] || '#',
          },
          {
            src: `/images/image${rowIndex + 1}-col4.jpg`,
            alt: `Image ${rowIndex + 1} Col 4`,
            href: urlArrays[3][rowIndex] || '#',
          },
          {
            src: `/images/image${rowIndex + 1}-col5.jpg`,
            alt: `Image ${rowIndex + 1} Col 5`,
            href: urlArrays[4][rowIndex] || '#',
          },
        ]);

        setImageData(parsedData);
      } catch (error) {
          console.error('Error fetching or parsing links:', error);
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        const fallbackData = Array.from({ length: 21 }, (_, index) => [
          { src: `/images/image${index + 1}-col1.jpg`, alt: `Image ${index + 1} Col 1`, href: '#' },
          { src: `/images/image${index + 1}-col2.jpg`, alt: `Image ${index + 1} Col 2`, href: '#' },
          { src: `/images/image${index + 1}-col3.jpg`, alt: `Image ${index + 1} Col 3`, href: '#' },
          { src: `/images/image${index + 1}-col4.jpg`, alt: `Image ${index + 1} Col 4`, href: '#' },
          { src: `/images/image${index + 1}-col5.jpg`, alt: `Image ${index + 1} Col 5`, href: '#' },
        ]);
        setImageData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const tripledImages = [...imageData, ...imageData, ...imageData];

  return (
    <>
      <style jsx>{`
        .scroll-up {
          animation: scrollUp 60s linear infinite;
        }
        .scroll-down {
          animation: scrollDown 60s linear infinite;
        }
        .scroll-up:hover,
        .scroll-down:hover {
          animation-play-state: paused;
        }
        @keyframes scrollUp {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0%);
          }
        }
        .image-table-container {
          height: 70vh; /* 2/3 of viewport height for desktop */
          overflow: hidden; /* Hide overflow to prevent visible seams */
          width: 60%; /* Narrower as per previous request */
        }
        .text-container {
          width: 40%; /* Adjusted to fill remaining space */
          overflow-y: auto; /* Allow scrolling if text overflows */
        }
        .image-table {
          transform: rotate(-6deg); /* Tilt left */
          width: 100%;
        }
        .column {
          width: 18%; /* Responsive width */
          min-width: 80px; /* Minimum width for mobile */
          flex-shrink: 0; /* Prevent shrinking */
          box-shadow: 0 0 10px 2px #ce7efc, 0 0 20px 4px #ce7efc66; /* Neon purple shadow */
          will-change: transform; /* Optimize animation performance */
          background: #e6ccff; /* Light purple column background */
          padding: 6px; /* Padding to create light purple spacing between images */
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px; /* Light purple gap between images */
        }
        .image-item {
          width: 100%;
          aspect-ratio: 550/680; /* Match your image dimensions (width/height) */
          overflow: hidden;
          background: #e6ccff; /* Light purple background */
          position: relative;
          display: block;
          flex-shrink: 0;
          border-radius: 8px;
        }
        .image-item img {
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important; /* Show full image without cropping */
        }
        @media (max-width: 767px) {
          .image-table-container {
            width: 100%; /* Full width for mobile */
            height: 50vh; /* Fixed height to match text container */
            justify-content: center;  /* centers horizontally */
            align-items: center;      /* centers vertically */
            text-align: center;
            overflow: hidden;
          }
          .text-container {
            width: 100%; /* Full width for mobile */
            overflow-y: auto;
          }
          .image-table {
            transform: rotate(-3deg); /* Reduced tilt for mobile */
            flex-wrap: nowrap; /* Keep columns side-by-side */
            gap: 0.5rem; /* Smaller gap */
          }
          .column {
            width: 20%; /* Fixed width for mobile */
            min-width: 60px;
            flex-shrink: 0;
            box-shadow: 0 0 8px 1px #ce7efc, 0 0 16px 2px #ce7efc66; /* Neon purple shadow for mobile */
            background: #e6ccff; /* Light purple column background */
            padding: 2px; /* Smaller padding for mobile */
          }
          .image-item {
              width: 100%;
              aspect-ratio: 550/680; /* Maintain rectangular aspect ratio like desktop */
              min-height: unset; /* Remove fixed min-height */
              flex-shrink: 0;
              margin-bottom: 2px; /* Smaller gap for mobile */
            }
          .text-container {
            padding: 0.5rem;
          }
          .text-container h2 {
            font-size: 1.25rem; /* Smaller heading on mobile */
          }
          .text-container p {
            font-size: 0.875rem; /* Smaller text on mobile */
          }
          .section-container {
            flex-direction: column; /* Stack image table and text vertically on mobile */
            min-height: auto; /* Remove fixed height */
            height: auto; /* Allow content to determine height */
          }
        }
        .text-container {
          width: 40%; /* Adjusted to fill remaining space */
          height: 70vh; /* Match image-table-container height on desktop */
          overflow-y: auto; /* Allow scrolling if text overflows */
          background-image: url('/about.png'); /* Background image */
          background-size: cover; /* Scale to fill container */
          background-position: center; /* Center the image */
          display: flex; /* Ensure Flexbox for centering */
          justify-content: center; /* Horizontal centering */
          align-items: center; /* Vertical centering */
        }
        .text-container p {
          font-family: 'Caveat', cursive;
          font-size: 1.35rem;    /* ⬅ bigger text */
          font-weight: 900;     /* ⬅ extra bold (range: 100–900) */
          color: black;
          text-align: center;
          letter-spacing: 1.5px;
        }

        @media (max-width: 767px) {
          .text-container {
              width: 100%; /* Full width for mobile */
              height: 50vh; /* Match image container height */
              overflow-y: auto;
              background-image: url('/about.png');
              background-size: cover;
              background-position: center;
              padding: 0.5rem;
              display: flex; /* Ensure Flexbox for centering */
              justify-content: center; /* Horizontal centering */
              align-items: center; /* Vertical centering */
            }
          .text-container p {
            font-size: 1.35rem; /* Slightly smaller for readability */
            font-family: 'Caveat', cursive;
            font-weight: bold;
            color: black;
            text-align: center; /* Center text horizontally */
            justify-content: center;
          }
        }
      `}</style>
      <section id="about" className="mt-1 section-container flex flex-col md:flex-row">
        <div className="flex flex-col md:flex-row bg-gray-100 w-full">
          <div className="image-table-container flex justify-center items-center">
            {isLoading ? (
              <div>Loading images...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : (
              <div className="image-table flex gap-4 md:gap-6">
                {[...Array(5)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={`column flex flex-col gap-2 md:gap-4 ${
                      colIndex % 2 === 0 ? 'scroll-up' : 'scroll-down'
                    }`}
                  >
                    {tripledImages.map((row, rowIndex) => (
                      <Link
                        key={`${colIndex}-${rowIndex}`}
                        href={row[colIndex].href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="image-item">
                          <Image
                            src={row[colIndex].src}
                            alt={row[colIndex].alt}
                            width={96}
                            height={80}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            className="rounded-md"
                            priority={rowIndex < 5}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
                      
            <div className="text-container flex justify-center items-center p-4 md:p-8 lg:ml-1">
              <div className="max-w-lg flex flex-col items-center mt-2 overflow-off">
                <p className="text-lg font-bold text-black font-dancing text-center">
                  The Hairiest Feet Collection, where every foot tells a story—fluffy, unique, and full of character.
                  <br /><br />
                  A tribute to the charm of feet pics with a touch of mystery in each piece.
                  <br /><br />
                  Embrace the fluff and be part of the LFP legacy!
                </p>
              </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default About;
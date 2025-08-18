"use client";

import Image from "next/image";
import React from "react";
import Heading from './Heading'

const NFTs = () => {
  const gridImages = [
    { src: "/genesis.png", alt: "Grid Image 1", url: "https://magiceden.io/collections/monad-testnet/0x536a63c11cc5c243712536cf352d9553d8b0964c" },
    { src: "/gtd.png", alt: "Grid Image 2", url: "https://magiceden.io/collections/monad-testnet/0xcf9c80cd6bb1d88078c3993606b7ef686f597e86" },
    { src: "/pass.gif", alt: "Grid Image 3", url: "https://magiceden.io/collections/monad-testnet/0x01b44e47765626b32e1c64ca7fbe59ea27f23be2" },
    { src: "/mainnet.png", alt: "Grid Image 4", url: "https://x.com/monad/status/1952746664524906845" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <section id="nfts" className="flex flex-col items-center w-full bg-purple">
        <Heading text="TESTNET COLLECTIONS" className="mt-1"/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full mt-1">
          {gridImages.map((image, index) => (
            <a
              key={index}
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={400}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </a>
          ))}
        </div>
      </section>
    </>
  );
};

export default NFTs;
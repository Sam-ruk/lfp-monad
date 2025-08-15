"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = document.querySelector("header")?.offsetHeight || 0;
    window.scrollTo({
      top: element.offsetTop - navbarHeight - 3,
      behavior: "smooth",
    });
  }
  setIsMenuOpen(false);
};

  return (
    <header
      className="fixed top-0 left-0 w-full h-15 bg-cover bg-center z-60"
      style={{ backgroundImage: "url(/navbar.png)" }}
    >
      <nav className="flex items-center justify-between h-full px-4">
        {/* Hamburger Menu for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#ffffff" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex sm:space-x-4">
        <button
            onClick={() => scrollToSection("about")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("nfts")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            NFTs
          </button>
          <button
            onClick={() => scrollToSection("pfp")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            PFP
          </button>
          <button
            onClick={() => scrollToSection("game")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Game
          </button>
          <button
            onClick={() => scrollToSection("tracker")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            FAST FEET Tracker
          </button>
          <button
            onClick={() => scrollToSection("lore")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Lore
          </button>
          <button
            onClick={() => scrollToSection("team")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Team
          </button>
          <button
            onClick={() => scrollToSection("roadmap")}
            className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Roadmap
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#673581] sm:hidden">
            <div className="flex flex-col items-center py-4 space-y-2">
              <button
                onClick={() => scrollToSection("about")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("nfts")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                NFTs
              </button>
              <button
                onClick={() => scrollToSection("pfp")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                PFPs
              </button>
              <button
                onClick={() => scrollToSection("game")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                Game
              </button>
              <button
                onClick={() => scrollToSection("tracker")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                FAST FEET Tracker
              </button>
              <button
                onClick={() => scrollToSection("lore")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                Lore
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection("roadmap")}
                className="text-white font-semibold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                Roadmap
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <div className="mt-1">
            <a href="https://x.com/Lfp_monad" target="_blank" rel="noopener noreferrer">
              <Image
                src="/x.png"
                alt="X Logo"
                width={32}
                height={32}
                style={{ width: '32px', height: 'auto' }}
                className="hover:opacity-80 transition"
              />
            </a>
          </div>
          <a href="https://discord.gg/JaCarQdwEK" target="_blank" rel="noopener noreferrer">
            <Image
              src="/discord.png"
              alt="Discord Logo"
              width={32}
              height={32}
              style={{ width: '32px', height: 'auto' }}
              className="hover:opacity-80 transition"
            />
          </a>
        </div>
      </nav>
    </header>
  );
}
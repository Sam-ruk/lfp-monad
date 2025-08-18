import Image from "next/image";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import About from "./components/About";
import NFTs from "./components/NFTs";
import Backstory from "./components/Backstory";
import Team from "./components/Team";
import PFPs from "./components/PFPs";
import Game from './components/Game';
import Lore from './components/Lore';
import Tracker from './components/Tracker';
import "./globals.css";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 pt-16 overflow-y-auto custom-scrollbar">
        <Banner />
        <About />
        <NFTs />
        <PFPs />
        <Game />
        <Tracker />
        <Lore />
        <Backstory />
        <Team />
      </main>
    </div>
  );
}
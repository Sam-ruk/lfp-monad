"use client";

import Image from "next/image";
import React from "react";

const Roadmap = () => {
  return (
    <section id="roadmap" className="w-full mt-1">
      <div className="w-full">
        <Image
          src="/roadmap.gif"
          alt="Roadmap Animation"
          width={1200}
          height={675}
          className="w-full h-auto object-contain"
          priority
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </section>
  );
};

export default Roadmap;
"use client";
import Image from "next/image";

export default function Banner() {
  return (
    <Image
      src="/banner.png"
      alt="Banner"
      width={1200}
      height={600}
      className="w-full h-auto object-contain sticky top-0"
      priority
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
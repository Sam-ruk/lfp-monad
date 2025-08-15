import Image from 'next/image'

const Heading = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <div className={`w-full relative ${className}`}>
      <Image
        src="/heading.png"
        alt="Heading"
        width={1200}
        height={300}
        className="w-full h-auto object-cover"
        priority
        onContextMenu={(e) => e.preventDefault()}
      />
      {text && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 
            className="text-white/80 tracking-wider text-xl md:text-6xl lg:text-8xl font-bold text-center px-4 drop-shadow-2xl"
            style={{ fontFamily: 'Gagalin, Orbitron, "Arial Black", sans-serif' }}
          >
            {text}
          </h1>
        </div>
      )}
    </div>
  )
}

export default Heading
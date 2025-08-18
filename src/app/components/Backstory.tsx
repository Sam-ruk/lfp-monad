"use client";
import Image from "next/image";
import Heading from './Heading'

export default function Backstory() {
  return (
    <>
      <style jsx>{`
        .first-letter {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 3.5em;
          line-height: 0.85;
          float: left;
          margin-right: 0.06em;
          margin-top: 0.02em;
          margin-bottom: 0;
        }
                .rest-text {
                  font-family: 'Patrick Hand', cursive;
                }
                .paragraph-container {
                  display: block;
                  align-self: center;
                }
                
                /* Responsive first letter sizing */
        @media (max-width: 640px) {
          .first-letter {
            font-size: 3.8em;
            margin-top: -0.03em;
          }
        }
        
        @media (min-width: 768px) {
          .first-letter {
            font-size: 4em;
            margin-top: -0.08em;
          }
        }
      `}</style>
      <section id="backstory" className="min-h-screen flex flex-col">
        <Heading text="BACKSTORY" className="mt-1"/>
        <div className="flex flex-col sm:flex-row w-full mt-1 sm:h-[400px]">
          <div className="w-full sm:w-auto sm:flex-shrink-0 h-full">
           <Image
             src="/lore-left.gif"
             alt="Lore Left Image"
             width={400}
             height={400}
             style={{ width: "100%", maxWidth: "400px", height: "100%", objectFit: "cover" }}
             className="w-full sm:w-[300px] md:w-[400px] h-full object-cover"
             onContextMenu={(e) => e.preventDefault()}
           />
          </div>
          <div
             className="w-full sm:flex-1 flex flex-col bg-cover bg-center ml-0 sm:ml-1 mt-1 sm:mt-0"
            style={{ 
              background: 'linear-gradient(45deg,#9f7aea,#ff9a9e,#c471ed,#b794f6,#fed6e3)',
              backgroundSize: '200% 200%',
            }}
          >
            <div className="flex flex-col sm:flex-row w-full h-1/2 lg:ml-2">
              <div
                className="paragraph-container sm:w-2/3 w-full text-base sm:text-sm md:text-xl lg:text-2xl font-bold leading-relaxed px-5 pt-4 pb-0 sm:py-0 text-justify text-black"
                style={{ color: "#000000" }}
              >
                <span className="first-letter">I</span>
                <span className="rest-text">n the House of Moyaki chat, King Loui's feet were shared, and Behnaz sketched it—just for laughs. 
                "Loui Feet Pic" later evolved into "Lost Feet Pics".</span>
              </div>
              <div className="sm:w-1/3 w-full flex items-center justify-center p-2 lg:mt-20">
                <a href="https://x.com/KinglouiEth/status/1813234778541310164" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/lore-right-1.png"
                    alt="Paragraph 1 Image"
                    width={200}
                    height={220}
                    style={{ width: '200px', height: 'auto' }}
                    className="object-cover rounded-lg shadow-md shadow-[#ffffff]"
                    priority
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full h-1/2 mb-2 lg:ml-2">
              <div
                className="paragraph-container sm:w-2/3 w-full text-base sm:text-sm md:text-xl lg:text-2xl font-bold leading-relaxed px-5 pt-4 pb-0 sm:py-0 text-justify text-black"
                style={{ color: "#000000" }}
              >
                <span className="first-letter">T</span>
                <span className="rest-text">he group loved it. Loui suggested her to create a full collection. 
                Soon, she started giving these feet Monad's early icons' personalities.</span>
              </div>
              <div className="sm:w-1/3 w-full flex items-center justify-center p-2 lg:mt-10">
                <a href="https://x.com/keoneHD/status/1896253904561815740" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/lore-right-2.png"
                    alt="Paragraph 2 Image"
                    width={200}
                    height={250}
                    style={{ width: '200px', height: 'auto' }}
                    className="object-cover rounded-lg shadow-md shadow-[#ffffff]"
                    priority
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full mt-1 sm:h-[400px]">
          <div
            className="w-full sm:flex-1 flex flex-col bg-cover bg-center"
            style={{ 
              background: 'linear-gradient(45deg, #dda0dd, #ff69b4, #87ceeb, #9370db, #ffb6c1)',
              backgroundSize: '200% 200%',
            }}
          >
            <div className="flex flex-col sm:flex-row w-full h-1/2">
              <div
                className="paragraph-container sm:w-2/3 w-full text-base sm:text-sm md:text-xl lg:text-2xl font-bold leading-relaxed px-5 pt-4 pb-0 sm:py-0 text-justify text-black"
                style={{ color: "#000000" }}
              >
                <span className="first-letter">L</span>
                <span className="rest-text">ife hit and LFP went quiet. 
                Months later, Keone's 1K Nads List and Mach2 Program reignited the fire and Behnaz jumped back in.</span>
              </div>
              <div className="sm:w-1/3 w-full flex items-center justify-center p-2 lg:mt-46">
                 <a href="https://x.com/Lfp_monad/status/1884345435721994316" target="_blank" rel="noopener noreferrer">
                   <Image
                     src="/lore-left-1.jpeg"
                     alt="Paragraph 3 Image"
                     width={200}
                     height={300}
                     className="w-[150px] h-[200px] sm:w-[200px] sm:h-[250px] lg:w-[180px] lg:h-[230px] object-cover rounded-lg shadow-lg shadow-[#ffffff]"
                     priority
                     onContextMenu={(e) => e.preventDefault()}
                   />
                 </a>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full h-1/2 mb-2">
              <div
                className="paragraph-container sm:w-2/3 w-full text-base sm:text-sm md:text-xl lg:text-2xl font-bold leading-relaxed px-5 pt-4 pb-0 sm:py-0 text-justify text-black"
                style={{ color: "#000000" }}
              >
                <span className="first-letter">S</span>
                <span className="rest-text">oon, she met Alex—completing the team. 
                What began as a joke in a group chat is now a growing NFT collection on Monad—Lost Feet Pics.</span>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto sm:flex-shrink-0 h-full mt-1 sm:mt-0 ml-0 sm:ml-1">
           <Image
             src="/lore-right.gif"
             alt="Lore Right Image"
             width={400}
             height={400}
             style={{ width: "100%", maxWidth: "400px", height: "100%", objectFit: "cover" }}
             className="w-full sm:w-[300px] md:w-[400px] h-full object-cover"
             onContextMenu={(e) => e.preventDefault()}
           />
          </div>
        </div>
      </section>
    </>
  );
}
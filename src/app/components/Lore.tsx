"use client";
import Image from "next/image";

export default function Lore() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <section id="lore" className="min-h-screen flex flex-col">
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
            style={{ backgroundImage: "url(/lore-bg.png)" }}
          >
            <div className="flex flex-col sm:flex-row w-full h-1/2 lg:ml-2">
              <p
                className="sm:w-2/3 w-full text-base sm:text-sm md:text-xl font-bold leading-relaxed px-5 py-0 flex items-center text-justify font-serif text-white"
                style={{ fontFamily: "Dancing Script, cursive", color: "#ffffff" }}
              >
                In the House of Moyaki group chat, King Loui’s feet were mentioned, 
                Loui shared a photo, and Behnaz sketched it—just for laughs. 
                That doodle turned into “Loui Feet Pic” (LFP), which later evolved into “Lost Feet Pics”.
              </p>
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
              <p
                className="sm:w-2/3 w-full text-base sm:text-sm md:text-xl font-bold leading-relaxed px-5 py-0 flex items-center text-justify font-serif text-white"
                style={{ fontFamily: "Dancing Script, cursive", color: "#ffffff" }}
              >
                The group loved it. Behnaz made more designs, then a sticker pack. 
                King Loui suggested her to create a full collection. 
                Soon, she started giving these feet personalities—drawing inspiration from Monad’s early icons.
              </p>
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
            style={{ backgroundImage: "url(/lore-bg.png)" }}
          >
            <div className="flex flex-col sm:flex-row w-full h-1/2">
              <p
                className="sm:w-2/3 w-full text-base sm:text-sm md:text-xl font-bold leading-relaxed px-5 py-0 flex items-center text-justify font-serif text-white"
                style={{ fontFamily: "Dancing Script, cursive", color: "#ffffff" }}
              >
                But then, life hit and LFP went quiet. 
                Months later, Keone’s 1K Nads List reignited the fire. 
                Behnaz jumped back in, registered LFP for Mach2 (Monad NFT Accelerator program), and started building again.
              </p>
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
              <p
                className="sm:w-2/3 w-full text-base sm:text-sm md:text-xl font-bold leading-relaxed px-5 py-0 flex items-center text-justify font-serif text-white"
                style={{ fontFamily: "Dancing Script, cursive", color: "#ffffff" }}
              >
                Soon after, they met Alex—completing the team. 
                What began as a joke in a group chat is now a growing NFT collection on Monad—Lost Feet Pics.
              </p>
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
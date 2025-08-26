"use client";

import Image from "next/image";
import React from "react";
import { Patrick_Hand } from "next/font/google";
import Heading from './Heading'

const dancingScript = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
});

const Team = () => {
  const teamMembers = [
    { name: "Behnaz", url: "https://x.com/0xBehnaZ1", image: "https://pbs.twimg.com/profile_images/1883575474544107520/fv_T6_PJ_400x400.jpg", role: "" },
    { name: "Nobody", url: "https://x.com/NobodyARB", image: "https://pbs.twimg.com/profile_images/1957557250651836417/T-S6jt5s_400x400.jpg", role: "" },
    { name: "Alex", url: "https://x.com/velicko_aleksej", image: "https://pbs.twimg.com/profile_images/1691710013029470208/qcMirJeI_400x400.jpg", role: "" },
    { name: "Arkar", url: "https://x.com/CoCa14740177", image: "https://pbs.twimg.com/profile_images/1935776785154629632/6miKh8xb_400x400.jpg" },
    { name: "Ihsan", url: "https://x.com/ihsan00333", image: "https://pbs.twimg.com/profile_images/1926024164449656833/c9S49fMr_400x400.jpg", role: "" },
    { name: "Max", url: "https://x.com/UmarovMax", image: "https://pbs.twimg.com/profile_images/1951352387584524288/SvTTCCAK_400x400.jpg", role: "" },
    { name: "Ayden", url: "https://x.com/omo_oshodi_", image: "https://pbs.twimg.com/profile_images/1933142661570908160/W3xewV5T_400x400.jpg", role: "" }
  ];

  const helpers = [
    { name: "Samk", url: "https://x.com/Samruddhi_Krnr", image: "https://pbs.twimg.com/profile_images/1945152698141302785/ZP26FPc5_400x400.jpg", role: "" },
    { name: "San", url: "https://x.com/SANTHOSH12004", image: "https://pbs.twimg.com/profile_images/1939393858732982272/q97VSuQh_400x400.jpg", role: "" },
    { name: "Ade", url: "https://x.com/DayoKeem", image: "https://pbs.twimg.com/profile_images/1938264668524470272/fXumrdZz_400x400.jpg", role: "" },
    { name: "Sen", url: "https://x.com/senqieee28", image: "https://pbs.twimg.com/profile_images/1932968827224231936/P4-a5jjG_400x400.jpg", role: "" },
    { name: "Nexus", url: "https://x.com/Nexus69xx", image: "https://i.ibb.co/YBccVZJC/1500x500.jpg", role: "" },
    { name: "Forrét", url: "https://x.com/m463173", image: "https://pbs.twimg.com/profile_images/1940450151052488711/TNQqbefP_400x400.jpg", role: "" },
    { name: "Irdzan", url: "https://x.com/Irdzannn", image: "https://pbs.twimg.com/profile_images/1950941409613324290/0nx78pAK_400x400.jpg", role: "" },
  ];

  return (
    <section id="team" className="bg-white m-0 mt-1 overflow-x-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full flex-row" style={{ height: '430px' }}>
        <div className="w-1/4" style={{ height: '430px' }}>
          <Image
            src="/team-left.jpeg"
            alt="Left Team Image"
            width={300}
            height={512}
            className="w-full h-64 object-cover"
            style={{ height: '430px' }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div className="overflow-y-auto lg:pl-1 w-3/4 flex flex-col" style={{ height: '430px' }}>
          <div className="w-full">
            <Heading text="OUR TEAM"/>
          </div>

          <div className="lg:ml-1 flex flex-wrap justify-between gap-4 px-6 py-6" style={{ height: '120px' }}>
            {teamMembers.map((member, index) => (
              <a
                key={index}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                style={{ width: '80px' }}
              >
                <div className="relative drop-shadow-lg" style={{ width: '64px', height: '64px' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full border-2 border-purple-200"
                    style={{ 
                      clipPath: "circle(50% at 50% 50%)",
                      filter: "drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3))"
                    }}
                  />
                </div>
                <span className={`font-bold text-black mt-1 text-center leading-tight ${dancingScript.className}`} style={{ fontSize: '15px' }}>
                  {member.name} {member.role && `(${member.role})`}
                </span>
              </a>
            ))}
          </div>

          <div className="w-full">
            <Heading text="HELPING HANDS"/>
          </div>

          <div className="flex flex-wrap justify-between gap-4 px-6 py-6" style={{ height: '120px' }}>
            {helpers.map((helper, index) => (
              <a
                key={index}
                href={helper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                style={{ width: '80px' }}
              >
                <div className="relative drop-shadow-lg" style={{ width: '64px', height: '64px' }}>
                  <Image
                    src={helper.image}
                    alt={helper.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full border-2 border-purple-200"
                    style={{ 
                      clipPath: "circle(50% at 50% 50%)",
                      filter: "drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3))"
                    }}
                  />
                </div>
                <span className={`font-bold text-black mt-1 text-center leading-tight ${dancingScript.className}`} style={{ fontSize: '15px' }}>
                  {helper.name} {helper.role && `(${helper.role})`}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full flex flex-col">
        <div className="w-full h-[40vh]">
          <Image
            src="/team-left.jpeg"
            alt="Left Team Image"
            width={300}
            height={512}
            className="w-full h-full object-cover"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div className="flex flex-col py-1">

          <div className="w-full px-0">
            <Heading text="OUR TEAM"/>
          </div>

          <div className="flex justify-between mb-2 mt-2 overflow-x-auto">
            {teamMembers.map((member, index) => (
              <a
                key={index}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center flex-shrink-0"
                style={{ width: 'calc(100% / 7)' }}
              >
                <div className="relative drop-shadow-lg" style={{ 
                  width: 'min(40px, 10vw)', 
                  height: 'min(40px, 10vw)' 
                }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full border-2 border-purple-200"
                    style={{ 
                      clipPath: "circle(50% at 50% 50%)",
                      filter: "drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3))"
                    }}
                  />
                </div>
                <span className={`font-bold text-black mt-1 text-center leading-tight ${dancingScript.className}`} 
                      style={{ fontSize: 'min(9px, 2vw)' }}>
                  {member.name}
                </span>
              </a>
            ))}
          </div>

          <div className="w-full">
            <Heading text="HELPING HANDS"/>
          </div>

          <div className="flex justify-between mb-1 mt-2 overflow-x-auto">
            {helpers.map((helper, index) => (
              <a
                key={index}
                href={helper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center flex-shrink-0"
                style={{ width: 'calc(100vw / 7)' }}
              >
                <div className="relative drop-shadow-lg" style={{ 
                  width: 'min(40px, 10vw)', 
                  height: 'min(40px, 10vw)' 
                }}>
                  <Image
                    src={helper.image}
                    alt={helper.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full border-2 border-purple-200"
                    style={{ 
                      clipPath: "circle(50% at 50% 50%)",
                      filter: "drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3))"
                    }}
                  />
                </div>
                <span className={`font-bold text-black mt-1 text-center leading-tight ${dancingScript.className}`} 
                      style={{ fontSize: 'min(9px, 2vw)' }}>
                  {helper.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
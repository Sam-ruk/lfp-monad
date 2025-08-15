'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Heading from './Heading'

interface NFTDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: { name: string; image: string; link: string }[];
  projectName: string;
}

interface CollectionItem {
  name: string;
  xLink: string;
  logo: string;
  website: string;
  nfts: { name: string; image: string; link: string }[];
  followers?: number;
  change?: number;
}

interface DAppItem {
  name: string;
  type: string;
  xLink: string;
  website: string;
  logo: string;
  tags: string[];
  followers?: number;
  change?: number;
}

const tagColors = {
  AI: 'bg-blue-300',
  Betting: 'bg-yellow-300',
  DeFi: 'bg-green-300',
  DePIN: 'bg-purple-300',
  Gaming: 'bg-red-300',
  Governance: 'bg-indigo-300',
  NFT: 'bg-pink-300',
  'Other Apps': 'bg-gray-300',
  Payments: 'bg-teal-300',
  'Prediction Market': 'bg-orange-300',
  RWA: 'bg-cyan-300',
  Social: 'bg-violet-300',
};

const XIcon = ({ size = 14 }) => (
  <Image
    src="/x.png"
    alt="X Logo"
    width={size}
    height={size}
    style={{ width: '14px', height: '14px' }}
    className="filter brightness-0 invert"
  />
);

const WebsiteIcon = ({ size = 14 }) => (
  <Image
    src="/website.png"
    alt="Website"
    width={size}
    height={size}
    className="filter brightness-0 invert scale-125"
  />
);

const formatFollowers = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatChange = (change: number) => {
  const absChange = Math.abs(change);
  if (absChange >= 1000) {
    const formatted = `${(absChange / 1000).toFixed(1)}K`;
    return change >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return change >= 0 ? `+${change}` : change.toString();
};

const NFTDialog: React.FC<NFTDialogProps> = ({ isOpen, onClose, nfts, projectName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900/95 to-purple-900/90 border border-pink-500/30 rounded-xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl shadow-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 sm:p-4 border-b border-pink-500/20 bg-gradient-to-r from-purple-800/40 to-pink-800/40">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{projectName} NFTs</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-1.5 bg-gray-700/50 hover:bg-pink-600/50 rounded-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(85vh-90px)] custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {nfts.map((nft, index) => (
              <Link 
                key={index}
                href={nft.link} 
                target="_blank"
                className="bg-gray-800/60 border border-purple-400/30 rounded-lg p-2 hover:bg-gradient-to-br hover:from-purple-800/50 hover:to-pink-800/50 hover:border-pink-400/50 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-purple-500/30"
              >
                <div className="aspect-square relative mb-1.5 overflow-hidden rounded-md">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xs font-medium text-white text-center truncate group-hover:text-pink-200 transition-colors">{nft.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type NFTItem = {
  name: string;
  image: string;
  link: string;
};

type CollectionItemT = {
  name: string;
  xLink: string;
  logo: string;
  website: string;
  nfts: NFTItem[];
  followers: number;
  change: number;
};

type DAppItemT = {
  name: string;
  type: string;
  xLink: string;
  website: string;
  logo: string;
  tags: string[];
  followers: number;
  change: number;
};

type SelectedNFTs = {
  nfts: NFTItem[];
  projectName: string;
} | null;

export default function Tracker() {
  const [collections, setCollections] = useState<CollectionItemT[]>([]);
  const [dapps, setDapps] = useState<DAppItemT[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<SelectedNFTs>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const trackerResponse = await fetch('/api/tracker');
        let trackerData = null;
        
        if (trackerResponse.ok) {
          trackerData = await trackerResponse.json();
        } else {
          console.error('Failed to fetch tracker data:', trackerResponse.status);
        }

        const collectionsResponse = await fetch('/collections.txt');
        let collectionsData: CollectionItem[] = [];
        
        if (collectionsResponse.ok) {
          const collectionsText = await collectionsResponse.text();
          
          if (collectionsText.trim()) {
            collectionsData = collectionsText
              .split('\n\n')
              .filter(Boolean)
              .map((block) => {
                const lines = block.split('\n').filter(line => line.trim());
                const firstLine = lines[0].split(',').map((s) => s.trim());
                const name = firstLine[0] || '';
                const xLink = firstLine[1] || '';
                const logo = firstLine[2] || '';
                const website = firstLine[3] || '';
                
                const nfts = lines.slice(1).map((line) => {
                  const [nftName, image, nftLink] = line.split(',').map((s) => s.trim());
                  return { 
                    name: nftName || '', 
                    image: image || '', 
                    link: nftLink ? nftLink.replace(/^["']|["']$/g, '') : ''
                  };
                }).filter(nft => nft.name);
                
                return { name, xLink, logo, website, nfts };
              })
              .filter(item => item.name);
          }
        }

        const dappsResponse = await fetch('/dapps.txt');
        let dappsData: DAppItem[] = [];
        
        if (dappsResponse.ok) {
          const dappsText = await dappsResponse.text();
          
          if (dappsText.trim()) {
            dappsData = dappsText
              .split('\n')
              .filter(Boolean)
              .map((line) => {
                const fields = line.split(',').map((s) => s.trim());
                const name = fields[0] || '';
                const type = fields[1] || '';
                const xLink = fields[2] || '';
                const website = fields[3] || '';
                const logo = fields[4] || '';
                const tagsString = fields[5] || '';
                
                const tags = tagsString
                  ? tagsString.replace(/"/g, '').split('|').map((t) => t.trim()).filter(Boolean)
                  : [];
                
                return { name, type, xLink, website, logo, tags };
              })
              .filter(item => item.name);
          }
        }

        const extractHandle = (xLink: string) => {
          if (!xLink) return '';
          const match = xLink.match(/twitter\.com\/([^/?]+)|x\.com\/([^/?]+)/);
          return match ? (match[1] || match[2]) : '';
        };

        let nftDataMap = new Map();
        let dappDataMap = new Map();
        
        if (trackerData && trackerData.nft_today) {
          const nftFollowers = trackerData.nft_today.split(',').map(Number);
          const nftChanges = trackerData.nft_change.split(',').map(Number);
          
          collectionsData.forEach((item, index) => {
            const handle = extractHandle(item.xLink);
            if (handle && nftFollowers[index] !== undefined) {
              nftDataMap.set(handle.toLowerCase(), {
                followers: nftFollowers[index] || 0,
                change: nftChanges[index] || 0
              });
            }
          });
        }
        
        if (trackerData && trackerData.dapp_today) {
          const dappFollowers = trackerData.dapp_today.split(',').map(Number);
          const dappChanges = trackerData.dapp_change.split(',').map(Number);
          
          dappsData.forEach((item, index) => {
            const handle = extractHandle(item.xLink);
            if (handle && dappFollowers[index] !== undefined) {
              dappDataMap.set(handle.toLowerCase(), {
                followers: dappFollowers[index] || 0,
                change: dappChanges[index] || 0
              });
            }
          });
        }

        const processedCollections = collectionsData.map(item => {
          const handle = extractHandle(item.xLink);
          const trackerItem = nftDataMap.get(handle.toLowerCase());
          
          return {
            ...item,
            followers: trackerItem?.followers || 0,
            change: trackerItem?.change || 0
          };
        });

        const processedDapps = dappsData.map(item => {
          const handle = extractHandle(item.xLink);
          const trackerItem = dappDataMap.get(handle.toLowerCase());
          
          return {
            ...item,
            followers: trackerItem?.followers || 0,
            change: trackerItem?.change || 0
          };
        });

        const sortByChangeAndFollowers = (a: { change: number; followers: number }, b: { change: number; followers: number }) => {
          if (b.change !== a.change) {
            return b.change - a.change;
          }
          return b.followers - a.followers;
        };

        setCollections(processedCollections.sort(sortByChangeAndFollowers));
        setDapps(processedDapps.sort(sortByChangeAndFollowers));

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please check your API and file configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openNFTDialog = (nfts: NFTItem[], projectName: string) => {
    setSelectedNFTs({ nfts, projectName });
    setDialogOpen(true);
  };

  const closeNFTDialog = () => {
    setSelectedNFTs(null);
    setDialogOpen(false);
  };

  const handleNFTRowClick = (col: CollectionItem) => {
    openNFTDialog(col.nfts, col.name);
  };

  const handleDAppRowClick = (dapp: DAppItem) => {
    if (dapp.xLink) {
      window.open(dapp.xLink, '_blank');
    }
  };

  if (loading) {
    return (
      <section id="tracker" className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center py-8 px-4">
        <div className="text-white text-base sm:text-lg animate-pulse bg-purple-800/60 px-6 py-3 rounded-xl border border-pink-500/30 shadow-lg shadow-purple-500/20">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tracker" className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center py-8 px-4">
        <div className="text-red-300 text-base sm:text-lg text-center px-6 py-4 bg-red-900/40 border border-red-500/50 rounded-xl shadow-lg shadow-red-500/20 max-w-md">{error}</div>
      </section>
    );
  }

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e879f9 #374151;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(45deg, #374151, #4b5563);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #e879f9, #a855f7);
          border-radius: 3px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #f472b6, #c084fc);
          box-shadow: 0 0 6px rgba(236, 72, 153, 0.5);
        }
      `}</style>
      
      
      <section id="tracker">
      
        <Heading text="FAST FEET TRACKER" className="mt-1"/>

        <div className="bg-black py-4 sm:py-6 mt-1 w-full px-2 bg-black sm:px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* NFTs Table */}
            <div className="bg-gradient-to-br from-pink-900/60 via-purple-900/70 to-black/80 p-3 sm:p-4 rounded-xl shadow-[0_0_20px_#9333ea80] border border-pink-300/10 backdrop-blur">
              <h2 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span>🎨</span>
                <span className="hidden sm:inline">NFT Collections</span>
                <span className="sm:hidden">NFTs</span>
              </h2>
              
              <div className="overflow-hidden rounded-lg">
                <div className="overflow-y-auto max-h-[50vh] sm:max-h-[70vh] custom-scrollbar">
                  <table className="w-full text-white text-xs sm:text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-pink-800 backdrop-blur-md text-pink-200 shadow-sm">
                        <th className="text-left px-2 sm:px-3 py-2">Name</th>
                        <th className="text-right px-2 sm:px-3 py-2 w-16 sm:w-20">
                          <span className="hidden sm:inline">Followers</span>
                          <span className="sm:hidden">Foll.</span>
                        </th>
                        <th className="text-right px-2 sm:px-3 py-2 w-12 sm:w-16">24Hr.</th>
                        <th className="text-center px-2 sm:px-3 py-2 w-16 sm:w-20">Links</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map((col, index) => (
                        <tr 
                          key={col.name} 
                          className="hover:bg-pink-700/10 transition-all duration-200 cursor-pointer border-b border-pink-300/5"
                          onClick={() => handleNFTRowClick(col)}
                        >
                          <td className="px-2 sm:px-3 py-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              {col.logo && (
                                <Image 
                                  src={col.logo} 
                                  alt={col.name} 
                                  width={16} 
                                  height={16} 
                                  className="rounded-full flex-shrink-0 sm:w-5 sm:h-5"
                                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                />
                              )}
                              <span className="truncate font-medium text-xs sm:text-sm">
                                {col.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-right text-pink-100">
                            {formatFollowers(col.followers)}
                          </td>
                          <td className={`px-2 sm:px-3 py-2 text-right font-medium ${col.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatChange(col.change)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {col.xLink && (
                                <Link 
                                  href={col.xLink} 
                                  target="_blank" 
                                  className="bg-pink-700/50 hover:bg-pink-600/70 p-2 sm:p-1 rounded transition-all duration-200 flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[24px] sm:min-h-[24px]" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <XIcon size={20} />
                                </Link>
                              )}
                              {col.website && (
                                <Link 
                                  href={col.website.startsWith('http') ? col.website : `https://${col.website}`} 
                                  target="_blank" 
                                  className="bg-pink-700/50 hover:bg-pink-600/70 p-2 sm:p-1 rounded transition-all duration-200 flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[24px] sm:min-h-[24px]" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <WebsiteIcon size={20} />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DApps Table */}
            <div className="bg-gradient-to-br from-purple-900/60 via-pink-900/70 to-black/80 p-3 sm:p-4 rounded-xl shadow-[0_0_20px_#9333ea80] border border-purple-300/10 backdrop-blur">
              <h2 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span>🖥️</span>
                Apps / Infra
              </h2>
              
              <div className="overflow-hidden rounded-lg">
                <div className="overflow-y-auto max-h-[50vh] sm:max-h-[70vh] custom-scrollbar">
                  <table className="w-full text-white text-xs sm:text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-purple-800 backdrop-blur-md text-purple-200 shadow-sm">
                        <th className="text-left px-2 sm:px-3 py-2 w-100 sm:w-64">Name</th>
                        <th className="text-right px-2 sm:px-3 py-2 w-16 sm:w-20">
                          <span className="hidden sm:inline">Followers</span>
                          <span className="sm:hidden">Foll.</span>
                        </th>
                        <th className="text-right px-2 sm:px-3 py-2 w-12 sm:w-16">24Hr.</th>
                        <th className="text-center px-2 sm:px-3 py-2 w-16 sm:w-20">Links</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dapps.map((dapp, index) => (
                        <tr 
                          key={dapp.name} 
                          className="hover:bg-purple-700/10 transition-all duration-200 cursor-pointer border-b border-purple-300/5"
                          onClick={() => handleDAppRowClick(dapp)}
                        >
                          <td className="px-2 sm:px-3 py-2">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                {dapp.logo && (
                                  <Image 
                                    src={dapp.logo} 
                                    alt={dapp.name} 
                                    width={16} 
                                    height={16} 
                                    className="rounded-full flex-shrink-0 sm:w-5 sm:h-5"
                                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                  />
                                )}
                                <span className="font-medium text-xs sm:text-sm">
                                  {dapp.name}
                                </span>
                              </div>
                              {dapp.tags && dapp.tags.length > 0 && (
                                <div className="flex items-center gap-0.5 flex-wrap">
                                  {dapp.tags.map((tag, tagIndex) => (
                                    <span 
                                      key={tagIndex}
                                      className={`text-xs px-1 py-0.5 rounded text-black font-medium ${tagColors[tag as keyof typeof tagColors] || 'bg-gray-300'} text-xs`}
                                      style={{fontSize: '10px'}}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-right text-purple-100">
                            {formatFollowers(dapp.followers)}
                          </td>
                          <td className={`px-2 sm:px-3 py-2 text-right font-medium ${dapp.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatChange(dapp.change)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {dapp.xLink && (
                                <Link 
                                  href={dapp.xLink} 
                                  target="_blank" 
                                  className="bg-purple-700/50 hover:bg-purple-600/70 p-2 sm:p-1 rounded transition-all duration-200 flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[24px] sm:min-h-[24px]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <XIcon size={20} />
                                </Link>
                              )}
                              {dapp.website && (
                                <Link 
                                  href={dapp.website.startsWith('http') ? dapp.website : `https://${dapp.website}`} 
                                  target="_blank" 
                                  className="bg-purple-700/50 hover:bg-purple-600/70 p-2 sm:p-1 rounded transition-all duration-200 flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[24px] sm:min-h-[24px]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <WebsiteIcon size={20} />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <NFTDialog
          isOpen={dialogOpen}
          onClose={closeNFTDialog}
          nfts={selectedNFTs?.nfts || []}
          projectName={selectedNFTs?.projectName || ''}
        />
      </section>
    </>
  );
}
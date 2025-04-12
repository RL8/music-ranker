import { useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowUp, Heart, Share2, Sparkles } from 'lucide-react';

// Helper function to get ordinal suffix
function getOrdinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = n % 100;
  return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

export default function TaylorSwiftAlbumRanker() {
  // Taylor Swift's albums with more detailed information
  const albums = [
    { 
      id: 1, 
      title: "Taylor Swift", 
      year: 2006, 
      color: "#7B9095", 
      bgColor: "#e8f0f2",
      textColor: "#2d4047",
      cover: "/api/placeholder/300/300",
      emoji: "🤠",
      era: "Country Era"
    },
    { 
      id: 2, 
      title: "Fearless", 
      year: 2008, 
      color: "#C9B870", 
      bgColor: "#fff9e6",
      textColor: "#8f7c24",
      cover: "/api/placeholder/300/300",
      emoji: "✨",
      era: "Fearless Era"
    },
    { 
      id: 3, 
      title: "Speak Now", 
      year: 2010, 
      color: "#A5567C", 
      bgColor: "#fae6f0",
      textColor: "#812552",
      cover: "/api/placeholder/300/300",
      emoji: "💜",
      era: "Speak Now Era"
    },
    { 
      id: 4, 
      title: "Red", 
      year: 2012, 
      color: "#A52A2A", 
      bgColor: "#ffe6e6",
      textColor: "#8c2020",
      cover: "/api/placeholder/300/300",
      emoji: "🧣",
      era: "Red Era"
    },
    { 
      id: 5, 
      title: "1989", 
      year: 2014, 
      color: "#ADD8E6", 
      bgColor: "#e6f7ff",
      textColor: "#1a6985",
      cover: "/api/placeholder/300/300",
      emoji: "🌊",
      era: "1989 Era"
    },
    { 
      id: 6, 
      title: "Reputation", 
      year: 2017, 
      color: "#000000", 
      bgColor: "#e6e6e6",
      textColor: "#000000",
      cover: "/api/placeholder/300/300",
      emoji: "🐍",
      era: "Reputation Era"
    },
    { 
      id: 7, 
      title: "Lover", 
      year: 2019, 
      color: "#FFB6C1", 
      bgColor: "#ffe6ea",
      textColor: "#cc5c6c",
      cover: "/api/placeholder/300/300",
      emoji: "💖",
      era: "Lover Era"
    },
    { 
      id: 8, 
      title: "Folklore", 
      year: 2020, 
      color: "#808080", 
      bgColor: "#f0f0f0",
      textColor: "#4d4d4d",
      cover: "/api/placeholder/300/300",
      emoji: "🌲",
      era: "Folklore Era"
    },
    { 
      id: 9, 
      title: "Evermore", 
      year: 2020, 
      color: "#8B4513", 
      bgColor: "#f5efe6",
      textColor: "#6b370f",
      cover: "/api/placeholder/300/300",
      emoji: "🍂",
      era: "Evermore Era"
    },
    { 
      id: 10, 
      title: "Midnights", 
      year: 2022, 
      color: "#191970", 
      bgColor: "#e6e6ff",
      textColor: "#151563",
      cover: "/api/placeholder/300/300",
      emoji: "🌙",
      era: "Midnights Era"
    },
    { 
      id: 11, 
      title: "The Tortured Poets Department", 
      year: 2024, 
      color: "#272727", 
      bgColor: "#e9e9e9",
      textColor: "#272727",
      cover: "/api/placeholder/300/300",
      emoji: "📝",
      era: "TTPD Era"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(5);
  const [rankedAlbums, setRankedAlbums] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Calculate which albums to show in the carousel
  const visibleAlbums = [];
  for (let i = -2; i <= 2; i++) {
    const index = (currentIndex + i + albums.length) % albums.length;
    visibleAlbums.push({ ...albums[index], position: i });
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + albums.length) % albums.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % albums.length);
  };

  const addToRanking = () => {
    const albumToAdd = albums[currentIndex];
    if (!rankedAlbums.some(album => album.id === albumToAdd.id)) {
      setRankedAlbums([...rankedAlbums, albumToAdd]);
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
      
      // Show confetti when ranking is complete
      if (rankedAlbums.length === albums.length - 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const currentAlbum = albums[currentIndex];
  const rankingComplete = rankedAlbums.length === albums.length;

  return (
    <div 
      className="relative flex flex-col h-screen font-sans overflow-hidden"
      style={{
        background: rankingComplete 
          ? "linear-gradient(135deg, #ffb6c1, #add8e6, #c9b870, #a5567c)" 
          : `linear-gradient(to bottom, ${currentAlbum.bgColor}, #f8f8f8)`
      }}
    >
      {/* Confetti effect when ranking is complete */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: ['#FFB6C1', '#ADD8E6', '#C9B870', '#A5567C', '#A52A2A'][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Header with title */}
      <div className="pt-8 pb-2 px-4 text-center">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>
          <Sparkles size={16} className="inline mr-1" />
          <span>Eras Ranker</span>
          <Sparkles size={16} className="inline ml-1" />
        </h1>
        <p className="text-sm opacity-75">Rank Taylor's albums your way</p>
      </div>

      {/* Top third - Instructions */}
      <div className="flex-none h-1/4 flex flex-col items-center justify-center p-4">
        {rankingComplete ? (
          <div className="text-center rounded-xl bg-white bg-opacity-70 p-4 shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-2" style={{ color: "#d23b68" }}>Your Ranking Is Complete! 🎉</h2>
            <p className="text-sm">You've ranked all of Taylor's eras. Share your ranking with fellow Swifties!</p>
            <button className="mt-3 px-6 py-2 rounded-full bg-pink-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors">
              <Share2 size={16} />
              <span>Share Your Ranking</span>
            </button>
          </div>
        ) : (
          <div 
            className={`text-center rounded-xl bg-white bg-opacity-70 p-4 shadow-lg max-w-md transform transition-all ${animation ? 'scale-105' : 'scale-100'}`}
            style={{ color: currentAlbum.textColor }}
          >
            <div className="text-xl font-bold mb-1">
              Select your {getOrdinal(rankedAlbums.length + 1)} favorite album
            </div>
            <p className="text-sm opacity-75 mb-1">
              {rankedAlbums.length === 0 
                ? "Let's start with your absolute favorite!" 
                : `${albums.length - rankedAlbums.length} albums left to rank`}
            </p>
            <div className="flex justify-center gap-1 mt-2">
              <span className="inline-block text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
                Swipe to browse {currentAlbum.emoji}
              </span>
              <span className="inline-block text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
                Swipe up to rank ⬆️
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Middle third - Ranking area */}
      <div className="flex-grow flex flex-col items-center p-4 overflow-hidden relative">
        {isDragging && (
          <div className="absolute inset-0 bg-pink-100 bg-opacity-40 flex items-center justify-center z-20">
            <div className="bg-white p-4 rounded-xl shadow-lg transform scale-110 transition-transform">
              <p className="font-bold flex items-center gap-2">
                <Heart size={16} className="text-pink-500" />
                Release to rank!
              </p>
            </div>
          </div>
        )}
        
        {rankedAlbums.length > 0 ? (
          <div className="w-full max-h-full overflow-y-auto rounded-xl bg-white bg-opacity-80 p-3 shadow-lg">
            <h2 className="text-center font-bold mb-3" style={{ color: "#d23b68" }}>
              Your Taylor Swift Albums Ranking
            </h2>
            <div className="flex flex-col gap-2">
              {rankedAlbums.map((album, index) => (
                <div 
                  key={album.id} 
                  className="flex items-center p-2 bg-white rounded-lg shadow-sm"
                  style={{ 
                    borderLeft: `4px solid ${album.color}`,
                    background: `linear-gradient(to right, ${album.bgColor}, white)`
                  }}
                >
                  <div 
                    className="flex justify-center items-center w-8 h-8 rounded-full mr-3 font-bold text-white"
                    style={{ backgroundColor: album.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3" style={{ backgroundColor: album.color }}>
                    <span className="text-lg">{album.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{album.title}</div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{album.era}</span>
                      <span>{album.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Your ranked albums will appear here</p>
          </div>
        )}
      </div>

      {/* Bottom third - Album carousel */}
      <div className="flex-none h-1/3 bg-gradient-to-b from-transparent to-gray-900 relative">
        {/* Swipe up indicator */}
        <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
          <div 
            className={`bg-white bg-opacity-80 px-4 py-2 rounded-b-lg shadow flex items-center gap-2 transition-all ${animation ? 'transform -translate-y-2' : ''}`}
            style={{ color: currentAlbum.textColor }}
          >
            <ArrowUp size={16} className="text-pink-500" />
            <span className="text-sm font-medium">Swipe up to rank</span>
          </div>
        </div>

        {/* Album carousel */}
        <div className="relative h-full flex items-center justify-center">
          <button 
            onClick={handlePrev} 
            className="absolute left-4 z-10 bg-white bg-opacity-70 p-3 rounded-full shadow-lg focus:outline-none hover:bg-opacity-100 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            className="flex items-center justify-center"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => {
              if (isDragging) {
                addToRanking();
                setIsDragging(false);
              }
            }}
            onMouseLeave={() => setIsDragging(false)}
          >
            {visibleAlbums.map((album) => (
              <div
                key={`${album.id}-${album.position}`}
                className="absolute transition-all duration-300 ease-in-out"
                style={{
                  transform: `
                    translateX(${album.position * 120}px) 
                    scale(${1 - Math.abs(album.position) * 0.2})
                    translateY(${Math.abs(album.position) * 15}px)
                    rotateY(${album.position * 15}deg)
                  `,
                  zIndex: 10 - Math.abs(album.position),
                  opacity: 1 - Math.abs(album.position) * 0.4,
                }}
              >
                <div 
                  className={`w-44 h-44 rounded-lg shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-transform ${album.position === 0 ? 'transform hover:scale-105' : ''}`}
                  style={{ 
                    backgroundColor: album.color,
                    boxShadow: album.position === 0 ? `0 10px 25px -5px ${album.color}80` : '',
                  }}
                >
                  <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 rounded-bl-lg">
                    <span className="text-lg">{album.emoji}</span>
                  </div>
                  
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 backdrop-blur-sm">
                    <div className="font-bold">{album.title}</div>
                    <div className="text-xs opacity-80">{album.era} • {album.year}</div>
                  </div>
                  
                  {album.position === 0 && rankedAlbums.some(ranked => ranked.id === album.id) && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium">
                        Already Ranked
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleNext} 
            className="absolute right-4 z-10 bg-white bg-opacity-70 p-3 rounded-full shadow-lg focus:outline-none hover:bg-opacity-100 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        .animate-confetti {
          position: absolute;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

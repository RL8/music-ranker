import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowUp, Heart, ArrowLeft, Music, List, Shuffle } from 'lucide-react';

// Album data including songs
const albumsData = [
  { 
    id: 1, 
    title: "Taylor Swift", 
    year: 2006, 
    color: "#7B9095", 
    bgColor: "#e8f0f2",
    textColor: "#2d4047",
    emoji: "🤠",
    era: "Country Era",
    songs: [
      "Tim McGraw", "Picture to Burn", "Teardrops on My Guitar", "A Place in This World",
      "Cold as You", "The Outside", "Tied Together with a Smile", "Stay Beautiful",
      "Should've Said No", "Mary's Song (Oh My My My)", "Our Song"
    ]
  },
  { 
    id: 2, 
    title: "Fearless", 
    year: 2008, 
    color: "#C9B870", 
    bgColor: "#fff9e6",
    textColor: "#8f7c24",
    emoji: "✨",
    era: "Fearless Era",
    songs: [
      "Fearless", "Fifteen", "Love Story", "Hey Stephen", "White Horse", "You Belong with Me",
      "Breathe", "Tell Me Why", "You're Not Sorry", "The Way I Loved You", "Forever & Always",
      "The Best Day", "Change"
    ]
  },
  { 
    id: 3, 
    title: "Speak Now", 
    year: 2010, 
    color: "#A5567C", 
    bgColor: "#fae6f0",
    textColor: "#812552",
    emoji: "💜",
    era: "Speak Now Era",
    songs: [
      "Mine", "Sparks Fly", "Back to December", "Speak Now", "Dear John", "Mean",
      "The Story of Us", "Never Grow Up", "Enchanted", "Better Than Revenge",
      "Innocent", "Haunted", "Last Kiss", "Long Live"
    ]
  },
  { 
    id: 4, 
    title: "Red", 
    year: 2012, 
    color: "#A52A2A", 
    bgColor: "#ffe6e6",
    textColor: "#8c2020",
    emoji: "🧣",
    era: "Red Era",
    songs: [
      "State of Grace", "Red", "Treacherous", "I Knew You Were Trouble", "All Too Well",
      "22", "I Almost Do", "We Are Never Ever Getting Back Together", "Stay Stay Stay",
      "The Last Time", "Holy Ground", "Sad Beautiful Tragic", "The Lucky One", 
      "Everything Has Changed", "Starlight", "Begin Again"
    ]
  },
  { 
    id: 5, 
    title: "1989", 
    year: 2014, 
    color: "#ADD8E6", 
    bgColor: "#e6f7ff",
    textColor: "#1a6985",
    emoji: "🌊",
    era: "1989 Era",
    songs: [
      "Welcome to New York", "Blank Space", "Style", "Out of the Woods", "All You Had to Do Was Stay",
      "Shake It Off", "I Wish You Would", "Bad Blood", "Wildest Dreams", "How You Get the Girl",
      "This Love", "I Know Places", "Clean"
    ]
  },
  { 
    id: 6, 
    title: "Reputation", 
    year: 2017, 
    color: "#000000", 
    bgColor: "#e6e6e6",
    textColor: "#000000",
    emoji: "🐍",
    era: "Reputation Era",
    songs: [
      "...Ready for It?", "End Game", "I Did Something Bad", "Don't Blame Me", "Delicate",
      "Look What You Made Me Do", "So It Goes...", "Gorgeous", "Getaway Car", "King of My Heart",
      "Dancing with Our Hands Tied", "Dress", "This Is Why We Can't Have Nice Things", 
      "Call It What You Want", "New Year's Day"
    ]
  },
  { 
    id: 7, 
    title: "Lover", 
    year: 2019, 
    color: "#FFB6C1", 
    bgColor: "#ffe6ea",
    textColor: "#cc5c6c",
    emoji: "💖",
    era: "Lover Era",
    songs: [
      "I Forgot That You Existed", "Cruel Summer", "Lover", "The Man", "The Archer",
      "I Think He Knows", "Miss Americana & the Heartbreak Prince", "Paper Rings", "Cornelia Street",
      "Death by a Thousand Cuts", "London Boy", "Soon You'll Get Better", "False God",
      "You Need to Calm Down", "Afterglow", "ME!", "It's Nice to Have a Friend", "Daylight"
    ]
  },
  { 
    id: 8, 
    title: "Folklore", 
    year: 2020, 
    color: "#808080", 
    bgColor: "#f0f0f0",
    textColor: "#4d4d4d",
    emoji: "🌲",
    era: "Folklore Era",
    songs: [
      "The 1", "Cardigan", "The Last Great American Dynasty", "Exile", "My Tears Ricochet",
      "Mirrorball", "Seven", "August", "This Is Me Trying", "Illicit Affairs", "Invisible String",
      "Mad Woman", "Epiphany", "Betty", "Peace", "Hoax", "The Lakes"
    ]
  },
  { 
    id: 9, 
    title: "Evermore", 
    year: 2020, 
    color: "#8B4513", 
    bgColor: "#f5efe6",
    textColor: "#6b370f",
    emoji: "🍂",
    era: "Evermore Era",
    songs: [
      "Willow", "Champagne Problems", "Gold Rush", "Tis the Damn Season", "Tolerate It",
      "No Body, No Crime", "Happiness", "Dorothea", "Coney Island", "Ivy", "Cowboy like Me",
      "Long Story Short", "Marjorie", "Closure", "Evermore"
    ]
  },
  { 
    id: 10, 
    title: "Midnights", 
    year: 2022, 
    color: "#191970", 
    bgColor: "#e6e6ff",
    textColor: "#151563",
    emoji: "🌙",
    era: "Midnights Era",
    songs: [
      "Lavender Haze", "Maroon", "Anti-Hero", "Snow on the Beach", "You're on Your Own, Kid",
      "Midnight Rain", "Question...?", "Vigilante Shit", "Bejeweled", "Labyrinth",
      "Karma", "Sweet Nothing", "Mastermind"
    ]
  },
  { 
    id: 11, 
    title: "The Tortured Poets Department", 
    year: 2024, 
    color: "#272727", 
    bgColor: "#e9e9e9",
    textColor: "#272727",
    emoji: "📝",
    era: "TTPD Era",
    songs: [
      "Fortnight", "The Tortured Poets Department", "My Boy Only Breaks His Favorite Toys", 
      "Down Bad", "So Long, London", "But Daddy I Love Him", "Fresh Out the Slammer", 
      "Florida!!!", "Guilty as Sin?", "Who's Afraid of Little Old Me?", "I Can Fix Him (No Really I Can)", 
      "loml", "I Can Do It With a Broken Heart", "The Smallest Man Who Ever Lived", 
      "The Alchemy", "Clara Bow"
    ]
  }
];

// Helper function for ordinals
function getOrdinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = n % 100;
  return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

export default function TaylorSwiftSongRanker() {
  const [selectedAlbumId, setSelectedAlbumId] = useState(7); // Lover as default
  const [view, setView] = useState('album-selection'); // 'album-selection' or 'song-ranking'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rankedSongs, setRankedSongs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const selectedAlbum = albumsData.find(album => album.id === selectedAlbumId);
  const unrankedSongs = selectedAlbum ? selectedAlbum.songs.filter(song => !rankedSongs.includes(song)) : [];
  
  useEffect(() => {
    // Reset rankings when switching albums
    setRankedSongs([]);
    setCurrentIndex(0);
  }, [selectedAlbumId]);

  // For album selection view
  const visibleAlbums = [];
  for (let i = -2; i <= 2; i++) {
    const index = (selectedAlbumId - 1 + i + albumsData.length) % albumsData.length;
    visibleAlbums.push({ ...albumsData[index], position: i });
  }

  const handleAlbumPrev = () => {
    setSelectedAlbumId(prev => prev === 1 ? albumsData.length : prev - 1);
  };

  const handleAlbumNext = () => {
    setSelectedAlbumId(prev => prev === albumsData.length ? 1 : prev + 1);
  };

  const startSongRanking = () => {
    setView('song-ranking');
    setRankedSongs([]);
  };

  // For song ranking view
  const handleSongPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? unrankedSongs.length - 1 : prev - 1));
  };

  const handleSongNext = () => {
    setCurrentIndex(prev => (prev === unrankedSongs.length - 1 ? 0 : prev + 1));
  };

  const addToRanking = () => {
    if (unrankedSongs.length > 0) {
      const songToAdd = unrankedSongs[currentIndex];
      setRankedSongs(prev => [...prev, songToAdd]);
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
      
      // Reset current index if we've reached the end
      if (currentIndex >= unrankedSongs.length - 1) {
        setCurrentIndex(0);
      }
      
      // Show confetti when ranking is complete
      if (rankedSongs.length === selectedAlbum.songs.length - 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const shuffleRanking = () => {
    // Shuffle remaining songs and add them to ranking
    const remaining = [...unrankedSongs];
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    setRankedSongs(prev => [...prev, ...remaining]);
    
    if (selectedAlbum.songs.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const backToAlbums = () => {
    setView('album-selection');
  };

  const rankingComplete = selectedAlbum && rankedSongs.length === selectedAlbum.songs.length;

  if (view === 'album-selection') {
    return (
      <div 
        className="relative flex flex-col h-screen font-sans overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${selectedAlbum.bgColor}, #f8f8f8)`
        }}
      >
        {/* Header with title */}
        <div className="pt-8 pb-2 px-4 text-center">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: selectedAlbum.textColor }}>
            <Music size={16} className="inline mr-1" />
            <span>Song Ranker</span>
            <Music size={16} className="inline ml-1" />
          </h1>
          <p className="text-sm opacity-75">Select an album to rank its songs</p>
        </div>

        {/* Album selection instructions */}
        <div className="flex-none h-1/4 flex flex-col items-center justify-center p-4">
          <div 
            className="text-center rounded-xl bg-white bg-opacity-70 p-4 shadow-lg max-w-md"
            style={{ color: selectedAlbum.textColor }}
          >
            <div className="text-xl font-bold mb-1">
              {selectedAlbum.title} {selectedAlbum.emoji}
            </div>
            <p className="text-sm opacity-75 mb-3">
              {selectedAlbum.era} • {selectedAlbum.year} • {selectedAlbum.songs.length} songs
            </p>
            <button 
              onClick={startSongRanking}
              className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all hover:shadow-lg"
              style={{ backgroundColor: selectedAlbum.color }}
            >
              Rank Songs on This Album
            </button>
          </div>
        </div>

        {/* Album details */}
        <div className="flex-grow flex flex-col items-center p-4 overflow-hidden">
          <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-4 shadow-lg">
            <h3 className="font-bold mb-2" style={{ color: selectedAlbum.textColor }}>Track List:</h3>
            <div className="max-h-64 overflow-y-auto">
              <ol className="list-decimal list-inside space-y-1 pl-2">
                {selectedAlbum.songs.map((song, index) => (
                  <li key={index} className="text-sm">
                    {song}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Album carousel */}
        <div className="flex-none h-1/3 bg-gradient-to-b from-transparent to-gray-900 relative">
          <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
            <div className="bg-white bg-opacity-80 px-4 py-2 rounded-b-lg shadow flex items-center gap-2">
              <span className="text-sm font-medium">Browse Albums</span>
            </div>
          </div>

          <div className="relative h-full flex items-center justify-center">
            <button 
              onClick={handleAlbumPrev} 
              className="absolute left-4 z-10 bg-white bg-opacity-70 p-3 rounded-full shadow-lg focus:outline-none hover:bg-opacity-100 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center justify-center">
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
                  onClick={album.position === 0 ? () => setSelectedAlbumId(album.id) : undefined}
                >
                  <div 
                    className={`w-44 h-44 rounded-lg shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-transform ${album.position === 0 ? 'transform hover:scale-105' : ''}`}
                    style={{ 
                      backgroundColor: album.color,
                      boxShadow: album.position === 0 ? `0 10px 25px -5px ${album.color}80` : '',
                      cursor: album.position === 0 ? 'pointer' : 'default'
                    }}
                  >
                    <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 rounded-bl-lg">
                      <span className="text-lg">{album.emoji}</span>
                    </div>
                    
                    <img src={`/api/placeholder/300/300`} alt={album.title} className="w-full h-full object-cover" />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 backdrop-blur-sm">
                      <div className="font-bold">{album.title}</div>
                      <div className="text-xs opacity-80">{album.era} • {album.year}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAlbumNext} 
              className="absolute right-4 z-10 bg-white bg-opacity-70 p-3 rounded-full shadow-lg focus:outline-none hover:bg-opacity-100 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Song ranking view
  return (
    <div 
      className="relative flex flex-col h-screen font-sans overflow-hidden"
      style={{
        background: rankingComplete 
          ? `linear-gradient(135deg, ${selectedAlbum.color}40, ${selectedAlbum.bgColor})` 
          : `linear-gradient(to bottom, ${selectedAlbum.bgColor}, #f8f8f8)`
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
                background: selectedAlbum.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Header with back button */}
      <div className="pt-6 pb-2 px-4 flex items-center">
        <button 
          onClick={backToAlbums} 
          className="bg-white bg-opacity-70 p-2 rounded-full shadow flex items-center"
        >
          <ArrowLeft size={16} />
          <span className="ml-1 text-sm">Albums</span>
        </button>
        
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: selectedAlbum.textColor }}>
            {selectedAlbum.title} {selectedAlbum.emoji}
          </h1>
          <p className="text-xs opacity-75">Rank your favorite songs</p>
        </div>
        
        <div className="w-20"></div> {/* For balance */}
      </div>

      {/* Top third - Instructions */}
      <div className="flex-none h-1/5 flex flex-col items-center justify-center p-4">
        {rankingComplete ? (
          <div className="text-center rounded-xl bg-white bg-opacity-70 p-4 shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-2" style={{ color: selectedAlbum.color }}>Ranking Complete! 🎉</h2>
            <p className="text-sm">You've ranked all {selectedAlbum.songs.length} songs from {selectedAlbum.title}</p>
          </div>
        ) : (
          <div 
            className={`text-center rounded-xl bg-white bg-opacity-70 p-4 shadow-lg max-w-md transform transition-all ${animation ? 'scale-105' : 'scale-100'}`}
            style={{ color: selectedAlbum.textColor }}
          >
            <div className="text-lg font-bold mb-1">
              Select your {getOrdinal(rankedSongs.length + 1)} favorite song
            </div>
            <p className="text-sm opacity-75 mb-1">
              {rankedSongs.length === 0 
                ? "Let's start with your absolute favorite!" 
                : `${selectedAlbum.songs.length - rankedSongs.length} songs left to rank`}
            </p>
            
            {unrankedSongs.length > 3 && (
              <button 
                onClick={shuffleRanking} 
                className="mt-2 px-4 py-1 text-xs rounded-full bg-white bg-opacity-70 flex items-center gap-1 mx-auto hover:bg-opacity-100 transition-all"
              >
                <Shuffle size={12} />
                <span>Auto-complete ranking</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Middle third - Ranking area */}
      <div className="flex-grow flex flex-col items-center p-4 overflow-hidden relative">
        {isDragging && (
          <div className="absolute inset-0 bg-pink-100 bg-opacity-40 flex items-center justify-center z-20">
            <div className="bg-white p-4 rounded-xl shadow-lg transform scale-110 transition-transform">
              <p className="font-bold flex items-center gap-2">
                <Heart size={16} style={{ color: selectedAlbum.color }} />
                Release to rank!
              </p>
            </div>
          </div>
        )}
        
        {rankedSongs.length > 0 ? (
          <div className="w-full max-h-full overflow-y-auto rounded-xl bg-white bg-opacity-80 p-3 shadow-lg">
            <h2 className="text-center font-bold mb-3" style={{ color: selectedAlbum.color }}>
              Your {selectedAlbum.title} Song Ranking
            </h2>
            <div className="flex flex-col gap-2">
              {rankedSongs.map((song, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-2 bg-white rounded-lg shadow-sm"
                  style={{ 
                    borderLeft: `4px solid ${selectedAlbum.color}`,
                    background: index === 0 ? `linear-gradient(to right, ${selectedAlbum.color}30, white)` : 'white'
                  }}
                >
                  <div 
                    className="flex justify-center items-center w-8 h-8 rounded-full mr-3 font-bold text-white"
                    style={{ 
                      backgroundColor: index === 0 ? selectedAlbum.color : '#9ca3af',
                      opacity: 1 - (index * 0.5) / selectedAlbum.songs.length
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{song}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="flex flex-col items-center">
              <List size={32} className="mb-2 opacity-40" />
              <p>Your ranked songs will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom third - Song carousel */}
      <div className="flex-none h-1/3 bg-gradient-to-b from-transparent to-gray-900 relative">
        {/* Swipe up indicator */}
        <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
          <div 
            className={`bg-white bg-opacity-80 px-4 py-2 rounded-b-lg shadow flex items-center gap-2 transition-all ${animation ? 'transform -translate-y-2' : ''}`}
            style={{ color: selectedAlbum.textColor }}
          >
            <ArrowUp size={16} style={{ color: selectedAlbum.color }} />
            <span className="text-sm font-medium">Swipe up to rank</span>
          </div>
        </div>

        {/* Song carousel */}
        {unrankedSongs.length > 0 ? (
          <div className="relative h-full flex items-center justify-center">
            <button 
              onClick={handleSongPrev} 
              className="absolute left-4 z-10 bg-white bg-opacity-70 p-3 rounded-full shadow-lg focus:outline-none hover:bg-opacity-100 transition-all"
              disabled={unrankedSongs.length <= 1}
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
              {unrankedSongs.length > 0 && (
                <div 
                  className="w-64 h-40 rounded-lg shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden bg-white transform hover:scale-105 transition-transform"
                  style={{ 
                    boxShadow: `0 10px 25px -5px ${selectedAlbum.color}50`,
                    border: `2px solid ${selectedAlbum.color}`
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 right-0 h-2"
                    style={{ backgroundColor: selectedAlbum.color }}
                  ></div>
                  
                  <div className="p-4 flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${selectedAlbum.color}20` }}
                    >
                      <Music size={20} style={{ color: selectedAlbum.color }} />
                    </div>
                    
                    <div className="font-bold text-lg mb-1">{unrankedSongs[currentIndex]}</div>
                    <div className="text-xs text-gray-500">
                      Track from {selectedAlbum.title} ({selectedAlbum.year})
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleSongNext} 
              className="absolute right-4 z-10 bg-white bg-opacity-70 p-3 rounded-full shadow-lg focus:outline-none hover:bg-opacity-100 transition-all"
              disabled={unrankedSongs.length <= 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow text-center">
              <p className="font-medium" style={{ color: selectedAlbum.textColor }}>All songs ranked!</p>
            </div>
          </div>
        )}
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

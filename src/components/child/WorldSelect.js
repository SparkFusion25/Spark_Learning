import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorldSelect = () => {
  const navigate = useNavigate();

  // Mock learning worlds data
  const learningWorlds = [
    {
      id: 'math',
      name: 'Number Castle',
      emoji: '🏰',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      description: 'Solve puzzles and build with numbers!',
      unlocked: true
    },
    {
      id: 'reading',
      name: 'Story Forest',
      emoji: '🌳',
      gradient: 'from-green-400 via-emerald-500 to-green-600',
      description: 'Adventure through magical tales',
      unlocked: true
    },
    {
      id: 'science',
      name: 'Wonder Lab',
      emoji: '🔬',
      gradient: 'from-blue-400 via-cyan-500 to-blue-600',
      description: 'Discover amazing experiments',
      unlocked: true
    },
    {
      id: 'art',
      name: 'Rainbow Studio',
      emoji: '🎨',
      gradient: 'from-pink-400 via-rose-500 to-pink-600',
      description: 'Create colorful masterpieces',
      unlocked: false
    },
    {
      id: 'music',
      name: 'Melody Mountain',
      emoji: '🎵',
      gradient: 'from-yellow-400 via-orange-500 to-yellow-600',
      description: 'Make music and find rhythm',
      unlocked: false
    },
    {
      id: 'social',
      name: 'Friendship Town',
      emoji: '🏘️',
      gradient: 'from-indigo-400 via-blue-500 to-indigo-600',
      description: 'Learn about people and places',
      unlocked: false
    }
  ];

  const handleWorldSelect = (world) => {
    if (world.unlocked) {
      navigate(`/lessons/${world.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto pt-8 px-4">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
            🌟 Choose Your Adventure! 
          </h2>
          <p className="text-xl text-white/90 font-semibold">
            Pick a magical world to explore and learn!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {learningWorlds.map(world => (
            <div 
              key={world.id}
              onClick={() => handleWorldSelect(world)}
              className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 hover:scale-105 transition-all duration-500 cursor-pointer border-4 border-transparent hover:border-yellow-400 group relative overflow-hidden ${
                !world.unlocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">{world.emoji}</div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{world.name}</h3>
                <p className="text-gray-600 mb-4">{world.description}</p>
                
                <div className={`bg-gradient-to-r ${world.gradient} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                  {world.unlocked ? 'Start Learning!' : 'Coming Soon!'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/child-select')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            ← Back to Child Select
          </button>

          {/* Family Games Button */}
          <button
            onClick={() => navigate('/family-games')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            🎮 Family Games
          </button>

                                {/* Current Child Info */}
                      <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                        <span className="text-white font-bold">👧🏽 Emmy • Level 3 • 150 ⭐</span>
                      </div>
        </div>
      </div>
    </div>
  );
};

export default WorldSelect;
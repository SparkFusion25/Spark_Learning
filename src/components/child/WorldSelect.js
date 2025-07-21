import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import FloatingShapes from '../shared/FloatingShapes';

const WorldSelect = () => {
  const navigate = useNavigate();
  const { LEARNING_WORLDS, setCurrentWorld, isWorldUnlocked } = useLearning();

  const handleWorldSelect = (world) => {
    if (isWorldUnlocked(world)) {
      setCurrentWorld(world);
      navigate(`/lessons/${world.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 relative overflow-hidden kid-interface">
      <FloatingShapes />
      
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
          {LEARNING_WORLDS.map(world => (
            <div 
              key={world.id}
              onClick={() => handleWorldSelect(world)}
              className={`kid-card p-6 shadow-magical hover:scale-105 transition-all duration-500 cursor-pointer border-4 border-transparent hover:border-yellow-400 group relative overflow-hidden ${
                !isWorldUnlocked(world) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">{world.emoji}</div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{world.name}</h3>
                <p className="text-gray-600 mb-4">{world.description}</p>
                
                <div className={`bg-gradient-to-r ${world.gradient} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                  {isWorldUnlocked(world) ? 'Start Learning!' : `Unlock at Level ${world.unlockLevel}`}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/child-select')}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorldSelect;
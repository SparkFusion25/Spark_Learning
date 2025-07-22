import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Trophy, Volume2, VolumeX } from 'lucide-react';

const FamilyGamesHubSimple = () => {
  const navigate = useNavigate();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const games = [
    {
      id: 'sparkle-crush',
      title: '✨ Sparkle Crush',
      description: 'Match magical sparkles in this candy-crush style game!',
      theme: 'frozen',
      difficulty: 'Easy'
    },
    {
      id: 'word-builder',
      title: '📝 Word Builder',
      description: 'Build words and expand your vocabulary!',
      theme: 'forest',
      difficulty: 'Medium'
    },
    {
      id: 'snowball-shooter',
      title: '⛄ Snowball Shooter',
      description: 'Launch snowballs at targets in this physics game!',
      theme: 'frozen',
      difficulty: 'Easy'
    },
    {
      id: 'element-slice',
      title: '⚡ Element Slice',
      description: 'Slice elements as they fly across the screen!',
      theme: 'spiderman',
      difficulty: 'Hard'
    },
    {
      id: 'block-builder',
      title: '🧱 Block Builder',
      description: 'Build amazing structures with magical blocks!',
      theme: 'minecraft',
      difficulty: 'Medium'
    }
  ];

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 relative overflow-hidden">
      
      {/* Audio Controls */}
      <motion.div 
        className="fixed top-4 right-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isAudioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </motion.button>
      </motion.div>

      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => navigate('/world-select')}
            className="absolute left-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div>
            <h1 className="text-6xl font-bold text-white mb-4">
              🎮 Family Fun Games
            </h1>
            <p className="text-2xl text-white/90">
              Games so fun, even parents want to play!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert(`${game.title} - Coming Soon! This is a demo.`)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
                <p className="text-lg text-white/90 mb-6">{game.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-medium">🎨 Theme: {game.theme}</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-medium">📊 {game.difficulty}</span>
                  </div>
                  
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold"
                    whileHover={{ scale: 1.05 }}
                  >
                    Play Now! 🚀
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Demo Notice */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-black/60 text-white px-6 py-3 rounded-xl text-center">
          <p className="font-bold">🎮 Demo Version</p>
          <p className="text-sm">Games are in development. Click to see placeholder!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default FamilyGamesHubSimple;
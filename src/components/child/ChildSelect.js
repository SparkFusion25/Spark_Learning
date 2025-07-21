import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChildSelect = () => {
  const navigate = useNavigate();

  // Mock child data
  const children = [
    {
      id: 'child1',
      name: 'Emma',
      age: 6,
      avatar: '👧',
      level: 12,
      sparkCoins: 450,
      streak: 8,
      completedLessons: 47,
      totalTimeToday: 32
    },
    {
      id: 'child2',
      name: 'Max',
      age: 5,
      avatar: '👦',
      level: 8,
      sparkCoins: 230,
      streak: 3,
      completedLessons: 31,
      totalTimeToday: 18
    }
  ];

  const handleChildSelect = (child) => {
    navigate('/world-select');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 bg-white/90 backdrop-blur-lg shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🌟</div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Rocketter Learning Kids</h1>
              <p className="text-gray-600">Choose your learning adventure!</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 flex items-center space-x-2"
          >
            <span>👋</span>
            <span className="hidden sm:inline">Goodbye</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-8 px-4">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
            🌈 Welcome Back, Superstar! 
          </h2>
          <p className="text-xl text-white/90 font-semibold">
            Who's ready for an amazing learning adventure today?
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {children.map(child => (
            <div 
              key={child.id}
              onClick={() => handleChildSelect(child)}
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer border-4 border-transparent hover:border-yellow-400 group relative overflow-hidden"
            >
              <div className="relative text-center">
                <div className="text-8xl mb-4 group-hover:animate-bounce">{child.avatar}</div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">{child.name}</h3>
                
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold mb-6 shadow-lg">
                  ⭐ Level {child.level} Explorer
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-yellow-600">⚡</span>
                      <span className="font-bold text-gray-700">{child.sparkCoins}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Spark Coins</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-orange-600">👑</span>
                      <span className="font-bold text-gray-700">{child.streak}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Day Streak</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Today's Progress</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      📚 {child.completedLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      ⏰ {child.totalTimeToday} minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildSelect;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Crown, Plus, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import FloatingShapes from '../shared/FloatingShapes';

const ChildSelect = () => {
  const navigate = useNavigate();
  const { getChildren, setCurrentChild, logout } = useAuth();
  const { sparkCoins, learningStreak, LEARNING_WORLDS } = useLearning();
  const [showAddChild, setShowAddChild] = useState(false);
  
  const children = getChildren();

  const handleChildSelect = (child) => {
    setCurrentChild(child);
    navigate('/world-select');
  };

  const handleAddChild = () => {
    setShowAddChild(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 relative overflow-hidden kid-interface">
      <FloatingShapes />
      
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
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 flex items-center space-x-2"
            >
              <span>👋</span>
              <span className="hidden sm:inline">Goodbye</span>
            </button>
          </div>
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
              className="kid-card p-8 shadow-magical hover:scale-105 transition-all duration-500 cursor-pointer border-4 border-transparent hover:border-yellow-400 hover:shadow-yellow-400/25 group relative overflow-hidden"
            >
              {/* Magical glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative text-center">
                <div className="text-8xl mb-4 group-hover:animate-bounce">{child.avatar}</div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">{child.name}</h3>
                
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold mb-6 shadow-lg">
                  ⭐ Level {child.level} Explorer
                </div>
                
                {/* Enhanced stats with cute icons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-gray-700">{child.sparkCoins}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Spark Coins</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-gray-700">{child.streak}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Day Streak</p>
                  </div>
                </div>
                
                {/* Today's progress */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Today's Progress</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      📚 {child.completedLessons || 0} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      ⏰ {child.totalTimeToday || 0} minutes
                    </span>
                  </div>
                </div>

                {/* Favorite subject indicator */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">Favorite Subject</p>
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-purple-200 to-pink-200 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-purple-800">
                        {LEARNING_WORLDS.find(w => w.id === child.favoriteSubject)?.emoji} {' '}
                        {LEARNING_WORLDS.find(w => w.id === child.favoriteSubject)?.name || 'Math'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add New Child Option */}
        <div className="text-center mb-8">
          <div 
            onClick={handleAddChild}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 max-w-sm mx-auto border-2 border-dashed border-white/40 hover:border-white/60 transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <div className="text-4xl mb-3">
              <Plus className="w-12 h-12 mx-auto text-white" />
            </div>
            <p className="text-white font-semibold">Add New Child</p>
            <p className="text-white/80 text-sm">Create another learning profile</p>
          </div>
        </div>

        {/* Fun facts section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 max-w-4xl mx-auto mb-8">
          <h4 className="text-2xl font-black text-gray-800 mb-4 text-center">🎯 Did You Know?</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <p className="text-sm font-semibold text-gray-700">
                Children learn 50% faster with interactive games!
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <p className="text-sm font-semibold text-gray-700">
                Creative play boosts problem-solving skills by 73%!
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <p className="text-sm font-semibold text-gray-700">
                Family learning time improves retention by 89%!
              </p>
            </div>
          </div>
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

      {/* Add Child Modal */}
      {showAddChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👶</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Add New Child</h3>
              <p className="text-gray-600">Create a new learning profile</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Child's Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                  placeholder="Enter child's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300">
                  <option value="">Select age</option>
                  <option value="4">4 years old</option>
                  <option value="5">5 years old</option>
                  <option value="6">6 years old</option>
                  <option value="7">7 years old</option>
                  <option value="8">8 years old</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['👧', '👦', '🧒', '👶', '🧑', '👨', '👩', '🦸'].map((avatar, index) => (
                    <button
                      key={index}
                      className="text-3xl p-3 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddChild(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle add child logic here
                  setShowAddChild(false);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildSelect;
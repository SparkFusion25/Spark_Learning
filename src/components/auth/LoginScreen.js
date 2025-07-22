import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
    
    if (userType === 'child') {
      // For children, go directly to child selection
      navigate('/child-select');
    } else {
      setShowLoginForm(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Simple demo authentication
    if (selectedUserType === 'parent' && credentials.email === 'parent@family.com' && credentials.password === 'password123') {
      navigate('/parent');
    } else if (selectedUserType === 'admin' && credentials.email === 'admin@sparklearn.com' && credentials.password === 'admin123') {
      navigate('/admin');
    } else {
      alert('Invalid credentials! Use demo credentials from the form.');
    }
  };

  const goBack = () => {
    setShowLoginForm(false);
    setSelectedUserType(null);
    setCredentials({ email: '', password: '' });
  };

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
            <div className="text-center mb-8">
              <button
                onClick={goBack}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                ← Back
              </button>
              
              <div className="text-6xl mb-4">
                {selectedUserType === 'parent' ? '👨‍👩‍👧‍👦' : '⚙️'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedUserType === 'parent' ? 'Parent Login' : 'Admin Login'}
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                  placeholder={selectedUserType === 'parent' ? 'parent@family.com' : 'admin@sparklearn.com'}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                  placeholder={selectedUserType === 'parent' ? 'password123' : 'admin123'}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
              <p className="text-sm text-blue-600">
                Email: {selectedUserType === 'parent' ? 'parent@family.com' : 'admin@sparklearn.com'}<br />
                Password: {selectedUserType === 'parent' ? 'password123' : 'admin123'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div 
          className="text-center relative z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h1 
            className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
          >
            Rocketter Learning
          </motion.h1>
          
          <motion.p 
            className="text-2xl text-gray-700 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Where learning comes alive with your favorite characters! ✨
          </motion.p>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                                    {/* Child Login */}
                        <motion.div
                          className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
                          whileHover={{ scale: 1.05, y: -10 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/child-select')}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                        >
                          <div className="text-6xl mb-4">
                            <span className="mr-2">👧🏽</span>
                            <span className="mr-2">👦🏻</span>
                            <span className="mr-2">👧🏿</span>
                            <span>👦🏾</span>
                          </div>
                          <h3 className="text-2xl font-bold text-purple-800 mb-3">I'm a Kid!</h3>
                          <p className="text-gray-600 mb-6">Start your magical learning adventure with Emmy & Greyson</p>
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-bold">
                            Let's Play! 🚀
                          </div>
                        </motion.div>

            {/* Parent Login */}
            <motion.div
              className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/parent')}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">I'm a Parent</h3>
              <p className="text-gray-600 mb-6">Track progress and manage settings</p>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-2xl font-bold">
                View Dashboard 📊
              </div>
            </motion.div>

            {/* Admin Login */}
            <motion.div
              className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold text-orange-800 mb-3">Admin Access</h3>
              <p className="text-gray-600 mb-6">System management and analytics</p>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-2xl font-bold">
                Admin Panel 🔧
              </div>
            </motion.div>
          </div>

          {/* Family Games Hub Button */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            <motion.button
              onClick={() => navigate('/family-games')}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-12 py-6 rounded-3xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Family Fun Games 🎮
              <div className="text-lg font-normal mt-2">
                Games so fun, even parents want to play!
              </div>
            </motion.button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
          >
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="text-xl font-bold mb-2">Interactive Worlds</h4>
              <p className="text-gray-600">Explore magical worlds with Frozen, Spider-Man, and more!</p>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-3">🧠</div>
              <h4 className="text-xl font-bold mb-2">Adaptive Learning</h4>
              <p className="text-gray-600">AI-powered curriculum that adapts to your child's pace</p>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <h4 className="text-xl font-bold mb-2">Family Engagement</h4>
              <p className="text-gray-600">Games and activities the whole family can enjoy together</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;
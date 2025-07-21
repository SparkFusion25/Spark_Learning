import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="bg-white/95 backdrop-blur-lg rounded-[2rem] shadow-2xl p-8 max-w-lg w-full border border-white/20">
          <div className="text-center mb-8">
            <div className="text-7xl mb-2 animate-bounce">🌟</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Rocketter Learning
            </h1>
            <h2 className="text-2xl font-bold text-gray-700 mb-1">Kids</h2>
            <p className="text-gray-600 font-medium">Where every child becomes a superhero learner! 🦸‍♀️</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleUserTypeSelect('child')}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative flex items-center justify-center gap-3">
                🎮 I'm Ready to Learn & Play!
              </span>
            </button>
            
            <button 
              onClick={() => handleUserTypeSelect('parent')}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              👨‍👩‍👧‍👦 Parent Dashboard
            </button>
            
            <button 
              onClick={() => handleUserTypeSelect('admin')}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-800 text-white py-3 rounded-2xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              ⚙️ Admin Portal
            </button>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-center space-x-3 text-3xl mb-4">
              <span className="animate-bounce" style={{animationDelay: '0s'}}>🏆</span>
              <span className="animate-bounce" style={{animationDelay: '0.1s'}}>📚</span>
              <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎨</span>
              <span className="animate-bounce" style={{animationDelay: '0.3s'}}>🧪</span>
              <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🎵</span>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                🎯 Ages 4-8 • 🔒 100% Safe • 👪 Parent Approved
              </p>
              <p className="text-xs text-gray-600">
                Join 50,000+ happy families learning together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
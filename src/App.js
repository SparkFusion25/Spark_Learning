import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import LoginScreen from './components/auth/LoginScreen';
import ChildSelect from './components/child/ChildSelect';
import WorldSelect from './components/child/WorldSelect';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/child-select" element={<ChildSelect />} />
          <Route path="/world-select" element={<WorldSelect />} />
          <Route path="/lessons/:worldId" element={<div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">🎮 Lessons Coming Soon!</div>} />
          <Route path="/parent" element={<div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">👨‍👩‍👧‍👦 Parent Dashboard Coming Soon!</div>} />
          <Route path="/admin" element={<div className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-3xl font-bold">⚙️ Admin Panel Coming Soon!</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
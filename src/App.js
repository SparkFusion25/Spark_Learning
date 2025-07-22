import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import LoginScreen from './components/auth/LoginScreen';
import ChildSelect from './components/child/ChildSelect';
import WorldSelect from './components/child/WorldSelect';
import SparkLearnGames from './components/games/SparkLearnGames';
import EnhancedParentDashboard from './components/dashboard/EnhancedParentDashboard';
import FamilyGamesHub from './components/games/FamilyGamesHub';
import VoiceInteractiveGame from './components/games/VoiceInteractiveGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/child-select" element={<ChildSelect />} />
          <Route path="/world-select" element={<WorldSelect />} />
          <Route path="/games" element={<SparkLearnGames />} />
          <Route path="/family-games" element={<FamilyGamesHub />} />
          <Route path="/lessons/:worldId" element={<SparkLearnGames />} />
          <Route path="/voice-chat/:worldId" element={<VoiceInteractiveGame />} />
          <Route path="/parent" element={<EnhancedParentDashboard />} />
          <Route path="/admin" element={<div className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-3xl font-bold">⚙️ Admin Panel Coming Soon!</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Volume2, VolumeX,
  Sparkles, Target, Clock, Gift
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

// Simplified Disney Themes
const DISNEY_THEMES = {
  frozen: {
    id: 'frozen',
    name: 'Frozen Adventure',
    background: 'from-blue-200 via-cyan-100 to-white',
    colors: { primary: 'from-blue-400 to-cyan-500', secondary: 'from-blue-100 to-cyan-50' },
    elements: ['❄️', '⛄', '🧊', '✨', '💎', '🌨️']
  },
  spiderman: {
    id: 'spiderman',
    name: 'Spider-Man City',
    background: 'from-red-400 via-blue-400 to-gray-600',
    colors: { primary: 'from-red-500 to-blue-600', secondary: 'from-red-100 to-blue-100' },
    elements: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢']
  },
  moana: {
    id: 'moana',
    name: 'Ocean Adventure',
    background: 'from-teal-200 via-blue-300 to-cyan-400',
    colors: { primary: 'from-teal-400 to-blue-500', secondary: 'from-teal-100 to-blue-100' },
    elements: ['🌊', '⭐', '🛶', '🐚', '🌺', '🥥']
  }
};

// Simplified Sparkle Crush Game
const SparkleCrushGame = ({ theme, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [selectedCells, setSelectedCells] = useState([]);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < 8; row++) {
      const gridRow = [];
      for (let col = 0; col < 8; col++) {
        gridRow.push({
          id: `${row}-${col}`,
          row,
          col,
          element: theme.elements[Math.floor(Math.random() * theme.elements.length)],
          matched: false
        });
      }
      newGrid.push(gridRow);
    }
    setGrid(newGrid);
  };

  const handleCellClick = (row, col) => {
    if (moves <= 0) return;

    const cellId = `${row}-${col}`;
    if (selectedCells.includes(cellId)) {
      setSelectedCells(selectedCells.filter(id => id !== cellId));
    } else if (selectedCells.length < 2) {
      setSelectedCells([...selectedCells, cellId]);
    }

    if (selectedCells.length === 1) {
      // Check if swap is valid and make the swap
      const [row1, col1] = selectedCells[0].split('-').map(Number);
      if (Math.abs(row1 - row) + Math.abs(col1 - col) === 1) {
        swapElements(row1, col1, row, col);
        setSelectedCells([]);
        setMoves(moves - 1);
      }
    }
  };

  const swapElements = (row1, col1, row2, col2) => {
    const newGrid = [...grid];
    const temp = newGrid[row1][col1].element;
    newGrid[row1][col1].element = newGrid[row2][col2].element;
    newGrid[row2][col2].element = temp;
    setGrid(newGrid);
    
    // Simple scoring
    setScore(prev => prev + 10);
    audioManager.playSound('correct');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">✨ Sparkle Crush</h2>
            <div className="flex gap-4 text-white text-lg">
              <span>⭐ {score}</span>
              <span>🎯 {moves} moves</span>
            </div>
          </div>
          
          <button
            onClick={initializeGrid}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Game Grid */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
          <div className="grid grid-cols-8 gap-2 max-w-md mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={cell.id}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`aspect-square bg-white/30 rounded-lg text-2xl flex items-center justify-center transition-all ${
                    selectedCells.includes(cell.id) ? 'bg-yellow-300 scale-110' : 'hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cell.element}
                </motion.button>
              ))
            )}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-white font-medium">
              Tap two adjacent elements to swap them and create matches!
            </p>
            {moves <= 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-4"
              >
                <div className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-2xl font-bold">
                  Game Over! Final Score: {score}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Word Builder Game
const WordBuilderGame = ({ theme, onGameEnd }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [targetWord, setTargetWord] = useState('FROZEN');
  const [availableLetters, setAvailableLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const words = ['FROZEN', 'SPIDER', 'OCEAN', 'MAGIC', 'HERO', 'WAVE'];

  useEffect(() => {
    generateNewWord();
  }, [level]);

  const generateNewWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    setCurrentWord('');
    
    // Scramble letters and add extras
    const letters = word.split('').concat(['A', 'E', 'I', 'O', 'U'].slice(0, 3));
    setAvailableLetters(letters.sort(() => Math.random() - 0.5));
  };

  const addLetter = (letter, index) => {
    if (currentWord.length < targetWord.length) {
      setCurrentWord(currentWord + letter);
      setAvailableLetters(availableLetters.filter((_, i) => i !== index));
    }
  };

  const removeLetter = (index) => {
    const letter = currentWord[index];
    setCurrentWord(currentWord.slice(0, index) + currentWord.slice(index + 1));
    setAvailableLetters([...availableLetters, letter]);
  };

  const checkWord = () => {
    if (currentWord === targetWord) {
      setScore(score + 50);
      audioManager.playSound('achievement');
      audioManager.speak('Excellent! You spelled it correctly!', 'default');
      
      setTimeout(() => {
        if (level < 5) {
          setLevel(level + 1);
        } else {
          onGameEnd({ score: score + 50, completed: true });
        }
      }, 2000);
    } else {
      audioManager.playSound('wrong');
      audioManager.speak('Try again! Look at the target word.', 'default');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">📝 Word Builder</h2>
            <div className="flex gap-4 text-white text-lg">
              <span>⭐ {score}</span>
              <span>🎯 Level {level}</span>
            </div>
          </div>
          
          <button
            onClick={generateNewWord}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Game Area */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
          
          {/* Target Word */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Spell this word:</h3>
            <div className="text-6xl font-bold text-white mb-6">{targetWord}</div>
          </div>

          {/* Current Word */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-bold text-white mb-4">Your word:</h4>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: targetWord.length }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => removeLetter(i)}
                  className="w-16 h-16 bg-white/30 rounded-xl text-2xl font-bold text-white border-2 border-dashed border-white/50 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentWord[i] || ''}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Available Letters */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-bold text-white mb-4">Available letters:</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {availableLetters.map((letter, index) => (
                <motion.button
                  key={index}
                  onClick={() => addLetter(letter, index)}
                  className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-xl font-bold text-white shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Check Button */}
          <div className="text-center">
            <motion.button
              onClick={checkWord}
              disabled={currentWord.length !== targetWord.length}
              className="bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-xl"
              whileHover={{ scale: currentWord.length === targetWord.length ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ Check Word
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Fixed Family Games Hub
const FamilyGamesHubFixed = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('frozen');
  const [currentGame, setCurrentGame] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    totalScore: 0,
    gamesPlayed: 0,
    favoriteTheme: 'frozen'
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const theme = DISNEY_THEMES[selectedTheme];

  const games = [
    {
      id: 'sparkle-crush',
      title: '✨ Sparkle Crush',
      description: 'Match magical elements in this engaging puzzle game!',
      component: SparkleCrushGame,
      difficulty: 'Easy',
      players: '1-2 Players'
    },
    {
      id: 'word-builder',
      title: '📝 Word Builder',
      description: 'Build words and expand your vocabulary!',
      component: WordBuilderGame,
      difficulty: 'Medium',
      players: '1 Player'
    },
    {
      id: 'coming-soon-1',
      title: '⛄ Snowball Shooter',
      description: 'Launch snowballs at targets in this physics game!',
      component: null,
      difficulty: 'Easy',
      players: '1-4 Players'
    },
    {
      id: 'coming-soon-2',
      title: '⚡ Element Slice',
      description: 'Slice elements as they fly across the screen!',
      component: null,
      difficulty: 'Hard',
      players: '1-2 Players'
    },
    {
      id: 'coming-soon-3',
      title: '🧱 Block Builder',
      description: 'Build amazing structures with magical blocks!',
      component: null,
      difficulty: 'Medium',
      players: '1-4 Players'
    }
  ];

  const handleGameSelect = (game) => {
    if (game.component) {
      setCurrentGame(game);
      audioManager.playSound('click');
    } else {
      alert(`${game.title} is coming soon! Stay tuned for more amazing games!`);
    }
  };

  const handleGameEnd = (result) => {
    setPlayerStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + result.score,
      gamesPlayed: prev.gamesPlayed + 1
    }));
    
    setCurrentGame(null);
    audioManager.playSound('achievement');
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    audioManager.setEnabled(!isAudioEnabled);
  };

  // Render current game
  if (currentGame && currentGame.component) {
    const GameComponent = currentGame.component;
    return <GameComponent theme={theme} onGameEnd={handleGameEnd} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      
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

        {/* Theme Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {Object.values(DISNEY_THEMES).map(themeOption => (
            <motion.button
              key={themeOption.id}
              onClick={() => setSelectedTheme(themeOption.id)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                selectedTheme === themeOption.id 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {themeOption.name}
            </motion.button>
          ))}
        </div>

        {/* Player Stats */}
        <div className="flex justify-center gap-6">
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">⭐ {playerStats.totalScore}</div>
            <div className="text-white/80">Total Score</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">🎮 {playerStats.gamesPlayed}</div>
            <div className="text-white/80">Games Played</div>
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
              className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl cursor-pointer hover:shadow-3xl transition-all group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameSelect(game)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">
                  {game.component ? '🎯' : '🔒'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
                <p className="text-lg text-white/90 mb-6">{game.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-medium">📊 {game.difficulty}</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-medium">👥 {game.players}</span>
                  </div>
                  
                  <motion.div 
                    className={`${
                      game.component 
                        ? `bg-gradient-to-r ${theme.colors.primary}` 
                        : 'bg-gray-400'
                    } text-white py-3 px-6 rounded-2xl font-bold`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {game.component ? 'Play Now! 🚀' : 'Coming Soon! 🔒'}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-black/60 text-white px-6 py-3 rounded-xl text-center">
          <p className="font-bold">🎮 Family Gaming Experience</p>
          <p className="text-sm">Choose a theme and start playing together!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default FamilyGamesHubFixed;
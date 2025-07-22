import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Volume2, VolumeX,
  Sparkles, Target, Clock, Gift, CheckCircle, XCircle, HelpCircle
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

// Enhanced Learning Games - Mickey Mouse Clubhouse & Hook on Phonics Style
const ENHANCED_LEARNING_WORLDS = {
  castle: {
    id: 'castle',
    name: 'Number Castle',
    emoji: '🏰',
    character: '👑',
    characterName: 'King Mickey',
    theme: {
      background: 'from-purple-400 via-blue-400 to-indigo-500',
      colors: { primary: 'from-purple-500 to-blue-600', secondary: 'from-purple-100 to-blue-100' }
    },
    games: [
      {
        id: 'number-builder',
        title: '🏗️ Royal Number Builder',
        description: 'Help King Mickey build the castle with the right numbers!',
        type: 'interactive-counting',
        skill: 'Counting & Number Recognition',
        levels: 5
      },
      {
        id: 'dragon-math',
        title: '🐉 Dragon Math Adventure',
        description: 'Solve math puzzles to help the friendly dragon!',
        type: 'math-adventure',
        skill: 'Addition & Subtraction',
        levels: 6
      },
      {
        id: 'treasure-logic',
        title: '🗝️ Royal Treasure Hunt',
        description: 'Use logic and patterns to find the hidden treasure!',
        type: 'logic-puzzle',
        skill: 'Logic & Problem Solving',
        levels: 4
      }
    ]
  },
  forest: {
    id: 'forest',
    name: 'Story Forest',
    emoji: '🌳',
    character: '🦉',
    characterName: 'Wise Owl',
    theme: {
      background: 'from-green-400 via-emerald-400 to-teal-500',
      colors: { primary: 'from-green-500 to-emerald-600', secondary: 'from-green-100 to-emerald-100' }
    },
    games: [
      {
        id: 'phonics-adventure',
        title: '🔤 Magical Phonics Quest',
        description: 'Join the Wise Owl on a letter sound adventure!',
        type: 'phonics-interactive',
        skill: 'Letter Sounds & Phonics',
        levels: 8
      },
      {
        id: 'story-builder',
        title: '📚 Enchanted Story Builder',
        description: 'Create magical stories with word choices!',
        type: 'story-creation',
        skill: 'Reading & Vocabulary',
        levels: 6
      },
      {
        id: 'word-hunt',
        title: '🔍 Forest Word Hunt',
        description: 'Find hidden words in the magical forest!',
        type: 'word-discovery',
        skill: 'Reading & Recognition',
        levels: 5
      }
    ]
  },
  lab: {
    id: 'lab',
    name: 'Wonder Lab',
    emoji: '🔬',
    character: '🧪',
    characterName: 'Professor Goofy',
    theme: {
      background: 'from-cyan-400 via-blue-400 to-purple-500',
      colors: { primary: 'from-cyan-500 to-blue-600', secondary: 'from-cyan-100 to-blue-100' }
    },
    games: [
      {
        id: 'potion-mixing',
        title: '⚗️ Magic Potion Lab',
        description: 'Mix colors and learn science with Professor Goofy!',
        type: 'science-experiment',
        skill: 'Colors & Science',
        levels: 6
      },
      {
        id: 'habitat-explorer',
        title: '🦋 Animal Habitat Adventure',
        description: 'Help animals find their perfect homes!',
        type: 'habitat-matching',
        skill: 'Science & Nature',
        levels: 5
      },
      {
        id: 'weather-station',
        title: '🌤️ Wonder Weather Station',
        description: 'Learn about weather and make predictions!',
        type: 'weather-learning',
        skill: 'Science & Observation',
        levels: 4
      }
    ]
  }
};

// Interactive Counting Game (Mickey Mouse Clubhouse Style)
const InteractiveCountingGame = ({ game, theme, onComplete, onBack }) => {
  const [level, setLevel] = useState(1);
  const [targetNumber, setTargetNumber] = useState(5);
  const [placedNumbers, setPlacedNumbers] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [celebrations, setCelebrations] = useState([]);

  useEffect(() => {
    generateNewChallenge();
    // Welcome message from King Mickey
    audioManager.speak("Welcome to my royal castle! Let's build something amazing together!", 'default');
  }, [level]);

  const generateNewChallenge = () => {
    const target = Math.min(3 + level, 10);
    setTargetNumber(target);
    setPlacedNumbers([]);
    
    // Generate available numbers (some correct, some incorrect)
    const numbers = [];
    for (let i = 1; i <= target + 3; i++) {
      numbers.push(i);
    }
    setAvailableNumbers(numbers.sort(() => Math.random() - 0.5));
    
    setFeedback(`Help me build ${target} tower blocks for the castle!`);
    audioManager.speak(`Let's build ${target} blocks for our royal castle!`, 'default');
  };

  const handleNumberDrop = useCallback((number) => {
    if (placedNumbers.length < targetNumber) {
      const newPlaced = [...placedNumbers, number];
      setPlacedNumbers(newPlaced);
      setAvailableNumbers(prev => prev.filter(n => n !== number));
      
      audioManager.playSound('click');
      
      if (newPlaced.length === targetNumber) {
        // Success!
        setIsBuilding(true);
        setScore(prev => prev + 10);
        setFeedback('🎉 Perfect! The castle tower is complete!');
        
        // Add celebration effects
        const newCelebrations = Array.from({ length: 5 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          emoji: ['⭐', '✨', '🎉', '👑', '🏰'][i]
        }));
        setCelebrations(newCelebrations);
        
        audioManager.playSound('achievement');
        audioManager.speak('Magnificent! You built the perfect tower! King Mickey is so proud!', 'default');
        
        setTimeout(() => {
          setCelebrations([]);
          setIsBuilding(false);
          if (level < game.levels) {
            setLevel(prev => prev + 1);
          } else {
            onComplete({ score: score + 10, level, perfectScore: true });
          }
        }, 3000);
      } else {
        setFeedback(`Great! You need ${targetNumber - newPlaced.length} more blocks.`);
      }
    }
  }, [placedNumbers, targetNumber, level, score, game.levels, onComplete]);

  const resetGame = () => {
    generateNewChallenge();
    audioManager.playSound('click');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      
      {/* Celebration Effects */}
      <AnimatePresence>
        {celebrations.map(celebration => (
          <motion.div
            key={celebration.id}
            className="fixed text-4xl pointer-events-none z-20"
            style={{ left: `${celebration.x}%`, top: `${celebration.y}%` }}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {celebration.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={onBack}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
          <div className="flex items-center gap-4 text-white">
            <span>⭐ {score}</span>
            <span>🎯 Level {level}</span>
            <span>👑 {theme.characterName}</span>
          </div>
        </div>
        
        <button
          onClick={resetGame}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      {/* Character */}
      <motion.div 
        className="text-center mb-6"
        animate={isBuilding ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5, repeat: isBuilding ? Infinity : 0 }}
      >
        <div className="text-8xl mb-4">{theme.character}</div>
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 max-w-md mx-auto">
          <p className="text-xl font-bold text-white">{feedback}</p>
        </div>
      </motion.div>

      {/* Castle Building Area */}
      <motion.div 
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            🏰 Build a Tower with {targetNumber} Blocks
          </h3>
          
          {/* Castle Foundation */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: targetNumber }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-20 h-16 rounded-lg border-4 border-dashed border-white/30 flex items-center justify-center ${
                    placedNumbers[targetNumber - 1 - i] 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-solid border-yellow-300' 
                      : 'bg-white/10'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {placedNumbers[targetNumber - 1 - i] && (
                    <motion.span
                      className="text-2xl font-bold text-white"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {placedNumbers[targetNumber - 1 - i]}
                    </motion.span>
                  )}
                </motion.div>
              ))}
              {/* Foundation */}
              <div className="w-24 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🏰 Base</span>
              </div>
            </div>
          </div>

          {/* Available Numbers */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-white mb-4">Pick the Right Numbers:</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {availableNumbers.slice(0, 6).map(number => (
                <motion.button
                  key={number}
                  onClick={() => handleNumberDrop(number)}
                  className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 rounded-2xl text-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={placedNumbers.length >= targetNumber}
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Progress</span>
            <span className="text-white font-medium">{placedNumbers.length}/{targetNumber}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(placedNumbers.length / targetNumber) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Phonics Interactive Game (Hook on Phonics Style)
const PhonicsInteractiveGame = ({ game, theme, onComplete, onBack }) => {
  const [level, setLevel] = useState(1);
  const [currentLetter, setCurrentLetter] = useState('A');
  const [targetWords, setTargetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const letterSounds = {
    A: { sound: 'ay', words: ['Apple', 'Ant', 'Arrow', 'Airplane'], example: '🍎' },
    B: { sound: 'buh', words: ['Ball', 'Bear', 'Butterfly', 'Banana'], example: '⚽' },
    C: { sound: 'kuh', words: ['Cat', 'Car', 'Cake', 'Crown'], example: '🐱' },
    D: { sound: 'duh', words: ['Dog', 'Duck', 'Drum', 'Door'], example: '🐕' },
    E: { sound: 'eh', words: ['Elephant', 'Egg', 'Eagle', 'Ear'], example: '🐘' },
    F: { sound: 'fuh', words: ['Fish', 'Frog', 'Flower', 'Fire'], example: '🐠' },
    G: { sound: 'guh', words: ['Goat', 'Gift', 'Guitar', 'Grapes'], example: '🐐' },
    H: { sound: 'huh', words: ['Hat', 'Horse', 'House', 'Heart'], example: '🎩' }
  };

  useEffect(() => {
    generateNewChallenge();
    audioManager.speak(`Let's learn about the letter ${currentLetter}! Listen carefully to the sound.`, 'default');
  }, [level, currentLetter]);

  const generateNewChallenge = () => {
    const letters = Object.keys(letterSounds);
    const letter = letters[Math.min(level - 1, letters.length - 1)];
    setCurrentLetter(letter);
    
    const letterData = letterSounds[letter];
    const correctWords = letterData.words.slice(0, 2);
    
    // Add some incorrect words from other letters
    const incorrectWords = [];
    const otherLetters = letters.filter(l => l !== letter);
    otherLetters.forEach(l => {
      incorrectWords.push(...letterSounds[l].words.slice(0, 1));
    });
    
    const allWords = [...correctWords, ...incorrectWords.slice(0, 2)];
    setTargetWords(allWords.sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsCorrect(null);
    setFeedback(`Find words that start with the "${letterData.sound}" sound!`);
  };

  const handleWordSelect = (word) => {
    const letterData = letterSounds[currentLetter];
    const isWordCorrect = letterData.words.includes(word);
    
    audioManager.playSound(isWordCorrect ? 'correct' : 'wrong');
    
    if (isWordCorrect) {
      const newSelected = [...selectedWords, word];
      setSelectedWords(newSelected);
      setScore(prev => prev + 10);
      setIsCorrect(true);
      setFeedback(`Excellent! "${word}" starts with "${letterData.sound}"!`);
      
      audioManager.speak(`Perfect! ${word} starts with ${letterData.sound}!`, 'default');
      
      // Check if all correct words found
      const correctWords = letterData.words.filter(w => targetWords.includes(w));
      if (newSelected.length === correctWords.length) {
        setTimeout(() => {
          if (level < game.levels) {
            setLevel(prev => prev + 1);
          } else {
            onComplete({ score: score + 10, level, perfectScore: true });
          }
        }, 2000);
      }
    } else {
      setIsCorrect(false);
      setFeedback(`Try again! "${word}" doesn't start with "${letterData.sound}".`);
      audioManager.speak(`Oops! Try again. Listen for the ${letterData.sound} sound.`, 'default');
    }
  };

  const playLetterSound = () => {
    const letterData = letterSounds[currentLetter];
    audioManager.speak(`The letter ${currentLetter} makes the ${letterData.sound} sound. ${letterData.sound}, ${letterData.sound}, ${letterData.sound}.`, 'default');
    audioManager.playSound('hover');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={onBack}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
          <div className="flex items-center gap-4 text-white">
            <span>⭐ {score}</span>
            <span>🎯 Level {level}</span>
            <span>🦉 {theme.characterName}</span>
          </div>
        </div>
        
        <button
          onClick={() => generateNewChallenge()}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      {/* Character and Letter Display */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-8xl mb-4">{theme.character}</div>
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto">
          <div className="text-9xl font-bold text-white mb-4">{currentLetter}</div>
          <div className="text-6xl mb-4">{letterSounds[currentLetter].example}</div>
          
          <motion.button
            onClick={playLetterSound}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔊 Hear the "{letterSounds[currentLetter].sound}" Sound
          </motion.button>
          
          <p className="text-xl font-bold text-white mt-4">{feedback}</p>
        </div>
      </motion.div>

      {/* Word Selection */}
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Which words start with "{letterSounds[currentLetter].sound}"?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {targetWords.map(word => (
              <motion.button
                key={word}
                onClick={() => handleWordSelect(word)}
                disabled={selectedWords.includes(word)}
                className={`p-6 rounded-2xl text-center transition-all text-2xl font-bold ${
                  selectedWords.includes(word)
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-xl'
                    : 'bg-white/30 hover:bg-white/50 text-white hover:shadow-xl'
                }`}
                whileHover={{ scale: selectedWords.includes(word) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: targetWords.indexOf(word) * 0.1 }}
              >
                <div className="text-4xl mb-3">
                  {word === 'Apple' && '🍎'}
                  {word === 'Ant' && '🐜'}
                  {word === 'Arrow' && '🏹'}
                  {word === 'Airplane' && '✈️'}
                  {word === 'Ball' && '⚽'}
                  {word === 'Bear' && '🐻'}
                  {word === 'Butterfly' && '🦋'}
                  {word === 'Banana' && '🍌'}
                  {word === 'Cat' && '🐱'}
                  {word === 'Car' && '🚗'}
                  {word === 'Cake' && '🎂'}
                  {word === 'Crown' && '👑'}
                  {word === 'Dog' && '🐕'}
                  {word === 'Duck' && '🦆'}
                  {word === 'Drum' && '🥁'}
                  {word === 'Door' && '🚪'}
                  {word === 'Elephant' && '🐘'}
                  {word === 'Egg' && '🥚'}
                  {word === 'Eagle' && '🦅'}
                  {word === 'Ear' && '👂'}
                  {word === 'Fish' && '🐠'}
                  {word === 'Frog' && '🐸'}
                  {word === 'Flower' && '🌺'}
                  {word === 'Fire' && '🔥'}
                  {word === 'Goat' && '🐐'}
                  {word === 'Gift' && '🎁'}
                  {word === 'Guitar' && '🎸'}
                  {word === 'Grapes' && '🍇'}
                  {word === 'Hat' && '🎩'}
                  {word === 'Horse' && '🐎'}
                  {word === 'House' && '🏠'}
                  {word === 'Heart' && '❤️'}
                </div>
                <div>{word}</div>
                {selectedWords.includes(word) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2"
                  >
                    <CheckCircle className="w-8 h-8 mx-auto text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Progress */}
          <div className="mt-8 text-center">
            <div className="bg-white/20 rounded-2xl p-4 inline-block">
              <p className="text-white font-bold">
                Found: {selectedWords.length} / {letterSounds[currentLetter].words.filter(w => targetWords.includes(w)).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main Enhanced Learning Games Component
const EnhancedLearningGames = ({ worldId = 'castle' }) => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    totalScore: 0,
    gamesCompleted: 0,
    currentStreak: 0
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const currentWorld = ENHANCED_LEARNING_WORLDS[worldId] || ENHANCED_LEARNING_WORLDS.castle;

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    audioManager.playSound('click');
  };

  const handleGameComplete = (result) => {
    setPlayerStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + result.score,
      gamesCompleted: prev.gamesCompleted + 1,
      currentStreak: result.perfectScore ? prev.currentStreak + 1 : 0
    }));
    
    setSelectedGame(null);
    audioManager.playSound('achievement');
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
    audioManager.playSound('click');
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    audioManager.setEnabled(!isAudioEnabled);
  };

  // Render specific game component
  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.type) {
      case 'interactive-counting':
        return <InteractiveCountingGame game={selectedGame} theme={currentWorld} onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      case 'phonics-interactive':
        return <PhonicsInteractiveGame game={selectedGame} theme={currentWorld} onComplete={handleGameComplete} onBack={handleBackToMenu} />;
      default:
        return <div>Game type not implemented yet</div>;
    }
  };

  if (selectedGame) {
    return renderGame();
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentWorld.theme.background} p-4 relative overflow-hidden`}>
      
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
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => navigate('/world-select')}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div>
            <h1 className="text-6xl font-bold text-white mb-4">
              {currentWorld.emoji} {currentWorld.name}
            </h1>
            <div className="flex items-center justify-center gap-6 text-white text-xl">
              <span>⭐ Score: {playerStats.totalScore}</span>
              <span>🎯 Completed: {playerStats.gamesCompleted}</span>
              <span>🔥 Streak: {playerStats.currentStreak}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">{currentWorld.character}</div>
          <p className="text-2xl font-bold text-white">
            Welcome to {currentWorld.name}! Let's learn together!
          </p>
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentWorld.games.map((game, index) => (
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
                <div className="text-6xl mb-4 group-hover:animate-bounce">{currentWorld.character}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
                <p className="text-lg text-white/90 mb-6">{game.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-medium">🎯 {game.skill}</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-medium">📊 {game.levels} Levels</span>
                  </div>
                  
                  <motion.div 
                    className={`bg-gradient-to-r ${currentWorld.theme.colors.primary} text-white py-3 px-6 rounded-2xl font-bold`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Start Learning! 🚀
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedLearningGames;
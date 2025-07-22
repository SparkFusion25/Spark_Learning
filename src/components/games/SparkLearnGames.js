import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Pause, Play, Volume2, VolumeX,
  Zap, Target, Clock, Gift, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  User, Settings, Palette, CheckCircle, XCircle, HelpCircle, Mic
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

// Enhanced Educational Learning Worlds with Proper Game Definitions
const LEARNING_WORLDS = {
  frozen: {
    id: 'frozen',
    name: 'Frozen Adventure',
    icon: '❄️',
    theme: {
      background: 'from-blue-200 via-blue-300 to-indigo-400',
      colors: { primary: 'from-blue-400 to-cyan-500', secondary: 'from-purple-400 to-blue-500' },
      elements: ['❄️', '⭐', '💎', '🏰', '🌨️'],
      character: '👸🏼',
      characterName: 'Elsa'
    },
    games: [
      {
        id: 'counting-snowflakes',
        title: '❄️ Count the Snowflakes',
        description: 'Help Elsa count magical snowflakes!',
        skill: 'Counting & Numbers',
        minAge: 4,
        type: 'counting',
        levels: 5
      },
      {
        id: 'pattern-ice',
        title: '🔷 Ice Crystal Patterns',
        description: 'Complete beautiful ice crystal patterns!',
        skill: 'Pattern Recognition',
        minAge: 5,
        type: 'patterns',
        levels: 4
      },
      {
        id: 'letters-frost',
        title: '📝 Frosty Letters',
        description: 'Trace letters in the frost with Elsa!',
        skill: 'Letter Recognition',
        minAge: 4,
        type: 'letters',
        levels: 6
      },
              {
          id: 'shapes-castle',
          title: '🏰 Build Ice Castles',
          description: 'Use shapes to build magical ice castles!',
          skill: 'Shapes & Geometry',
          minAge: 5,
          type: 'shapes',
          levels: 4
        },
        {
          id: 'voice-chat',
          title: '🎤 Talk with Elsa',
          description: 'Have a magical conversation with Elsa using your voice!',
          skill: 'Voice Interaction',
          minAge: 4,
          type: 'voice',
          levels: 5,
          special: true
        }
    ]
  },
  spiderman: {
    id: 'spiderman',
    name: 'Spider-Verse City',
    icon: '🕷️',
    theme: {
      background: 'from-red-300 via-blue-300 to-red-400',
      colors: { primary: 'from-red-500 to-blue-600', secondary: 'from-blue-500 to-red-500' },
      elements: ['🕷️', '🕸️', '🏢', '⚡', '💥'],
      character: '🕷️',
      characterName: 'Spider-Man'
    },
    games: [
      {
        id: 'web-math',
        title: '🕸️ Web-Slinging Math',
        description: 'Solve math problems to swing through the city!',
        skill: 'Basic Math',
        minAge: 6,
        type: 'math',
        levels: 5
      },
      {
        id: 'building-climb',
        title: '🏢 Building Climb Challenge',
        description: 'Answer questions to climb taller buildings!',
        skill: 'Problem Solving',
        minAge: 5,
        type: 'problem-solving',
        levels: 4
      },
      {
        id: 'hero-words',
        title: '💥 Super Hero Words',
        description: 'Match action words with Spider-Man!',
        skill: 'Vocabulary',
        minAge: 5,
        type: 'vocabulary',
        levels: 5
      },
              {
          id: 'city-colors',
          title: '🌆 City Colors',
          description: 'Learn colors while exploring the city!',
          skill: 'Color Recognition',
          minAge: 4,
          type: 'colors',
          levels: 3
        },
        {
          id: 'voice-chat',
          title: '🎤 Chat with Spider-Man',
          description: 'Have a heroic conversation with your friendly neighborhood Spider-Man!',
          skill: 'Voice Interaction',
          minAge: 4,
          type: 'voice',
          levels: 5,
          special: true
        }
    ]
  },
  moana: {
    id: 'moana',
    name: 'Ocean Adventure',
    icon: '🌊',
    theme: {
      background: 'from-teal-200 via-blue-300 to-cyan-400',
      colors: { primary: 'from-teal-400 to-blue-500', secondary: 'from-green-400 to-teal-500' },
      elements: ['🌊', '🐚', '🏝️', '🐠', '⛵'],
      character: '🌺',
      characterName: 'Moana'
    },
    games: [
      {
        id: 'ocean-counting',
        title: '🐠 Count Sea Creatures',
        description: 'Count beautiful sea creatures with Moana!',
        skill: 'Counting & Numbers',
        minAge: 4,
        type: 'counting',
        levels: 5
      },
      {
        id: 'island-navigation',
        title: '🏝️ Island Navigation',
        description: 'Use directions to help Moana find islands!',
        skill: 'Spatial Awareness',
        minAge: 6,
        type: 'directions',
        levels: 4
      },
      {
        id: 'shell-sorting',
        title: '🐚 Shell Sorting',
        description: 'Sort shells by size, color, and shape!',
        skill: 'Sorting & Classification',
        minAge: 5,
        type: 'sorting',
        levels: 4
      },
              {
          id: 'ocean-sounds',
          title: '🎵 Ocean Sounds',
          description: 'Match sounds with ocean animals!',
          skill: 'Audio Recognition',
          minAge: 4,
          type: 'sounds',
          levels: 3
        },
        {
          id: 'voice-chat',
          title: '🎤 Sail with Moana',
          description: 'Join Moana on an ocean adventure through voice conversation!',
          skill: 'Voice Interaction',
          minAge: 4,
          type: 'voice',
          levels: 5,
          special: true
        }
    ]
  }
};

// Individual Game Components - Properly Designed

// Enhanced Counting Game
const CountingGame = ({ game, theme, onComplete, selectedAvatar }) => {
  const [level, setLevel] = useState(1);
  const [targetNumber, setTargetNumber] = useState(3);
  const [items, setItems] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const maxItems = Math.min(3 + level, 10);
  const gameElements = theme.elements;

  useEffect(() => {
    generateNewQuestion();
  }, [level]);

  const generateNewQuestion = () => {
    const count = Math.floor(Math.random() * maxItems) + 1;
    setTargetNumber(count);
    
    const newItems = Array(count).fill().map((_, i) => ({
      id: i,
      element: gameElements[Math.floor(Math.random() * gameElements.length)],
      x: Math.random() * 70 + 10,
      y: Math.random() * 60 + 20,
      delay: i * 0.1
    }));
    
    setItems(newItems);
    setUserCount(0);
    setFeedback('');
    setAttempts(0);
  };

  const handleNumberClick = (number) => {
    setUserCount(number);
    setAttempts(attempts + 1);
    
    // Play click sound
    audioManager.playSound('click');
    
    if (number === targetNumber) {
      const feedbackText = `🎉 Correct! There are ${targetNumber} items!`;
      setFeedback(feedbackText);
      setScore(score + 10);
      
      // Play success sound and speak encouragement
      audioManager.playSound('correct');
      const characterResponse = audioManager.getCharacterPhrase(theme.characterName.toLowerCase(), 'correct');
      audioManager.speak(characterResponse, theme.characterName.toLowerCase());
      
      setTimeout(() => {
        if (level < game.levels) {
          setLevel(level + 1);
          generateNewQuestion();
        } else {
          onComplete({ score: score + 10, level, game: game.id });
        }
      }, 2000);
    } else {
      const feedbackText = `Try again! Count carefully. 🤔`;
      setFeedback(feedbackText);
      
      // Play wrong sound and speak encouragement
      audioManager.playSound('wrong');
      
      if (attempts >= 2) {
        setTimeout(() => {
          const hintText = `The answer is ${targetNumber}! Let's try another one. 😊`;
          setFeedback(hintText);
          audioManager.speak(hintText, theme.characterName.toLowerCase());
          setTimeout(generateNewQuestion, 2000);
        }, 1500);
      } else {
        const encouragement = audioManager.getCharacterPhrase(theme.characterName.toLowerCase(), 'incorrect');
        audioManager.speak(encouragement, theme.characterName.toLowerCase());
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      
      {/* Game Header */}
      <motion.div 
        className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-6xl">{theme.character}</div>
          <div>
            <div className="text-3xl font-bold text-white">{game.title}</div>
            <div className="text-lg text-white/80">Level {level} of {game.levels}</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold">
            ⭐ {score}
        </div>
      </motion.div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              {theme.characterName} asks: "How many {gameElements[0]} can you count?"
            </h2>
            <p className="text-2xl text-white/90">Look carefully and count all the items!</p>
          </div>
        </motion.div>

        {/* Items to Count */}
        <motion.div 
          className="relative h-80 bg-white/20 backdrop-blur-lg rounded-3xl mb-8 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                className="absolute text-6xl cursor-pointer hover:scale-110 transition-transform"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: item.delay, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {item.element}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Number Choices */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {Array.from({ length: Math.min(maxItems + 2, 10) }, (_, i) => i + 1).map(number => (
            <motion.button
              key={number}
              onClick={() => handleNumberClick(number)}
              className={`w-20 h-20 text-3xl font-bold rounded-full transition-all shadow-lg ${
                userCount === number 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white scale-110' 
                  : 'bg-white hover:bg-gray-100 text-gray-800 hover:scale-105'
              }`}
              whileHover={{ scale: userCount === number ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={feedback.includes('Correct')}
            >
              {number}
            </motion.button>
          ))}
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={`inline-block px-8 py-4 rounded-2xl text-2xl font-bold ${
                feedback.includes('Correct') 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {feedback}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Enhanced Pattern Game
const PatternGame = ({ game, theme, onComplete, selectedAvatar }) => {
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [showingPattern, setShowingPattern] = useState(true);

  const gameElements = theme.elements;

  useEffect(() => {
    generateNewPattern();
  }, [level]);

  const generateNewPattern = () => {
    const patternLength = Math.min(3 + level, 8);
    const newPattern = Array(patternLength).fill().map(() => 
      gameElements[Math.floor(Math.random() * gameElements.length)]
    );
    
    // Create choices including the next element and some distractors
    const nextElement = newPattern[newPattern.length - 1];
    const otherElements = gameElements.filter(el => el !== nextElement);
    const shuffledChoices = [nextElement, ...otherElements.slice(0, 2)]
      .sort(() => Math.random() - 0.5);
    
    setPattern(newPattern);
    setUserPattern(newPattern.slice(0, -1)); // Show all but last
    setChoices(shuffledChoices);
    setFeedback('');
    setShowingPattern(true);
    
    setTimeout(() => setShowingPattern(false), 3000);
  };

  const handleElementClick = (element) => {
    const correctElement = pattern[pattern.length - 1];
    
    if (element === correctElement) {
      setFeedback('🎉 Perfect! You completed the pattern!');
      setScore(score + 15);
      
      setTimeout(() => {
        if (level < game.levels) {
          setLevel(level + 1);
          generateNewPattern();
        } else {
          onComplete({ score: score + 15, level, game: game.id });
        }
      }, 2000);
    } else {
      setFeedback('Try again! Look at the pattern carefully. 🤔');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      
      {/* Game Header */}
      <motion.div 
        className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-6xl">{theme.character}</div>
          <div>
            <div className="text-3xl font-bold text-white">{game.title}</div>
            <div className="text-lg text-white/80">Level {level} of {game.levels}</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold">
          ⭐ {score}
        </div>
      </motion.div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Instructions */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete the Pattern!
            </h2>
            <p className="text-2xl text-white/90">
              Look at the pattern and choose what comes next!
            </p>
          </div>
        </motion.div>

        {/* Pattern Display */}
        <motion.div 
          className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {userPattern.map((element, index) => (
              <motion.div
                key={index}
                className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {element}
              </motion.div>
            ))}
            
            {/* Missing element placeholder */}
            <motion.div
              className="w-20 h-20 bg-white/50 border-4 border-dashed border-white rounded-2xl flex items-center justify-center text-4xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ?
            </motion.div>
          </div>

          {/* Choices */}
          <div className="flex justify-center gap-6">
            {choices.map((element, index) => (
              <motion.button
                key={index}
                onClick={() => handleElementClick(element)}
                className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 + index * 0.1 }}
              >
                {element}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={`inline-block px-8 py-4 rounded-2xl text-2xl font-bold ${
                feedback.includes('Perfect') 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {feedback}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Enhanced Math Game
const MathGame = ({ game, theme, onComplete, selectedAvatar }) => {
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(0);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNewQuestion();
  }, [level]);

  const generateNewQuestion = () => {
    const maxNum = Math.min(5 + level * 2, 20);
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const operation = level > 3 ? (Math.random() > 0.5 ? '+' : '-') : '+';
    
    let correctAnswer;
    let questionText;
    
    if (operation === '+') {
      correctAnswer = num1 + num2;
      questionText = `${num1} + ${num2} = ?`;
    } else {
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      correctAnswer = larger - smaller;
      questionText = `${larger} - ${smaller} = ?`;
    }
    
    // Generate choices
    const wrongAnswers = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + 2
    ].filter(n => n >= 0);
    
    const allChoices = [correctAnswer, ...wrongAnswers.slice(0, 2)]
      .sort(() => Math.random() - 0.5);
    
    setQuestion(questionText);
    setAnswer(correctAnswer);
    setChoices(allChoices);
    setFeedback('');
  };

  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === answer) {
      setFeedback('🎉 Excellent! You solved it correctly!');
      setScore(score + 20);
      
      setTimeout(() => {
        if (level < game.levels) {
          setLevel(level + 1);
          generateNewQuestion();
        } else {
          onComplete({ score: score + 20, level, game: game.id });
        }
      }, 2000);
    } else {
      setFeedback('Try again! Take your time. 🤔');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      
      {/* Game Header */}
      <motion.div 
        className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-6xl">{theme.character}</div>
          <div>
            <div className="text-3xl font-bold text-white">{game.title}</div>
            <div className="text-lg text-white/80">Level {level} of {game.levels}</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold">
          ⭐ {score}
        </div>
      </motion.div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
            <h2 className="text-6xl font-bold text-white mb-8">
              {question}
            </h2>
            <p className="text-2xl text-white/90">
              Help {theme.characterName} solve this math problem!
            </p>
          </div>
        </motion.div>

        {/* Answer Choices */}
        <motion.div 
          className="flex justify-center gap-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {choices.map((choice, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerClick(choice)}
              className="w-32 h-32 text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {choice}
            </motion.button>
          ))}
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={`inline-block px-8 py-4 rounded-2xl text-2xl font-bold ${
                feedback.includes('Excellent') 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {feedback}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main Component
const SparkLearnGames = () => {
  const navigate = useNavigate();
  const { worldId } = useParams();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [playerStats, setPlayerStats] = useState({
    totalScore: 0,
    gamesCompleted: 0,
    currentStreak: 0
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const currentWorld = LEARNING_WORLDS[worldId] || LEARNING_WORLDS.frozen;

  const handleGameSelect = (game) => {
    // Handle special voice interactive games
    if (game.type === 'voice') {
      navigate(`/voice-chat/${worldId}`);
      return;
    }
    
    setSelectedGame(game);
    setGameState('playing');
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    audioManager.setEnabled(!isAudioEnabled);
  };

  const handleGameComplete = (result) => {
    setPlayerStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + result.score,
      gamesCompleted: prev.gamesCompleted + 1,
      currentStreak: prev.currentStreak + 1
    }));
    setGameState('completed');
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
    setGameState('menu');
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    const gameProps = {
      game: selectedGame,
      theme: currentWorld.theme,
      onComplete: handleGameComplete,
      selectedAvatar: { name: 'Emmy', emoji: '👧🏽' }
    };

    switch (selectedGame.type) {
      case 'counting':
        return <CountingGame {...gameProps} />;
      case 'patterns':
        return <PatternGame {...gameProps} />;
      case 'math':
        return <MathGame {...gameProps} />;
      default:
        return <CountingGame {...gameProps} />;
    }
  };

  if (gameState === 'playing') {
    return (
      <div className="relative">
        {renderGame()}
        
        {/* Back Button */}
        <motion.button
          onClick={handleBackToMenu}
          className="fixed top-4 left-4 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home className="w-6 h-6" />
        </motion.button>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentWorld.theme.background} flex items-center justify-center p-4`}>
        <motion.div 
          className="bg-white/30 backdrop-blur-lg rounded-3xl p-12 text-center max-w-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-2xl text-white/90 mb-8">
            You completed {selectedGame.title}!
          </p>
          
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={handleBackToMenu}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play More Games! 🎮
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/world-select')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Choose New World 🌟
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Menu
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
          <div className="text-8xl">{currentWorld.icon}</div>
          <div>
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">
              {currentWorld.name}
            </h1>
            <p className="text-2xl text-white/90">
              Learn with {currentWorld.theme.characterName}!
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">⭐ {playerStats.totalScore}</div>
            <div className="text-white/80">Total Score</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">🎮 {playerStats.gamesCompleted}</div>
            <div className="text-white/80">Games Done</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">🔥 {playerStats.currentStreak}</div>
            <div className="text-white/80">Streak</div>
          </div>
        </div>
      </motion.div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {currentWorld.games.map((game, index) => (
            <motion.div
              key={game.id}
              className={`backdrop-blur-lg rounded-3xl p-8 shadow-2xl cursor-pointer hover:shadow-3xl transition-all ${
                game.special 
                  ? 'bg-gradient-to-br from-purple-400/40 to-pink-400/40 border-2 border-purple-300' 
                  : 'bg-white/30'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameSelect(game)}
            >
                              <div className="text-center">
                  <div className="text-6xl mb-4">
                    {game.special ? <Mic className="w-16 h-16 mx-auto mb-2 text-purple-300" /> : null}
                    {currentWorld.theme.character}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">{game.title}</h3>
                  {game.special && (
                    <div className="bg-purple-500/30 px-4 py-2 rounded-full mb-3 inline-block">
                      <span className="text-white font-bold">🎤 Voice Interactive</span>
                    </div>
                  )}
                  <p className="text-xl text-white/90 mb-4">{game.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-bold">{game.skill}</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="text-white font-bold">Age {game.minAge}+</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-2xl font-bold text-xl">
                  Start Learning! 🚀
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <motion.div 
        className="text-center mt-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => navigate('/world-select')}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl hover:bg-white/30 transition-all font-bold text-xl border border-white/30"
        >
          ← Back to Worlds
        </button>
      </motion.div>
    </div>
  );
};

export default SparkLearnGames;
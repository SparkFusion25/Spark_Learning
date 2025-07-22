import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Sparkles, Trophy, ArrowRight, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import PatternMagicGame from './PatternMagic';
import MemoryQuestGame from './MemoryQuest';

// Enhanced Theme Data with Audio Cues
const THEMES = {
  frozen: {
    id: 'frozen',
    name: 'Frozen Adventure',
    colors: {
      primary: 'from-blue-400 via-cyan-500 to-blue-600',
      secondary: 'from-blue-100 via-cyan-50 to-white',
      accent: 'text-cyan-600'
    },
    aiCompanion: {
      name: 'Snowball',
      emoji: '⛄',
      phrases: {
        correct: ['Fantastic ice work! ❄️', 'Cool learning! 🧊', 'You\'re ice-credible! ⛄'],
        incorrect: ['Try again, little snowflake! ❄️', 'Almost there! Keep going! 🧊'],
        encouraging: ['You\'ve got this! ❄️', 'Let it go, let it flow! ⛄']
      }
    },
    emojis: ['❄️', '⛄', '🧊', '✨', '💎', '🦢', '🏰', '👑'],
    soundEffects: {
      correct: 'ding-magic',
      incorrect: 'whoosh-ice',
      background: 'frozen-melody'
    }
  },
  spiderman: {
    id: 'spiderman',
    name: 'Spider-Verse',
    colors: {
      primary: 'from-red-500 to-blue-600',
      secondary: 'from-red-100 via-blue-50 to-white',
      accent: 'text-red-600'
    },
    aiCompanion: {
      name: 'Web-Bot',
      emoji: '🤖🕷️',
      phrases: {
        correct: ['Amazing work, web-slinger! 🕷️', 'Spider-senses are tingling with pride! 🕸️', 'Spectacular! 💥'],
        incorrect: ['Even Spider-Man misses sometimes! 🕷️', 'Swing back and try again! 🕸️'],
        encouraging: ['With great power comes great learning! ⚡', 'You\'re our friendly neighborhood learner! 🦸‍♂️']
      }
    },
    emojis: ['🕷️', '🕸️', '🦸‍♂️', '⚡', '💥', '🏢', '🚁', '💪'],
    soundEffects: {
      correct: 'web-thwip',
      incorrect: 'whoosh-swing',
      background: 'heroic-theme'
    }
  },
  moana: {
    id: 'moana',
    name: 'Ocean Adventure',
    colors: {
      primary: 'from-teal-400 via-blue-500 to-cyan-600',
      secondary: 'from-teal-100 via-blue-50 to-white',
      accent: 'text-teal-600'
    },
    aiCompanion: {
      name: 'Wave',
      emoji: '🌊',
      phrases: {
        correct: ['The ocean chose you! 🌊', 'Wonderful wayfinding! ⭐', 'Boat-iful work! 🛶'],
        incorrect: ['The ocean will guide you back! 🌊', 'Try again, brave explorer! ⭐'],
        encouraging: ['Feel the call of the ocean! 🌊', 'You know the way! ⭐']
      }
    },
    emojis: ['🌊', '⭐', '🛶', '🐚', '🌺', '🥥', '🏝️', '🐠'],
    soundEffects: {
      correct: 'ocean-wave',
      incorrect: 'gentle-splash',
      background: 'island-melody'
    }
  }
};

// Enhanced Game Types with Progressive Difficulty
const GAME_TYPES = {
  counting: {
    title: 'Counting Adventures',
    icon: '🔢',
    description: 'Count magical objects and learn numbers!',
    skills: ['Number recognition', 'Counting', 'Basic math'],
    levels: {
      1: { range: [1, 5], objects: 'simple', speed: 'slow' },
      2: { range: [1, 10], objects: 'medium', speed: 'medium' },
      3: { range: [5, 15], objects: 'complex', speed: 'fast' }
    }
  },
  patterns: {
    title: 'Pattern Magic',
    icon: '🔮',
    description: 'Complete magical patterns and sequences!',
    skills: ['Pattern recognition', 'Logic', 'Sequence completion'],
    levels: {
      1: { length: 3, complexity: 'simple', patterns: ['ABAB', 'AAB'] },
      2: { length: 4, complexity: 'medium', patterns: ['ABCD', 'ABAC'] },
      3: { length: 5, complexity: 'complex', patterns: ['ABCDE', 'AABBC'] }
    }
  },
  matching: {
    title: 'Memory Quest',
    icon: '🧩',
    description: 'Match pairs and boost your memory power!',
    skills: ['Memory', 'Visual recognition', 'Concentration'],
    levels: {
      1: { pairs: 4, flipTime: 3000, showTime: 2000 },
      2: { pairs: 6, flipTime: 2500, showTime: 1500 },
      3: { pairs: 8, flipTime: 2000, showTime: 1000 }
    }
  }
};

// Enhanced Learning Game Component
const SparkLearnGames = () => {
  const [selectedTheme, setSelectedTheme] = useState('frozen');
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed, paused
  const [playerStats, setPlayerStats] = useState({
    sparkCoins: 150,
    streak: 0,
    level: 1,
    achievements: [],
    totalScore: 0
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);

  const theme = THEMES[selectedTheme];

  // Sound Effect Simulation (would integrate with actual audio files)
  const playSound = (soundType) => {
    if (soundEnabled) {
      console.log(`Playing sound: ${theme.soundEffects[soundType]}`);
      // In production, this would play actual audio files
    }
  };

  // AI Companion Response System
  const getAIResponse = (type, isCorrect = true) => {
    const phrases = theme.aiCompanion.phrases[type];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    return randomPhrase;
  };

  // Achievement System
  const unlockAchievement = (type, value) => {
    const achievements = {
      'first_correct': { title: 'First Success!', emoji: '🎯', coins: 10 },
      'streak_5': { title: 'Hot Streak!', emoji: '🔥', coins: 25 },
      'level_up': { title: 'Level Master!', emoji: '⬆️', coins: 50 },
      'perfect_game': { title: 'Perfectionist!', emoji: '💯', coins: 100 }
    };

    if (achievements[type] && !playerStats.achievements.includes(type)) {
      setPlayerStats(prev => ({
        ...prev,
        achievements: [...prev.achievements, type],
        sparkCoins: prev.sparkCoins + achievements[type].coins
      }));
      return achievements[type];
    }
    return null;
  };

  // Counting Dragons Game Component
  const CountingDragonsGame = () => {
    const [dragons, setDragons] = useState([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    const generateDragons = () => {
      const level = GAME_TYPES.counting.levels[currentLevel];
      const count = Math.floor(Math.random() * (level.range[1] - level.range[0] + 1)) + level.range[0];
      
      const dragonArray = Array(count).fill().map((_, i) => ({
        id: i,
        emoji: theme.emojis[Math.floor(Math.random() * theme.emojis.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        delay: i * 0.1
      }));

      setDragons(dragonArray);
      setQuestion(`How many ${selectedTheme === 'frozen' ? 'ice crystals' : selectedTheme === 'spiderman' ? 'web symbols' : 'ocean treasures'} do you see?`);

      // Generate options
      const correctAnswer = count;
      const wrongAnswers = [];
      for (let i = 0; i < 3; i++) {
        let wrong = correctAnswer + Math.floor(Math.random() * 6) - 3;
        if (wrong <= 0) wrong = correctAnswer + Math.floor(Math.random() * 3) + 1;
        if (wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong);
        }
      }

      const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)]
        .sort(() => Math.random() - 0.5);
      setOptions(allOptions);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setFeedback('');
    };

    const handleAnswer = (answer) => {
      setSelectedAnswer(answer);
      const correct = answer === dragons.length;
      setIsCorrect(correct);

      if (correct) {
        const points = 10 * currentLevel;
        setScore(prev => prev + points);
        setPlayerStats(prev => ({
          ...prev,
          sparkCoins: prev.sparkCoins + points,
          streak: prev.streak + 1,
          totalScore: prev.totalScore + points
        }));
        setFeedback(getAIResponse('correct'));
        playSound('correct');

        // Check for achievements
        if (playerStats.streak === 0) unlockAchievement('first_correct');
        if (playerStats.streak + 1 === 5) unlockAchievement('streak_5');
      } else {
        setPlayerStats(prev => ({ ...prev, streak: 0 }));
        setFeedback(getAIResponse('incorrect'));
        playSound('incorrect');
      }

      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (round < 5) {
          setRound(prev => prev + 1);
          generateDragons();
        } else {
          setGameState('completed');
          if (score === 50) unlockAchievement('perfect_game');
        }
      }, 2000);
    };

    useEffect(() => {
      generateDragons();
    }, []);

    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
        {/* Game Header */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGameState('menu')}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Home className="w-6 h-6" />
            </button>
            <div className="text-2xl font-bold">{theme.name}</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{playerStats.sparkCoins}</span>
            </div>
            <div className="text-sm">Round {round}/5</div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Game Area */}
        <div className="max-w-4xl mx-auto">
          {/* Question */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-3xl font-bold mb-4 kid-interface">{question}</h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-2xl">{theme.aiCompanion.emoji}</span>
              <span className="text-lg">{theme.aiCompanion.name} is watching!</span>
            </div>
          </motion.div>

          {/* Dragons Display */}
          <motion.div
            className="relative h-80 bg-white/30 rounded-3xl mb-8 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
            {dragons.map((dragon) => (
              <motion.div
                key={dragon.id}
                className="absolute text-4xl cursor-pointer hover:scale-110 transition-transform"
                style={{ left: `${dragon.x}%`, top: `${dragon.y}%` }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: dragon.delay, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {dragon.emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {options.map((option) => (
              <motion.button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`
                  p-6 rounded-2xl text-2xl font-bold transition-all duration-300
                  ${selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-red-500 text-white scale-95'
                    : selectedAnswer !== null && option === dragons.length
                      ? 'bg-green-400 text-white'
                      : 'bg-white/70 hover:bg-white/90 hover:scale-105'
                  }
                  ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                  isCorrect ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                  {isCorrect ? '🎉' : '🤔'} {feedback}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Game Menu Component
  const GameMenu = () => (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className={`text-6xl font-bold bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent mb-4`}>
            {theme.name}
          </h1>
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-4xl">{theme.aiCompanion.emoji}</span>
            <p className="text-2xl font-semibold">{theme.aiCompanion.name} is ready to help!</p>
          </div>

          {/* Player Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold">{playerStats.sparkCoins}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
              <Trophy className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-bold">Level {playerStats.level}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold">{playerStats.streak} Streak</span>
            </div>
          </div>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Choose Your Adventure</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.values(THEMES).map((themeOption) => (
              <motion.button
                key={themeOption.id}
                onClick={() => setSelectedTheme(themeOption.id)}
                className={`
                  p-6 rounded-2xl transition-all duration-300 border-4
                  ${selectedTheme === themeOption.id
                    ? `border-blue-500 bg-gradient-to-br ${themeOption.colors.primary} text-white scale-105`
                    : 'border-white/30 bg-white/20 hover:bg-white/30 hover:scale-102'
                  }
                `}
                whileHover={{ scale: selectedTheme === themeOption.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-4xl mb-4">{themeOption.aiCompanion.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{themeOption.name}</h3>
                <div className="flex justify-center gap-2 mb-3">
                  {themeOption.emojis.slice(0, 4).map((emoji, i) => (
                    <span key={i} className="text-2xl">{emoji}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Game Selection */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Game</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(GAME_TYPES).map(([gameKey, game]) => (
              <motion.div
                key={gameKey}
                className="bg-white/30 rounded-3xl p-8 hover:bg-white/40 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentGame(gameKey);
                  setGameState('playing');
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 kid-interface">{game.title}</h3>
                  <p className="text-gray-700 mb-6">{game.description}</p>
                  
                  {/* Skills Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {game.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/50 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Difficulty Indicator */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-full ${
                          level <= currentLevel ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <motion.button
                    className={`px-8 py-3 bg-gradient-to-r ${theme.colors.primary} text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play Now! <ArrowRight className="inline w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Showcase */}
        {playerStats.achievements.length > 0 && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Your Achievements</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {playerStats.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 min-w-[120px]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-sm font-bold capitalize">{achievement.replace('_', ' ')}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  // Game Completed Component
  const GameCompleted = () => {
    const [celebrationActive, setCelebrationActive] = useState(true);

    useEffect(() => {
      setTimeout(() => setCelebrationActive(false), 3000);
    }, []);

    return (
      <motion.div
        className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 flex items-center justify-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center max-w-2xl mx-auto">
          {/* Celebration Animation */}
          <AnimatePresence>
            {celebrationActive && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl"
                    initial={{
                      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                      y: typeof window !== 'undefined' ? window.innerHeight : 800,
                      rotate: 0,
                      scale: 0
                    }}
                    animate={{
                      y: -100,
                      rotate: 360,
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    {theme.emojis[i % theme.emojis.length]}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-5xl font-bold mb-4 kid-interface">Amazing Work!</h1>
            <div className="text-2xl mb-8">{getAIResponse('correct')}</div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8 max-w-md mx-auto">
              <div className="bg-white/30 rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-600">{playerStats.sparkCoins}</div>
                <div className="text-lg">Spark Coins</div>
              </div>
              <div className="bg-white/30 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-600">{playerStats.streak}</div>
                <div className="text-lg">Streak</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setGameState('playing')}
                className={`px-8 py-4 bg-gradient-to-r ${theme.colors.primary} text-white rounded-full font-bold text-xl shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="inline w-6 h-6 mr-2" />
                Play Again
              </motion.button>
              <motion.button
                onClick={() => setGameState('menu')}
                className="px-8 py-4 bg-white/30 hover:bg-white/40 rounded-full font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="inline w-6 h-6 mr-2" />
                Back to Menu
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Floating Background Elements
  const FloatingElements = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        >
          {theme.emojis[i % theme.emojis.length]}
        </motion.div>
      ))}
    </div>
  );

  // Main Render
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingElements />
      <div className="relative z-10">
        {gameState === 'menu' && <GameMenu />}
        {gameState === 'playing' && currentGame === 'counting' && <CountingDragonsGame />}
        {gameState === 'playing' && currentGame === 'patterns' && 
          <PatternMagicGame 
            theme={theme}
            currentLevel={currentLevel}
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            playSound={playSound}
            getAIResponse={getAIResponse}
            setGameState={setGameState}
            unlockAchievement={unlockAchievement}
          />
        }
        {gameState === 'playing' && currentGame === 'matching' && 
          <MemoryQuestGame 
            theme={theme}
            currentLevel={currentLevel}
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            playSound={playSound}
            getAIResponse={getAIResponse}
            setGameState={setGameState}
            unlockAchievement={unlockAchievement}
          />
        }
        {gameState === 'completed' && <GameCompleted />}
      </div>
    </div>
  );
};

export default SparkLearnGames;
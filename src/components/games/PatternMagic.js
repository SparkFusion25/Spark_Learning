import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Star, Volume2, VolumeX, RotateCcw } from 'lucide-react';

const PatternMagicGame = ({ theme, currentLevel, playerStats, setPlayerStats, playSound, getAIResponse, setGameState, unlockAchievement }) => {
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [showingPattern, setShowingPattern] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const GAME_TYPES = {
    patterns: {
      levels: {
        1: { length: 3, complexity: 'simple', patterns: ['ABAB', 'AAB'] },
        2: { length: 4, complexity: 'medium', patterns: ['ABCD', 'ABAC'] },
        3: { length: 5, complexity: 'complex', patterns: ['ABCDE', 'AABBC'] }
      }
    }
  };

  const generatePattern = () => {
    const level = GAME_TYPES.patterns.levels[currentLevel];
    const patternTypes = level.patterns;
    const selectedType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    const newPattern = [];
    const symbols = theme.emojis.slice(0, 4);
    
    for (let i = 0; i < level.length; i++) {
      const patternChar = selectedType[i % selectedType.length];
      newPattern.push(symbols[patternChar.charCodeAt(0) - 'A'.charCodeAt(0)]);
    }
    
    setPattern(newPattern);
    setUserPattern([]);
    setCurrentStep(0);
    setShowingPattern(true);
    setFeedback('');
    setIsCorrect(null);
    
    // Show pattern for a few seconds
    setTimeout(() => setShowingPattern(false), 3000);
  };

  const handleSymbolClick = (symbol) => {
    if (showingPattern) return;
    
    const newUserPattern = [...userPattern, symbol];
    setUserPattern(newUserPattern);
    
    // Check if correct
    if (newUserPattern[currentStep] === pattern[currentStep]) {
      if (newUserPattern.length === pattern.length) {
        // Pattern complete!
        const points = 20 * currentLevel;
        setScore(prev => prev + points);
        setPlayerStats(prev => ({
          ...prev,
          sparkCoins: prev.sparkCoins + points,
          streak: prev.streak + 1,
          totalScore: prev.totalScore + points
        }));
        setFeedback(getAIResponse('correct'));
        setIsCorrect(true);
        playSound('correct');
        
        // Check for achievements
        if (playerStats.streak === 0) unlockAchievement('first_correct');
        if (playerStats.streak + 1 === 5) unlockAchievement('streak_5');
        
        setTimeout(() => {
          if (round < 5) {
            setRound(prev => prev + 1);
            generatePattern();
          } else {
            setGameState('completed');
            if (score >= 90) unlockAchievement('perfect_game');
          }
        }, 1500);
      } else {
        setCurrentStep(prev => prev + 1);
        playSound('correct');
      }
    } else {
      // Wrong symbol
      setFeedback(getAIResponse('incorrect'));
      setIsCorrect(false);
      playSound('incorrect');
      setPlayerStats(prev => ({ ...prev, streak: 0 }));
      
      setTimeout(() => {
        generatePattern(); // Restart pattern
      }, 1000);
    }
  };

  useEffect(() => {
    generatePattern();
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <motion.div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGameState('menu')}
              className="p-3 bg-white/20 rounded-full hover:bg-white/30"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">Pattern Magic</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{playerStats.sparkCoins}</span>
            </div>
            <div className="text-sm">Round {round}/5</div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4 kid-interface">
            {showingPattern ? 'Watch the pattern!' : 'Complete the pattern!'}
          </h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl">{theme.aiCompanion.emoji}</span>
            <span className="text-lg">{theme.aiCompanion.name} believes in you!</span>
          </div>
          <div className="text-lg text-gray-600">Round {round}/5</div>
        </motion.div>

        {/* Pattern Display */}
        <motion.div
          className="flex justify-center gap-4 mb-8 p-6 bg-white/30 rounded-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {pattern.map((symbol, index) => (
            <motion.div
              key={index}
              className={`
                w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                ${showingPattern 
                  ? 'bg-white/50' 
                  : index < userPattern.length 
                    ? userPattern[index] === symbol 
                      ? 'bg-green-300' 
                      : 'bg-red-300'
                    : index === currentStep 
                      ? 'bg-yellow-300 ring-4 ring-yellow-400' 
                      : 'bg-gray-200'
                }
              `}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {showingPattern || index < userPattern.length ? symbol : '?'}
            </motion.div>
          ))}
        </motion.div>

        {/* Symbol Options */}
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
          {theme.emojis.slice(0, 4).map((symbol, index) => (
            <motion.button
              key={symbol}
              onClick={() => handleSymbolClick(symbol)}
              disabled={showingPattern}
              className="w-16 h-16 bg-white/70 rounded-xl flex items-center justify-center text-3xl hover:bg-white/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={!showingPattern ? { scale: 1.05 } : {}}
              whileTap={!showingPattern ? { scale: 0.95 } : {}}
            >
              {symbol}
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
      </motion.div>
    </div>
  );
};

export default PatternMagicGame;
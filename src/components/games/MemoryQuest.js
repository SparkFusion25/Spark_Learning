import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Star, RotateCcw } from 'lucide-react';

const MemoryQuestGame = ({ theme, currentLevel, playerStats, setPlayerStats, playSound, getAIResponse, setGameState, unlockAchievement }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const GAME_TYPES = {
    matching: {
      levels: {
        1: { pairs: 4, flipTime: 3000, showTime: 2000 },
        2: { pairs: 6, flipTime: 2500, showTime: 1500 },
        3: { pairs: 8, flipTime: 2000, showTime: 1000 }
      }
    }
  };

  const initializeGame = () => {
    const level = GAME_TYPES.matching.levels[currentLevel];
    const symbols = theme.emojis.slice(0, level.pairs);
    const gameCards = [...symbols, ...symbols]
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: true, // Start with all cards visible
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(false);
    setFeedback('');
    setIsCorrect(null);

    // Show all cards briefly at start
    setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
      setGameStarted(true);
    }, level.showTime);
  };

  const handleCardClick = (cardId) => {
    if (!gameStarted || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setMatchedPairs(prev => [...prev, firstCard.symbol]);
          setFlippedCards([]);
          
          const points = 50 * currentLevel;
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
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setFeedback(getAIResponse('incorrect'));
          setIsCorrect(false);
          playSound('incorrect');
        }, 1000);
      }
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const level = GAME_TYPES.matching.levels[currentLevel];
    if (matchedPairs.length === level.pairs) {
      setTimeout(() => {
        setGameState('completed');
        if (moves <= level.pairs + 2) unlockAchievement('perfect_game'); // Efficient completion
      }, 1000);
    }
  }, [matchedPairs]);

  const level = GAME_TYPES.matching.levels[currentLevel];
  const progress = (matchedPairs.length / level.pairs) * 100;

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
            <h1 className="text-3xl font-bold">Memory Quest</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg">Moves: {moves}</div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{playerStats.sparkCoins}</span>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4 kid-interface">
            {!gameStarted ? 'Memorize the cards!' : 'Find the matching pairs!'}
          </h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl">{theme.aiCompanion.emoji}</span>
            <span className="text-lg">{theme.aiCompanion.name} knows you can do it!</span>
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-4">
            <div className="bg-white/30 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm mt-2">{matchedPairs.length} / {level.pairs} pairs found</p>
          </div>
        </motion.div>

        {/* Game Grid */}
        <motion.div
          className={`grid gap-4 max-w-2xl mx-auto mb-8 ${
            level.pairs <= 4 ? 'grid-cols-4' : level.pairs <= 6 ? 'grid-cols-4' : 'grid-cols-4'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-xl cursor-pointer flex items-center justify-center text-4xl
                ${card.isMatched 
                  ? 'bg-green-300 scale-105' 
                  : card.isFlipped 
                    ? 'bg-white' 
                    : 'bg-white/30 hover:bg-white/50'
                }
                transition-all duration-300
              `}
              whileHover={!card.isMatched && gameStarted ? { scale: 1.05 } : {}}
              whileTap={!card.isMatched && gameStarted ? { scale: 0.95 } : {}}
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: card.id * 0.05 }}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '❓'}
            </motion.div>
          ))}
        </motion.div>

        {/* Game Stats */}
        <motion.div
          className="flex justify-center gap-8 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm">Moves</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{matchedPairs.length}</div>
            <div className="text-sm">Pairs Found</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{score}</div>
            <div className="text-sm">Score</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            onClick={initializeGame}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-bold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            Restart
          </motion.button>
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

        {/* Memory Tips */}
        {!gameStarted && (
          <motion.div
            className="text-center bg-white/20 rounded-2xl p-6 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-bold mb-2">💡 Memory Tips:</h3>
            <ul className="text-sm space-y-1">
              <li>• Look for patterns in the symbols</li>
              <li>• Remember positions, not just symbols</li>
              <li>• Take your time to memorize</li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MemoryQuestGame;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Pause, Play, Volume2, VolumeX,
  Zap, Target, Clock, Gift, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

// Enhanced theme data for family games
const FAMILY_THEMES = {
  frozen: {
    id: 'frozen',
    name: 'Frozen Adventure',
    colors: {
      primary: 'from-blue-400 via-cyan-500 to-blue-600',
      secondary: 'from-blue-100 via-cyan-50 to-white',
      accent: 'text-cyan-600'
    },
    gameElements: {
      candyCrush: ['❄️', '⛄', '🧊', '✨', '💎', '🌨️'],
      wordscape: ['ICE', 'SNOW', 'COLD', 'ELSA', 'ANNA', 'OLAF'],
      angryBirds: { bird: '⛄', target: '🧊', obstacle: '🌨️' },
      fruitNinja: ['❄️', '🧊', '💎', '✨', '⛄', '🌨️'],
      minecraft: { blocks: ['🧊', '❄️', '🏰', '✨'], theme: 'ice_palace' }
    },
    sounds: {
      match: 'ice-tinkle',
      combo: 'magical-chime',
      success: 'elsa-magic'
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
    gameElements: {
      candyCrush: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢'],
      wordscape: ['WEB', 'HERO', 'SPIN', 'MASK', 'CITY', 'SAVE'],
      angryBirds: { bird: '🕷️', target: '💥', obstacle: '🏢' },
      fruitNinja: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢'],
      minecraft: { blocks: ['🏢', '🕸️', '🚁', '⚡'], theme: 'spider_city' }
    },
    sounds: {
      match: 'web-thwip',
      combo: 'hero-fanfare',
      success: 'spidey-sense'
    }
  }
};

// Sparkle Crush Game (Candy Crush Style)
const SparkleCrushGame = ({ theme, onGameEnd }) => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [level, setLevel] = useState(1);
  const [targetScore, setTargetScore] = useState(1000);
  const [combo, setCombo] = useState(0);

  const BOARD_SIZE = 8;
  const elements = theme.gameElements.candyCrush;

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const boardRow = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        boardRow.push({
          id: `${row}-${col}`,
          type: elements[Math.floor(Math.random() * elements.length)],
          row,
          col,
          isMatched: false,
          isNew: false
        });
      }
      newBoard.push(boardRow);
    }
    setBoard(newBoard);
  }, [elements]);

  // Check for matches
  const checkMatches = useCallback((gameBoard) => {
    const matches = [];
    
    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      let consecutiveCount = 1;
      let currentType = gameBoard[row][0].type;
      
      for (let col = 1; col < BOARD_SIZE; col++) {
        if (gameBoard[row][col].type === currentType) {
          consecutiveCount++;
        } else {
          if (consecutiveCount >= 3) {
            for (let i = col - consecutiveCount; i < col; i++) {
              matches.push({ row, col: i });
            }
          }
          consecutiveCount = 1;
          currentType = gameBoard[row][col].type;
        }
      }
      if (consecutiveCount >= 3) {
        for (let i = BOARD_SIZE - consecutiveCount; i < BOARD_SIZE; i++) {
          matches.push({ row, col: i });
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      let consecutiveCount = 1;
      let currentType = gameBoard[0][col].type;
      
      for (let row = 1; row < BOARD_SIZE; row++) {
        if (gameBoard[row][col].type === currentType) {
          consecutiveCount++;
        } else {
          if (consecutiveCount >= 3) {
            for (let i = row - consecutiveCount; i < row; i++) {
              matches.push({ row: i, col });
            }
          }
          consecutiveCount = 1;
          currentType = gameBoard[row][col].type;
        }
      }
      if (consecutiveCount >= 3) {
        for (let i = BOARD_SIZE - consecutiveCount; i < BOARD_SIZE; i++) {
          matches.push({ row: i, col });
        }
      }
    }

    return matches;
  }, []);

  // Handle cell swap
  const handleCellClick = (row, col) => {
    if (isAnimating || moves <= 0) return;

    if (!selectedCell) {
      setSelectedCell({ row, col });
      return;
    }

    const { row: selectedRow, col: selectedCol } = selectedCell;
    
    // Check if cells are adjacent
    const rowDiff = Math.abs(row - selectedRow);
    const colDiff = Math.abs(col - selectedCol);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      // Swap cells
      const newBoard = board.map(boardRow => [...boardRow]);
      const temp = newBoard[row][col].type;
      newBoard[row][col].type = newBoard[selectedRow][selectedCol].type;
      newBoard[selectedRow][selectedCol].type = temp;

      // Check if swap creates matches
      const matches = checkMatches(newBoard);
      if (matches.length > 0) {
        setBoard(newBoard);
        setMoves(prev => prev - 1);
        processMatches(newBoard, matches);
      }
    }
    
    setSelectedCell(null);
  };

  // Process matches and update score
  const processMatches = (gameBoard, matches) => {
    setIsAnimating(true);
    
    // Mark matched cells
    const newBoard = gameBoard.map(row => [...row]);
    matches.forEach(({ row, col }) => {
      newBoard[row][col].isMatched = true;
    });
    
    setBoard(newBoard);
    
    // Calculate score
    const basePoints = 10;
    const comboMultiplier = Math.max(1, combo);
    const points = matches.length * basePoints * comboMultiplier;
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);

    // Remove matches and drop pieces after animation
    setTimeout(() => {
      const clearedBoard = newBoard.map(row => 
        row.map(cell => cell.isMatched ? null : { ...cell, isMatched: false })
      );
      
      // Drop existing pieces
      const droppedBoard = dropPieces(clearedBoard);
      
      // Fill empty spaces
      const filledBoard = fillEmptySpaces(droppedBoard);
      
      setBoard(filledBoard);
      
      // Check for more matches
      const newMatches = checkMatches(filledBoard);
      if (newMatches.length > 0) {
        setTimeout(() => processMatches(filledBoard, newMatches), 300);
      } else {
        setCombo(0);
        setIsAnimating(false);
      }
    }, 500);
  };

  // Drop pieces down
  const dropPieces = (gameBoard) => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      let writeRow = BOARD_SIZE - 1;
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (gameBoard[row][col] !== null) {
          newBoard[writeRow][col] = {
            ...gameBoard[row][col],
            row: writeRow,
            col
          };
          writeRow--;
        }
      }
    }
    
    return newBoard;
  };

  // Fill empty spaces with new pieces
  const fillEmptySpaces = (gameBoard) => {
    const newBoard = gameBoard.map(row => [...row]);
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (newBoard[row][col] === null) {
          newBoard[row][col] = {
            id: `${row}-${col}`,
            type: elements[Math.floor(Math.random() * elements.length)],
            row,
            col,
            isMatched: false,
            isNew: true
          };
        }
      }
    }
    
    return newBoard;
  };

  // Initialize game
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Check game end conditions
  useEffect(() => {
    if (moves <= 0) {
      if (score >= targetScore) {
        onGameEnd('win', { score, level });
      } else {
        onGameEnd('lose', { score, level });
      }
    }
  }, [moves, score, targetScore, level, onGameEnd]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-3xl font-bold">✨ Sparkle Crush</div>
          <div className="flex gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Score: {score.toLocaleString()}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Moves: {moves}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Target: {targetScore.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Combo Indicator */}
        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              className="text-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-xl">
                🔥 COMBO x{combo}! 🔥
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <motion.div 
          className="grid grid-cols-8 gap-1 bg-white/30 p-4 rounded-2xl max-w-lg mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-3xl cursor-pointer
                  transition-all duration-200 hover:scale-110
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? 'bg-yellow-300 ring-4 ring-yellow-400 scale-110'
                    : cell?.isMatched
                      ? 'bg-red-300 scale-90'
                      : 'bg-white/70 hover:bg-white/90'
                  }
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                initial={cell?.isNew ? { scale: 0, y: -100 } : false}
                animate={{ scale: cell?.isMatched ? 0 : 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: cell?.isMatched ? 0 : 1.1 }}
                whileTap={{ scale: cell?.isMatched ? 0 : 0.9 }}
              >
                {cell?.type}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Power-ups */}
        <motion.div 
          className="flex justify-center gap-4 mt-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {['🌟', '💥', '🔥'].map((powerup, index) => (
            <motion.button
              key={powerup}
              className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl text-2xl shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              disabled={isAnimating}
            >
              {powerup}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Word Builder Game (Wordscape Style)
const WordBuilderGame = ({ theme, onGameEnd }) => {
  const [letters, setLetters] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const wordSets = {
    1: { letters: ['I', 'C', 'E'], words: ['ICE'] },
    2: { letters: ['S', 'N', 'O', 'W'], words: ['SNOW', 'NOW', 'OWN', 'SON'] },
    3: { letters: ['C', 'O', 'L', 'D'], words: ['COLD', 'OLD', 'COD'] },
    4: { letters: ['F', 'R', 'O', 'Z', 'E', 'N'], words: ['FROZEN', 'ZONE', 'ZERO', 'FORE', 'FOR', 'OR', 'NO'] }
  };

  // Initialize level
  useEffect(() => {
    const levelData = wordSets[level];
    if (levelData) {
      setLetters(levelData.letters.map((letter, index) => ({
        id: index,
        letter,
        isSelected: false,
        position: { x: 0, y: 0 }
      })));
      setTargetWords(levelData.words);
      setFoundWords([]);
      setCurrentWord('');
      setSelectedLetters([]);
    }
  }, [level]);

  // Handle letter selection
  const handleLetterClick = (letterId) => {
    const letter = letters.find(l => l.id === letterId);
    if (!letter || letter.isSelected) return;

    const newSelectedLetters = [...selectedLetters, letterId];
    const newCurrentWord = currentWord + letter.letter;
    
    setSelectedLetters(newSelectedLetters);
    setCurrentWord(newCurrentWord);
    
    setLetters(prev => prev.map(l => 
      l.id === letterId ? { ...l, isSelected: true } : l
    ));
  };

  // Submit word
  const submitWord = () => {
    if (targetWords.includes(currentWord) && !foundWords.includes(currentWord)) {
      setFoundWords(prev => [...prev, currentWord]);
      setScore(prev => prev + currentWord.length * 10);
      
      // Check if level complete
      if (foundWords.length + 1 === targetWords.length) {
        setTimeout(() => {
          if (level < 4) {
            setLevel(prev => prev + 1);
          } else {
            onGameEnd('win', { score, level });
          }
        }, 1000);
      }
    }
    
    clearSelection();
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedLetters([]);
    setCurrentWord('');
    setLetters(prev => prev.map(l => ({ ...l, isSelected: false })));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-4xl font-bold mb-4">📝 Word Builder</h1>
          <div className="flex justify-center gap-6">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Level: {level}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Score: {score}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Words: {foundWords.length}/{targetWords.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Word Display */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="bg-white/30 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Current Word</h3>
            <div className="text-3xl font-bold tracking-widest mb-4 min-h-[50px] flex items-center justify-center">
              {currentWord || 'Select letters...'}
            </div>
            <div className="flex gap-2 justify-center">
              <motion.button
                onClick={submitWord}
                disabled={currentWord.length === 0}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                whileHover={{ scale: currentWord.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: currentWord.length > 0 ? 0.95 : 1 }}
              >
                Submit
              </motion.button>
              <motion.button
                onClick={clearSelection}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Letter Circle */}
        <motion.div 
          className="relative w-80 h-80 mx-auto mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
        >
          <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
          {letters.map((letter, index) => {
            const angle = (index * 360) / letters.length;
            const radius = 120;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
            
            return (
              <motion.button
                key={letter.id}
                className={`
                  absolute w-16 h-16 rounded-full text-2xl font-bold
                  transform -translate-x-1/2 -translate-y-1/2 transition-all
                  ${letter.isSelected 
                    ? 'bg-yellow-400 scale-110 shadow-lg' 
                    : 'bg-white hover:bg-gray-100 hover:scale-105'
                  }
                `}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`
                }}
                onClick={() => handleLetterClick(letter.id)}
                whileHover={{ scale: letter.isSelected ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                {letter.letter}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Found Words */}
        <motion.div 
          className="bg-white/30 rounded-2xl p-6 max-w-md mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h3 className="text-xl font-bold mb-4 text-center">Found Words</h3>
          <div className="grid grid-cols-2 gap-2">
            {targetWords.map((word, index) => (
              <div
                key={word}
                className={`
                  p-3 rounded-lg text-center font-bold transition-all
                  ${foundWords.includes(word)
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {foundWords.includes(word) ? word : '???'}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Snowball Shooter (Angry Birds Style)
const SnowballShooterGame = ({ theme, onGameEnd }) => {
  const [projectile, setProjectile] = useState(null);
  const [targets, setTargets] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(5);
  const [isAiming, setIsAiming] = useState(false);
  const [aimDirection, setAimDirection] = useState({ x: 0, y: 0 });
  const [level, setLevel] = useState(1);

  const gameElements = theme.gameElements.angryBirds;

  // Initialize level
  useEffect(() => {
    const levelTargets = [
      { id: 1, x: 70, y: 60, hit: false },
      { id: 2, x: 80, y: 40, hit: false },
      { id: 3, x: 75, y: 80, hit: false }
    ];
    
    const levelObstacles = [
      { id: 1, x: 65, y: 70, type: 'block' },
      { id: 2, x: 85, y: 50, type: 'block' }
    ];

    setTargets(levelTargets);
    setObstacles(levelObstacles);
    setShotsLeft(5);
    setScore(0);
  }, [level]);

  // Handle shooting
  const handleShoot = (direction) => {
    if (shotsLeft <= 0 || projectile) return;

    const newProjectile = {
      x: 10,
      y: 50,
      velocityX: direction.x * 5,
      velocityY: direction.y * 5,
      active: true
    };

    setProjectile(newProjectile);
    setShotsLeft(prev => prev - 1);
    setIsAiming(false);

    // Animate projectile
    const animateProjectile = () => {
      setProjectile(prev => {
        if (!prev || !prev.active) return null;

        const newX = prev.x + prev.velocityX;
        const newY = prev.y + prev.velocityY + 0.2; // gravity

        // Check bounds
        if (newX > 100 || newY > 100 || newY < 0) {
          return null;
        }

        // Check target collisions
        targets.forEach(target => {
          if (!target.hit && 
              Math.abs(newX - target.x) < 5 && 
              Math.abs(newY - target.y) < 5) {
            target.hit = true;
            setScore(prev => prev + 100);
            setTargets(prev => prev.map(t => 
              t.id === target.id ? { ...t, hit: true } : t
            ));
          }
        });

        return {
          ...prev,
          x: newX,
          y: newY,
          velocityY: prev.velocityY + 0.2
        };
      });
    };

    const interval = setInterval(animateProjectile, 50);
    setTimeout(() => {
      clearInterval(interval);
      setProjectile(null);
    }, 3000);
  };

  // Check game end
  useEffect(() => {
    const allTargetsHit = targets.every(t => t.hit);
    if (allTargetsHit && targets.length > 0) {
      setTimeout(() => onGameEnd('win', { score, level }), 1000);
    } else if (shotsLeft <= 0 && !projectile) {
      setTimeout(() => onGameEnd('lose', { score, level }), 1000);
    }
  }, [targets, shotsLeft, projectile, score, level, onGameEnd]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-3xl font-bold">{gameElements.bird} Element Shooter</div>
          <div className="flex gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Score: {score}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Shots: {shotsLeft}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Area */}
        <motion.div 
          className="relative h-96 bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl overflow-hidden border-4 border-white/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onMouseMove={(e) => {
            if (isAiming) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width - 0.1) * 2;
              const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
              setAimDirection({ x: Math.max(0, x), y: -y });
            }
          }}
          onClick={(e) => {
            if (isAiming) {
              handleShoot(aimDirection);
            } else {
              setIsAiming(true);
            }
          }}
        >
          {/* Shooter */}
          <motion.div
            className="absolute text-4xl cursor-pointer"
            style={{ left: '8%', top: '45%' }}
            whileHover={{ scale: 1.1 }}
            animate={isAiming ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isAiming ? Infinity : 0, duration: 0.5 }}
          >
            {gameElements.bird}
          </motion.div>

          {/* Aiming Line */}
          {isAiming && (
            <motion.div
              className="absolute w-1 bg-white/50 origin-bottom"
              style={{
                left: '10%',
                top: '50%',
                height: `${Math.min(100, Math.abs(aimDirection.y) * 50)}px`,
                transform: `rotate(${Math.atan2(aimDirection.y, aimDirection.x) * 180 / Math.PI}deg)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Projectile */}
          {projectile && (
            <motion.div
              className="absolute text-2xl"
              style={{
                left: `${projectile.x}%`,
                top: `${projectile.y}%`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {gameElements.bird}
            </motion.div>
          )}

          {/* Targets */}
          {targets.map(target => (
            <motion.div
              key={target.id}
              className={`absolute text-4xl transition-all ${target.hit ? 'opacity-30 scale-50' : ''}`}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`
              }}
              animate={target.hit ? { scale: 0, rotate: 360 } : {}}
            >
              {gameElements.target}
            </motion.div>
          ))}

          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <motion.div
              key={obstacle.id}
              className="absolute text-3xl"
              style={{
                left: `${obstacle.x}%`,
                top: `${obstacle.y}%`
              }}
            >
              {gameElements.obstacle}
            </motion.div>
          ))}

          {/* Instructions */}
          {isAiming && (
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Move mouse to aim, click to shoot!
            </motion.div>
          )}
        </motion.div>

        {/* Power-ups */}
        <motion.div 
          className="flex justify-center gap-4 mt-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors">
            🎯 Multi-Shot
          </button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors">
            💥 Explosive
          </button>
          <button className="px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors">
            🌟 Super Speed
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Element Slice Game (Fruit Ninja Style)
const ElementSliceGame = ({ theme, onGameEnd }) => {
  const [elements, setElements] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [isSlicing, setIsSlicing] = useState(false);
  const [sliceTrail, setSliceTrail] = useState([]);

  const gameElements = theme.gameElements.fruitNinja;

  // Generate random element
  const generateElement = () => {
    const newElement = {
      id: Math.random(),
      type: gameElements[Math.floor(Math.random() * gameElements.length)],
      x: Math.random() * 80 + 10,
      y: 100,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: -(Math.random() * 8 + 8),
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 10,
      sliced: false,
      isBomb: Math.random() < 0.1 // 10% chance of bomb
    };
    return newElement;
  };

  // Spawn elements
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (timeLeft > 0) {
        setElements(prev => [...prev, generateElement()]);
      }
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [timeLeft]);

  // Update element positions
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setElements(prev => 
        prev.map(element => ({
          ...element,
          x: element.x + element.velocityX,
          y: element.y + element.velocityY,
          velocityY: element.velocityY + 0.5, // gravity
          rotation: element.rotation + element.rotationSpeed
        })).filter(element => 
          element.y < 120 && element.x > -10 && element.x < 110 && !element.sliced
        )
      );
    }, 50);

    return () => clearInterval(updateInterval);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onGameEnd('complete', { score, combo });
    }
  }, [timeLeft, score, combo, onGameEnd]);

  // Handle slice
  const handleSlice = (elementId, event) => {
    event.preventDefault();
    
    setElements(prev => 
      prev.map(element => {
        if (element.id === elementId && !element.sliced) {
          if (element.isBomb) {
            // Bomb hit - end game
            setTimeLeft(0);
            return { ...element, sliced: true };
          } else {
            // Normal element sliced
            setScore(prevScore => prevScore + 10 + (combo * 2));
            setCombo(prevCombo => prevCombo + 1);
            return { ...element, sliced: true };
          }
        }
        return element;
      })
    );

    // Add slice effect
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setSliceTrail(prev => [...prev, { x, y, id: Math.random() }]);
    setTimeout(() => {
      setSliceTrail(prev => prev.filter(trail => trail.id !== Math.random()));
    }, 500);
  };

  // Reset combo when no slicing
  useEffect(() => {
    const resetCombo = setTimeout(() => {
      if (!isSlicing) {
        setCombo(0);
      }
    }, 2000);

    return () => clearTimeout(resetCombo);
  }, [isSlicing, combo]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 overflow-hidden`}>
      <div className="max-w-4xl mx-auto h-screen relative">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-6 relative z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-3xl font-bold">⚔️ Element Slice</div>
          <div className="flex gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Score: {score}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Time: {timeLeft}s</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Combo: x{combo}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Area */}
        <div 
          className="relative h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-2xl overflow-hidden border-4 border-white/30"
          onMouseDown={() => setIsSlicing(true)}
          onMouseUp={() => setIsSlicing(false)}
          onMouseLeave={() => setIsSlicing(false)}
        >
          {/* Elements */}
          {elements.map(element => (
            <motion.div
              key={element.id}
              className={`absolute text-4xl cursor-pointer select-none ${
                element.isBomb ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: `rotate(${element.rotation}deg)`
              }}
              onClick={(e) => handleSlice(element.id, e)}
              whileHover={{ scale: 1.1 }}
              animate={element.sliced ? { 
                scale: [1, 1.5, 0],
                rotate: element.rotation + 180,
                opacity: [1, 1, 0]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {element.isBomb ? '💣' : element.type}
            </motion.div>
          ))}

          {/* Slice Trails */}
          {sliceTrail.map(trail => (
            <motion.div
              key={trail.id}
              className="absolute w-8 h-8 bg-yellow-400 rounded-full pointer-events-none"
              style={{
                left: `${trail.x}%`,
                top: `${trail.y}%`
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          ))}

          {/* Combo Display */}
          <AnimatePresence>
            {combo > 3 && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-yellow-400 pointer-events-none"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                COMBO x{combo}!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <motion.div 
          className="text-center mt-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-lg font-medium">Click on elements to slice them! Avoid the bombs! 💣</p>
          <p className="text-sm text-gray-600 mt-2">Build combos by slicing multiple elements quickly!</p>
        </motion.div>
      </div>
    </div>
  );
};

// Block Builder Game (Minecraft Style)
const BlockBuilderGame = ({ theme, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [inventory, setInventory] = useState({});
  const [mode, setMode] = useState('build'); // build or destroy
  const [project, setProject] = useState('house');
  const [score, setScore] = useState(0);

  const GRID_SIZE = 12;
  const blocks = theme.gameElements.minecraft.blocks;

  // Initialize game
  useEffect(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    setGrid(newGrid);
    
    const newInventory = {};
    blocks.forEach(block => {
      newInventory[block] = 20; // Start with 20 of each block
    });
    setInventory(newInventory);
    setSelectedBlock(blocks[0]);
  }, [blocks]);

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (mode === 'build' && selectedBlock && inventory[selectedBlock] > 0) {
      // Place block
      const newGrid = grid.map(r => [...r]);
      if (!newGrid[row][col]) {
        newGrid[row][col] = selectedBlock;
        setGrid(newGrid);
        setInventory(prev => ({ ...prev, [selectedBlock]: prev[selectedBlock] - 1 }));
        setScore(prev => prev + 10);
      }
    } else if (mode === 'destroy') {
      // Remove block
      const newGrid = grid.map(r => [...r]);
      if (newGrid[row][col]) {
        const removedBlock = newGrid[row][col];
        newGrid[row][col] = null;
        setGrid(newGrid);
        setInventory(prev => ({ ...prev, [removedBlock]: prev[removedBlock] + 1 }));
        setScore(prev => prev + 5);
      }
    }
  };

  // Project templates
  const projectTemplates = {
    house: [
      { row: 8, col: 4, block: blocks[0] }, { row: 8, col: 5, block: blocks[0] }, { row: 8, col: 6, block: blocks[0] }, { row: 8, col: 7, block: blocks[0] },
      { row: 7, col: 4, block: blocks[1] }, { row: 7, col: 7, block: blocks[1] },
      { row: 6, col: 4, block: blocks[1] }, { row: 6, col: 7, block: blocks[1] },
      { row: 5, col: 4, block: blocks[2] }, { row: 5, col: 5, block: blocks[2] }, { row: 5, col: 6, block: blocks[2] }, { row: 5, col: 7, block: blocks[2] }
    ],
    tower: [
      { row: 10, col: 5, block: blocks[0] }, { row: 9, col: 5, block: blocks[0] }, { row: 8, col: 5, block: blocks[0] },
      { row: 7, col: 5, block: blocks[1] }, { row: 6, col: 5, block: blocks[1] }, { row: 5, col: 5, block: blocks[1] },
      { row: 4, col: 5, block: blocks[2] }, { row: 3, col: 5, block: blocks[3] }
    ]
  };

  // Auto-build project (cheat/help feature)
  const autoBuildProject = () => {
    const template = projectTemplates[project];
    if (template) {
      const newGrid = grid.map(r => [...r]);
      template.forEach(({ row, col, block }) => {
        if (inventory[block] > 0) {
          newGrid[row][col] = block;
          setInventory(prev => ({ ...prev, [block]: prev[block] - 1 }));
        }
      });
      setGrid(newGrid);
      setScore(prev => prev + 100);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-3xl font-bold">🏗️ Block Builder</div>
          <div className="flex gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Score: {score}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Project: {project}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Building Grid */}
          <div className="lg:col-span-3">
            <motion.div 
              className="bg-white/30 p-4 rounded-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="grid grid-cols-12 gap-1">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        aspect-square rounded border-2 cursor-pointer transition-all
                        ${cell 
                          ? 'bg-white shadow-md hover:shadow-lg' 
                          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }
                        ${mode === 'destroy' ? 'hover:bg-red-200' : 'hover:bg-green-200'}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {cell && (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          {cell}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <motion.div 
              className="bg-white/30 p-4 rounded-2xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="text-xl font-bold mb-4">Mode</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setMode('build')}
                  className={`w-full p-3 rounded-lg font-bold transition-all ${
                    mode === 'build' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  🔨 Build
                </button>
                <button
                  onClick={() => setMode('destroy')}
                  className={`w-full p-3 rounded-lg font-bold transition-all ${
                    mode === 'destroy' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  💥 Destroy
                </button>
              </div>
            </motion.div>

            {/* Block Inventory */}
            <motion.div 
              className="bg-white/30 p-4 rounded-2xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4">Blocks</h3>
              <div className="space-y-2">
                {blocks.map(block => (
                  <button
                    key={block}
                    onClick={() => setSelectedBlock(block)}
                    className={`w-full p-3 rounded-lg font-bold transition-all flex items-center justify-between ${
                      selectedBlock === block 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  >
                    <span className="text-2xl">{block}</span>
                    <span>{inventory[block]}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Project Templates */}
            <motion.div 
              className="bg-white/30 p-4 rounded-2xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Projects</h3>
              <div className="space-y-2">
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full p-2 rounded-lg"
                >
                  <option value="house">🏠 House</option>
                  <option value="tower">🗼 Tower</option>
                </select>
                <button
                  onClick={autoBuildProject}
                  className="w-full p-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
                >
                  ✨ Auto Build
                </button>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="bg-white/30 p-4 rounded-2xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setGrid(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
                    setScore(0);
                  }}
                  className="w-full p-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                >
                  🗑️ Clear All
                </button>
                <button
                  onClick={() => onGameEnd('save', { score, grid })}
                  className="w-full p-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
                >
                  💾 Save & Exit
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Family Games Hub
const FamilyGamesHub = () => {
  const [selectedTheme, setSelectedTheme] = useState('frozen');
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [playerStats, setPlayerStats] = useState({
    sparkCoins: 250,
    gamesPlayed: 0,
    totalScore: 0,
    achievements: []
  });

  const theme = FAMILY_THEMES[selectedTheme];

  const familyGames = [
    {
      id: 'sparkle-crush',
      title: 'Sparkle Crush',
      icon: '💎',
      description: 'Match 3 magical elements in this addictive puzzle game!',
      difficulty: 'Easy to Learn, Hard to Master',
      players: '1-2 Players (Parent vs Child)',
      component: SparkleCrushGame
    },
    {
      id: 'word-builder',
      title: 'Word Builder',
      icon: '📝',
      description: 'Create words from letter circles - parents will love helping!',
      difficulty: 'Educational & Fun',
      players: 'Family Friendly',
      component: WordBuilderGame
    },
    {
      id: 'element-shooter',
      title: 'Element Shooter',
      icon: '🎯',
      description: 'Physics-based shooting game with theme elements!',
      difficulty: 'Action Packed',
      players: 'Turn-based Competition',
      component: SnowballShooterGame
    },
    {
      id: 'element-slice',
      title: 'Element Slice',
      icon: '⚔️',
      description: 'Fast-paced slicing action - slice theme elements, avoid bombs!',
      difficulty: 'Quick Reflexes',
      players: 'High Score Challenge',
      component: ElementSliceGame
    },
    {
      id: 'block-builder',
      title: 'Block Builder',
      icon: '🏗️',
      description: 'Build amazing structures together in this creative sandbox!',
      difficulty: 'Creative & Relaxing',
      players: 'Collaborative Building',
      component: BlockBuilderGame
    }
  ];

  const handleGameEnd = (result, data) => {
    setPlayerStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + (data.score || 0),
      sparkCoins: prev.sparkCoins + (data.score || 0) / 10
    }));
    setGameState('menu');
    setCurrentGame(null);
  };

  const startGame = (gameId) => {
    setCurrentGame(gameId);
    setGameState('playing');
  };

  if (gameState === 'playing' && currentGame) {
    const game = familyGames.find(g => g.id === currentGame);
    const GameComponent = game.component;
    return <GameComponent theme={theme} onGameEnd={handleGameEnd} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className={`text-6xl font-bold bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent mb-4`}>
            Family Fun Games
          </h1>
          <p className="text-2xl text-gray-600 mb-6">
            Games so fun, even parents want to play! 🎮👨‍👩‍👧‍👦
          </p>
          
          {/* Theme Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {Object.values(FAMILY_THEMES).map((themeOption) => (
              <motion.button
                key={themeOption.id}
                onClick={() => setSelectedTheme(themeOption.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                  selectedTheme === themeOption.id
                    ? `bg-gradient-to-r ${themeOption.colors.primary} text-white scale-105`
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: selectedTheme === themeOption.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {themeOption.name}
              </motion.button>
            ))}
          </div>

          {/* Player Stats */}
          <div className="flex justify-center gap-6">
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <Star className="inline w-5 h-5 mr-2 text-yellow-500" />
              <span className="font-bold">{Math.floor(playerStats.sparkCoins)} Coins</span>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <Trophy className="inline w-5 h-5 mr-2 text-orange-500" />
              <span className="font-bold">{playerStats.gamesPlayed} Games Played</span>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <Target className="inline w-5 h-5 mr-2 text-blue-500" />
              <span className="font-bold">{playerStats.totalScore.toLocaleString()} Total Score</span>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {familyGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/40 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame(game.id)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{game.title}</h3>
                <p className="text-gray-700 mb-4">{game.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="bg-blue-100 px-3 py-1 rounded-full">{game.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="bg-green-100 px-3 py-1 rounded-full">{game.players}</span>
                  </div>
                </div>

                <motion.button
                  className={`w-full py-4 bg-gradient-to-r ${theme.colors.primary} text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Now! 🚀
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Family Features */}
        <motion.div 
          className="mt-16 bg-white/20 rounded-3xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Why Parents Love These Games Too! 👨‍👩‍👧‍👦</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-bold mb-2">Brain Training</h3>
              <p className="text-sm text-gray-600">Pattern recognition, problem solving, and strategic thinking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-bold mb-2">Quick Sessions</h3>
              <p className="text-sm text-gray-600">Perfect for short breaks - 2-5 minute games</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold mb-2">Competitive Fun</h3>
              <p className="text-sm text-gray-600">High score challenges and family tournaments</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="font-bold mb-2">Bonding Time</h3>
              <p className="text-sm text-gray-600">Collaborative building and learning together</p>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">Coming Soon! 🎉</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span>🏎️ Racing Games</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span>🎵 Music Rhythm</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span>🧩 Jigsaw Puzzles</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span>📊 Trivia Challenges</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyGamesHub;
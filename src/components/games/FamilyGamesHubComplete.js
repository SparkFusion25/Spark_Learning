import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Volume2, VolumeX,
  Sparkles, Target, Clock, Gift, Zap, ArrowUp
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

// Enhanced Disney Themes
const DISNEY_THEMES = {
  frozen: {
    id: 'frozen',
    name: 'Frozen Adventure',
    background: 'from-blue-200 via-cyan-100 to-white',
    colors: { primary: 'from-blue-400 to-cyan-500', secondary: 'from-blue-100 to-cyan-50' },
    elements: ['❄️', '⛄', '🧊', '✨', '💎', '🌨️'],
    shooter: { projectile: '⛄', targets: ['🧊', '❄️', '✨'], obstacles: ['🌨️', '💎'] },
    slice: ['❄️', '🧊', '💎', '✨', '⛄', '🌨️'],
    blocks: ['🧊', '❄️', '🏰', '✨', '💎', '🌨️']
  },
  spiderman: {
    id: 'spiderman',
    name: 'Spider-Man City',
    background: 'from-red-400 via-blue-400 to-gray-600',
    colors: { primary: 'from-red-500 to-blue-600', secondary: 'from-red-100 to-blue-100' },
    elements: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢'],
    shooter: { projectile: '🕷️', targets: ['💥', '🎯', '🏢'], obstacles: ['🕸️', '⚡'] },
    slice: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢'],
    blocks: ['🏢', '🕸️', '🚁', '⚡', '💥', '🎯']
  },
  moana: {
    id: 'moana',
    name: 'Ocean Adventure',
    background: 'from-teal-200 via-blue-300 to-cyan-400',
    colors: { primary: 'from-teal-400 to-blue-500', secondary: 'from-teal-100 to-blue-100' },
    elements: ['🌊', '⭐', '🛶', '🐚', '🌺', '🥥'],
    shooter: { projectile: '🛶', targets: ['🐚', '⭐', '🌺'], obstacles: ['🌊', '🥥'] },
    slice: ['🌊', '🥥', '🌺', '⭐', '🐚', '🏝️'],
    blocks: ['🏝️', '🌊', '🛶', '🌺', '🥥', '⭐']
  }
};

// Sparkle Crush Game (Enhanced)
const SparkleCrushGame = ({ theme, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [selectedCells, setSelectedCells] = useState([]);
  const [combo, setCombo] = useState(0);

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
    
    const matchFound = checkForMatches(newGrid);
    if (matchFound) {
      setCombo(combo + 1);
      setScore(prev => prev + (10 + combo * 5));
      audioManager.playSound('correct');
    } else {
      setCombo(0);
    }
  };

  const checkForMatches = (grid) => {
    // Simple match detection (3 in a row/column)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        if (grid[row][col].element === grid[row][col + 1].element && 
            grid[row][col].element === grid[row][col + 2].element) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4`}>
      <div className="max-w-4xl mx-auto">
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
              {combo > 0 && <span>🔥 {combo}x combo!</span>}
            </div>
          </div>
          
          <button
            onClick={initializeGrid}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

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
              Swap adjacent elements to create matches of 3 or more!
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

// Word Builder Game
const WordBuilderGame = ({ theme, onGameEnd }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [targetWord, setTargetWord] = useState('FROZEN');
  const [availableLetters, setAvailableLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const words = ['FROZEN', 'SPIDER', 'OCEAN', 'MAGIC', 'HERO', 'WAVE', 'BRAVE', 'DREAM'];

  useEffect(() => {
    generateNewWord();
  }, [level]);

  const generateNewWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    setCurrentWord('');
    
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
      audioManager.speak('Excellent! You spelled it correctly!', 'child');
      
      setTimeout(() => {
        if (level < 5) {
          setLevel(level + 1);
          generateNewWord();
        } else {
          onGameEnd({ score: score + 50, completed: true });
        }
      }, 2000);
    } else {
      audioManager.playSound('wrong');
      audioManager.speak('Try again! Look at the target word.', 'child');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4`}>
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Spell this word:</h3>
            <div className="text-6xl font-bold text-white mb-6">{targetWord}</div>
          </div>

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

// Snowball Shooter Game (Angry Birds Style)
const SnowballShooterGame = ({ theme, onGameEnd }) => {
  const [projectile, setProjectile] = useState(null);
  const [targets, setTargets] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(10);
  const [isAiming, setIsAiming] = useState(false);
  const [level, setLevel] = useState(1);
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(45);

  const gameElements = theme.shooter;

  useEffect(() => {
    initializeLevel();
  }, [level]);

  const initializeLevel = () => {
    const newTargets = [];
    const newObstacles = [];
    
    // Generate targets based on level
    for (let i = 0; i < 3 + level; i++) {
      newTargets.push({
        id: i,
        x: 60 + (i * 10) + Math.random() * 10,
        y: 30 + Math.random() * 40,
        element: gameElements.targets[Math.floor(Math.random() * gameElements.targets.length)],
        hit: false,
        health: Math.floor(Math.random() * 2) + 1
      });
    }

    // Generate obstacles
    for (let i = 0; i < level; i++) {
      newObstacles.push({
        id: i,
        x: 40 + (i * 15) + Math.random() * 10,
        y: 60 + Math.random() * 20,
        element: gameElements.obstacles[Math.floor(Math.random() * gameElements.obstacles.length)]
      });
    }

    setTargets(newTargets);
    setObstacles(newObstacles);
  };

  const handleShoot = () => {
    if (shotsLeft <= 0 || isAiming) return;

    setIsAiming(true);
    const newProjectile = {
      x: 10,
      y: 70,
      velocityX: Math.cos(angle * Math.PI / 180) * power,
      velocityY: -Math.sin(angle * Math.PI / 180) * power,
      element: gameElements.projectile
    };

    setProjectile(newProjectile);
    setShotsLeft(shotsLeft - 1);
    audioManager.playSound('whoosh');

    // Simulate projectile motion
    setTimeout(() => {
      checkCollisions(newProjectile);
      setProjectile(null);
      setIsAiming(false);
      
      if (targets.every(t => t.hit)) {
        // Level complete
        setScore(score + 100 + (shotsLeft * 10));
        audioManager.speak('Amazing! Level complete!', 'child');
        setTimeout(() => {
          if (level < 5) {
            setLevel(level + 1);
            setShotsLeft(10);
          } else {
            onGameEnd({ score: score + 100 + (shotsLeft * 10), completed: true });
          }
        }, 2000);
      } else if (shotsLeft <= 1) {
        // Game over
        audioManager.speak('Good try! Let\'s play again!', 'child');
        setTimeout(() => onGameEnd({ score, completed: false }), 2000);
      }
    }, 2000);
  };

  const checkCollisions = (projectile) => {
    const newTargets = targets.map(target => {
      const distance = Math.sqrt(
        Math.pow(target.x - projectile.x - projectile.velocityX, 2) +
        Math.pow(target.y - projectile.y - projectile.velocityY, 2)
      );
      
      if (distance < 15 && !target.hit) {
        target.health -= 1;
        if (target.health <= 0) {
          target.hit = true;
          setScore(prev => prev + 25);
          audioManager.playSound('pop');
        }
      }
      return target;
    });
    setTargets(newTargets);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">⛄ Snowball Shooter</h2>
            <div className="flex gap-4 text-white text-lg">
              <span>⭐ {score}</span>
              <span>🎯 Level {level}</span>
              <span>🚀 {shotsLeft} shots</span>
            </div>
          </div>
          
          <button
            onClick={initializeLevel}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 relative h-96">
          {/* Shooter */}
          <div className="absolute bottom-4 left-4">
            <div className="text-4xl">{gameElements.projectile}</div>
          </div>

          {/* Power and Angle Controls */}
          <div className="absolute bottom-4 left-20">
            <div className="bg-white/30 p-4 rounded-xl">
              <div className="mb-2">
                <label className="text-white font-bold">Power: {power}</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={power}
                  onChange={(e) => setPower(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="mb-2">
                <label className="text-white font-bold">Angle: {angle}°</label>
                <input
                  type="range"
                  min="15"
                  max="75"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <motion.button
                onClick={handleShoot}
                disabled={shotsLeft <= 0 || isAiming}
                className="bg-gradient-to-r from-red-500 to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 SHOOT!
              </motion.button>
            </div>
          </div>

          {/* Targets */}
          {targets.map(target => !target.hit && (
            <motion.div
              key={target.id}
              className="absolute text-3xl"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {target.element}
              {target.health > 1 && (
                <div className="text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-1">
                  {target.health}
                </div>
              )}
            </motion.div>
          ))}

          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute text-2xl opacity-70"
              style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
            >
              {obstacle.element}
            </div>
          ))}

          {/* Projectile */}
          {projectile && (
            <motion.div
              className="absolute text-3xl"
              initial={{ x: projectile.x, y: projectile.y }}
              animate={{
                x: projectile.x + projectile.velocityX,
                y: projectile.y + projectile.velocityY
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {projectile.element}
            </motion.div>
          )}

          <div className="absolute bottom-4 right-4">
            <div className="text-white text-center">
              <p className="font-bold">Hit all targets to win!</p>
              <p className="text-sm">Adjust power and angle, then shoot!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Element Slice Game (Fruit Ninja Style)
const ElementSliceGame = ({ theme, onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sliceTrail, setSliceTrail] = useState([]);
  const [fallingElements, setFallingElements] = useState([]);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const sliceElements = theme.slice;

  useEffect(() => {
    if (!gameActive) return;

    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          audioManager.speak(`Great job! Your final score is ${score}!`, 'child');
          setTimeout(() => onGameEnd({ score, completed: true }), 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const elementSpawner = setInterval(() => {
      if (Math.random() < 0.7) {
        spawnElement();
      }
    }, 1000);

    return () => {
      clearInterval(gameTimer);
      clearInterval(elementSpawner);
    };
  }, [gameActive, score]);

  const spawnElement = () => {
    const newElement = {
      id: Math.random(),
      x: Math.random() * 80 + 10,
      y: 100,
      element: sliceElements[Math.floor(Math.random() * sliceElements.length)],
      velocityY: -(Math.random() * 3 + 2),
      sliced: false,
      isBomb: Math.random() < 0.1 // 10% chance of bomb
    };

    setFallingElements(prev => [...prev, newElement]);

    // Remove element after it falls
    setTimeout(() => {
      setFallingElements(prev => prev.filter(el => el.id !== newElement.id));
    }, 5000);
  };

  const handleSlice = (elementId, event) => {
    const element = fallingElements.find(el => el.id === elementId);
    if (!element || element.sliced) return;

    // Add slice trail effect
    const rect = event.currentTarget.getBoundingClientRect();
    const trailPoint = {
      id: Math.random(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    setSliceTrail(prev => [...prev, trailPoint]);
    setTimeout(() => {
      setSliceTrail(prev => prev.filter(p => p.id !== trailPoint.id));
    }, 300);

    // Update element
    setFallingElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, sliced: true } : el
    ));

    if (element.isBomb) {
      // Hit bomb - game over
      setScore(prev => Math.max(0, prev - 50));
      setCombo(0);
      audioManager.playSound('explosion');
      audioManager.speak('Oh no! You hit a bomb!', 'child');
    } else {
      // Successful slice
      setCombo(prev => prev + 1);
      setScore(prev => prev + (10 + combo * 2));
      audioManager.playSound('slice');
      
      if (combo > 0 && combo % 5 === 0) {
        audioManager.speak(`Amazing ${combo} combo!`, 'child');
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!gameActive) return;
    
    // Check for slice interactions
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    fallingElements.forEach(element => {
      if (element.sliced) return;
      
      const elementX = (element.x / 100) * rect.width;
      const elementY = (element.y / 100) * rect.height;
      const distance = Math.sqrt(
        Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2)
      );

      if (distance < 40) {
        handleSlice(element.id, event);
      }
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto h-screen relative">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">⚡ Element Slice</h2>
            <div className="flex gap-4 text-white text-lg">
              <span>⭐ {score}</span>
              <span>⏰ {timeLeft}s</span>
              {combo > 0 && <span>🔥 {combo}x</span>}
            </div>
          </div>
          
          <div className="text-white text-right">
            <div className="text-sm">Slice elements!</div>
            <div className="text-xs">Avoid bombs! 💣</div>
          </div>
        </div>

        {/* Game Area */}
        <div 
          className="absolute inset-0 cursor-crosshair"
          onMouseMove={handleMouseMove}
        >
          {/* Falling Elements */}
          {fallingElements.map(element => (
            <motion.div
              key={element.id}
              className={`absolute text-4xl select-none pointer-events-none ${
                element.sliced ? 'opacity-30' : ''
              }`}
              initial={{ x: `${element.x}%`, y: `${element.y}%` }}
              animate={{ 
                y: `${element.y + element.velocityY * 100}%`,
                rotate: element.sliced ? 360 : 0,
                scale: element.sliced ? 0.5 : 1
              }}
              transition={{ duration: 0.1 }}
            >
              {element.isBomb ? '💣' : element.element}
              {element.sliced && !element.isBomb && (
                <motion.div
                  className="absolute inset-0 bg-yellow-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}

          {/* Slice Trail */}
          {sliceTrail.map(point => (
            <motion.div
              key={point.id}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full pointer-events-none"
              style={{ left: point.x - 6, top: point.y - 6 }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-black/60 text-white px-6 py-3 rounded-xl">
          <p className="font-bold">Move your mouse to slice falling elements!</p>
          <p className="text-sm">Avoid the bombs 💣 and create combos for bonus points!</p>
        </div>
      </div>
    </div>
  );
};

// Block Builder Game (Minecraft Style)
const BlockBuilderGame = ({ theme, onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(theme.blocks[0]);
  const [score, setScore] = useState(0);
  const [structures, setStructures] = useState(0);
  const [inventory, setInventory] = useState({});

  const gridSize = 10;

  useEffect(() => {
    initializeGrid();
    initializeInventory();
  }, []);

  const initializeGrid = () => {
    const newGrid = Array(gridSize).fill().map(() => 
      Array(gridSize).fill().map(() => ({
        block: null,
        id: Math.random()
      }))
    );
    setGrid(newGrid);
  };

  const initializeInventory = () => {
    const newInventory = {};
    theme.blocks.forEach(block => {
      newInventory[block] = 20; // Start with 20 of each block
    });
    setInventory(newInventory);
  };

  const placeBlock = (row, col) => {
    if (inventory[selectedBlock] <= 0) {
      audioManager.speak('You need more blocks! Complete structures to get more.', 'child');
      return;
    }

    const newGrid = [...grid];
    if (newGrid[row][col].block === null) {
      newGrid[row][col].block = selectedBlock;
      setGrid(newGrid);
      
      setInventory(prev => ({
        ...prev,
        [selectedBlock]: prev[selectedBlock] - 1
      }));

      setScore(prev => prev + 5);
      audioManager.playSound('place');
      
      checkForStructures(newGrid, row, col);
    }
  };

  const removeBlock = (row, col) => {
    const newGrid = [...grid];
    if (newGrid[row][col].block !== null) {
      const removedBlock = newGrid[row][col].block;
      newGrid[row][col].block = null;
      setGrid(newGrid);
      
      setInventory(prev => ({
        ...prev,
        [removedBlock]: prev[removedBlock] + 1
      }));

      setScore(prev => Math.max(0, prev - 2));
      audioManager.playSound('break');
    }
  };

  const checkForStructures = (grid, row, col) => {
    // Check for 3x3 complete structures
    for (let r = 0; r <= gridSize - 3; r++) {
      for (let c = 0; c <= gridSize - 3; c++) {
        let isComplete = true;
        for (let dr = 0; dr < 3; dr++) {
          for (let dc = 0; dc < 3; dc++) {
            if (grid[r + dr][c + dc].block === null) {
              isComplete = false;
              break;
            }
          }
          if (!isComplete) break;
        }
        
        if (isComplete) {
          setStructures(prev => prev + 1);
          setScore(prev => prev + 100);
          audioManager.playSound('achievement');
          audioManager.speak('Amazing structure! You built something wonderful!', 'child');
          
          // Give bonus blocks
          theme.blocks.forEach(block => {
            setInventory(prev => ({
              ...prev,
              [block]: prev[block] + 5
            }));
          });
        }
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">🧱 Block Builder</h2>
            <div className="flex gap-4 text-white text-lg">
              <span>⭐ {score}</span>
              <span>🏗️ {structures} structures</span>
            </div>
          </div>
          
          <button
            onClick={initializeGrid}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Inventory */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎒 Inventory</h3>
            <div className="space-y-3">
              {theme.blocks.map(block => (
                <motion.button
                  key={block}
                  onClick={() => setSelectedBlock(block)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedBlock === block 
                      ? 'bg-yellow-400 text-gray-800' 
                      : 'bg-white/30 text-white hover:bg-white/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{block}</span>
                    <span className="font-bold">{inventory[block] || 0}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-white text-sm">Build 3x3 structures to get more blocks!</p>
            </div>
          </div>

          {/* Building Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
              <div className="grid grid-cols-10 gap-1 max-w-lg mx-auto">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => placeBlock(rowIndex, colIndex)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        removeBlock(rowIndex, colIndex);
                      }}
                      className="aspect-square bg-white/30 rounded border-2 border-white/20 flex items-center justify-center text-lg hover:bg-white/50 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {cell.block}
                    </motion.button>
                  ))
                )}
              </div>
              
              <div className="text-center mt-6">
                <p className="text-white font-medium mb-2">
                  Selected: <span className="text-2xl">{selectedBlock}</span>
                </p>
                <p className="text-white text-sm">
                  Left click to place • Right click to remove
                </p>
                <p className="text-white text-xs">
                  Build 3x3 complete structures for bonus points and blocks!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Complete Family Games Hub
const FamilyGamesHubComplete = () => {
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
      id: 'snowball-shooter',
      title: '⛄ Snowball Shooter',
      description: 'Launch projectiles at targets in this physics game!',
      component: SnowballShooterGame,
      difficulty: 'Easy',
      players: '1-4 Players'
    },
    {
      id: 'element-slice',
      title: '⚡ Element Slice',
      description: 'Slice elements as they fly across the screen!',
      component: ElementSliceGame,
      difficulty: 'Hard',
      players: '1-2 Players'
    },
    {
      id: 'block-builder',
      title: '🧱 Block Builder',
      description: 'Build amazing structures with magical blocks!',
      component: BlockBuilderGame,
      difficulty: 'Medium',
      players: '1-4 Players'
    }
  ];

  const handleGameSelect = (game) => {
    setCurrentGame(game);
    audioManager.playSound('click');
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
                <div className="text-6xl mb-4 group-hover:animate-bounce">🎯</div>
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
                    className={`bg-gradient-to-r ${theme.colors.primary} text-white py-3 px-6 rounded-2xl font-bold`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Play Now! 🚀
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
          <p className="font-bold">🎮 All Games Now Available!</p>
          <p className="text-sm">Choose a theme and enjoy fully interactive gameplay!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default FamilyGamesHubComplete;
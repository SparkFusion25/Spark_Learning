import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Pause, Play, Volume2, VolumeX,
  Zap, Target, Clock, Gift, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  User, Settings, Palette
} from 'lucide-react';

// Enhanced Disney theme data for family games
const DISNEY_THEMES = {
  frozen: {
    id: 'frozen',
    name: 'Frozen: Arendelle Kingdom',
    environment: {
      background: 'from-blue-200 via-cyan-100 to-white',
      atmosphere: 'Northern Lights with floating ice crystals',
      music: 'Let It Go instrumental',
      weather: 'Gentle snowfall animation'
    },
    colors: {
      primary: 'from-blue-400 via-cyan-500 to-blue-600',
      secondary: 'from-blue-100 via-cyan-50 to-white',
      accent: 'text-cyan-600'
    },
    gameElements: {
      candyCrush: ['❄️', '⛄', '🧊', '✨', '💎', '🌨️', '🔮', '👑'],
      wordscape: ['ICE', 'SNOW', 'COLD', 'ELSA', 'ANNA', 'OLAF', 'MAGIC', 'CASTLE', 'FROZEN', 'KINGDOM'],
      angryBirds: { bird: '⛄', target: '🧊', obstacle: '🌨️', powerup: '✨' },
      fruitNinja: ['❄️', '🧊', '💎', '✨', '⛄', '🌨️', '🔮', '👑'],
      minecraft: { blocks: ['🧊', '❄️', '🏰', '✨', '💎', '🌨️'], theme: 'ice_palace' }
    },
    characters: ['Elsa', 'Anna', 'Olaf', 'Kristoff'],
    sounds: {
      match: 'magical-ice-chime',
      combo: 'elsa-magic-cascade',
      success: 'frozen-victory-fanfare'
    }
  },
  spiderman: {
    id: 'spiderman',
    name: 'Spider-Man: New York City',
    environment: {
      background: 'from-red-900 via-blue-900 to-gray-900',
      atmosphere: 'City skyline with web patterns',
      music: 'Heroic Spider-Man theme',
      weather: 'Dynamic city lights'
    },
    colors: {
      primary: 'from-red-500 to-blue-600',
      secondary: 'from-red-100 via-blue-50 to-white',
      accent: 'text-red-600'
    },
    gameElements: {
      candyCrush: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢', '🚁', '🎯'],
      wordscape: ['WEB', 'HERO', 'SPIN', 'MASK', 'CITY', 'SAVE', 'SPIDER', 'POWER', 'SWING', 'COURAGE'],
      angryBirds: { bird: '🕷️', target: '💥', obstacle: '🏢', powerup: '⚡' },
      fruitNinja: ['🕷️', '🕸️', '💥', '⚡', '🦸‍♂️', '🏢', '🚁', '🎯'],
      minecraft: { blocks: ['🏢', '🕸️', '🚁', '⚡', '💥', '🎯'], theme: 'spider_city' }
    },
    characters: ['Spider-Man', 'Miles Morales', 'Spider-Gwen', 'Iron Spider'],
    sounds: {
      match: 'web-thwip-combo',
      combo: 'spidey-sense-alert',
      success: 'heroic-victory'
    }
  },
  moana: {
    id: 'moana',
    name: 'Moana: Heart of Te Fiti',
    environment: {
      background: 'from-teal-400 via-blue-500 to-cyan-600',
      atmosphere: 'Tropical ocean with floating islands',
      music: 'How Far I\'ll Go instrumental',
      weather: 'Ocean waves and tropical breeze'
    },
    colors: {
      primary: 'from-teal-400 via-blue-500 to-cyan-600',
      secondary: 'from-teal-100 via-blue-50 to-white',
      accent: 'text-teal-600'
    },
    gameElements: {
      candyCrush: ['🌊', '⭐', '🛶', '🐚', '🌺', '🥥', '🏝️', '💖'],
      wordscape: ['WAVE', 'OCEAN', 'SAIL', 'BOAT', 'ISLAND', 'HEART', 'MOANA', 'MAUI', 'VOYAGE', 'COURAGE'],
      angryBirds: { bird: '🛶', target: '🏝️', obstacle: '🌊', powerup: '💖' },
      fruitNinja: ['🌊', '🥥', '🌺', '⭐', '🐚', '🏝️', '🛶', '💖'],
      minecraft: { blocks: ['🏝️', '🌊', '🛶', '🌺', '🥥', '⭐'], theme: 'tropical_paradise' }
    },
    characters: ['Moana', 'Maui', 'Te Fiti', 'Ocean Spirit'],
    sounds: {
      match: 'ocean-wave-harmony',
      combo: 'te-fiti-magic',
      success: 'polynesian-celebration'
    }
  },
  lionking: {
    id: 'lionking',
    name: 'Lion King: Pride Rock',
    environment: {
      background: 'from-orange-400 via-yellow-500 to-red-500',
      atmosphere: 'African savanna with acacia trees',
      music: 'Circle of Life instrumental',
      weather: 'Warm savanna winds with dust particles'
    },
    colors: {
      primary: 'from-orange-400 via-yellow-500 to-red-500',
      secondary: 'from-orange-100 via-yellow-50 to-red-50',
      accent: 'text-orange-600'
    },
    gameElements: {
      candyCrush: ['🦁', '👑', '🌅', '🌿', '🦓', '🐘', '🌳', '⭐'],
      wordscape: ['LION', 'KING', 'PRIDE', 'ROCK', 'MUFASA', 'SIMBA', 'JUNGLE', 'ROAR', 'BRAVE', 'FAMILY'],
      angryBirds: { bird: '🦁', target: '🌳', obstacle: '🪨', powerup: '👑' },
      fruitNinja: ['🦁', '🌿', '🌅', '🦓', '🐘', '👑', '🌳', '⭐'],
      minecraft: { blocks: ['🪨', '🌳', '🌿', '🌅', '👑', '🦁'], theme: 'pride_rock' }
    },
    characters: ['Simba', 'Mufasa', 'Nala', 'Timon & Pumbaa'],
    sounds: {
      match: 'savanna-drums',
      combo: 'roar-of-pride',
      success: 'hakuna-matata-celebration'
    }
  },
  toystory: {
    id: 'toystory',
    name: 'Toy Story: Andy\'s Room',
    environment: {
      background: 'from-blue-300 via-green-300 to-yellow-300',
      atmosphere: 'Colorful toy room with floating toys',
      music: 'You\'ve Got a Friend in Me',
      weather: 'Playful toy magic sparkles'
    },
    colors: {
      primary: 'from-blue-400 via-green-400 to-yellow-400',
      secondary: 'from-blue-100 via-green-50 to-yellow-50',
      accent: 'text-blue-600'
    },
    gameElements: {
      candyCrush: ['🤠', '🚀', '🦕', '🎯', '⭐', '🎪', '🎈', '🎁'],
      wordscape: ['TOY', 'STORY', 'BUZZ', 'WOODY', 'FRIEND', 'PLAY', 'SPACE', 'COWBOY', 'ADVENTURE', 'INFINITY'],
      angryBirds: { bird: '🚀', target: '🎯', obstacle: '📦', powerup: '⭐' },
      fruitNinja: ['🤠', '🚀', '🦕', '⭐', '🎪', '🎈', '🎁', '🎯'],
      minecraft: { blocks: ['📦', '🎪', '🚀', '⭐', '🎈', '🎁'], theme: 'toy_room' }
    },
    characters: ['Woody', 'Buzz Lightyear', 'Rex', 'Bo Peep'],
    sounds: {
      match: 'toy-box-melody',
      combo: 'to-infinity-and-beyond',
      success: 'toy-story-fanfare'
    }
  },
  incredibles: {
    id: 'incredibles',
    name: 'The Incredibles: Metroville',
    environment: {
      background: 'from-red-500 via-orange-500 to-yellow-500',
      atmosphere: 'Retro-futuristic city with flying cars',
      music: 'The Incredibles theme',
      weather: 'Dynamic superhero energy'
    },
    colors: {
      primary: 'from-red-500 via-orange-500 to-yellow-500',
      secondary: 'from-red-100 via-orange-50 to-yellow-50',
      accent: 'text-red-600'
    },
    gameElements: {
      candyCrush: ['💪', '🔥', '⚡', '🏃‍♂️', '👁️', '🛡️', '💨', '⭐'],
      wordscape: ['SUPER', 'HERO', 'FAMILY', 'POWER', 'STRONG', 'FAST', 'FIRE', 'SHIELD', 'INCREDIBLE', 'TEAM'],
      angryBirds: { bird: '💪', target: '🏢', obstacle: '🛡️', powerup: '⚡' },
      fruitNinja: ['💪', '🔥', '⚡', '💨', '👁️', '🛡️', '🏃‍♂️', '⭐'],
      minecraft: { blocks: ['🏢', '⚡', '🛡️', '🔥', '💪', '⭐'], theme: 'super_city' }
    },
    characters: ['Mr. Incredible', 'Elastigirl', 'Dash', 'Violet'],
    sounds: {
      match: 'super-power-activate',
      combo: 'incredible-strength',
      success: 'superhero-victory'
    }
  },
  findingdory: {
    id: 'findingdory',
    name: 'Finding Dory: Great Barrier Reef',
    environment: {
      background: 'from-blue-400 via-teal-400 to-cyan-400',
      atmosphere: 'Underwater coral reef with sea creatures',
      music: 'Finding Dory underwater theme',
      weather: 'Gentle underwater currents with bubbles'
    },
    colors: {
      primary: 'from-blue-400 via-teal-400 to-cyan-400',
      secondary: 'from-blue-100 via-teal-50 to-cyan-50',
      accent: 'text-blue-600'
    },
    gameElements: {
      candyCrush: ['🐠', '🐟', '🦈', '🐙', '🌊', '🪸', '🐚', '💙'],
      wordscape: ['FISH', 'OCEAN', 'DORY', 'NEMO', 'CORAL', 'REEF', 'SWIM', 'BLUE', 'MEMORY', 'FAMILY'],
      angryBirds: { bird: '🐠', target: '🪸', obstacle: '🌊', powerup: '💙' },
      fruitNinja: ['🐠', '🐟', '🐙', '🪸', '🐚', '🌊', '🦈', '💙'],
      minecraft: { blocks: ['🪸', '🌊', '🐚', '🐠', '🐟', '💙'], theme: 'coral_reef' }
    },
    characters: ['Dory', 'Nemo', 'Marlin', 'Hank'],
    sounds: {
      match: 'underwater-bubbles',
      combo: 'ocean-current-flow',
      success: 'sea-celebration'
    }
  },
  coco: {
    id: 'coco',
    name: 'Coco: Land of the Dead',
    environment: {
      background: 'from-purple-500 via-pink-500 to-orange-500',
      atmosphere: 'Colorful Land of the Dead with marigold petals',
      music: 'Remember Me instrumental',
      weather: 'Floating marigold petals and magical lights'
    },
    colors: {
      primary: 'from-purple-500 via-pink-500 to-orange-500',
      secondary: 'from-purple-100 via-pink-50 to-orange-50',
      accent: 'text-purple-600'
    },
    gameElements: {
      candyCrush: ['🌺', '🎵', '🎸', '💀', '🌈', '✨', '🎪', '💫'],
      wordscape: ['MUSIC', 'FAMILY', 'REMEMBER', 'COCO', 'MIGUEL', 'GUITAR', 'SONG', 'LOVE', 'MEMORY', 'SPIRIT'],
      angryBirds: { bird: '🎵', target: '🎸', obstacle: '🌺', powerup: '✨' },
      fruitNinja: ['🌺', '🎵', '🎸', '🌈', '✨', '🎪', '💫', '💀'],
      minecraft: { blocks: ['🎸', '🌺', '✨', '🎪', '🌈', '💫'], theme: 'land_of_dead' }
    },
    characters: ['Miguel', 'Coco', 'Héctor', 'Mama Imelda'],
    sounds: {
      match: 'mariachi-strum',
      combo: 'remember-me-melody',
      success: 'dia-de-muertos-celebration'
    }
  }
};

// Enhanced Avatar System
const AVATAR_SYSTEM = {
  defaultAvatars: [
    {
      id: 'emmy',
      name: 'Emmy',
      emoji: '👧🏽',
      personality: 'Creative and Curious',
      favoriteSubject: 'Art & Music',
      skinTone: 'medium',
      hairColor: 'brown',
      eyeColor: 'hazel'
    },
    {
      id: 'greyson',
      name: 'Greyson',
      emoji: '👦🏻',
      personality: 'Adventurous and Brave',
      favoriteSubject: 'Science & Math',
      skinTone: 'light',
      hairColor: 'blonde',
      eyeColor: 'blue'
    },
    {
      id: 'jaxon',
      name: 'Jaxon',
      emoji: '👦🏿',
      personality: 'Funny and Smart',
      favoriteSubject: 'Reading & Stories',
      skinTone: 'dark',
      hairColor: 'black',
      eyeColor: 'brown'
    }
  ],
  characterAvatars: {
    superheroes: [
      { id: 'spiderman', name: 'Spider-Man', emoji: '🕷️', type: 'Marvel' },
      { id: 'superman', name: 'Superman', emoji: '🦸‍♂️', type: 'DC' },
      { id: 'ironman', name: 'Iron Man', emoji: '🤖', type: 'Marvel' },
      { id: 'hulk', name: 'The Hulk', emoji: '💚', type: 'Marvel' },
      { id: 'wonderwoman', name: 'Wonder Woman', emoji: '👸🏻', type: 'DC' },
      { id: 'captain', name: 'Captain America', emoji: '🛡️', type: 'Marvel' }
    ],
    disneyPrincesses: [
      { id: 'elsa', name: 'Elsa', emoji: '❄️', movie: 'Frozen' },
      { id: 'anna', name: 'Anna', emoji: '🧡', movie: 'Frozen' },
      { id: 'moana', name: 'Moana', emoji: '🌊', movie: 'Moana' },
      { id: 'belle', name: 'Belle', emoji: '📚', movie: 'Beauty and the Beast' },
      { id: 'ariel', name: 'Ariel', emoji: '🧜‍♀️', movie: 'The Little Mermaid' },
      { id: 'jasmine', name: 'Jasmine', emoji: '🧞‍♀️', movie: 'Aladdin' },
      { id: 'rapunzel', name: 'Rapunzel', emoji: '🌻', movie: 'Tangled' },
      { id: 'tiana', name: 'Tiana', emoji: '🐸', movie: 'Princess and the Frog' }
    ],
    disneyHeroes: [
      { id: 'woody', name: 'Woody', emoji: '🤠', movie: 'Toy Story' },
      { id: 'buzz', name: 'Buzz Lightyear', emoji: '🚀', movie: 'Toy Story' },
      { id: 'simba', name: 'Simba', emoji: '🦁', movie: 'Lion King' },
      { id: 'miguel', name: 'Miguel', emoji: '🎸', movie: 'Coco' },
      { id: 'nemo', name: 'Nemo', emoji: '🐠', movie: 'Finding Nemo' },
      { id: 'baymax', name: 'Baymax', emoji: '🤖', movie: 'Big Hero 6' }
    ]
  }
};

// Enhanced Sparkle Crush Game with realistic graphics and physics
const SparkleCrushGame = ({ theme, onGameEnd, selectedAvatar }) => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [level, setLevel] = useState(1);
  const [targetScore, setTargetScore] = useState(1000);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [powerUps, setPowerUps] = useState({ bomb: 2, lightning: 2, rainbow: 1 });

  const BOARD_SIZE = 8;
  const elements = theme.gameElements.candyCrush;

  // Enhanced particle effects
  const createParticleEffect = (x, y, type = 'sparkle') => {
    const newParticles = Array(10).fill().map((_, i) => ({
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 50,
      opacity: 1,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      type
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

  // Initialize board with enhanced logic
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const boardRow = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        let elementType;
        do {
          elementType = elements[Math.floor(Math.random() * elements.length)];
        } while (
          // Prevent initial matches
          (row >= 2 && newBoard[row-1]?.[col]?.type === elementType && newBoard[row-2]?.[col]?.type === elementType) ||
          (col >= 2 && boardRow[col-1]?.type === elementType && boardRow[col-2]?.type === elementType)
        );
        
        boardRow.push({
          id: `${row}-${col}`,
          type: elementType,
          row,
          col,
          isMatched: false,
          isNew: false,
          glow: false,
          shake: false
        });
      }
      newBoard.push(boardRow);
    }
    setBoard(newBoard);
  }, [elements]);

  // Enhanced match detection with special patterns
  const checkMatches = useCallback((gameBoard) => {
    const matches = [];
    
    // Check for L-shapes and T-shapes (worth more points)
    const checkSpecialShapes = (row, col, type) => {
      const shapes = [];
      // L-shape detection logic here
      // T-shape detection logic here
      return shapes;
    };
    
    // Standard horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      let consecutiveCount = 1;
      let currentType = gameBoard[row][0].type;
      
      for (let col = 1; col < BOARD_SIZE; col++) {
        if (gameBoard[row][col].type === currentType) {
          consecutiveCount++;
        } else {
          if (consecutiveCount >= 3) {
            for (let i = col - consecutiveCount; i < col; i++) {
              matches.push({ row, col: i, type: 'horizontal', length: consecutiveCount });
            }
          }
          consecutiveCount = 1;
          currentType = gameBoard[row][col].type;
        }
      }
      if (consecutiveCount >= 3) {
        for (let i = BOARD_SIZE - consecutiveCount; i < BOARD_SIZE; i++) {
          matches.push({ row, col: i, type: 'horizontal', length: consecutiveCount });
        }
      }
    }

    // Standard vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      let consecutiveCount = 1;
      let currentType = gameBoard[0][col].type;
      
      for (let row = 1; row < BOARD_SIZE; row++) {
        if (gameBoard[row][col].type === currentType) {
          consecutiveCount++;
        } else {
          if (consecutiveCount >= 3) {
            for (let i = row - consecutiveCount; i < row; i++) {
              matches.push({ row: i, col, type: 'vertical', length: consecutiveCount });
            }
          }
          consecutiveCount = 1;
          currentType = gameBoard[row][col].type;
        }
      }
      if (consecutiveCount >= 3) {
        for (let i = BOARD_SIZE - consecutiveCount; i < BOARD_SIZE; i++) {
          matches.push({ row: i, col, type: 'vertical', length: consecutiveCount });
        }
      }
    }

    return matches;
  }, []);

  // Enhanced cell click with realistic feedback
  const handleCellClick = (row, col) => {
    if (isAnimating || moves <= 0) return;

    // Add visual feedback
    const newBoard = board.map(r => [...r]);
    newBoard[row][col].glow = true;
    setBoard(newBoard);

    if (!selectedCell) {
      setSelectedCell({ row, col });
      // Play selection sound
      if (theme.sounds?.select) {
        // playSound(theme.sounds.select);
      }
      return;
    }

    const { row: selectedRow, col: selectedCol } = selectedCell;
    
    // Check if cells are adjacent
    const rowDiff = Math.abs(row - selectedRow);
    const colDiff = Math.abs(col - selectedCol);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      // Swap cells with animation
      const swapBoard = board.map(boardRow => [...boardRow]);
      const temp = swapBoard[row][col].type;
      swapBoard[row][col].type = swapBoard[selectedRow][selectedCol].type;
      swapBoard[selectedRow][selectedCol].type = temp;

      // Check if swap creates matches
      const matches = checkMatches(swapBoard);
      if (matches.length > 0) {
        setBoard(swapBoard);
        setMoves(prev => prev - 1);
        createParticleEffect((col + selectedCol) * 50, (row + selectedRow) * 50, 'swap');
        processMatches(swapBoard, matches);
      } else {
        // Invalid move - shake animation
        newBoard[row][col].shake = true;
        newBoard[selectedRow][selectedCol].shake = true;
        setBoard(newBoard);
        setTimeout(() => {
          const resetBoard = board.map(r => r.map(c => ({ ...c, shake: false, glow: false })));
          setBoard(resetBoard);
        }, 500);
      }
    }
    
    setSelectedCell(null);
    // Clear all glows
    setTimeout(() => {
      setBoard(prev => prev.map(r => r.map(c => ({ ...c, glow: false }))));
    }, 200);
  };

  // Enhanced processing with realistic animations
  const processMatches = (gameBoard, matches) => {
    setIsAnimating(true);
    
    // Mark matched cells and create particle effects
    const newBoard = gameBoard.map(row => [...row]);
    matches.forEach(({ row, col, length }) => {
      newBoard[row][col].isMatched = true;
      createParticleEffect(col * 50, row * 50, length >= 5 ? 'explosion' : 'match');
    });
    
    setBoard(newBoard);
    
    // Calculate enhanced scoring
    const basePoints = 10;
    const lengthBonus = matches.reduce((sum, match) => sum + (match.length - 3) * 5, 0);
    const comboMultiplier = Math.max(1, combo);
    const points = (matches.length * basePoints + lengthBonus) * comboMultiplier;
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);

    // Play match sound
    if (theme.sounds?.match) {
      // playSound(theme.sounds.match);
    }

    // Process cascading with enhanced timing
    setTimeout(() => {
      const clearedBoard = newBoard.map(row => 
        row.map(cell => cell.isMatched ? null : { ...cell, isMatched: false })
      );
      
      const droppedBoard = dropPieces(clearedBoard);
      const filledBoard = fillEmptySpaces(droppedBoard);
      
      setBoard(filledBoard);
      
      // Check for cascade matches
      const newMatches = checkMatches(filledBoard);
      if (newMatches.length > 0) {
        setTimeout(() => processMatches(filledBoard, newMatches), 500);
      } else {
        setCombo(0);
        setIsAnimating(false);
      }
    }, 800);
  };

  // Enhanced piece dropping with physics
  const dropPieces = (gameBoard) => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      let writeRow = BOARD_SIZE - 1;
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (gameBoard[row][col] !== null) {
          newBoard[writeRow][col] = {
            ...gameBoard[row][col],
            row: writeRow,
            col,
            dropping: row !== writeRow,
            dropDistance: writeRow - row
          };
          writeRow--;
        }
      }
    }
    
    return newBoard;
  };

  // Enhanced space filling with new piece animations
  const fillEmptySpaces = (gameBoard) => {
    const newBoard = gameBoard.map(row => [...row]);
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (newBoard[row][col] === null) {
          newBoard[row][col] = {
            id: `${row}-${col}-${Date.now()}`,
            type: elements[Math.floor(Math.random() * elements.length)],
            row,
            col,
            isMatched: false,
            isNew: true,
            glow: false,
            shake: false
          };
        }
      }
    }
    
    return newBoard;
  };

  // Power-up usage
  const activatePowerUp = (type) => {
    if (powerUps[type] <= 0) return;
    
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    
    switch (type) {
      case 'bomb':
        // Destroy 3x3 area around clicked cell
        createParticleEffect(200, 200, 'explosion');
        break;
      case 'lightning':
        // Clear entire row and column
        createParticleEffect(400, 200, 'lightning');
        break;
      case 'rainbow':
        // Clear all pieces of selected type
        createParticleEffect(300, 300, 'rainbow');
        break;
    }
  };

  // Initialize game
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Check game end conditions
  useEffect(() => {
    if (moves <= 0) {
      setTimeout(() => {
        if (score >= targetScore) {
          onGameEnd('win', { score, level, avatar: selectedAvatar });
        } else {
          onGameEnd('lose', { score, level, avatar: selectedAvatar });
        }
      }, 1000);
    }
  }, [moves, score, targetScore, level, onGameEnd, selectedAvatar]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 relative overflow-hidden`} 
         style={{
           backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%), 
                            linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%)`
         }}>
      
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {theme.environment?.weather === 'Gentle snowfall animation' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 10}px`
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                ❄️
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Game Header with Avatar */}
        <motion.div 
          className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl">{selectedAvatar?.emoji || '👧🏽'}</div>
            <div>
              <div className="text-3xl font-bold">{theme.name}</div>
              <div className="text-lg text-gray-600">Playing as {selectedAvatar?.name || 'Emmy'}</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
              <Star className="inline w-5 h-5 mr-2" />
              {score.toLocaleString()}
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
              <Target className="inline w-5 h-5 mr-2" />
              {moves} moves
            </div>
            <div className="bg-gradient-to-r from-green-400 to-teal-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
              <Trophy className="inline w-5 h-5 mr-2" />
              {targetScore.toLocaleString()}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Combo Display */}
        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              className="text-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-xl border-4 border-white/50">
                🔥 AMAZING COMBO x{combo}! 🔥
                <div className="text-sm">+{combo * 50} Bonus Points!</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Game Board */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="grid grid-cols-8 gap-2 max-w-lg mx-auto">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer
                        transition-all duration-300 relative overflow-hidden
                        ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                          ? 'ring-4 ring-yellow-400 scale-110 shadow-2xl bg-yellow-200'
                          : cell?.isMatched
                            ? 'bg-red-300 scale-75'
                            : cell?.glow
                              ? 'bg-white shadow-2xl scale-105 ring-2 ring-white/50'
                              : 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl hover:scale-105'
                        }
                        ${cell?.shake ? 'animate-bounce' : ''}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      initial={cell?.isNew ? { scale: 0, y: -100, rotate: -180 } : 
                              cell?.dropping ? { y: -cell.dropDistance * 64 } : false}
                      animate={{ 
                        scale: cell?.isMatched ? 0 : 1, 
                        y: 0, 
                        rotate: cell?.isNew ? 0 : undefined 
                      }}
                      transition={{ 
                        duration: cell?.isNew ? 0.6 : 0.3,
                        type: "spring",
                        stiffness: cell?.isNew ? 120 : 200
                      }}
                      whileHover={{ 
                        scale: cell?.isMatched ? 0 : 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: cell?.isMatched ? 0 : 0.9 }}
                    >
                      <motion.div
                        animate={cell?.glow ? {
                          textShadow: ["0 0 5px #fff", "0 0 20px #fff", "0 0 5px #fff"],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.5, repeat: cell?.glow ? Infinity : 0 }}
                      >
                        {cell?.type}
                      </motion.div>
                      
                      {/* Sparkle overlay for matched cells */}
                      {cell?.isMatched && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50 rounded-2xl"
                          animate={{ opacity: [0.5, 1, 0] }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Enhanced Power-ups and Stats Panel */}
          <div className="space-y-6">
            {/* Power-ups */}
            <motion.div 
              className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">🎯 Power-Ups</h3>
              <div className="space-y-3">
                {Object.entries(powerUps).map(([type, count]) => (
                  <motion.button
                    key={type}
                    onClick={() => activatePowerUp(type)}
                    disabled={count <= 0}
                    className={`w-full p-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-between ${
                      count > 0 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={count > 0 ? { scale: 1.05 } : {}}
                    whileTap={count > 0 ? { scale: 0.95 } : {}}
                  >
                    <span>
                      {type === 'bomb' && '💣 Bomb Blast'}
                      {type === 'lightning' && '⚡ Lightning Strike'}
                      {type === 'rainbow' && '🌈 Rainbow Clear'}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">{count}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Progress and Stats */}
            <motion.div 
              className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">📊 Progress</h3>
              
              {/* Score Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Score Progress</span>
                  <span>{Math.round((score / targetScore) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Level and Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/20 rounded-xl">
                  <div className="text-2xl font-bold">{level}</div>
                  <div className="text-sm">Level</div>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-xl">
                  <div className="text-2xl font-bold">{combo}</div>
                  <div className="text-sm">Best Combo</div>
                </div>
              </div>
            </motion.div>

            {/* Game Controls */}
            <motion.div 
              className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-3">
                <motion.button
                  onClick={() => onGameEnd('quit', { score, level, avatar: selectedAvatar })}
                  className="w-full p-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏠 Return to Hub
                </motion.button>
                
                <motion.button
                  onClick={() => window.location.reload()}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Restart Game
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Particle Effects */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none text-2xl"
              style={{ left: particle.x, top: particle.y }}
              initial={{ opacity: 1, scale: particle.scale, rotate: particle.rotation }}
              animate={{ 
                opacity: 0, 
                scale: particle.scale * 2, 
                y: particle.y - 50,
                rotate: particle.rotation + 180 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {particle.type === 'sparkle' && '✨'}
              {particle.type === 'explosion' && '💥'}
              {particle.type === 'swap' && '🌟'}
              {particle.type === 'match' && '⭐'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Avatar Selection Component
const AvatarSelection = ({ onSelectAvatar, selectedAvatar }) => {
  const [activeCategory, setActiveCategory] = useState('default');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const categories = [
    { id: 'default', name: '👧👦 Kids', items: AVATAR_SYSTEM.defaultAvatars },
    { id: 'superheroes', name: '🦸‍♂️ Superheroes', items: AVATAR_SYSTEM.characterAvatars.superheroes },
    { id: 'princesses', name: '👸 Disney Princesses', items: AVATAR_SYSTEM.characterAvatars.disneyPrincesses },
    { id: 'heroes', name: '🌟 Disney Heroes', items: AVATAR_SYSTEM.characterAvatars.disneyHeroes }
  ];

  return (
    <>
      {/* Current Avatar Display */}
      <motion.button
        onClick={() => setShowAvatarModal(true)}
        className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl hover:bg-white/30 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-3xl">{selectedAvatar?.emoji || '👧🏽'}</div>
        <div className="text-left">
          <div className="font-bold">{selectedAvatar?.name || 'Emmy'}</div>
          <div className="text-sm opacity-75">Tap to change</div>
        </div>
      </motion.button>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-center">Choose Your Avatar</h2>
                <p className="text-gray-600 text-center mt-2">Pick your character to represent you in the games!</p>
              </div>

              {/* Category Tabs */}
              <div className="flex overflow-x-auto p-4 bg-gray-50">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap mr-3 transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Avatar Grid */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.find(c => c.id === activeCategory)?.items.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      onClick={() => {
                        onSelectAvatar(avatar);
                        setShowAvatarModal(false);
                      }}
                      className={`p-6 rounded-2xl text-center transition-all border-2 ${
                        selectedAvatar?.id === avatar.id
                          ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-400'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-5xl mb-3">{avatar.emoji}</div>
                      <div className="font-bold text-lg">{avatar.name}</div>
                      {avatar.personality && (
                        <div className="text-sm text-gray-600 mt-1">{avatar.personality}</div>
                      )}
                      {avatar.movie && (
                        <div className="text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1 mt-2">
                          {avatar.movie}
                        </div>
                      )}
                      {avatar.type && (
                        <div className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 mt-2">
                          {avatar.type}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main Family Games Hub with enhanced features
const FamilyGamesHub = () => {
  const [selectedTheme, setSelectedTheme] = useState('frozen');
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SYSTEM.defaultAvatars[0]);
  const [playerStats, setPlayerStats] = useState({
    sparkCoins: 250,
    gamesPlayed: 0,
    totalScore: 0,
    achievements: [],
    favoriteTheme: 'frozen',
    totalPlayTime: 0
  });

  const theme = DISNEY_THEMES[selectedTheme];

  const familyGames = [
    {
      id: 'sparkle-crush',
      title: 'Sparkle Crush',
      icon: '💎',
      description: 'Match magical elements in this addictive puzzle adventure!',
      difficulty: 'Easy to Master',
      players: 'Family Friendly',
      component: SparkleCrushGame,
      minAge: 4,
      skills: ['Pattern Recognition', 'Strategic Thinking', 'Color Matching']
    }
    // Note: Other games would be implemented similarly with enhanced features
  ];

  const handleGameEnd = (result, data) => {
    setPlayerStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + (data.score || 0),
      sparkCoins: prev.sparkCoins + Math.floor((data.score || 0) / 10),
      totalPlayTime: prev.totalPlayTime + 1
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
    return <GameComponent theme={theme} onGameEnd={handleGameEnd} selectedAvatar={selectedAvatar} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} relative overflow-hidden`}>
      
      {/* Enhanced Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Theme-specific atmospheric elements */}
        {selectedTheme === 'frozen' && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 15 + 8}px`
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  x: [0, Math.random() * 50 - 25],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              >
                ❄️
              </motion.div>
            ))}
          </>
        )}
        
        {selectedTheme === 'moana' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-400 text-opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${80 + Math.random() * 20}%`,
                  fontSize: `${Math.random() * 20 + 15}px`
                }}
                animate={{
                  x: ['0vw', '100vw'],
                  y: [0, Math.random() * 20 - 10],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: Math.random() * 6 + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3
                }}
              >
                🌊
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Enhanced Header with Avatar Selection */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.h1 
            className={`text-7xl font-bold bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent mb-4`}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {theme.name}
          </motion.h1>
          
          <p className="text-3xl text-gray-700 mb-8 font-medium">
            {theme.environment.atmosphere} ✨
          </p>

          {/* Avatar Selection */}
          <div className="flex justify-center mb-8">
            <AvatarSelection 
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
            />
          </div>
          
          {/* Theme Selector with Enhanced UI */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {Object.values(DISNEY_THEMES).map((themeOption) => (
              <motion.button
                key={themeOption.id}
                onClick={() => setSelectedTheme(themeOption.id)}
                className={`px-8 py-4 rounded-3xl font-bold text-lg transition-all shadow-lg border-2 ${
                  selectedTheme === themeOption.id
                    ? `bg-gradient-to-r ${themeOption.colors.primary} text-white scale-105 border-white/50 shadow-2xl`
                    : 'bg-white/30 hover:bg-white/50 border-white/30 hover:border-white/50 backdrop-blur-sm'
                }`}
                whileHover={{ scale: selectedTheme === themeOption.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-1">
                  {themeOption.id === 'frozen' && '❄️'}
                  {themeOption.id === 'spiderman' && '🕷️'}
                  {themeOption.id === 'moana' && '🌊'}
                  {themeOption.id === 'lionking' && '🦁'}
                  {themeOption.id === 'toystory' && '🤠'}
                  {themeOption.id === 'incredibles' && '💪'}
                  {themeOption.id === 'findingdory' && '🐠'}
                  {themeOption.id === 'coco' && '🎵'}
                </div>
                <div>{themeOption.name.split(':')[0]}</div>
              </motion.button>
            ))}
          </div>

          {/* Enhanced Player Stats */}
          <div className="flex justify-center gap-6 flex-wrap">
            <motion.div 
              className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/30 shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="inline w-6 h-6 mr-3 text-yellow-500" />
              <span className="font-bold text-xl">{Math.floor(playerStats.sparkCoins)} Spark Coins</span>
            </motion.div>
            <motion.div 
              className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/30 shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="inline w-6 h-6 mr-3 text-orange-500" />
              <span className="font-bold text-xl">{playerStats.gamesPlayed} Games Played</span>
            </motion.div>
            <motion.div 
              className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/30 shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="inline w-6 h-6 mr-3 text-blue-500" />
              <span className="font-bold text-xl">{playerStats.totalScore.toLocaleString()} Total Score</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Games Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {familyGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/40 transition-all duration-500 cursor-pointer border border-white/50 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame(game.id)}
            >
              <div className="text-center">
                <motion.div 
                  className="text-8xl mb-6"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {game.icon}
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {game.title}
                </h3>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {game.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {game.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {game.players}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Ages {game.minAge}+
                    </span>
                  </div>
                </div>

                {/* Skills Learned */}
                <div className="mb-6">
                  <h4 className="font-bold mb-2 text-gray-700">Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {game.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="bg-white/50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.button
                  className={`w-full py-4 bg-gradient-to-r ${theme.colors.primary} text-white rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all border-2 border-white/30`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Start Adventure! 🚀
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Coming Soon Games */}
          {[
            { name: 'Word Magic Quest', icon: '📝', description: 'Build words in magical circles!' },
            { name: 'Hero Target Practice', icon: '🎯', description: 'Physics-based shooting adventure!' },
            { name: 'Lightning Slice Challenge', icon: '⚔️', description: 'Fast-paced slicing action!' },
            { name: 'Dream Castle Builder', icon: '🏗️', description: 'Create amazing structures!' },
            { name: 'Racing Adventure', icon: '🏎️', description: 'High-speed character racing!' }
          ].map((comingSoon, index) => (
            <motion.div
              key={comingSoon.name}
              className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (familyGames.length + index) * 0.1 }}
            >
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4 opacity-50">{comingSoon.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-600">{comingSoon.name}</h3>
                <p className="text-gray-500 mb-6">{comingSoon.description}</p>
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-6 rounded-2xl font-bold">
                  🚧 Coming Soon! 🚧
                </div>
              </div>
              
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-gray/10 backdrop-blur-sm" />
            </motion.div>
          ))}
        </div>

        {/* Enhanced Why Parents Love This Section */}
        <motion.div 
          className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 border border-white/50 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Families Love {theme.name}! 👨‍👩‍👧‍👦
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center p-6 bg-white/30 rounded-3xl"
              whileHover={{ scale: 1.05, rotateY: 10 }}
            >
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="font-bold text-xl mb-3">Brain Development</h3>
              <p className="text-gray-700">Advanced pattern recognition, strategic thinking, and problem-solving skills</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white/30 rounded-3xl"
              whileHover={{ scale: 1.05, rotateY: 10 }}
            >
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="font-bold text-xl mb-3">Perfect Sessions</h3>
              <p className="text-gray-700">Designed for 5-15 minute focused learning sessions that fit any schedule</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white/30 rounded-3xl"
              whileHover={{ scale: 1.05, rotateY: 10 }}
            >
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="font-bold text-xl mb-3">Achievement System</h3>
              <p className="text-gray-700">Comprehensive progress tracking and celebration of every milestone</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white/30 rounded-3xl"
              whileHover={{ scale: 1.05, rotateY: 10 }}
            >
              <div className="text-6xl mb-4">💝</div>
              <h3 className="font-bold text-xl mb-3">Family Bonding</h3>
              <p className="text-gray-700">Collaborative gameplay that brings generations together through shared adventures</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyGamesHub;
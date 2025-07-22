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

// Enhanced Word Builder Game (Wordscape Style)
const WordBuilderGame = ({ theme, onGameEnd, selectedAvatar }) => {
  const [letters, setLetters] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [particles, setParticles] = useState([]);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const wordSets = {
    1: { letters: ['I', 'C', 'E'], words: ['ICE'], theme: 'frozen' },
    2: { letters: ['S', 'N', 'O', 'W'], words: ['SNOW', 'NOW', 'OWN', 'SON'], theme: 'frozen' },
    3: { letters: ['F', 'R', 'O', 'Z', 'E', 'N'], words: ['FROZEN', 'ZONE', 'ZERO', 'FORE', 'FOR', 'OR', 'NO'], theme: 'frozen' },
    4: { letters: ['S', 'P', 'I', 'D', 'E', 'R'], words: ['SPIDER', 'RIDE', 'PRIDE', 'PIER', 'RIPE', 'RED', 'SIP'], theme: 'spiderman' },
    5: { letters: ['O', 'C', 'E', 'A', 'N'], words: ['OCEAN', 'ONCE', 'CONE', 'ACE', 'CAN'], theme: 'moana' }
  };

  // Enhanced particle effects
  const createWordParticle = (x, y, word) => {
    const newParticles = Array(15).fill().map((_, i) => ({
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      opacity: 1,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      type: word.length >= 6 ? 'star' : 'sparkle',
      word: word
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 2000);
  };

  // Initialize level
  useEffect(() => {
    const levelData = wordSets[level] || wordSets[1];
    const letterObjects = levelData.letters.map((letter, index) => ({
      id: index,
      letter,
      isSelected: false,
      position: { 
        x: Math.cos((index * 360) / levelData.letters.length * Math.PI / 180) * 120,
        y: Math.sin((index * 360) / levelData.letters.length * Math.PI / 180) * 120
      }
    }));
    
    setLetters(letterObjects);
    setTargetWords(levelData.words);
    setFoundWords([]);
    setCurrentWord('');
    setSelectedLetters([]);
  }, [level]);

  // Handle letter selection with enhanced animations
  const handleLetterClick = (letterId) => {
    if (isAnimating) return;
    
    const letter = letters.find(l => l.id === letterId);
    if (!letter || letter.isSelected) return;

    const newSelectedLetters = [...selectedLetters, letterId];
    const newCurrentWord = currentWord + letter.letter;
    
    setSelectedLetters(newSelectedLetters);
    setCurrentWord(newCurrentWord);
    
    setLetters(prev => prev.map(l => 
      l.id === letterId ? { ...l, isSelected: true } : l
    ));

    // Play selection sound effect
    createWordParticle(200 + letterId * 20, 300, letter.letter);
  };

  // Submit word with enhanced feedback
  const submitWord = () => {
    if (currentWord.length < 2) return;
    
    setIsAnimating(true);
    
    if (targetWords.includes(currentWord) && !foundWords.includes(currentWord)) {
      // Correct word found!
      const wordScore = currentWord.length * 10 * (streak + 1);
      setFoundWords(prev => [...prev, currentWord]);
      setScore(prev => prev + wordScore);
      setStreak(prev => prev + 1);
      
      // Create celebration particles
      createWordParticle(400, 200, currentWord);
      
      // Check if level complete
      if (foundWords.length + 1 === targetWords.length) {
        setTimeout(() => {
          if (level < 5) {
            setLevel(prev => prev + 1);
          } else {
            onGameEnd('win', { score, level, avatar: selectedAvatar });
          }
        }, 1500);
      }
    } else {
      // Word not found or already found
      setStreak(0);
    }
    
    setTimeout(() => {
      clearSelection();
      setIsAnimating(false);
    }, 1000);
  };

  // Clear selection with animation
  const clearSelection = () => {
    setSelectedLetters([]);
    setCurrentWord('');
    setLetters(prev => prev.map(l => ({ ...l, isSelected: false })));
  };

     // Hint system
   const activateHint = () => {
    if (hintsUsed >= 3) return;
    
    const unFoundWords = targetWords.filter(word => !foundWords.includes(word));
    if (unFoundWords.length === 0) return;
    
    const hintWord = unFoundWords[0];
    const firstLetter = hintWord[0];
    
    // Highlight first letter
    const firstLetterObj = letters.find(l => l.letter === firstLetter);
    if (firstLetterObj) {
      handleLetterClick(firstLetterObj.id);
    }
    
    setHintsUsed(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 relative overflow-hidden`}>
      
      {/* Theme-specific background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {theme.id === 'frozen' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-200 text-opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 10}px`
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="flex justify-between items-center mb-8 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl">{selectedAvatar?.emoji || '👧🏽'}</div>
            <div>
              <div className="text-3xl font-bold">📝 Word Builder</div>
              <div className="text-lg text-gray-600">Level {level} - {selectedAvatar?.name || 'Emmy'}</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
              <Star className="inline w-5 h-5 mr-2" />
              {score.toLocaleString()}
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
              <Trophy className="inline w-5 h-5 mr-2" />
              {foundWords.length}/{targetWords.length}
            </div>
            <div className="bg-gradient-to-r from-green-400 to-teal-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
              🔥 Streak: {streak}
            </div>
          </div>
        </motion.div>

        {/* Current Word Display */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/50 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Current Word</h3>
            <div className="text-5xl font-bold tracking-widest mb-6 min-h-[80px] flex items-center justify-center">
              <motion.span
                key={currentWord}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                {currentWord || 'Select letters...'}
              </motion.span>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                onClick={submitWord}
                disabled={currentWord.length === 0 || isAnimating}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: currentWord.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: currentWord.length > 0 ? 0.95 : 1 }}
              >
                ✓ Submit Word
              </motion.button>
              <motion.button
                onClick={clearSelection}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🗑️ Clear
              </motion.button>
              <motion.button
                                 onClick={activateHint}
                disabled={hintsUsed >= 3}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: hintsUsed < 3 ? 1.05 : 1 }}
                whileTap={{ scale: hintsUsed < 3 ? 0.95 : 1 }}
              >
                💡 Hint ({3 - hintsUsed} left)
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Letter Circle */}
          <div className="lg:col-span-2">
            <motion.div 
              className="relative w-full h-96 mx-auto mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
            >
              <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl"></div>
              {letters.map((letter, index) => {
                const angle = (index * 360) / letters.length;
                const radius = 140;
                const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                
                return (
                  <motion.button
                    key={letter.id}
                    className={`
                      absolute w-20 h-20 rounded-full text-3xl font-bold
                      transform -translate-x-1/2 -translate-y-1/2 transition-all shadow-lg
                      ${letter.isSelected 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-110 shadow-2xl' 
                        : 'bg-white hover:bg-gray-100 hover:scale-105 text-gray-800'
                      }
                    `}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`
                    }}
                    onClick={() => handleLetterClick(letter.id)}
                    whileHover={{ scale: letter.isSelected ? 1.1 : 1.15, rotate: [0, -10, 10, 0] }}
                    whileTap={{ scale: 0.9 }}
                    animate={letter.isSelected ? {
                      boxShadow: ["0 0 20px rgba(255,215,0,0.5)", "0 0 40px rgba(255,215,0,0.8)", "0 0 20px rgba(255,215,0,0.5)"]
                    } : {}}
                    transition={{ duration: 0.5, repeat: letter.isSelected ? Infinity : 0 }}
                  >
                    {letter.letter}
                  </motion.button>
                );
              })}
              
              {/* Center decoration */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20">
                {theme.gameElements.wordscape[0] === 'ICE' ? '❄️' : 
                 theme.gameElements.wordscape[0] === 'WEB' ? '🕷️' : '🌊'}
              </div>
            </motion.div>
          </div>

          {/* Found Words Panel */}
          <div>
            <motion.div 
              className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-2xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">🎯 Found Words</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {targetWords.map((word, index) => (
                  <motion.div
                    key={word}
                    className={`
                      p-4 rounded-2xl text-center font-bold transition-all border-2
                      ${foundWords.includes(word)
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300 shadow-lg'
                        : 'bg-gray-200 text-gray-400 border-gray-300'
                      }
                    `}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={foundWords.includes(word) ? { scale: 1.05 } : {}}
                  >
                    <div className="text-lg">
                      {foundWords.includes(word) ? word : '???'}
                    </div>
                    {foundWords.includes(word) && (
                      <div className="text-sm opacity-80">
                        +{word.length * 10} points
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Progress</span>
                  <span>{Math.round((foundWords.length / targetWords.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(foundWords.length / targetWords.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Game Controls */}
            <motion.div 
              className="mt-6 bg-white/30 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-2xl"
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
              className="absolute pointer-events-none text-3xl"
              style={{ left: particle.x, top: particle.y }}
              initial={{ opacity: 1, scale: particle.scale, rotate: particle.rotation }}
              animate={{ 
                opacity: 0, 
                scale: particle.scale * 3, 
                y: particle.y - 100,
                rotate: particle.rotation + 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              {particle.type === 'star' && '⭐'}
              {particle.type === 'sparkle' && '✨'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
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

      // Enhanced Snowball Shooter Game (Angry Birds Style)
    const SnowballShooterGame = ({ theme, onGameEnd, selectedAvatar }) => {
      const [projectile, setProjectile] = useState(null);
      const [targets, setTargets] = useState([]);
      const [obstacles, setObstacles] = useState([]);
      const [score, setScore] = useState(0);
      const [shotsLeft, setShotsLeft] = useState(5);
      const [isAiming, setIsAiming] = useState(false);
      const [aimDirection, setAimDirection] = useState({ x: 0, y: 0 });
      const [level, setLevel] = useState(1);
      const [particles, setParticles] = useState([]);
      const [powerUps, setPowerUps] = useState({ multiShot: 1, explosive: 1, superSpeed: 1 });
      const [selectedPowerUp, setSelectedPowerUp] = useState(null);
      const [trajectory, setTrajectory] = useState([]);
      
      const gameElements = theme.gameElements.angryBirds;

      // Enhanced particle effects
      const createExplosion = (x, y, type = 'hit') => {
        const particleCount = type === 'explosion' ? 20 : 10;
        const newParticles = Array(particleCount).fill().map((_, i) => ({
          id: Math.random(),
          x: x + (Math.random() - 0.5) * 100,
          y: y + (Math.random() - 0.5) * 100,
          opacity: 1,
          scale: Math.random() * 0.5 + 0.5,
          rotation: Math.random() * 360,
          type,
          velocityX: (Math.random() - 0.5) * 200,
          velocityY: (Math.random() - 0.5) * 200
        }));
        setParticles(prev => [...prev, ...newParticles]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 1500);
      };

      // Initialize level with enhanced target patterns
      useEffect(() => {
        const levelConfigs = {
          1: {
            targets: [
              { id: 1, x: 70, y: 60, hit: false, health: 1, type: 'basic' },
              { id: 2, x: 80, y: 40, hit: false, health: 1, type: 'basic' }
            ],
            obstacles: [
              { id: 1, x: 65, y: 70, type: 'block', health: 1 }
            ]
          },
          2: {
            targets: [
              { id: 1, x: 65, y: 50, hit: false, health: 2, type: 'strong' },
              { id: 2, x: 75, y: 30, hit: false, health: 1, type: 'basic' },
              { id: 3, x: 85, y: 70, hit: false, health: 1, type: 'basic' }
            ],
            obstacles: [
              { id: 1, x: 60, y: 60, type: 'block', health: 2 },
              { id: 2, x: 80, y: 50, type: 'block', health: 1 }
            ]
          },
          3: {
            targets: [
              { id: 1, x: 70, y: 40, hit: false, health: 3, type: 'boss' },
              { id: 2, x: 60, y: 60, hit: false, health: 1, type: 'basic' },
              { id: 3, x: 80, y: 60, hit: false, health: 1, type: 'basic' },
              { id: 4, x: 75, y: 80, hit: false, health: 2, type: 'strong' }
            ],
            obstacles: [
              { id: 1, x: 65, y: 50, type: 'block', health: 2 },
              { id: 2, x: 75, y: 50, type: 'block', health: 2 },
              { id: 3, x: 85, y: 70, type: 'block', health: 1 }
            ]
          }
        };

        const config = levelConfigs[level] || levelConfigs[1];
        setTargets(config.targets);
        setObstacles(config.obstacles);
        setShotsLeft(5 + level);
        setScore(0);
      }, [level]);

      // Enhanced trajectory calculation
      const calculateTrajectory = (direction, power = 1) => {
        const points = [];
        const steps = 20;
        const gravity = 0.3;
        
        for (let i = 0; i < steps; i++) {
          const t = i / steps * 3;
          const x = 10 + direction.x * power * t * 100;
          const y = 50 + direction.y * power * t * 100 + gravity * t * t * 20;
          
          if (x > 100 || y > 100 || y < 0) break;
          points.push({ x, y });
        }
        
        setTrajectory(points);
      };

      // Enhanced shooting with power-ups
      const handleShoot = (direction) => {
        if (shotsLeft <= 0 || projectile) return;

        const power = selectedPowerUp === 'superSpeed' ? 1.5 : 1;
        const projectileCount = selectedPowerUp === 'multiShot' ? 3 : 1;
        
        // Use power-up
        if (selectedPowerUp) {
          setPowerUps(prev => ({ ...prev, [selectedPowerUp]: prev[selectedPowerUp] - 1 }));
          setSelectedPowerUp(null);
        }

        for (let i = 0; i < projectileCount; i++) {
          const spreadAngle = projectileCount > 1 ? (i - 1) * 0.2 : 0;
          const adjustedDirection = {
            x: direction.x + spreadAngle,
            y: direction.y + spreadAngle * 0.5
          };

          const newProjectile = {
            id: Math.random(),
            x: 10,
            y: 50,
            velocityX: adjustedDirection.x * 5 * power,
            velocityY: adjustedDirection.y * 5 * power,
            active: true,
            explosive: selectedPowerUp === 'explosive',
            trail: []
          };

          setProjectile(newProjectile);
          animateProjectile(newProjectile);
        }

        setShotsLeft(prev => prev - 1);
        setIsAiming(false);
        setTrajectory([]);
      };

      // Enhanced projectile animation with physics
      const animateProjectile = (initialProjectile) => {
        let currentProjectile = { ...initialProjectile };
        
        const animate = () => {
          setProjectile(prev => {
            if (!prev || !prev.active) return null;

            const newX = prev.x + prev.velocityX;
            const newY = prev.y + prev.velocityY + 0.3; // gravity
            const newTrail = [...prev.trail, { x: prev.x, y: prev.y }].slice(-8);

            // Check bounds
            if (newX > 100 || newY > 100 || newY < 0) {
              return null;
            }

            // Check target collisions
            let hitTarget = false;
            setTargets(prevTargets => {
              return prevTargets.map(target => {
                if (!target.hit && 
                    Math.abs(newX - target.x) < 8 && 
                    Math.abs(newY - target.y) < 8) {
                  
                  const newHealth = target.health - 1;
                  hitTarget = true;
                  
                  if (prev.explosive) {
                    createExplosion(target.x, target.y, 'explosion');
                    // Damage nearby targets
                    setTargets(prevAll => prevAll.map(t => {
                      const distance = Math.sqrt(Math.pow(t.x - target.x, 2) + Math.pow(t.y - target.y, 2));
                      if (distance < 15 && !t.hit) {
                        return { ...t, health: Math.max(0, t.health - 1), hit: t.health <= 1 };
                      }
                      return t;
                    }));
                  } else {
                    createExplosion(target.x, target.y, 'hit');
                  }
                  
                  const points = target.type === 'boss' ? 500 : target.type === 'strong' ? 200 : 100;
                  setScore(prevScore => prevScore + points);
                  
                  return { ...target, health: newHealth, hit: newHealth <= 0 };
                }
                return target;
              });
            });

            // Check obstacle collisions
            setObstacles(prevObstacles => {
              return prevObstacles.map(obstacle => {
                if (Math.abs(newX - obstacle.x) < 6 && 
                    Math.abs(newY - obstacle.y) < 6) {
                  
                  const newHealth = obstacle.health - 1;
                  createExplosion(obstacle.x, obstacle.y, 'break');
                  
                  if (newHealth <= 0) {
                    setScore(prevScore => prevScore + 50);
                  }
                  
                  return { ...obstacle, health: newHealth };
                }
                return obstacle;
              }).filter(obstacle => obstacle.health > 0);
            });

            if (hitTarget) {
              return null;
            }

            return {
              ...prev,
              x: newX,
              y: newY,
              velocityY: prev.velocityY + 0.3,
              trail: newTrail
            };
          });
        };

        const interval = setInterval(animate, 50);
        setTimeout(() => {
          clearInterval(interval);
          setProjectile(null);
        }, 4000);
      };

      // Check game end conditions
      useEffect(() => {
        const allTargetsDestroyed = targets.every(t => t.hit);
        if (allTargetsDestroyed && targets.length > 0) {
          setTimeout(() => {
            if (level < 3) {
              setLevel(prev => prev + 1);
            } else {
              onGameEnd('win', { score, level, avatar: selectedAvatar });
            }
          }, 1500);
        } else if (shotsLeft <= 0 && !projectile) {
          setTimeout(() => onGameEnd('lose', { score, level, avatar: selectedAvatar }), 1000);
        }
      }, [targets, shotsLeft, projectile, score, level, onGameEnd, selectedAvatar]);

      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 relative overflow-hidden`}>
          
          {/* Enhanced Header */}
          <motion.div 
            className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="text-6xl">{selectedAvatar?.emoji || '👧🏽'}</div>
              <div>
                <div className="text-3xl font-bold">{gameElements.bird} Element Shooter</div>
                <div className="text-lg text-gray-600">Level {level} - {selectedAvatar?.name || 'Emmy'}</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                <Star className="inline w-5 h-5 mr-2" />
                {score.toLocaleString()}
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                <Target className="inline w-5 h-5 mr-2" />
                {shotsLeft} shots
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Game Area */}
            <div className="lg:col-span-3">
              <motion.div 
                className="relative h-96 bg-gradient-to-b from-sky-200 to-green-200 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onMouseMove={(e) => {
                  if (isAiming) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.1) * 2;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                    const direction = { x: Math.max(0, x), y: -y };
                    setAimDirection(direction);
                    calculateTrajectory(direction);
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
                  className="absolute text-5xl cursor-pointer z-10"
                  style={{ left: '8%', top: '45%' }}
                  whileHover={{ scale: 1.1 }}
                  animate={isAiming ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0]
                  } : {}}
                  transition={{ repeat: isAiming ? Infinity : 0, duration: 0.8 }}
                >
                  {gameElements.bird}
                </motion.div>

                {/* Trajectory line */}
                {isAiming && trajectory.length > 0 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d={`M ${trajectory[0]?.x}% ${trajectory[0]?.y}% ${trajectory.map(point => `L ${point.x}% ${point.y}%`).join(' ')}`}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="3"
                      strokeDasharray="10,5"
                      fill="none"
                    />
                  </svg>
                )}

                {/* Projectile with trail */}
                {projectile && (
                  <>
                    {/* Trail */}
                    {projectile.trail.map((point, index) => (
                      <motion.div
                        key={index}
                        className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-50"
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          opacity: (index / projectile.trail.length) * 0.8
                        }}
                      />
                    ))}
                    
                    {/* Main projectile */}
                    <motion.div
                      className="absolute text-3xl z-10"
                      style={{
                        left: `${projectile.x}%`,
                        top: `${projectile.y}%`
                      }}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        rotate: projectile.explosive ? [0, 360] : 0
                      }}
                      transition={{ 
                        rotate: { duration: 0.5, repeat: projectile.explosive ? Infinity : 0 }
                      }}
                    >
                      {projectile.explosive ? '💥' : gameElements.bird}
                    </motion.div>
                  </>
                )}

                {/* Targets */}
                {targets.map(target => (
                  <motion.div
                    key={target.id}
                    className={`absolute text-4xl transition-all z-10 ${target.hit ? 'opacity-30 scale-50' : ''}`}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`
                    }}
                    animate={target.hit ? { 
                      scale: 0, 
                      rotate: 720,
                      opacity: 0 
                    } : {
                      scale: target.health < (target.type === 'boss' ? 3 : target.type === 'strong' ? 2 : 1) ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: target.hit ? 0 : 1.1 }}
                  >
                    <div className="relative">
                      {target.type === 'boss' ? '👑' : target.type === 'strong' ? '🛡️' : ''}
                      {gameElements.target}
                      {/* Health indicator */}
                      {target.health > 1 && !target.hit && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {target.health}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Obstacles */}
                {obstacles.map(obstacle => (
                  <motion.div
                    key={obstacle.id}
                    className="absolute text-3xl z-10"
                    style={{
                      left: `${obstacle.x}%`,
                      top: `${obstacle.y}%`
                    }}
                    animate={obstacle.health < 2 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <div className="relative">
                      {gameElements.obstacle}
                      {obstacle.health > 1 && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {obstacle.health}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Instructions */}
                {isAiming && (
                  <motion.div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-lg font-bold z-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    🎯 Aim and click to shoot!
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Power-ups and Controls */}
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
                      onClick={() => setSelectedPowerUp(type)}
                      disabled={count <= 0}
                      className={`w-full p-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-between ${
                        selectedPowerUp === type
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl scale-105'
                          : count > 0 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={count > 0 ? { scale: 1.05 } : {}}
                      whileTap={count > 0 ? { scale: 0.95 } : {}}
                    >
                      <span>
                        {type === 'multiShot' && '🎯 Multi-Shot'}
                        {type === 'explosive' && '💥 Explosive'}
                        {type === 'superSpeed' && '🌟 Super Speed'}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">{count}</span>
                    </motion.button>
                  ))}
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
                className="absolute pointer-events-none text-2xl z-20"
                style={{ 
                  left: `${particle.x}%`, 
                  top: `${particle.y}%`,
                  transform: `rotate(${particle.rotation}deg)`
                }}
                initial={{ opacity: 1, scale: particle.scale }}
                animate={{ 
                  opacity: 0, 
                  scale: particle.scale * 2,
                  x: particle.velocityX,
                  y: particle.velocityY,
                  rotate: particle.rotation + 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                {particle.type === 'explosion' && '💥'}
                {particle.type === 'hit' && '⭐'}
                {particle.type === 'break' && '💫'}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
    };

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
      },
      {
        id: 'word-builder',
        title: 'Word Builder',
        icon: '📝',
        description: 'Create words from letter circles - parents will love helping!',
        difficulty: 'Educational & Fun',
        players: 'Family Friendly',
        component: WordBuilderGame,
        minAge: 5,
        skills: ['Vocabulary', 'Spelling', 'Letter Recognition']
      },
      {
        id: 'element-shooter',
        title: 'Element Shooter',
        icon: '🎯',
        description: 'Physics-based shooting game with theme elements!',
        difficulty: 'Action Packed',
        players: 'Turn-based Competition',
        component: SnowballShooterGame,
        minAge: 6,
        skills: ['Hand-eye Coordination', 'Physics', 'Strategic Aiming']
             },
       {
         id: 'element-slice',
         title: 'Element Slice',
         icon: '⚔️',
         description: 'Fast-paced slicing action - slice theme elements, avoid bombs!',
         difficulty: 'Quick Reflexes',
         players: 'High Score Challenge',
         component: ElementSliceGame,
         minAge: 5,
         skills: ['Hand-eye Coordination', 'Quick Reflexes', 'Pattern Recognition']
       },
       {
         id: 'block-builder',
         title: 'Block Builder',
         icon: '🏗️',
         description: 'Build amazing structures together in this creative sandbox!',
         difficulty: 'Creative & Relaxing',
         players: 'Collaborative Building',
         component: BlockBuilderGame,
         minAge: 4,
         skills: ['Creativity', 'Spatial Thinking', 'Problem Solving']
       }
     ];

    // Enhanced Element Slice Game (Fruit Ninja Style)
    const ElementSliceGame = ({ theme, onGameEnd, selectedAvatar }) => {
      const [elements, setElements] = useState([]);
      const [score, setScore] = useState(0);
      const [timeLeft, setTimeLeft] = useState(60);
      const [combo, setCombo] = useState(0);
      const [comboTimer, setComboTimer] = useState(0);
      const [isSlicing, setIsSlicing] = useState(false);
      const [sliceTrail, setSliceTrail] = useState([]);
      const [particles, setParticles] = useState([]);
      const [level, setLevel] = useState(1);
      const [lives, setLives] = useState(3);
      const [powerUps, setPowerUps] = useState({ freeze: 2, doubleScore: 2, shield: 1 });
      const [activePowerUp, setActivePowerUp] = useState(null);
      
      const gameElements = theme.gameElements.fruitNinja;

      // Enhanced particle effects
      const createSliceEffect = (x, y, element, isCombo = false) => {
        const particleCount = isCombo ? 15 : 8;
        const newParticles = Array(particleCount).fill().map((_, i) => ({
          id: Math.random(),
          x: x + (Math.random() - 0.5) * 60,
          y: y + (Math.random() - 0.5) * 60,
          opacity: 1,
          scale: Math.random() * 0.8 + 0.5,
          rotation: Math.random() * 360,
          type: isCombo ? 'combo' : 'slice',
          element,
          velocityX: (Math.random() - 0.5) * 200,
          velocityY: (Math.random() - 0.5) * 200 - 50
        }));
        setParticles(prev => [...prev, ...newParticles]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 2000);
      };

      // Generate random element with enhanced properties
      const generateElement = () => {
        const elementType = gameElements[Math.floor(Math.random() * gameElements.length)];
        const isBomb = Math.random() < (0.08 + level * 0.02); // Increasing bomb chance
        const isGolden = Math.random() < 0.05; // 5% chance for golden element
        
        return {
          id: Math.random(),
          type: isBomb ? '💣' : elementType,
          x: Math.random() * 80 + 10,
          y: 110,
          velocityX: (Math.random() - 0.5) * 4,
          velocityY: -(Math.random() * 6 + 6 + level),
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 8,
          sliced: false,
          isBomb,
          isGolden,
          size: isBomb ? 1.2 : isGolden ? 1.5 : 1,
          points: isGolden ? 50 : 10
        };
      };

      // Spawn elements with increasing difficulty
      useEffect(() => {
        const spawnInterval = setInterval(() => {
          if (timeLeft > 0 && (!activePowerUp || activePowerUp !== 'freeze')) {
            const spawnCount = Math.random() < 0.3 ? 2 : 1; // 30% chance for double spawn
            for (let i = 0; i < spawnCount; i++) {
              setTimeout(() => {
                setElements(prev => [...prev, generateElement()]);
              }, i * 200);
            }
          }
        }, Math.max(800 - level * 100, 400)); // Faster spawning with level

        return () => clearInterval(spawnInterval);
      }, [timeLeft, level, activePowerUp]);

      // Update element positions with physics
      useEffect(() => {
        const updateInterval = setInterval(() => {
          if (activePowerUp === 'freeze') return;
          
          setElements(prev => 
            prev.map(element => ({
              ...element,
              x: element.x + element.velocityX,
              y: element.y + element.velocityY,
              velocityY: element.velocityY + 0.4, // gravity
              rotation: element.rotation + element.rotationSpeed
            })).filter(element => 
              element.y < 120 && element.x > -10 && element.x < 110 && !element.sliced
            )
          );
        }, 50);

        return () => clearInterval(updateInterval);
      }, [activePowerUp]);

      // Combo timer
      useEffect(() => {
        if (comboTimer > 0) {
          const timer = setTimeout(() => {
            setComboTimer(prev => prev - 1);
            if (comboTimer === 1) {
              setCombo(0);
            }
          }, 100);
          return () => clearTimeout(timer);
        }
      }, [comboTimer]);

      // Main timer
      useEffect(() => {
        if (timeLeft > 0) {
          const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
          return () => clearTimeout(timer);
        } else {
          onGameEnd('complete', { score, combo, level, avatar: selectedAvatar });
        }
      }, [timeLeft, score, combo, level, onGameEnd, selectedAvatar]);

      // Enhanced slice handling
      const handleSlice = (elementId, event) => {
        event.preventDefault();
        
        setElements(prev => 
          prev.map(element => {
            if (element.id === elementId && !element.sliced) {
              const rect = event.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0, width: 100, height: 100 };
              const x = event.clientX ? ((event.clientX - rect.left) / rect.width) * 100 : element.x;
              const y = event.clientY ? ((event.clientY - rect.top) / rect.height) * 100 : element.y;
              
              if (element.isBomb) {
                // Bomb hit - lose life or end game
                if (activePowerUp === 'shield') {
                  setActivePowerUp(null);
                  createSliceEffect(x, y, '🛡️');
                } else {
                  setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                      setTimeout(() => onGameEnd('lose', { score, combo, level, avatar: selectedAvatar }), 1000);
                    }
                    return newLives;
                  });
                  createSliceEffect(x, y, '💥');
                  setCombo(0);
                  setComboTimer(0);
                }
                return { ...element, sliced: true };
              } else {
                // Normal element sliced
                const comboMultiplier = Math.max(1, Math.floor(combo / 3) + 1);
                const powerMultiplier = activePowerUp === 'doubleScore' ? 2 : 1;
                const points = element.points * comboMultiplier * powerMultiplier;
                
                setScore(prevScore => prevScore + points);
                setCombo(prevCombo => prevCombo + 1);
                setComboTimer(20); // 2 seconds to continue combo
                
                createSliceEffect(x, y, element.type, combo > 5);
                
                return { ...element, sliced: true };
              }
            }
            return element;
          })
        );

        // Add slice trail effect
        const rect = event.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0, width: 100, height: 100 };
        const x = event.clientX ? ((event.clientX - rect.left) / rect.width) * 100 : 50;
        const y = event.clientY ? ((event.clientY - rect.top) / rect.height) * 100 : 50;
        
        setSliceTrail(prev => [...prev, { x, y, id: Math.random() }]);
        setTimeout(() => {
          setSliceTrail(prev => prev.filter(trail => trail.id !== Math.random()));
        }, 500);
      };

             // Power-up usage
       const activatePowerUp = (type) => {
        if (powerUps[type] <= 0 || activePowerUp) return;
        
        setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
        setActivePowerUp(type);
        
        if (type === 'freeze') {
          setTimeout(() => setActivePowerUp(null), 3000);
        } else if (type === 'doubleScore') {
          setTimeout(() => setActivePowerUp(null), 10000);
        } else if (type === 'shield') {
          setTimeout(() => setActivePowerUp(null), 15000);
        }
      };

      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 overflow-hidden relative`}>
          
          {/* Enhanced Header */}
          <motion.div 
            className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 relative z-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="text-6xl">{selectedAvatar?.emoji || '👧🏽'}</div>
              <div>
                <div className="text-3xl font-bold">⚔️ Element Slice</div>
                <div className="text-lg text-gray-600">Level {level} - {selectedAvatar?.name || 'Emmy'}</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                <Star className="inline w-5 h-5 mr-2" />
                {score.toLocaleString()}
              </div>
              <div className="bg-gradient-to-r from-red-400 to-pink-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                ⏰ {timeLeft}s
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                🔥 Combo x{combo}
              </div>
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                💝 Lives: {lives}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Game Area */}
            <div className="lg:col-span-3">
              <div 
                className={`relative h-96 bg-gradient-to-b from-sky-100 to-green-100 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl ${
                  activePowerUp === 'freeze' ? 'filter blur-sm' : ''
                }`}
                onMouseDown={() => setIsSlicing(true)}
                onMouseUp={() => setIsSlicing(false)}
                onMouseLeave={() => setIsSlicing(false)}
              >
                {/* Elements */}
                {elements.map(element => (
                  <motion.div
                    key={element.id}
                    className={`absolute cursor-pointer select-none z-10 ${
                      element.isBomb ? 'animate-pulse' : element.isGolden ? 'animate-bounce' : ''
                    }`}
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      transform: `rotate(${element.rotation}deg) scale(${element.size})`,
                      fontSize: `${3 * element.size}rem`
                    }}
                    onClick={(e) => handleSlice(element.id, e)}
                    whileHover={{ scale: element.size * 1.1 }}
                    animate={element.sliced ? { 
                      scale: [element.size, element.size * 2, 0],
                      rotate: element.rotation + 360,
                      opacity: [1, 1, 0]
                    } : {}}
                    transition={{ duration: 0.4 }}
                    initial={{ scale: 0 }}
                  >
                    <div className="relative">
                      {element.type}
                      {element.isGolden && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-yellow-400"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                      {element.points > 10 && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {element.points}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Slice Trails */}
                {sliceTrail.map(trail => (
                  <motion.div
                    key={trail.id}
                    className="absolute w-12 h-12 bg-yellow-400 rounded-full pointer-events-none z-20"
                    style={{
                      left: `${trail.x}%`,
                      top: `${trail.y}%`
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}

                {/* Combo Display */}
                <AnimatePresence>
                  {combo > 5 && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-yellow-400 pointer-events-none z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      key={combo}
                    >
                      <div className="text-center">
                        <div>INCREDIBLE!</div>
                        <div className="text-4xl">COMBO x{combo}!</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Power-up Indicators */}
                {activePowerUp && (
                  <motion.div
                    className="absolute top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {activePowerUp === 'freeze' && '🧊 FREEZE ACTIVE'}
                    {activePowerUp === 'doubleScore' && '✨ DOUBLE SCORE'}
                    {activePowerUp === 'shield' && '🛡️ SHIELD ACTIVE'}
                  </motion.div>
                )}

                {/* Freeze overlay */}
                {activePowerUp === 'freeze' && (
                  <motion.div
                    className="absolute inset-0 bg-blue-200 bg-opacity-30 flex items-center justify-center z-15"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-6xl text-blue-600">🧊 TIME FROZEN 🧊</div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Power-ups and Stats */}
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
                      disabled={count <= 0 || activePowerUp}
                      className={`w-full p-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-between ${
                        activePowerUp === type
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl scale-105'
                          : count > 0 && !activePowerUp
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={count > 0 && !activePowerUp ? { scale: 1.05 } : {}}
                      whileTap={count > 0 && !activePowerUp ? { scale: 0.95 } : {}}
                    >
                      <span>
                        {type === 'freeze' && '🧊 Freeze Time'}
                        {type === 'doubleScore' && '✨ Double Score'}
                        {type === 'shield' && '🛡️ Bomb Shield'}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">{count}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-center">📊 Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                    <span className="font-bold">Best Combo</span>
                    <span className="text-2xl font-bold text-yellow-600">x{combo}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                    <span className="font-bold">Level</span>
                    <span className="text-2xl font-bold text-blue-600">{level}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                    <span className="font-bold">Lives</span>
                    <span className="text-2xl font-bold text-red-600">❤️ {lives}</span>
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
                    onClick={() => onGameEnd('quit', { score, combo, level, avatar: selectedAvatar })}
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

          {/* Instructions */}
          <motion.div 
            className="text-center mt-6 relative z-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="text-xl font-bold text-white mb-2">🎯 Click on elements to slice them! Avoid the bombs! 💣</p>
            <p className="text-lg text-gray-200">Build combos by slicing multiple elements quickly! Golden elements give bonus points! ⭐</p>
          </motion.div>

          {/* Particle Effects */}
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none text-3xl z-20"
                style={{ 
                  left: `${particle.x}%`, 
                  top: `${particle.y}%`,
                  transform: `rotate(${particle.rotation}deg)`
                }}
                initial={{ opacity: 1, scale: particle.scale }}
                animate={{ 
                  opacity: 0, 
                  scale: particle.scale * 2,
                  x: particle.velocityX,
                  y: particle.velocityY,
                  rotate: particle.rotation + 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                {particle.type === 'combo' && '🌟'}
                {particle.type === 'slice' && '✨'}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
         };

    // Enhanced Block Builder Game (Minecraft Style)
    const BlockBuilderGame = ({ theme, onGameEnd, selectedAvatar }) => {
      const [grid, setGrid] = useState([]);
      const [selectedBlock, setSelectedBlock] = useState(null);
      const [inventory, setInventory] = useState({});
      const [mode, setMode] = useState('build'); // build, destroy, paint
      const [project, setProject] = useState('house');
      const [score, setScore] = useState(0);
      const [structures, setStructures] = useState([]);
      const [showGrid, setShowGrid] = useState(true);
      const [particles, setParticles] = useState([]);
      const [savedProjects, setSavedProjects] = useState([]);
      const [buildingGuide, setBuildingGuide] = useState(false);
      
      const GRID_SIZE = 16;
      const blocks = theme.gameElements.minecraft.blocks;

      // Enhanced particle effects for building
      const createBuildEffect = (x, y, blockType) => {
        const newParticles = Array(6).fill().map((_, i) => ({
          id: Math.random(),
          x: x * (100 / GRID_SIZE) + (Math.random() - 0.5) * 20,
          y: y * (100 / GRID_SIZE) + (Math.random() - 0.5) * 20,
          opacity: 1,
          scale: Math.random() * 0.5 + 0.5,
          rotation: Math.random() * 360,
          type: 'build',
          block: blockType,
          velocityX: (Math.random() - 0.5) * 100,
          velocityY: (Math.random() - 0.5) * 100 - 30
        }));
        setParticles(prev => [...prev, ...newParticles]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 1500);
      };

      // Initialize game with enhanced inventory
      useEffect(() => {
        const newGrid = Array(GRID_SIZE).fill().map((_, row) => 
          Array(GRID_SIZE).fill().map((_, col) => ({
            id: `${row}-${col}`,
            block: null,
            elevation: 0,
            color: null
          }))
        );
        setGrid(newGrid);
        
        const newInventory = {};
        blocks.forEach(block => {
          newInventory[block] = 50; // Start with 50 of each block
        });
        setInventory(newInventory);
        setSelectedBlock(blocks[0]);
      }, [blocks]);

      // Enhanced cell interaction
      const handleCellClick = (row, col) => {
        const cell = grid[row][col];
        
        if (mode === 'build' && selectedBlock && inventory[selectedBlock] > 0) {
          // Place block with elevation
          const newGrid = grid.map(r => [...r]);
          if (!newGrid[row][col].block) {
            newGrid[row][col] = {
              ...newGrid[row][col],
              block: selectedBlock,
              elevation: 0
            };
            setGrid(newGrid);
            setInventory(prev => ({ ...prev, [selectedBlock]: prev[selectedBlock] - 1 }));
            setScore(prev => prev + 10);
            createBuildEffect(col, row, selectedBlock);
          } else {
            // Stack blocks (increase elevation)
            newGrid[row][col].elevation = Math.min(newGrid[row][col].elevation + 1, 3);
            setGrid(newGrid);
            setInventory(prev => ({ ...prev, [selectedBlock]: prev[selectedBlock] - 1 }));
            setScore(prev => prev + 5);
            createBuildEffect(col, row, selectedBlock);
          }
        } else if (mode === 'destroy') {
          // Remove block
          const newGrid = grid.map(r => [...r]);
          if (newGrid[row][col].block) {
            const removedBlock = newGrid[row][col].block;
            if (newGrid[row][col].elevation > 0) {
              newGrid[row][col].elevation -= 1;
            } else {
              newGrid[row][col] = {
                ...newGrid[row][col],
                block: null,
                elevation: 0
              };
            }
            setGrid(newGrid);
            setInventory(prev => ({ ...prev, [removedBlock]: prev[removedBlock] + 1 }));
            setScore(prev => prev + 5);
            createBuildEffect(col, row, '💥');
          }
        } else if (mode === 'paint' && cell.block) {
          // Change block type
          const newGrid = grid.map(r => [...r]);
          if (selectedBlock && inventory[selectedBlock] > 0) {
            const oldBlock = newGrid[row][col].block;
            newGrid[row][col].block = selectedBlock;
            setGrid(newGrid);
            setInventory(prev => ({ 
              ...prev, 
              [selectedBlock]: prev[selectedBlock] - 1,
              [oldBlock]: prev[oldBlock] + 1
            }));
          }
        }
      };

      // Project templates with enhanced structures
      const projectTemplates = {
        house: {
          name: '🏠 Cozy House',
          description: 'Build a simple house with walls, roof, and door',
          blocks: [
            { row: 12, col: 6, block: blocks[0] }, { row: 12, col: 7, block: blocks[0] }, 
            { row: 12, col: 8, block: blocks[0] }, { row: 12, col: 9, block: blocks[0] },
            { row: 11, col: 6, block: blocks[1] }, { row: 11, col: 9, block: blocks[1] },
            { row: 10, col: 6, block: blocks[1] }, { row: 10, col: 9, block: blocks[1] },
            { row: 9, col: 6, block: blocks[2] }, { row: 9, col: 7, block: blocks[2] }, 
            { row: 9, col: 8, block: blocks[2] }, { row: 9, col: 9, block: blocks[2] }
          ]
        },
        castle: {
          name: '🏰 Magic Castle',
          description: 'Build a majestic castle with towers',
          blocks: [
            // Base walls
            { row: 14, col: 4, block: blocks[0] }, { row: 14, col: 5, block: blocks[0] },
            { row: 14, col: 10, block: blocks[0] }, { row: 14, col: 11, block: blocks[0] },
            // Towers
            { row: 13, col: 4, block: blocks[1] }, { row: 12, col: 4, block: blocks[1] },
            { row: 13, col: 11, block: blocks[1] }, { row: 12, col: 11, block: blocks[1] },
            // Central structure
            { row: 13, col: 7, block: blocks[2] }, { row: 13, col: 8, block: blocks[2] },
            { row: 12, col: 7, block: blocks[2] }, { row: 12, col: 8, block: blocks[2] }
          ]
        },
        garden: {
          name: '🌸 Flower Garden',
          description: 'Create a beautiful garden layout',
          blocks: [
            { row: 13, col: 6, block: blocks[3] }, { row: 13, col: 9, block: blocks[3] },
            { row: 12, col: 7, block: blocks[4] }, { row: 12, col: 8, block: blocks[4] },
            { row: 11, col: 6, block: blocks[2] }, { row: 11, col: 9, block: blocks[2] },
            { row: 10, col: 7, block: blocks[1] }, { row: 10, col: 8, block: blocks[1] }
          ]
        }
      };

      // Enhanced auto-build with animation
      const autoBuildProject = () => {
        const template = projectTemplates[project];
        if (template) {
          let blockIndex = 0;
          const buildInterval = setInterval(() => {
            if (blockIndex >= template.blocks.length) {
              clearInterval(buildInterval);
              setScore(prev => prev + 200);
              return;
            }

            const { row, col, block } = template.blocks[blockIndex];
            if (inventory[block] > 0) {
              const newGrid = grid.map(r => [...r]);
              newGrid[row][col] = {
                ...newGrid[row][col],
                block: block,
                elevation: 0
              };
              setGrid(newGrid);
              setInventory(prev => ({ ...prev, [block]: prev[block] - 1 }));
              createBuildEffect(col, row, block);
            }
            blockIndex++;
          }, 300);
        }
      };

      // Save current project
      const saveProject = () => {
        const projectData = {
          id: Date.now(),
          name: `${selectedAvatar?.name || 'Player'}'s Creation`,
          grid: grid,
          score: score,
          blocks: inventory
        };
        setSavedProjects(prev => [...prev, projectData]);
      };

      // Clear all blocks
      const clearAll = () => {
        const newGrid = Array(GRID_SIZE).fill().map((_, row) => 
          Array(GRID_SIZE).fill().map((_, col) => ({
            id: `${row}-${col}`,
            block: null,
            elevation: 0,
            color: null
          }))
        );
        setGrid(newGrid);
        
        // Restore inventory
        const newInventory = {};
        blocks.forEach(block => {
          newInventory[block] = 50;
        });
        setInventory(newInventory);
        setScore(0);
      };

      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.colors.secondary} p-4 relative overflow-hidden`}>
          
          {/* Enhanced Header */}
          <motion.div 
            className="flex justify-between items-center mb-6 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="text-6xl">{selectedAvatar?.emoji || '👧🏽'}</div>
              <div>
                <div className="text-3xl font-bold">🏗️ Block Builder</div>
                <div className="text-lg text-gray-600">{selectedAvatar?.name || 'Emmy'}'s Workshop</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                <Star className="inline w-5 h-5 mr-2" />
                {score.toLocaleString()}
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg">
                🏗️ {project}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Building Grid */}
            <div className="lg:col-span-3">
              <motion.div 
                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="grid grid-cols-16 gap-1 max-w-2xl mx-auto">
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square rounded border cursor-pointer transition-all relative overflow-hidden
                          ${cell.block 
                            ? 'bg-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                            : showGrid 
                              ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' 
                              : 'bg-transparent'
                          }
                          ${mode === 'destroy' ? 'hover:bg-red-200' : 
                            mode === 'paint' ? 'hover:bg-blue-200' : 'hover:bg-green-200'}
                        `}
                        style={{
                          transform: `translateY(-${cell.elevation * 2}px)`,
                          zIndex: cell.elevation + 1
                        }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={cell.block ? {
                          boxShadow: cell.elevation > 0 ? 
                            `0 ${cell.elevation * 4}px ${cell.elevation * 8}px rgba(0,0,0,0.3)` : 
                            "0 2px 4px rgba(0,0,0,0.1)"
                        } : {}}
                      >
                        {cell.block && (
                          <div className="w-full h-full flex items-center justify-center text-xs sm:text-sm lg:text-base">
                            {cell.block}
                          </div>
                        )}
                        {cell.elevation > 0 && (
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                            {cell.elevation}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Grid Controls */}
                <div className="flex justify-center mt-4 gap-2">
                  <motion.button
                    onClick={() => setShowGrid(!showGrid)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showGrid ? '🔲 Hide Grid' : '⬜ Show Grid'}
                  </motion.button>
                  <motion.button
                    onClick={() => setBuildingGuide(!buildingGuide)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {buildingGuide ? '📖 Hide Guide' : '💡 Show Guide'}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Controls Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mode Selection */}
              <motion.div 
                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-center">🛠️ Build Mode</h3>
                <div className="space-y-3">
                  {[
                    { mode: 'build', icon: '🔨', label: 'Build', color: 'from-green-500 to-emerald-600' },
                    { mode: 'destroy', icon: '💥', label: 'Destroy', color: 'from-red-500 to-pink-600' },
                    { mode: 'paint', icon: '🎨', label: 'Paint', color: 'from-blue-500 to-indigo-600' }
                  ].map(({ mode: modeType, icon, label, color }) => (
                    <motion.button
                      key={modeType}
                      onClick={() => setMode(modeType)}
                      className={`w-full p-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                        mode === modeType 
                          ? `bg-gradient-to-r ${color} text-white scale-105 shadow-xl` 
                          : 'bg-white/50 hover:bg-white/70 shadow-lg hover:shadow-xl'
                      }`}
                      whileHover={{ scale: mode === modeType ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Block Inventory */}
              <motion.div 
                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-center">📦 Blocks</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {blocks.map(block => (
                    <motion.button
                      key={block}
                      onClick={() => setSelectedBlock(block)}
                      className={`w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-between ${
                        selectedBlock === block 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-xl' 
                          : 'bg-white/50 hover:bg-white/70 shadow-lg hover:shadow-xl'
                      }`}
                      whileHover={{ scale: selectedBlock === block ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{block}</span>
                        <span className="text-lg">{block === blocks[0] ? 'Stone' : block === blocks[1] ? 'Wood' : block === blocks[2] ? 'Brick' : 'Special'}</span>
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-lg font-bold">{inventory[block]}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Project Templates */}
              <motion.div 
                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-center">🏗️ Projects</h3>
                <div className="space-y-3">
                  <select 
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/70 border border-white/50 font-bold"
                  >
                    {Object.entries(projectTemplates).map(([key, template]) => (
                      <option key={key} value={key}>{template.name}</option>
                    ))}
                  </select>
                  
                  {buildingGuide && (
                    <motion.div
                      className="bg-blue-100 p-4 rounded-xl"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <h4 className="font-bold text-blue-800 mb-2">Building Guide:</h4>
                      <p className="text-blue-700 text-sm">{projectTemplates[project]?.description}</p>
                    </motion.div>
                  )}
                  
                  <motion.button
                    onClick={autoBuildProject}
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl font-bold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✨ Auto Build
                  </motion.button>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-3">
                  <motion.button
                    onClick={saveProject}
                    className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💾 Save Creation
                  </motion.button>
                  
                  <motion.button
                    onClick={clearAll}
                    className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️ Clear All
                  </motion.button>
                  
                  <motion.button
                    onClick={() => onGameEnd('save', { score, grid, projects: savedProjects, avatar: selectedAvatar })}
                    className="w-full p-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🏠 Return to Hub
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
                className="absolute pointer-events-none text-2xl z-20"
                style={{ 
                  left: `${particle.x}%`, 
                  top: `${particle.y}%`,
                  transform: `rotate(${particle.rotation}deg)`
                }}
                initial={{ opacity: 1, scale: particle.scale }}
                animate={{ 
                  opacity: 0, 
                  scale: particle.scale * 2,
                  x: particle.velocityX,
                  y: particle.velocityY,
                  rotate: particle.rotation + 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                {particle.type === 'build' && '✨'}
                {particle.block === '💥' && '💥'}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Instructions */}
          <motion.div 
            className="text-center mt-6 relative z-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="text-xl font-bold text-white mb-2">🏗️ Click on grid cells to build! Use different modes to create amazing structures! 🎨</p>
            <p className="text-lg text-gray-200">Stack blocks to create 3D structures! Save your creations to share with family! 💝</p>
          </motion.div>
        </div>
      );
    };

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
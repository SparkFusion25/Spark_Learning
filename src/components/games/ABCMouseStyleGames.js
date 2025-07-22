import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Star, Heart, Trophy, Home, RotateCcw, Volume2, VolumeX,
  BookOpen, Calculator, Palette, Music, Globe, Award
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

// Age-based learning levels similar to ABC Mouse
const LEARNING_LEVELS = {
  preschool: {
    id: 'preschool',
    name: 'Preschool',
    ageRange: '2-4 years',
    color: 'from-pink-400 to-red-400',
    character: '🐻',
    description: 'Perfect for little learners taking their first steps!',
    skills: ['Letters', 'Numbers 1-10', 'Colors', 'Shapes', 'Sounds']
  },
  prek: {
    id: 'prek',
    name: 'Pre-K',
    ageRange: '4-5 years',
    color: 'from-purple-400 to-pink-400',
    character: '🦄',
    description: 'Getting ready for kindergarten with fun activities!',
    skills: ['Alphabet', 'Numbers 1-20', 'Patterns', 'Rhyming', 'Fine Motor']
  },
  kindergarten: {
    id: 'kindergarten',
    name: 'Kindergarten',
    ageRange: '5-6 years',
    color: 'from-blue-400 to-purple-400',
    character: '🐸',
    description: 'Building strong foundations for reading and math!',
    skills: ['Reading Readiness', 'Addition/Subtraction', 'Writing', 'Science', 'Social Studies']
  },
  grade1: {
    id: 'grade1',
    name: '1st Grade',
    ageRange: '6-7 years',
    color: 'from-green-400 to-blue-400',
    character: '🐨',
    description: 'First grade adventures in learning!',
    skills: ['Reading Fluency', 'Math Facts', 'Writing Stories', 'Life Science', 'Geography']
  },
  grade2: {
    id: 'grade2',
    name: '2nd Grade',
    ageRange: '7-8 years',
    color: 'from-yellow-400 to-green-400',
    character: '🦉',
    description: 'Building confidence and expanding knowledge!',
    skills: ['Complex Reading', 'Two-digit Math', 'Research Skills', 'Earth Science', 'History']
  },
  grade3: {
    id: 'grade3',
    name: '3rd Grade',
    ageRange: '8-9 years',
    color: 'from-orange-400 to-yellow-400',
    character: '🦅',
    description: 'Developing critical thinking and problem-solving!',
    skills: ['Reading Comprehension', 'Multiplication', 'Creative Writing', 'Physical Science', 'Culture']
  },
  grade4: {
    id: 'grade4',
    name: '4th Grade',
    ageRange: '9-10 years',
    color: 'from-red-400 to-orange-400',
    character: '🦁',
    description: 'Advanced learning with exciting challenges!',
    skills: ['Advanced Reading', 'Division/Fractions', 'Research Projects', 'Chemistry', 'World Studies']
  }
};

// Subject categories similar to ABC Mouse
const SUBJECT_CATEGORIES = {
  reading: {
    icon: '📚',
    name: 'Reading & Language Arts',
    color: 'from-blue-500 to-purple-600',
    description: 'Letters, words, stories, and writing'
  },
  math: {
    icon: '🔢',
    name: 'Math & Logic',
    color: 'from-green-500 to-teal-600',
    description: 'Numbers, counting, shapes, and problem solving'
  },
  science: {
    icon: '🔬',
    name: 'Science & Nature',
    color: 'from-purple-500 to-pink-600',
    description: 'Explore the world around us'
  },
  art: {
    icon: '🎨',
    name: 'Art & Creativity',
    color: 'from-pink-500 to-red-600',
    description: 'Drawing, coloring, and creative expression'
  },
  music: {
    icon: '🎵',
    name: 'Music & Movement',
    color: 'from-yellow-500 to-orange-600',
    description: 'Songs, rhythms, and musical fun'
  },
  social: {
    icon: '🌍',
    name: 'Social Studies',
    color: 'from-teal-500 to-blue-600',
    description: 'Community, cultures, and the world'
  }
};

// Letter Recognition Game (Preschool/Pre-K)
const LetterRecognitionGame = ({ level, onGameEnd }) => {
  const [currentLetter, setCurrentLetter] = useState('A');
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    setCurrentLetter(letter);
    
    // Create options with correct answer and 3 distractors
    const distractors = alphabet.filter(l => l !== letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [letter, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    
    // Use younger American voice
    audioManager.speak(`Find the letter ${letter}`, 'child');
  };

  const handleAnswer = (selectedLetter) => {
    if (selectedLetter === currentLetter) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setGameProgress(prev => prev + 1);
      audioManager.playSound('correct');
      audioManager.speak('Great job! That\'s right!', 'child');
      
      setTimeout(() => {
        if (gameProgress >= 9) {
          onGameEnd({ score: score + 10, completed: true });
        } else {
          generateNewQuestion();
        }
      }, 1500);
    } else {
      setStreak(0);
      audioManager.playSound('wrong');
      audioManager.speak(`Oops! Try again. We're looking for ${currentLetter}`, 'child');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.color} p-4`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">📚 Letter Recognition</h2>
            <div className="text-white text-lg">
              Score: ⭐ {score} | Progress: {gameProgress}/10
            </div>
          </div>
          
          <div className="text-6xl">{level.character}</div>
        </div>

        {/* Game Area */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 text-center">
          
          {/* Current Letter Display */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Find this letter:</h3>
            <motion.div 
              className="text-9xl font-bold text-blue-600 mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {currentLetter}
            </motion.div>
          </div>

          {/* Letter Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {options.map((letter, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(letter)}
                className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl text-6xl font-bold text-white shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {letter}
              </motion.button>
            ))}
          </div>

          {/* Encouragement */}
          <div className="mt-8">
            <p className="text-xl text-gray-700 font-medium">
              {streak > 0 ? `Amazing! ${streak} in a row! 🎉` : 'You can do it! 💪'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Number Counting Game (Preschool/Pre-K)
const NumberCountingGame = ({ level, onGameEnd }) => {
  const [targetNumber, setTargetNumber] = useState(1);
  const [items, setItems] = useState([]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  
  const emojis = ['🍎', '🎈', '⭐', '🌸', '🍪', '🐸', '🦋', '🌟'];
  const maxNumber = level.id === 'preschool' ? 5 : 10;

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const number = Math.floor(Math.random() * maxNumber) + 1;
    setTargetNumber(number);
    
    // Create items to count
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const newItems = Array(number).fill(emoji);
    setItems(newItems);
    
    // Create number options
    const distractors = [];
    while (distractors.length < 3) {
      const distractor = Math.floor(Math.random() * maxNumber) + 1;
      if (distractor !== number && !distractors.includes(distractor)) {
        distractors.push(distractor);
      }
    }
    
    const allOptions = [number, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    
    audioManager.speak(`Count the items and pick the right number!`, 'child');
  };

  const handleAnswer = (selectedNumber) => {
    if (selectedNumber === targetNumber) {
      setScore(prev => prev + 15);
      setGameProgress(prev => prev + 1);
      audioManager.playSound('correct');
      audioManager.speak(`Perfect! There are ${targetNumber} items!`, 'child');
      
      setTimeout(() => {
        if (gameProgress >= 7) {
          onGameEnd({ score: score + 15, completed: true });
        } else {
          generateNewQuestion();
        }
      }, 2000);
    } else {
      audioManager.playSound('wrong');
      audioManager.speak(`Try counting again! Look carefully at each item.`, 'child');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.color} p-4`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">🔢 Counting Fun</h2>
            <div className="text-white text-lg">
              Score: ⭐ {score} | Progress: {gameProgress}/8
            </div>
          </div>
          
          <div className="text-6xl">{level.character}</div>
        </div>

        {/* Game Area */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8">
          
          {/* Instructions */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Count the items below:</h3>
          </div>

          {/* Items to Count */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 p-6 bg-blue-50 rounded-2xl">
            {items.map((item, index) => (
              <motion.div
                key={index}
                className="text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {item}
              </motion.div>
            ))}
          </div>

          {/* Number Options */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-800 mb-6">How many do you see?</h4>
            <div className="flex justify-center gap-6">
              {options.map((number, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(number)}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl text-3xl font-bold text-white shadow-xl hover:shadow-2xl transition-all"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1 }}
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shape Matching Game (Preschool/Pre-K)
const ShapeMatchingGame = ({ level, onGameEnd }) => {
  const [targetShape, setTargetShape] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);

  const shapes = [
    { name: 'circle', emoji: '🔵', color: 'blue' },
    { name: 'square', emoji: '🟦', color: 'blue' },
    { name: 'triangle', emoji: '🔺', color: 'red' },
    { name: 'heart', emoji: '❤️', color: 'red' },
    { name: 'star', emoji: '⭐', color: 'yellow' },
    { name: 'diamond', emoji: '💎', color: 'purple' }
  ];

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(shape);
    
    // Create options
    const distractors = shapes.filter(s => s.name !== shape.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [shape, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    
    audioManager.speak(`Find the ${shape.name}!`, 'child');
  };

  const handleAnswer = (selectedShape) => {
    if (selectedShape.name === targetShape.name) {
      setScore(prev => prev + 12);
      setGameProgress(prev => prev + 1);
      audioManager.playSound('correct');
      audioManager.speak(`Wonderful! That's a ${targetShape.name}!`, 'child');
      
      setTimeout(() => {
        if (gameProgress >= 8) {
          onGameEnd({ score: score + 12, completed: true });
        } else {
          generateNewQuestion();
        }
      }, 1500);
    } else {
      audioManager.playSound('wrong');
      audioManager.speak(`Try again! Look for the ${targetShape.name}.`, 'child');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.color} p-4`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">🔷 Shape Explorer</h2>
            <div className="text-white text-lg">
              Score: ⭐ {score} | Progress: {gameProgress}/9
            </div>
          </div>
          
          <div className="text-6xl">{level.character}</div>
        </div>

        {/* Game Area */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 text-center">
          
          {/* Target Shape */}
          {targetShape && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Find the {targetShape.name}:</h3>
              <motion.div 
                className="text-8xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {targetShape.emoji}
              </motion.div>
              <p className="text-lg text-gray-600 font-medium">
                A {targetShape.name} is {targetShape.color}!
              </p>
            </div>
          )}

          {/* Shape Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {options.map((shape, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(shape)}
                className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl text-6xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {shape.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Addition Game (Kindergarten+)
const SimpleAdditionGame = ({ level, onGameEnd }) => {
  const [problem, setProblem] = useState({ num1: 1, num2: 1, answer: 2 });
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  
  const maxNumber = level.id === 'kindergarten' ? 5 : level.id === 'grade1' ? 10 : 20;

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    const num1 = Math.floor(Math.random() * maxNumber) + 1;
    const num2 = Math.floor(Math.random() * maxNumber) + 1;
    const answer = num1 + num2;
    
    setProblem({ num1, num2, answer });
    
    // Create options
    const distractors = [];
    while (distractors.length < 3) {
      const distractor = answer + (Math.floor(Math.random() * 6) - 3);
      if (distractor !== answer && distractor > 0 && !distractors.includes(distractor)) {
        distractors.push(distractor);
      }
    }
    
    const allOptions = [answer, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    
    audioManager.speak(`What is ${num1} plus ${num2}?`, 'child');
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === problem.answer) {
      setScore(prev => prev + 20);
      setGameProgress(prev => prev + 1);
      audioManager.playSound('correct');
      audioManager.speak(`Excellent! ${problem.num1} plus ${problem.num2} equals ${problem.answer}!`, 'child');
      
      setTimeout(() => {
        if (gameProgress >= 6) {
          onGameEnd({ score: score + 20, completed: true });
        } else {
          generateNewProblem();
        }
      }, 2000);
    } else {
      audioManager.playSound('wrong');
      audioManager.speak(`Not quite! Try counting ${problem.num1} plus ${problem.num2} again.`, 'child');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.color} p-4`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => onGameEnd({ score, completed: true })}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">➕ Addition Adventure</h2>
            <div className="text-white text-lg">
              Score: ⭐ {score} | Progress: {gameProgress}/7
            </div>
          </div>
          
          <div className="text-6xl">{level.character}</div>
        </div>

        {/* Game Area */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 text-center">
          
          {/* Math Problem */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Solve this problem:</h3>
            <div className="text-8xl font-bold text-blue-600 mb-8">
              {problem.num1} + {problem.num2} = ?
            </div>
            
            {/* Visual Aid with Dots */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {Array(problem.num1).fill().map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  ))}
                </div>
                <p className="text-gray-600 font-bold">{problem.num1}</p>
              </div>
              
              <div className="text-6xl text-gray-400 self-center">+</div>
              
              <div className="text-center">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {Array(problem.num2).fill().map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-green-500 rounded-full"></div>
                  ))}
                </div>
                <p className="text-gray-600 font-bold">{problem.num2}</p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex justify-center gap-6">
            {options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl text-3xl font-bold text-white shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Level Selection Screen
const LevelSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/world-select')}
            className="absolute left-4 top-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-6xl font-bold text-white mb-4">🎓 Learning Levels</h1>
          <p className="text-2xl text-white/90">Choose your perfect learning adventure!</p>
        </div>

        {/* Learning Levels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.values(LEARNING_LEVELS).map((level, index) => (
            <motion.div
              key={level.id}
              className={`bg-gradient-to-br ${level.color} rounded-3xl p-6 text-white cursor-pointer hover:shadow-2xl transition-all group`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/abc-games/${level.id}`)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">{level.character}</div>
                <h3 className="text-2xl font-bold mb-2">{level.name}</h3>
                <p className="text-lg opacity-90 mb-4">{level.ageRange}</p>
                <p className="text-sm opacity-80 mb-6">{level.description}</p>
                
                {/* Skills Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold opacity-70">YOU'LL LEARN:</p>
                  <div className="flex flex-wrap gap-1">
                    {level.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {level.skills.length > 3 && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        +{level.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 bg-white/20 py-3 px-6 rounded-2xl font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  Start Learning! 🚀
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Subject Selection for a Level
const SubjectSelectionScreen = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = LEARNING_LEVELS[levelId];

  if (!level) {
    return <div>Level not found</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.color} p-4`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/abc-games')}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-2">{level.character} {level.name}</h1>
            <p className="text-xl text-white/90">{level.description}</p>
          </div>
          
          <div className="w-12"></div>
        </div>

        {/* Subject Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(SUBJECT_CATEGORIES).map(([subjectId, subject], index) => (
            <motion.div
              key={subjectId}
              className={`bg-gradient-to-br ${subject.color} rounded-3xl p-8 text-white cursor-pointer hover:shadow-2xl transition-all group`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/abc-games/${levelId}/${subjectId}`)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">{subject.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{subject.name}</h3>
                <p className="text-lg opacity-90 mb-6">{subject.description}</p>
                
                <motion.div 
                  className="bg-white/20 py-3 px-6 rounded-2xl font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Now! ✨
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Game Selection for Subject
const GameSelectionScreen = () => {
  const { levelId, subjectId } = useParams();
  const navigate = useNavigate();
  const level = LEARNING_LEVELS[levelId];
  const subject = SUBJECT_CATEGORIES[subjectId];

  if (!level || !subject) {
    return <div>Not found</div>;
  }

  // Define games based on level and subject
  const getGamesForLevelAndSubject = (levelId, subjectId) => {
    const games = [];
    
    if (subjectId === 'reading') {
      if (['preschool', 'prek'].includes(levelId)) {
        games.push({
          id: 'letter-recognition',
          title: 'Letter Recognition',
          description: 'Learn and identify letters of the alphabet',
          component: LetterRecognitionGame,
          icon: '🔤'
        });
      }
    }
    
    if (subjectId === 'math') {
      if (['preschool', 'prek'].includes(levelId)) {
        games.push({
          id: 'number-counting',
          title: 'Number Counting',
          description: 'Count objects and learn numbers',
          component: NumberCountingGame,
          icon: '🔢'
        });
        games.push({
          id: 'shape-matching',
          title: 'Shape Matching',
          description: 'Identify and match different shapes',
          component: ShapeMatchingGame,
          icon: '🔷'
        });
      }
      if (['kindergarten', 'grade1', 'grade2'].includes(levelId)) {
        games.push({
          id: 'simple-addition',
          title: 'Addition Fun',
          description: 'Learn to add numbers together',
          component: SimpleAdditionGame,
          icon: '➕'
        });
      }
    }
    
    return games;
  };

  const games = getGamesForLevelAndSubject(levelId, subjectId);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.color} p-4`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(`/abc-games/${levelId}`)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {subject.icon} {subject.name}
            </h1>
            <p className="text-lg text-white/90">{level.name} • {subject.description}</p>
          </div>
          
          <div className="text-6xl">{level.character}</div>
        </div>

        {/* Games Grid */}
        {games.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/abc-games/${levelId}/${subjectId}/${game.id}`)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{game.description}</p>
                  
                  <motion.div 
                    className={`bg-gradient-to-r ${subject.color} text-white py-3 px-6 rounded-2xl font-bold`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Play Now! 🎮
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/90 rounded-3xl p-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">More Games Coming Soon!</h3>
              <p className="text-lg text-gray-600 mb-6">
                We're working hard to bring you amazing {subject.name.toLowerCase()} games for {level.name}!
              </p>
              <button
                onClick={() => navigate(`/abc-games/${levelId}`)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold"
              >
                Try Another Subject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Game Player Component
const GamePlayer = () => {
  const { levelId, subjectId, gameId } = useParams();
  const navigate = useNavigate();
  const level = LEARNING_LEVELS[levelId];
  
  const handleGameEnd = (result) => {
    // Show results and return to game selection
    audioManager.speak(`Great job! You scored ${result.score} points!`, 'child');
    setTimeout(() => {
      navigate(`/abc-games/${levelId}/${subjectId}`);
    }, 3000);
  };

  if (!level) {
    return <div>Level not found</div>;
  }

  // Determine which game component to render
  let GameComponent = null;
  if (gameId === 'letter-recognition') GameComponent = LetterRecognitionGame;
  else if (gameId === 'number-counting') GameComponent = NumberCountingGame;
  else if (gameId === 'shape-matching') GameComponent = ShapeMatchingGame;
  else if (gameId === 'simple-addition') GameComponent = SimpleAdditionGame;

  if (!GameComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Game not found!</h2>
          <button
            onClick={() => navigate(`/abc-games/${levelId}/${subjectId}`)}
            className="bg-white/20 px-6 py-3 rounded-2xl font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <GameComponent level={level} onGameEnd={handleGameEnd} />;
};

// Main ABC Mouse Style Games Component
const ABCMouseStyleGames = () => {
  const { levelId, subjectId, gameId } = useParams();

  if (gameId) {
    return <GamePlayer />;
  } else if (subjectId) {
    return <GameSelectionScreen />;
  } else if (levelId) {
    return <SubjectSelectionScreen />;
  } else {
    return <LevelSelectionScreen />;
  }
};

export default ABCMouseStyleGames;
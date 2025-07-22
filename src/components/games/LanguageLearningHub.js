import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Volume2, VolumeX, Mic, MicOff, Home, Star, Trophy,
  ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Flag
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

// Language Learning System
const SUPPORTED_LANGUAGES = {
  spanish: {
    id: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español',
    character: '🦜',
    characterName: 'Pablo the Parrot',
    color: 'from-red-500 via-yellow-500 to-red-500',
    lessons: [
      {
        id: 'greetings',
        title: 'Greetings',
        emoji: '👋',
        words: [
          { english: 'Hello', spanish: 'Hola', pronunciation: 'OH-lah' },
          { english: 'Good morning', spanish: 'Buenos días', pronunciation: 'BWAY-nos DEE-ahs' },
          { english: 'Good afternoon', spanish: 'Buenas tardes', pronunciation: 'BWAY-nas TAR-des' },
          { english: 'Goodbye', spanish: 'Adiós', pronunciation: 'ah-DYOHS' },
          { english: 'Please', spanish: 'Por favor', pronunciation: 'por fah-VOR' },
          { english: 'Thank you', spanish: 'Gracias', pronunciation: 'GRAH-see-ahs' }
        ]
      },
      {
        id: 'numbers',
        title: 'Numbers 1-10',
        emoji: '🔢',
        words: [
          { english: 'One', spanish: 'Uno', pronunciation: 'OO-no' },
          { english: 'Two', spanish: 'Dos', pronunciation: 'dohs' },
          { english: 'Three', spanish: 'Tres', pronunciation: 'trehs' },
          { english: 'Four', spanish: 'Cuatro', pronunciation: 'KWAH-tro' },
          { english: 'Five', spanish: 'Cinco', pronunciation: 'SEEN-ko' },
          { english: 'Six', spanish: 'Seis', pronunciation: 'says' }
        ]
      },
      {
        id: 'colors',
        title: 'Colors',
        emoji: '🎨',
        words: [
          { english: 'Red', spanish: 'Rojo', pronunciation: 'ROH-ho' },
          { english: 'Blue', spanish: 'Azul', pronunciation: 'ah-SOOL' },
          { english: 'Yellow', spanish: 'Amarillo', pronunciation: 'ah-mah-REE-yo' },
          { english: 'Green', spanish: 'Verde', pronunciation: 'VER-deh' },
          { english: 'Orange', spanish: 'Naranja', pronunciation: 'nah-RAHN-ha' },
          { english: 'Purple', spanish: 'Morado', pronunciation: 'mo-RAH-do' }
        ]
      },
      {
        id: 'family',
        title: 'Family',
        emoji: '👨‍👩‍👧‍👦',
        words: [
          { english: 'Mother', spanish: 'Madre', pronunciation: 'MAH-dreh' },
          { english: 'Father', spanish: 'Padre', pronunciation: 'PAH-dreh' },
          { english: 'Sister', spanish: 'Hermana', pronunciation: 'er-MAH-nah' },
          { english: 'Brother', spanish: 'Hermano', pronunciation: 'er-MAH-no' },
          { english: 'Grandmother', spanish: 'Abuela', pronunciation: 'ah-BWAY-lah' },
          { english: 'Grandfather', spanish: 'Abuelo', pronunciation: 'ah-BWAY-lo' }
        ]
      }
    ]
  },
  french: {
    id: 'french',
    name: 'French',
    flag: '🇫🇷',
    nativeName: 'Français',
    character: '🐸',
    characterName: 'François the Frog',
    color: 'from-blue-500 via-white to-red-500',
    lessons: [
      {
        id: 'greetings',
        title: 'Greetings',
        emoji: '👋',
        words: [
          { english: 'Hello', french: 'Bonjour', pronunciation: 'bon-ZHOOR' },
          { english: 'Good evening', french: 'Bonsoir', pronunciation: 'bon-SWAHR' },
          { english: 'Goodbye', french: 'Au revoir', pronunciation: 'oh ruh-VWAHR' },
          { english: 'Please', french: 'S\'il vous plaît', pronunciation: 'see voo PLAY' },
          { english: 'Thank you', french: 'Merci', pronunciation: 'mer-SEE' },
          { english: 'You\'re welcome', french: 'De rien', pronunciation: 'duh ree-AHN' }
        ]
      }
    ]
  }
};

// Language Selection Screen
const LanguageSelector = ({ onLanguageSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4">
      
      {/* Header */}
      <motion.div 
        className="flex items-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={onBack}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-white">🌍 Choose a Language</h1>
          <p className="text-xl text-white/90">Pick a language to start learning!</p>
        </div>
      </motion.div>

      {/* Language Options */}
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          {Object.values(SUPPORTED_LANGUAGES).map((language, index) => (
            <motion.button
              key={language.id}
              onClick={() => onLanguageSelect(language)}
              className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/30 transition-all group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-8xl mb-4 group-hover:animate-bounce">{language.flag}</div>
              <h3 className="text-3xl font-bold text-white mb-2">{language.name}</h3>
              <p className="text-xl text-white/80 mb-4">{language.nativeName}</p>
              <div className="text-6xl mb-4">{language.character}</div>
              <p className="text-lg text-white/90 mb-6">Learn with {language.characterName}!</p>
              
              <div className={`bg-gradient-to-r ${language.color} text-white py-3 px-6 rounded-2xl font-bold`}>
                Start Learning! 🚀
              </div>
            </motion.button>
          ))}
        </div>

        {/* Coming Soon Languages */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">🔜 Coming Soon!</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Mandarin', flag: '🇨🇳', native: '中文' },
              { name: 'German', flag: '🇩🇪', native: 'Deutsch' },
              { name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
              { name: 'Portuguese', flag: '🇵🇹', native: 'Português' }
            ].map(lang => (
              <div key={lang.name} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center opacity-60">
                <div className="text-4xl mb-2">{lang.flag}</div>
                <h4 className="text-lg font-bold text-white">{lang.name}</h4>
                <p className="text-sm text-white/80">{lang.native}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Lesson Selection Screen
const LessonSelector = ({ language, onLessonSelect, onBack }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${language.color} p-4`}>
      
      {/* Header */}
      <motion.div 
        className="flex items-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={onBack}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-white">
            {language.flag} {language.name} Lessons
          </h1>
          <p className="text-xl text-white/90">Choose a lesson to practice!</p>
        </div>
      </motion.div>

      {/* Character Welcome */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-8xl mb-4">{language.character}</div>
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">¡Hola! I'm {language.characterName}</h2>
          <p className="text-lg text-white/90">Let's learn {language.name} together!</p>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {language.lessons.map((lesson, index) => (
            <motion.button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson)}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-left hover:bg-white/30 transition-all group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4 group-hover:animate-bounce">{lesson.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{lesson.title}</h3>
                  <p className="text-white/80">{lesson.words.length} words</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {lesson.words.slice(0, 3).map((word, i) => (
                  <div key={i} className="bg-white/20 rounded-lg p-2 text-center">
                    <p className="text-sm font-medium text-white">{word[language.id]}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white text-gray-800 py-2 px-4 rounded-lg font-bold text-center">
                Practice Now! →
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Interactive Language Game
const LanguageGame = ({ language, lesson, onComplete, onBack }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [gameMode, setGameMode] = useState('learn'); // learn, practice, quiz
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showPronunciation, setShowPronunciation] = useState(true);
  const [completedWords, setCompletedWords] = useState([]);
  
  const recognition = useRef(null);
  const currentWord = lesson.words[currentWordIndex];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = language.id === 'spanish' ? 'es-ES' : 'fr-FR';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleSpeechResult(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const speakWord = (word, languageCode = 'default') => {
    // Use browser's speech synthesis for different languages
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = languageCode === 'spanish' ? 'es-ES' : languageCode === 'french' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeechResult = (transcript) => {
    const targetWord = currentWord[language.id].toLowerCase();
    const similarity = calculateSimilarity(transcript, targetWord);
    
    if (similarity > 0.7) {
      setScore(prev => prev + 10);
      setFeedback('¡Excelente! Perfect pronunciation!');
      setCompletedWords(prev => [...prev, currentWordIndex]);
      audioManager.playSound('correct');
      
      setTimeout(() => {
        moveToNextWord();
      }, 2000);
    } else {
      setFeedback('Good try! Listen again and repeat.');
      audioManager.playSound('wrong');
    }
    
    setAttempts(prev => prev + 1);
  };

  const calculateSimilarity = (str1, str2) => {
    // Simple similarity calculation
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const moveToNextWord = () => {
    if (currentWordIndex < lesson.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setFeedback('');
    } else {
      // Lesson complete
      onComplete({ score, attempts, wordsLearned: lesson.words.length });
    }
  };

  const moveToPreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      setFeedback('');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${language.color} p-4`}>
      
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
          <h2 className="text-2xl font-bold text-white">{lesson.emoji} {lesson.title}</h2>
          <div className="flex items-center gap-4 text-white">
            <span>⭐ {score}</span>
            <span>{currentWordIndex + 1}/{lesson.words.length}</span>
            <span>{language.character} {language.characterName}</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowPronunciation(!showPronunciation)}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <Volume2 className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      {/* Character */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-8xl mb-4">{language.character}</div>
        {feedback && (
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-xl font-bold text-white">{feedback}</p>
          </div>
        )}
      </motion.div>

      {/* Word Learning Interface */}
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
          
          {/* Current Word Display */}
          <div className="text-center mb-8">
            <h3 className="text-6xl font-bold text-white mb-4">
              {currentWord[language.id]}
            </h3>
            <p className="text-3xl text-white/80 mb-4">{currentWord.english}</p>
            {showPronunciation && (
              <p className="text-2xl text-white/60 mb-6">/{currentWord.pronunciation}/</p>
            )}
            
            {/* Audio Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                onClick={() => speakWord(currentWord[language.id], language.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Volume2 className="w-5 h-5" />
                Hear {language.name}
              </motion.button>
              
              <motion.button
                onClick={() => speakWord(currentWord.english, 'en-US')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Volume2 className="w-5 h-5" />
                Hear English
              </motion.button>
            </div>

            {/* Voice Practice */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold text-white mb-4">🎤 Try saying it!</h4>
              <motion.button
                onClick={startListening}
                disabled={isListening}
                className={`px-8 py-4 rounded-2xl font-bold text-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg'
                }`}
                whileHover={{ scale: isListening ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? {
                  boxShadow: ['0 0 20px rgba(239, 68, 68, 0.5)', '0 0 40px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.5)']
                } : {}}
                transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
              >
                {isListening ? (
                  <>
                    <MicOff className="inline w-6 h-6 mr-3" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="inline w-6 h-6 mr-3" />
                    Record Pronunciation
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <motion.button
              onClick={moveToPreviousWord}
              disabled={currentWordIndex === 0}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center gap-2"
              whileHover={{ scale: currentWordIndex === 0 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </motion.button>

            {/* Progress */}
            <div className="text-center">
              <div className="flex gap-2 mb-2">
                {lesson.words.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      index === currentWordIndex 
                        ? 'bg-yellow-400' 
                        : completedWords.includes(index)
                          ? 'bg-green-400'
                          : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white font-medium">
                Word {currentWordIndex + 1} of {lesson.words.length}
              </p>
            </div>

            <motion.button
              onClick={moveToNextWord}
              disabled={currentWordIndex === lesson.words.length - 1}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center gap-2"
              whileHover={{ scale: currentWordIndex === lesson.words.length - 1 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="max-w-md mx-auto mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Lesson Progress</span>
            <span className="text-white font-medium">{Math.round(((currentWordIndex + 1) / lesson.words.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentWordIndex + 1) / lesson.words.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main Language Learning Hub Component
const LanguageLearningHub = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState('selector'); // selector, lessons, game
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setCurrentScreen('lessons');
    audioManager.playSound('click');
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentScreen('game');
    audioManager.playSound('click');
  };

  const handleGameComplete = (result) => {
    // Handle lesson completion
    audioManager.playSound('achievement');
    audioManager.speak(`¡Fantástico! You learned ${result.wordsLearned} words!`, 'default');
    
    // Return to lessons
    setCurrentScreen('lessons');
    setSelectedLesson(null);
  };

  const handleBack = () => {
    if (currentScreen === 'game') {
      setCurrentScreen('lessons');
      setSelectedLesson(null);
    } else if (currentScreen === 'lessons') {
      setCurrentScreen('selector');
      setSelectedLanguage(null);
    } else {
      navigate('/world-select');
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    audioManager.setEnabled(!isAudioEnabled);
  };

  return (
    <div className="relative">
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

      {/* Render Current Screen */}
      <AnimatePresence mode="wait">
        {currentScreen === 'selector' && (
          <LanguageSelector 
            key="selector"
            onLanguageSelect={handleLanguageSelect} 
            onBack={handleBack}
          />
        )}
        
        {currentScreen === 'lessons' && selectedLanguage && (
          <LessonSelector 
            key="lessons"
            language={selectedLanguage} 
            onLessonSelect={handleLessonSelect} 
            onBack={handleBack}
          />
        )}
        
        {currentScreen === 'game' && selectedLanguage && selectedLesson && (
          <LanguageGame 
            key="game"
            language={selectedLanguage} 
            lesson={selectedLesson} 
            onComplete={handleGameComplete} 
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageLearningHub;
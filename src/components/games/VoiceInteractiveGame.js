import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, VolumeX, Mic, MicOff, Home, Star, Trophy, 
  MessageCircle, Play, Pause, RotateCcw
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

const VoiceInteractiveGame = ({ worldId = 'frozen' }) => {
  const navigate = useNavigate();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState('elsa');
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, completed
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  
  // Speech recognition setup
  const recognition = useRef(null);
  const synthesisBusy = useRef(false);

  // Character configurations
  const characters = {
    elsa: {
      name: 'Elsa',
      emoji: '👸🏼',
      voiceId: 'elsa',
      background: 'from-blue-200 via-blue-300 to-indigo-400',
      theme: 'Ice Magic Learning',
      elements: ['❄️', '⭐', '💎', '🏰', '🌨️']
    },
    spiderman: {
      name: 'Spider-Man',
      emoji: '🕷️',
      voiceId: 'spiderman',
      background: 'from-red-300 via-blue-300 to-red-400',
      theme: 'Super Hero Learning',
      elements: ['🕷️', '🕸️', '🏢', '⚡', '💥']
    },
    moana: {
      name: 'Moana',
      emoji: '🌺',
      voiceId: 'moana',
      background: 'from-teal-200 via-blue-300 to-cyan-400',
      theme: 'Ocean Adventure Learning',
      elements: ['🌊', '🐚', '🏝️', '🐠', '⛵']
    }
  };

  const character = characters[currentCharacter];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        handleUserSpeech(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  // Start the game with character introduction
  useEffect(() => {
    if (gameState === 'welcome') {
      startWelcomeSequence();
    }
  }, [gameState, currentCharacter]);

  const startWelcomeSequence = async () => {
    const welcomeMessage = audioManager.getCharacterPhrase(character.voiceId, 'welcome');
    await speakWithSubtitles(welcomeMessage);
    
    setTimeout(() => {
      const introMessage = `I'm ${character.name}, and I'll be your learning companion today! We're going to have so much fun learning together. Are you ready to start?`;
      speakWithSubtitles(introMessage);
    }, 1000);

    setTimeout(() => {
      setGameState('playing');
      generateNewChallenge();
    }, 4000);
  };

  const speakWithSubtitles = async (text) => {
    setIsCharacterSpeaking(true);
    setCurrentSubtitle(text);
    
    try {
      await audioManager.speak(text, character.voiceId, 'high');
    } catch (error) {
      console.error('Speech error:', error);
    }
    
    setIsCharacterSpeaking(false);
    setTimeout(() => setCurrentSubtitle(''), 2000);
  };

  const generateNewChallenge = () => {
    const challenges = [
      {
        type: 'counting',
        question: `Can you count these ${character.elements[0]} for me?`,
        items: generateCountingItems(),
        expectedAnswer: null // Will be set based on items
      },
      {
        type: 'colors',
        question: 'What color is this beautiful item?',
        item: character.elements[Math.floor(Math.random() * character.elements.length)],
        expectedAnswers: ['blue', 'red', 'green', 'yellow', 'purple', 'orange']
      },
      {
        type: 'shapes',
        question: 'Can you tell me what shape this is?',
        shape: ['circle', 'square', 'triangle', 'star'][Math.floor(Math.random() * 4)],
        expectedAnswers: ['circle', 'square', 'triangle', 'star']
      },
      {
        type: 'letters',
        question: 'What letter does this word start with?',
        word: ['Magic', 'Hero', 'Ocean', 'Adventure'][Math.floor(Math.random() * 4)],
        expectedAnswers: ['m', 'h', 'o', 'a']
      }
    ];

    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    if (challenge.type === 'counting') {
      challenge.expectedAnswer = challenge.items.length;
    }
    
    setCurrentChallenge(challenge);
    
    setTimeout(() => {
      const contextualQuestion = audioManager.getCharacterPhrase(
        character.voiceId, 
        'counting', 
        { item: challenge.type === 'counting' ? character.elements[0] : 'items' }
      );
      speakWithSubtitles(challenge.question || contextualQuestion);
    }, 500);
  };

  const generateCountingItems = () => {
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 items
    return Array(count).fill().map((_, i) => ({
      id: i,
      element: character.elements[Math.floor(Math.random() * character.elements.length)],
      x: Math.random() * 70 + 10,
      y: Math.random() * 60 + 20,
      delay: i * 0.2
    }));
  };

  const handleUserSpeech = (transcript) => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    if (!currentChallenge) return;

    let isCorrect = false;
    
    switch (currentChallenge.type) {
      case 'counting':
        const spokenNumber = extractNumber(normalizedTranscript);
        isCorrect = spokenNumber === currentChallenge.expectedAnswer;
        break;
      
      case 'colors':
      case 'shapes':
      case 'letters':
        isCorrect = currentChallenge.expectedAnswers.some(answer => 
          normalizedTranscript.includes(answer.toLowerCase())
        );
        break;
    }

    handleAnswer(isCorrect, normalizedTranscript);
  };

  const extractNumber = (text) => {
    const numberWords = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };
    
    // Check for number words
    for (const [word, num] of Object.entries(numberWords)) {
      if (text.includes(word)) return num;
    }
    
    // Check for digits
    const digitMatch = text.match(/\d+/);
    return digitMatch ? parseInt(digitMatch[0]) : null;
  };

  const handleAnswer = async (isCorrect, userText) => {
    addToConversation('user', userText);
    
    audioManager.playSound(isCorrect ? 'correct' : 'wrong');
    
    let responseMessage;
    if (isCorrect) {
      responseMessage = audioManager.getCharacterPhrase(character.voiceId, 'correct');
      setScore(prev => prev + 10);
      
      setTimeout(() => {
        if (level < 5) {
          setLevel(prev => prev + 1);
          generateNewChallenge();
        } else {
          setGameState('completed');
          speakWithSubtitles("Congratulations! You've completed all the challenges! You're an amazing learner!");
        }
      }, 3000);
    } else {
      responseMessage = audioManager.getCharacterPhrase(character.voiceId, 'incorrect');
      
      setTimeout(() => {
        speakWithSubtitles("Let's try that again! Take your time.");
      }, 2000);
    }
    
    addToConversation('character', responseMessage);
    await speakWithSubtitles(responseMessage);
  };

  const addToConversation = (speaker, message) => {
    setConversation(prev => [...prev, { speaker, message, timestamp: Date.now() }]);
  };

  const startListening = () => {
    if (recognition.current && !isListening && !isCharacterSpeaking) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    audioManager.setEnabled(!isAudioEnabled);
  };

  const restartGame = () => {
    setGameState('welcome');
    setLevel(1);
    setScore(0);
    setConversation([]);
    setCurrentChallenge(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${character.background} p-4 relative overflow-hidden`}>
      
      {/* Audio Controls */}
      <motion.div 
        className="fixed top-4 right-4 z-20 flex gap-3"
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
        
        <motion.button
          onClick={() => navigate('/world-select')}
          className="p-3 rounded-full bg-gray-600 text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Character Avatar */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-8xl mb-4"
            animate={isCharacterSpeaking ? {
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: isCharacterSpeaking ? Infinity : 0 }}
          >
            {character.emoji}
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
          <p className="text-xl text-white/90">{character.theme}</p>
        </div>
      </motion.div>

      {/* Subtitles */}
      <AnimatePresence>
        {showSubtitles && currentSubtitle && (
          <motion.div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-black/80 text-white px-6 py-4 rounded-2xl max-w-4xl text-center">
              <p className="text-lg font-medium">{currentSubtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        
        {/* Stats */}
        <motion.div 
          className="flex justify-center gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">⭐ {score}</div>
            <div className="text-white/80">Score</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">🎯 {level}</div>
            <div className="text-white/80">Level</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
            <div className="text-2xl font-bold text-white">🎤 Voice</div>
            <div className="text-white/80">Interactive</div>
          </div>
        </motion.div>

        {/* Challenge Area */}
        {currentChallenge && gameState === 'playing' && (
          <motion.div 
            className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 mb-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              {currentChallenge.question}
            </h2>
            
            {/* Visual Elements */}
            {currentChallenge.type === 'counting' && (
              <div className="relative h-64 mb-6">
                {currentChallenge.items.map(item => (
                  <motion.div
                    key={item.id}
                    className="absolute text-5xl"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: item.delay, type: "spring" }}
                  >
                    {item.element}
                  </motion.div>
                ))}
              </div>
            )}
            
            {currentChallenge.type === 'shapes' && (
              <div className="mb-6">
                <div className="text-8xl">
                  {currentChallenge.shape === 'circle' && '⭕'}
                  {currentChallenge.shape === 'square' && '🟦'}
                  {currentChallenge.shape === 'triangle' && '🔺'}
                  {currentChallenge.shape === 'star' && '⭐'}
                </div>
              </div>
            )}
            
            {currentChallenge.type === 'letters' && (
              <div className="mb-6">
                <div className="text-6xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 inline-block">
                  {currentChallenge.word}
                </div>
              </div>
            )}
            
            {currentChallenge.type === 'colors' && (
              <div className="mb-6">
                <div className="text-8xl">
                  {currentChallenge.item}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Voice Controls */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.button
            onClick={isListening ? stopListening : startListening}
            disabled={isCharacterSpeaking}
            className={`px-8 py-6 rounded-full text-2xl font-bold shadow-2xl transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : isCharacterSpeaking
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            whileHover={{ scale: isCharacterSpeaking ? 1 : 1.05 }}
            whileTap={{ scale: isCharacterSpeaking ? 1 : 0.95 }}
            animate={isListening ? {
              boxShadow: ['0 0 20px rgba(239, 68, 68, 0.5)', '0 0 40px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.5)']
            } : {}}
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          >
            {isListening ? (
              <>
                <MicOff className="inline w-8 h-8 mr-3" />
                Stop Listening
              </>
            ) : isCharacterSpeaking ? (
              <>
                <MessageCircle className="inline w-8 h-8 mr-3" />
                {character.name} is speaking...
              </>
            ) : (
              <>
                <Mic className="inline w-8 h-8 mr-3" />
                Speak Your Answer
              </>
            )}
          </motion.button>
          
          {userResponse && (
            <motion.div
              className="mt-4 bg-white/20 backdrop-blur-lg rounded-2xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-white font-medium">You said: "{userResponse}"</p>
            </motion.div>
          )}
        </motion.div>

        {/* Game Completed */}
        {gameState === 'completed' && (
          <motion.div 
            className="text-center bg-white/30 backdrop-blur-lg rounded-3xl p-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4">Congratulations!</h2>
            <p className="text-2xl text-white/90 mb-8">
              You completed all challenges with {character.name}!
            </p>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="inline w-6 h-6 mr-2" />
                Play Again
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/world-select')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="inline w-6 h-6 mr-2" />
                Choose New World
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <motion.div 
            className="mt-8 bg-white/20 backdrop-blur-lg rounded-3xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">💬 Conversation</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {conversation.slice(-5).map((msg, index) => (
                <div key={index} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    msg.speaker === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/30 text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-4 py-2 rounded-xl text-sm">
          🎤 Click the microphone and speak your answer aloud!
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceInteractiveGame;
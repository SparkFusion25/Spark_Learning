// Enhanced Audio Manager for Rocketter Learning Platform
// Handles sound effects, background music, and text-to-speech voice interactions

class AudioManager {
  constructor() {
    this.isEnabled = true;
    this.volume = 0.7;
    this.musicVolume = 0.3;
    this.voiceVolume = 0.8;
    this.currentMusic = null;
    this.soundEffects = new Map();
    this.voiceQueue = [];
    this.isVoicePlaying = false;
    this.speechSynthesis = window.speechSynthesis;
    this.voices = [];
    
    // Initialize voices when they're loaded
    this.loadVoices();
    
    // Listen for voices changed event
    if (this.speechSynthesis) {
      this.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  // Load available voices for text-to-speech
  loadVoices() {
    if (this.speechSynthesis) {
      this.voices = this.speechSynthesis.getVoices();
      console.log('Available voices:', this.voices.length);
    }
  }

  // Get the best voice for a character
  getCharacterVoice(character) {
    if (!this.voices.length) return null;

    const voicePreferences = {
      'elsa': { 
        preferred: ['Google UK English Female', 'Microsoft Zira', 'Karen'], 
        pitch: 1.2, 
        rate: 0.9,
        lang: 'en-US'
      },
      'spiderman': { 
        preferred: ['Google US English Male', 'Microsoft David', 'Alex'], 
        pitch: 1.0, 
        rate: 1.1,
        lang: 'en-US'
      },
      'moana': { 
        preferred: ['Google UK English Female', 'Microsoft Zira', 'Samantha'], 
        pitch: 1.1, 
        rate: 1.0,
        lang: 'en-US'
      },
      'default': { 
        preferred: ['Google US English Female', 'Microsoft Zira'], 
        pitch: 1.1, 
        rate: 0.95,
        lang: 'en-US'
      }
    };

    const prefs = voicePreferences[character] || voicePreferences.default;
    
    // Try to find preferred voice
    for (const preferredName of prefs.preferred) {
      const voice = this.voices.find(v => v.name.includes(preferredName));
      if (voice) return { voice, ...prefs };
    }
    
    // Fallback to any English voice
    const englishVoice = this.voices.find(v => v.lang.startsWith('en'));
    return englishVoice ? { voice: englishVoice, ...prefs } : null;
  }

  // Speak text with character voice
  async speak(text, character = 'default', priority = 'normal') {
    if (!this.isEnabled || !this.speechSynthesis) return;

    const voiceConfig = this.getCharacterVoice(character);
    if (!voiceConfig) {
      console.warn('No suitable voice found for character:', character);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceConfig.voice;
    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;
    utterance.volume = this.voiceVolume;
    utterance.lang = voiceConfig.lang;

    return new Promise((resolve) => {
      utterance.onend = () => {
        this.isVoicePlaying = false;
        this.processVoiceQueue();
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        this.isVoicePlaying = false;
        this.processVoiceQueue();
        resolve();
      };

      if (priority === 'high' || !this.isVoicePlaying) {
        if (priority === 'high') {
          this.speechSynthesis.cancel(); // Stop current speech for high priority
        }
        this.isVoicePlaying = true;
        this.speechSynthesis.speak(utterance);
      } else {
        // Queue the speech
        this.voiceQueue.push(utterance);
      }
    });
  }

  // Process queued voice messages
  processVoiceQueue() {
    if (this.voiceQueue.length > 0 && !this.isVoicePlaying) {
      const nextUtterance = this.voiceQueue.shift();
      this.isVoicePlaying = true;
      this.speechSynthesis.speak(nextUtterance);
    }
  }

  // Play sound effect
  playSound(soundName, volume = 1.0) {
    if (!this.isEnabled) return;

    // For demo purposes, we'll use the Web Audio API to generate simple tones
    // In production, you would load actual audio files
    const sounds = {
      // Success sounds
      'correct': { frequency: 523.25, duration: 0.3, type: 'sine' }, // C5
      'excellent': { frequency: 659.25, duration: 0.5, type: 'sine' }, // E5
      'perfect': { frequency: 783.99, duration: 0.7, type: 'sine' }, // G5
      
      // Feedback sounds
      'click': { frequency: 800, duration: 0.1, type: 'square' },
      'hover': { frequency: 400, duration: 0.05, type: 'sine' },
      'wrong': { frequency: 220, duration: 0.3, type: 'sawtooth' },
      
      // Game-specific sounds
      'snowflake': { frequency: 1046.50, duration: 0.2, type: 'sine' }, // C6
      'web-swing': { frequency: 300, duration: 0.4, type: 'square' },
      'ocean-wave': { frequency: 150, duration: 0.6, type: 'sine' },
      
      // UI sounds
      'level-up': { frequency: [523.25, 659.25, 783.99], duration: 0.8, type: 'sine' },
      'achievement': { frequency: [523.25, 659.25, 783.99, 1046.50], duration: 1.0, type: 'sine' }
    };

    const soundConfig = sounds[soundName];
    if (!soundConfig) return;

    this.generateTone(soundConfig, volume * this.volume);
  }

  // Generate synthetic sound using Web Audio API
  generateTone(config, volume) {
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume;

    if (Array.isArray(config.frequency)) {
      // Play chord/sequence
      config.frequency.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.value = freq;
        oscillator.type = config.type;
        
        const startTime = audioContext.currentTime + (index * 0.1);
        oscillator.start(startTime);
        oscillator.stop(startTime + (config.duration / config.frequency.length));
      });
    } else {
      // Play single tone
      const oscillator = audioContext.createOscillator();
      oscillator.connect(gainNode);
      oscillator.frequency.value = config.frequency;
      oscillator.type = config.type;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + config.duration);
    }
  }

  // Play background music (placeholder for actual music files)
  playBackgroundMusic(theme) {
    if (!this.isEnabled) return;
    
    // In production, you would load and play actual music files
    // For now, we'll just log the action
    console.log(`Playing background music for theme: ${theme}`);
    
    // Example implementation would load audio files:
    // const musicFiles = {
    //   'frozen': '/audio/music/frozen-theme.mp3',
    //   'spiderman': '/audio/music/spiderman-theme.mp3',
    //   'moana': '/audio/music/moana-theme.mp3'
    // };
    // this.loadAndPlayMusic(musicFiles[theme]);
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic = null;
    }
  }

  // Set audio settings
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
      this.speechSynthesis?.cancel();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setVoiceVolume(volume) {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
  }

  // Get character-specific phrases for different situations
  getCharacterPhrase(character, situation, context = {}) {
    const phrases = {
      elsa: {
        welcome: [
          "Welcome to my magical ice kingdom! ❄️",
          "Let's learn together in the land of eternal winter!",
          "The cold never bothered me anyway! Ready to learn?"
        ],
        correct: [
          "Fantastic! You've got ice magic in your brain! ❄️",
          "Perfectly frozen! You're doing amazing!",
          "Let it go, let it flow! Excellent work!",
          "Cool as ice! You're a natural learner!"
        ],
        incorrect: [
          "That's okay! Even snowflakes take time to form perfectly.",
          "Don't worry, we all make mistakes in the learning process!",
          "Try again! The magic is still within you! ❄️"
        ],
        encouragement: [
          "Believe in yourself! You have the power!",
          "Some people are worth melting for... and you're learning!",
          "Let your inner magic shine through!"
        ],
        levelUp: [
          "Amazing! You've unlocked a new level of ice magic!",
          "Incredible! Your powers are growing stronger!",
          "Level up! You're becoming a true ice queen!"
        ],
        counting: [
          `Can you help me count these magical ${context.item || 'snowflakes'}?`,
          `Let's count together! How many ${context.item || 'ice crystals'} do you see?`,
          `Use your magic to count the ${context.item || 'frozen treasures'}!`
        ]
      },
      spiderman: {
        welcome: [
          "Hey there, true believer! Ready to swing into learning?",
          "Your friendly neighborhood Spider-Man is here to help!",
          "With great power comes great responsibility... to learn!"
        ],
        correct: [
          "Amazing! You've got spider-sense for learning! 🕷️",
          "Spectacular! Your brain power is incredible!",
          "Web-solutely fantastic! You're a real hero!",
          "Thwip! That's the sound of success!"
        ],
        incorrect: [
          "Even Spider-Man misses the target sometimes!",
          "Don't worry! Every hero learns from their mistakes!",
          "Try again, web-head! You've got this!"
        ],
        encouragement: [
          "Remember, anyone can wear the mask! You can do this!",
          "Your spider-sense is tingling with knowledge!",
          "Keep going! Heroes never give up!"
        ],
        levelUp: [
          "Excelsior! You've leveled up your super powers!",
          "Amazing! You're becoming a real superhero learner!",
          "Web-tastic! You've unlocked new abilities!"
        ],
        counting: [
          `Can you count these ${context.item || 'web symbols'} for me?`,
          `Help me swing through the city by counting ${context.item || 'buildings'}!`,
          `Use your spider powers to count ${context.item || 'villains'}!`
        ]
      },
      moana: {
        welcome: [
          "Aloha! Welcome to our ocean adventure! 🌊",
          "The ocean has chosen you... for learning!",
          "Set sail with me on this educational journey!"
        ],
        correct: [
          "Wonderful! The ocean smiles upon your wisdom! 🌊",
          "Boat-iful work! You're navigating perfectly!",
          "Amazing! You know the way!",
          "The ocean chose wisely! Excellent job!"
        ],
        incorrect: [
          "That's okay! Even the best navigators need to adjust course!",
          "The ocean will guide you back to the right path!",
          "Try again, brave voyager! I believe in you!"
        ],
        encouragement: [
          "Listen to your heart! It knows the way!",
          "The ocean is calling... and so is knowledge!",
          "You have the heart of Te Fiti within you!"
        ],
        levelUp: [
          "Incredible! You've discovered a new island of knowledge!",
          "Amazing! Your navigation skills are growing!",
          "You've found your way to the next level!"
        ],
        counting: [
          `Help me count these beautiful ${context.item || 'sea creatures'}!`,
          `Can you count the ${context.item || 'shells'} along the shore?`,
          `Let's explore together! Count the ${context.item || 'islands'} we find!`
        ]
      }
    };

    const characterPhrases = phrases[character] || phrases.elsa;
    const situationPhrases = characterPhrases[situation] || characterPhrases.encouragement;
    
    return situationPhrases[Math.floor(Math.random() * situationPhrases.length)];
  }

  // Cleanup resources
  destroy() {
    this.stopBackgroundMusic();
    this.speechSynthesis?.cancel();
    this.voiceQueue = [];
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
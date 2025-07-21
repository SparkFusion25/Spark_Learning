import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Initial learning state
const initialState = {
  currentWorld: null,
  currentLesson: null,
  achievements: [],
  sparkCoins: 0,
  learningStreak: 0,
  completedLessons: [],
  worldProgress: {},
  aiCompanion: {
    name: 'Sparky',
    level: 1,
    mood: 'happy',
    experience: 0
  },
  screenTime: {
    today: 0,
    thisWeek: 0,
    limit: 60 // minutes
  },
  recentActivity: []
};

// Learning worlds data
export const LEARNING_WORLDS = [
  {
    id: 'math',
    name: 'Number Castle',
    emoji: '🏰',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    description: 'Solve puzzles and build with numbers!',
    unlockLevel: 1,
    lessons: [
      { id: 'counting-dragons', name: 'Counting Dragons', difficulty: 'easy', time: 5, reward: 25, xp: 50 },
      { id: 'shape-safari', name: 'Shape Safari', difficulty: 'medium', time: 8, reward: 35, xp: 75 },
      { id: 'pattern-palace', name: 'Pattern Palace', difficulty: 'medium', time: 10, reward: 40, xp: 80 },
      { id: 'number-ninjas', name: 'Number Ninjas', difficulty: 'hard', time: 12, reward: 50, xp: 100 }
    ]
  },
  {
    id: 'reading',
    name: 'Story Forest',
    emoji: '🌳',
    gradient: 'from-green-400 via-emerald-500 to-green-600',
    description: 'Adventure through magical tales',
    unlockLevel: 1,
    lessons: [
      { id: 'letter-detective', name: 'Letter Detective', difficulty: 'easy', time: 6, reward: 30, xp: 60 },
      { id: 'word-wizard', name: 'Word Wizard', difficulty: 'medium', time: 9, reward: 40, xp: 80 },
      { id: 'story-builder', name: 'Story Builder', difficulty: 'medium', time: 11, reward: 45, xp: 90 },
      { id: 'rhyme-time', name: 'Rhyme Time', difficulty: 'easy', time: 7, reward: 35, xp: 70 }
    ]
  },
  {
    id: 'science',
    name: 'Wonder Lab',
    emoji: '🔬',
    gradient: 'from-blue-400 via-cyan-500 to-blue-600',
    description: 'Discover amazing experiments',
    unlockLevel: 3,
    lessons: [
      { id: 'weather-wonders', name: 'Weather Wonders', difficulty: 'easy', time: 8, reward: 35, xp: 70 },
      { id: 'animal-adventures', name: 'Animal Adventures', difficulty: 'medium', time: 10, reward: 45, xp: 90 },
      { id: 'plant-power', name: 'Plant Power', difficulty: 'easy', time: 6, reward: 30, xp: 60 },
      { id: 'space-explorers', name: 'Space Explorers', difficulty: 'hard', time: 15, reward: 60, xp: 120 }
    ]
  },
  {
    id: 'art',
    name: 'Rainbow Studio',
    emoji: '🎨',
    gradient: 'from-pink-400 via-rose-500 to-pink-600',
    description: 'Create colorful masterpieces',
    unlockLevel: 5,
    lessons: [
      { id: 'color-mixing', name: 'Color Mixing', difficulty: 'easy', time: 10, reward: 40, xp: 80 },
      { id: 'shape-art', name: 'Shape Art', difficulty: 'medium', time: 12, reward: 50, xp: 100 },
      { id: 'story-pictures', name: 'Story Pictures', difficulty: 'medium', time: 14, reward: 55, xp: 110 },
      { id: 'digital-drawing', name: 'Digital Drawing', difficulty: 'hard', time: 18, reward: 70, xp: 140 }
    ]
  },
  {
    id: 'music',
    name: 'Melody Mountain',
    emoji: '🎵',
    gradient: 'from-yellow-400 via-orange-500 to-yellow-600',
    description: 'Make music and find rhythm',
    unlockLevel: 8,
    lessons: [
      { id: 'rhythm-games', name: 'Rhythm Games', difficulty: 'easy', time: 8, reward: 35, xp: 70 },
      { id: 'instrument-fun', name: 'Instrument Fun', difficulty: 'medium', time: 12, reward: 50, xp: 100 },
      { id: 'singing-time', name: 'Singing Time', difficulty: 'easy', time: 10, reward: 40, xp: 80 },
      { id: 'music-making', name: 'Music Making', difficulty: 'hard', time: 16, reward: 65, xp: 130 }
    ]
  },
  {
    id: 'social',
    name: 'Friendship Town',
    emoji: '🏘️',
    gradient: 'from-indigo-400 via-blue-500 to-indigo-600',
    description: 'Learn about people and places',
    unlockLevel: 10,
    lessons: [
      { id: 'my-family', name: 'My Family', difficulty: 'easy', time: 8, reward: 35, xp: 70 },
      { id: 'community-helpers', name: 'Community Helpers', difficulty: 'medium', time: 10, reward: 45, xp: 90 },
      { id: 'world-cultures', name: 'World Cultures', difficulty: 'medium', time: 12, reward: 50, xp: 100 },
      { id: 'map-adventures', name: 'Map Adventures', difficulty: 'hard', time: 15, reward: 60, xp: 120 }
    ]
  }
];

// Action types
const ActionTypes = {
  SET_CURRENT_WORLD: 'SET_CURRENT_WORLD',
  SET_CURRENT_LESSON: 'SET_CURRENT_LESSON',
  COMPLETE_LESSON: 'COMPLETE_LESSON',
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  UPDATE_SPARK_COINS: 'UPDATE_SPARK_COINS',
  UPDATE_STREAK: 'UPDATE_STREAK',
  UPDATE_AI_COMPANION: 'UPDATE_AI_COMPANION',
  UPDATE_SCREEN_TIME: 'UPDATE_SCREEN_TIME',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  LOAD_PROGRESS: 'LOAD_PROGRESS',
  RESET_PROGRESS: 'RESET_PROGRESS'
};

// Reducer
const learningReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_WORLD:
      return {
        ...state,
        currentWorld: action.payload
      };

    case ActionTypes.SET_CURRENT_LESSON:
      return {
        ...state,
        currentLesson: action.payload
      };

    case ActionTypes.COMPLETE_LESSON:
      const { lesson, world } = action.payload;
      const lessonKey = `${world.id}-${lesson.id}`;
      
      return {
        ...state,
        completedLessons: [...state.completedLessons, lessonKey],
        sparkCoins: state.sparkCoins + lesson.reward,
        worldProgress: {
          ...state.worldProgress,
          [world.id]: {
            ...state.worldProgress[world.id],
            completedLessons: [
              ...(state.worldProgress[world.id]?.completedLessons || []),
              lesson.id
            ],
            totalXP: (state.worldProgress[world.id]?.totalXP || 0) + lesson.xp
          }
        },
        aiCompanion: {
          ...state.aiCompanion,
          experience: state.aiCompanion.experience + lesson.xp
        }
      };

    case ActionTypes.ADD_ACHIEVEMENT:
      return {
        ...state,
        achievements: [action.payload, ...state.achievements]
      };

    case ActionTypes.UPDATE_SPARK_COINS:
      return {
        ...state,
        sparkCoins: Math.max(0, state.sparkCoins + action.payload)
      };

    case ActionTypes.UPDATE_STREAK:
      return {
        ...state,
        learningStreak: action.payload
      };

    case ActionTypes.UPDATE_AI_COMPANION:
      return {
        ...state,
        aiCompanion: {
          ...state.aiCompanion,
          ...action.payload
        }
      };

    case ActionTypes.UPDATE_SCREEN_TIME:
      return {
        ...state,
        screenTime: {
          ...state.screenTime,
          ...action.payload
        }
      };

    case ActionTypes.ADD_ACTIVITY:
      return {
        ...state,
        recentActivity: [action.payload, ...state.recentActivity.slice(0, 49)] // Keep last 50 activities
      };

    case ActionTypes.LOAD_PROGRESS:
      return {
        ...state,
        ...action.payload
      };

    case ActionTypes.RESET_PROGRESS:
      return initialState;

    default:
      return state;
  }
};

// Create context
const LearningContext = createContext();

// Provider component
export const LearningProvider = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('sparklearn_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        dispatch({
          type: ActionTypes.LOAD_PROGRESS,
          payload: progress
        });
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sparklearn_progress', JSON.stringify(state));
  }, [state]);

  // Set current world
  const setCurrentWorld = (world) => {
    dispatch({
      type: ActionTypes.SET_CURRENT_WORLD,
      payload: world
    });
  };

  // Set current lesson
  const setCurrentLesson = (lesson) => {
    dispatch({
      type: ActionTypes.SET_CURRENT_LESSON,
      payload: lesson
    });
  };

  // Complete a lesson
  const completeLesson = (lesson, world) => {
    dispatch({
      type: ActionTypes.COMPLETE_LESSON,
      payload: { lesson, world }
    });

    // Add activity
    addActivity({
      type: 'lesson_completed',
      title: `Completed ${lesson.name}`,
      description: `Earned ${lesson.reward} coins and ${lesson.xp} XP`,
      timestamp: new Date(),
      world: world.name,
      lesson: lesson.name
    });

    // Check for achievements
    checkAchievements(lesson, world);

    // Update AI companion
    updateAICompanion();

    toast.success(`🎉 Lesson completed! +${lesson.reward} coins!`);
  };

  // Add achievement
  const addAchievement = (achievement) => {
    const newAchievement = {
      id: Date.now(),
      ...achievement,
      timestamp: new Date(),
      shared: false
    };

    dispatch({
      type: ActionTypes.ADD_ACHIEVEMENT,
      payload: newAchievement
    });

    addActivity({
      type: 'achievement_earned',
      title: `🏆 ${achievement.title}`,
      description: achievement.description,
      timestamp: new Date()
    });

    toast.success(`🏆 Achievement unlocked: ${achievement.title}!`);
    return newAchievement;
  };

  // Update spark coins
  const updateSparkCoins = (amount) => {
    dispatch({
      type: ActionTypes.UPDATE_SPARK_COINS,
      payload: amount
    });

    if (amount > 0) {
      toast.success(`✨ +${amount} Spark Coins!`);
    }
  };

  // Update learning streak
  const updateStreak = (streak) => {
    dispatch({
      type: ActionTypes.UPDATE_STREAK,
      payload: streak
    });

    if (streak > 0) {
      addActivity({
        type: 'streak_updated',
        title: `🔥 ${streak} Day Streak!`,
        description: 'Keep up the amazing work!',
        timestamp: new Date()
      });
    }
  };

  // Update AI companion
  const updateAICompanion = () => {
    const experience = state.aiCompanion.experience + 50;
    const level = Math.floor(experience / 200) + 1;
    const moods = ['happy', 'excited', 'proud', 'energetic'];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    dispatch({
      type: ActionTypes.UPDATE_AI_COMPANION,
      payload: {
        level,
        experience,
        mood
      }
    });
  };

  // Update screen time
  const updateScreenTime = (minutes) => {
    const today = state.screenTime.today + minutes;
    const thisWeek = state.screenTime.thisWeek + minutes;

    dispatch({
      type: ActionTypes.UPDATE_SCREEN_TIME,
      payload: {
        today,
        thisWeek
      }
    });

    // Check screen time limit
    if (today >= state.screenTime.limit) {
      toast('⏰ Screen time limit reached! Time for a break?', {
        icon: '⏰',
        duration: 5000
      });
    }
  };

  // Add activity
  const addActivity = (activity) => {
    dispatch({
      type: ActionTypes.ADD_ACTIVITY,
      payload: activity
    });
  };

  // Check for achievements based on progress
  const checkAchievements = (lesson, world) => {
    const completedInWorld = state.worldProgress[world.id]?.completedLessons?.length || 0;
    const totalCompleted = state.completedLessons.length;

    // First lesson achievement
    if (totalCompleted === 0) {
      addAchievement({
        title: 'First Steps!',
        description: 'Completed your very first lesson',
        icon: '👶',
        category: 'milestone'
      });
    }

    // World-specific achievements
    if (completedInWorld === 1) {
      addAchievement({
        title: `${world.name} Explorer!`,
        description: `Started your journey in ${world.name}`,
        icon: world.emoji,
        category: 'world'
      });
    }

    if (completedInWorld === world.lessons.length) {
      addAchievement({
        title: `${world.name} Master!`,
        description: `Completed all lessons in ${world.name}`,
        icon: '👑',
        category: 'mastery'
      });
    }

    // Streak achievements
    if (state.learningStreak === 7) {
      addAchievement({
        title: 'Week Warrior!',
        description: 'Learned for 7 days in a row',
        icon: '🔥',
        category: 'streak'
      });
    }

    // Coin achievements
    if (state.sparkCoins >= 1000) {
      addAchievement({
        title: 'Coin Collector!',
        description: 'Earned 1000 Spark Coins',
        icon: '💰',
        category: 'coins'
      });
    }
  };

  // Get world progress
  const getWorldProgress = (worldId) => {
    const world = LEARNING_WORLDS.find(w => w.id === worldId);
    const progress = state.worldProgress[worldId] || { completedLessons: [], totalXP: 0 };
    
    return {
      ...progress,
      totalLessons: world?.lessons.length || 0,
      progressPercentage: world ? (progress.completedLessons.length / world.lessons.length) * 100 : 0
    };
  };

  // Check if lesson is completed
  const isLessonCompleted = (worldId, lessonId) => {
    return state.completedLessons.includes(`${worldId}-${lessonId}`);
  };

  // Check if world is unlocked
  const isWorldUnlocked = (world) => {
    const userLevel = Math.floor(state.aiCompanion.experience / 200) + 1;
    return userLevel >= world.unlockLevel;
  };

  // Get available lessons for a world
  const getAvailableLessons = (worldId) => {
    const world = LEARNING_WORLDS.find(w => w.id === worldId);
    if (!world) return [];

    return world.lessons.map(lesson => ({
      ...lesson,
      completed: isLessonCompleted(worldId, lesson.id)
    }));
  };

  // Reset progress (for testing or new user)
  const resetProgress = () => {
    dispatch({ type: ActionTypes.RESET_PROGRESS });
    localStorage.removeItem('sparklearn_progress');
    toast.success('Progress reset successfully!');
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    setCurrentWorld,
    setCurrentLesson,
    completeLesson,
    addAchievement,
    updateSparkCoins,
    updateStreak,
    updateScreenTime,
    addActivity,
    resetProgress,
    
    // Helpers
    getWorldProgress,
    isLessonCompleted,
    isWorldUnlocked,
    getAvailableLessons,
    
    // Constants
    LEARNING_WORLDS
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

// Custom hook to use learning context
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

export default LearningContext;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Palette, Save, X, ArrowLeft, Star, Heart, 
  Sparkles, Edit3, Check, Camera, Crown, Shield
} from 'lucide-react';
import audioManager from '../../utils/audioManager';

const ChildProfileEditor = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [currentSection, setCurrentSection] = useState('overview'); // overview, avatar, theme, name
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // Avatar options with diverse representation
  const avatarCategories = {
    kids: {
      name: 'Kids',
      icon: '👶',
      options: [
        { id: 'emmy', emoji: '👧🏽', name: 'Emmy', description: 'Smart & Creative' },
        { id: 'greyson', emoji: '👦🏻', name: 'Greyson', description: 'Curious Explorer' },
        { id: 'jaxon', emoji: '👦🏾', name: 'Jaxon', description: 'Adventure Seeker' },
        { id: 'girl1', emoji: '👧🏻', name: 'Sophia', description: 'Book Lover' },
        { id: 'boy1', emoji: '👦🏽', name: 'Carlos', description: 'Math Wizard' },
        { id: 'girl2', emoji: '👧🏿', name: 'Zara', description: 'Artist' },
        { id: 'boy2', emoji: '👦🏿', name: 'Marcus', description: 'Scientist' },
        { id: 'girl3', emoji: '👧🏼', name: 'Luna', description: 'Storyteller' }
      ]
    },
    superheroes: {
      name: 'Superheroes',
      icon: '🦸',
      options: [
        { id: 'spiderman', emoji: '🕷️', name: 'Spider-Man', description: 'Web-slinging Hero' },
        { id: 'superman', emoji: '🛡️', name: 'Superman', description: 'Man of Steel' },
        { id: 'ironman', emoji: '🤖', name: 'Iron Man', description: 'Tech Genius' },
        { id: 'hulk', emoji: '💚', name: 'Hulk', description: 'Incredible Strength' },
        { id: 'wonderwoman', emoji: '👑', name: 'Wonder Woman', description: 'Amazon Warrior' },
        { id: 'captain', emoji: '🛡️', name: 'Captain America', description: 'First Avenger' }
      ]
    },
    disney: {
      name: 'Disney Characters',
      icon: '🏰',
      options: [
        { id: 'elsa', emoji: '❄️', name: 'Elsa', description: 'Ice Queen' },
        { id: 'anna', emoji: '🌸', name: 'Anna', description: 'Fearless Princess' },
        { id: 'moana', emoji: '🌊', name: 'Moana', description: 'Ocean Explorer' },
        { id: 'belle', emoji: '📚', name: 'Belle', description: 'Book Lover' },
        { id: 'ariel', emoji: '🧜', name: 'Ariel', description: 'Mermaid Princess' },
        { id: 'mickey', emoji: '🐭', name: 'Mickey Mouse', description: 'Magic Maker' },
        { id: 'buzz', emoji: '🚀', name: 'Buzz Lightyear', description: 'Space Ranger' },
        { id: 'woody', emoji: '🤠', name: 'Woody', description: 'Cowboy Sheriff' }
      ]
    }
  };

  // Color themes
  const colorThemes = [
    { id: 'rainbow', name: 'Rainbow Magic', gradient: 'from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400', description: 'All colors together!' },
    { id: 'ocean', name: 'Ocean Blue', gradient: 'from-blue-400 via-cyan-400 to-teal-400', description: 'Deep sea adventure' },
    { id: 'sunset', name: 'Sunset Orange', gradient: 'from-orange-400 via-pink-400 to-red-400', description: 'Warm and cozy' },
    { id: 'forest', name: 'Forest Green', gradient: 'from-green-400 via-emerald-400 to-teal-400', description: 'Nature explorer' },
    { id: 'lavender', name: 'Lavender Dreams', gradient: 'from-purple-400 via-pink-400 to-indigo-400', description: 'Magical and dreamy' },
    { id: 'golden', name: 'Golden Sun', gradient: 'from-yellow-400 via-orange-400 to-amber-400', description: 'Bright and happy' },
    { id: 'cosmic', name: 'Cosmic Space', gradient: 'from-indigo-400 via-purple-400 to-pink-400', description: 'Galaxy adventure' },
    { id: 'candy', name: 'Candy Sweet', gradient: 'from-pink-400 via-rose-400 to-red-400', description: 'Sweet and fun' }
  ];

  // Mock children data (this would come from a context or API in production)
  const children = [
    {
      id: 'emmy',
      name: 'Emmy',
      age: 6,
      avatar: '👧🏽',
      avatarId: 'emmy',
      level: 12,
      sparkCoins: 450,
      streak: 8,
      theme: 'ocean',
      favoriteSubject: 'Math',
      achievements: ['First Steps', 'Word Master', 'Counting Champion']
    },
    {
      id: 'greyson',
      name: 'Greyson',
      age: 5,
      avatar: '👦🏻',
      avatarId: 'greyson',
      level: 8,
      sparkCoins: 230,
      streak: 3,
      theme: 'forest',
      favoriteSubject: 'Science',
      achievements: ['Explorer', 'Pattern Pro']
    },
    {
      id: 'jaxon',
      name: 'Jaxon',
      age: 7,
      avatar: '👦🏾',
      avatarId: 'jaxon',
      level: 15,
      sparkCoins: 680,
      streak: 12,
      theme: 'cosmic',
      favoriteSubject: 'Reading',
      achievements: ['Math Wizard', 'Creative Builder', 'Speed Reader', 'Problem Solver']
    }
  ];

  useEffect(() => {
    // Set first child as selected by default
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
      setEditedProfile({ ...children[0] });
    }
  }, []);

  const startEditing = () => {
    setIsEditing(true);
    setEditedProfile({ ...selectedChild });
    audioManager.playSound('click');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedProfile({ ...selectedChild });
    setCurrentSection('overview');
    audioManager.playSound('click');
  };

  const saveProfile = () => {
    // In production, this would save to backend/context
    setSelectedChild({ ...editedProfile });
    setIsEditing(false);
    setCurrentSection('overview');
    setShowSaveConfirm(true);
    
    audioManager.playSound('achievement');
    audioManager.speak(`Great job! Your profile has been saved!`, 'default');
    
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  const updateProfile = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
    audioManager.playSound('hover');
  };

  const getSelectedAvatar = () => {
    const allAvatars = [
      ...avatarCategories.kids.options,
      ...avatarCategories.superheroes.options,
      ...avatarCategories.disney.options
    ];
    return allAvatars.find(avatar => avatar.id === editedProfile.avatarId) || avatarCategories.kids.options[0];
  };

  const getSelectedTheme = () => {
    return colorThemes.find(theme => theme.id === editedProfile.theme) || colorThemes[0];
  };

  const renderOverview = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Profile Preview */}
      <div className={`bg-gradient-to-br ${getSelectedTheme().gradient} rounded-3xl p-8 text-center`}>
        <div className="text-8xl mb-4">{getSelectedAvatar().emoji}</div>
        <h2 className="text-4xl font-bold text-white mb-2">{editedProfile.name}</h2>
        <p className="text-xl text-white/90 mb-4">Level {editedProfile.level} • {editedProfile.sparkCoins} ⭐</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white font-medium">🎯 Favorite: {editedProfile.favoriteSubject}</p>
          <p className="text-white font-medium">🔥 Streak: {editedProfile.streak} days</p>
        </div>
      </div>

      {/* Edit Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.button
          onClick={() => setCurrentSection('name')}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit3 className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Edit Name</h3>
          <p className="text-gray-600">Change your display name</p>
        </motion.button>

        <motion.button
          onClick={() => setCurrentSection('avatar')}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Avatar</h3>
          <p className="text-gray-600">Pick your character</p>
        </motion.button>

        <motion.button
          onClick={() => setCurrentSection('theme')}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Palette className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Color Theme</h3>
          <p className="text-gray-600">Customize your colors</p>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderNameEditor = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">✏️ What's your name?</h3>
        <p className="text-xl text-gray-600">Choose a name that makes you happy!</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-8">
          <label className="block text-lg font-bold text-gray-800 mb-4">Your Name:</label>
          <input
            type="text"
            value={editedProfile.name || ''}
            onChange={(e) => updateProfile('name', e.target.value)}
            className="w-full px-6 py-4 text-2xl font-bold text-center bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            placeholder="Enter your name..."
            maxLength={20}
          />
          <p className="text-sm text-gray-600 mt-2 text-center">
            {editedProfile.name?.length || 0}/20 characters
          </p>
        </div>

        {/* Name suggestions */}
        <div className="mt-6">
          <p className="text-lg font-medium text-gray-700 mb-3 text-center">💡 Name Ideas:</p>
          <div className="grid grid-cols-2 gap-3">
            {['Alex', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery'].map(name => (
              <motion.button
                key={name}
                onClick={() => updateProfile('name', name)}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-blue-800 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAvatarSelector = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">🎭 Choose your avatar!</h3>
        <p className="text-xl text-gray-600">Pick the character that represents you best</p>
      </div>

      {Object.entries(avatarCategories).map(([categoryKey, category]) => (
        <div key={categoryKey} className="space-y-4">
          <h4 className="text-2xl font-bold text-gray-700 flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            {category.name}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {category.options.map(avatar => (
              <motion.button
                key={avatar.id}
                onClick={() => {
                  updateProfile('avatarId', avatar.id);
                  updateProfile('avatar', avatar.emoji);
                  audioManager.playSound('correct');
                }}
                className={`p-4 rounded-2xl text-center transition-all ${
                  editedProfile.avatarId === avatar.id 
                    ? 'bg-blue-200 border-4 border-blue-400 shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50 border-2 border-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-6xl mb-2">{avatar.emoji}</div>
                <p className="text-sm font-bold text-gray-800">{avatar.name}</p>
                <p className="text-xs text-gray-600">{avatar.description}</p>
                {editedProfile.avatarId === avatar.id && (
                  <motion.div
                    className="mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-6 h-6 mx-auto text-blue-600" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderThemeSelector = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">🎨 Pick your colors!</h3>
        <p className="text-xl text-gray-600">Choose colors that make you feel awesome</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {colorThemes.map(theme => (
          <motion.button
            key={theme.id}
            onClick={() => {
              updateProfile('theme', theme.id);
              audioManager.playSound('correct');
            }}
            className={`relative p-6 rounded-3xl transition-all ${
              editedProfile.theme === theme.id 
                ? 'border-4 border-white shadow-2xl scale-105' 
                : 'border-2 border-transparent hover:scale-102'
            }`}
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
            whileHover={{ scale: editedProfile.theme === theme.id ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`bg-gradient-to-br ${theme.gradient} absolute inset-0 rounded-3xl`}></div>
            <div className="relative z-10 text-center">
              <h4 className="text-2xl font-bold text-white mb-2">{theme.name}</h4>
              <p className="text-white/90">{theme.description}</p>
              {editedProfile.theme === theme.id && (
                <motion.div
                  className="mt-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 inline-block">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      
      {/* Header */}
      <motion.div 
        className="max-w-6xl mx-auto mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between bg-white/30 backdrop-blur-lg rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/child-select')}
              className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">✨ Profile Editor</h1>
              <p className="text-gray-600">Make your profile awesome!</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-3">
              <motion.button
                onClick={cancelEditing}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 mr-2 inline" />
                Cancel
              </motion.button>
              <motion.button
                onClick={saveProfile}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-5 h-5 mr-2 inline" />
                Save
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Child Selector */}
      {!isEditing && (
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">👨‍👩‍👧‍👦 Which profile would you like to edit?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {children.map(child => (
              <motion.button
                key={child.id}
                onClick={() => {
                  setSelectedChild(child);
                  setEditedProfile({ ...child });
                  audioManager.playSound('click');
                }}
                className={`p-6 rounded-2xl text-center transition-all ${
                  selectedChild?.id === child.id 
                    ? 'bg-blue-200 border-4 border-blue-400 shadow-xl' 
                    : 'bg-white/40 hover:bg-white/60 border-2 border-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-6xl mb-3">{child.avatar}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{child.name}</h3>
                <p className="text-gray-600">Level {child.level}</p>
                {selectedChild?.id === child.id && (
                  <motion.div
                    className="mt-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Selected ✓
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      {selectedChild && (
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          
          {!isEditing ? (
            <div className="text-center mb-8">
              <motion.button
                onClick={startEditing}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 className="w-6 h-6 mr-3 inline" />
                Start Editing Profile
              </motion.button>
            </div>
          ) : (
            <>
              {/* Section Navigation */}
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-2 flex gap-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: '👀' },
                    { id: 'name', label: 'Name', icon: '✏️' },
                    { id: 'avatar', label: 'Avatar', icon: '🎭' },
                    { id: 'theme', label: 'Colors', icon: '🎨' }
                  ].map(section => (
                    <motion.button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        currentSection === section.id 
                          ? 'bg-white text-blue-600 shadow-lg' 
                          : 'text-gray-600 hover:bg-white/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* Content Area */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
            <AnimatePresence mode="wait">
              {!isEditing && (
                <motion.div
                  key="profile-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {renderOverview()}
                </motion.div>
              )}
              
              {isEditing && currentSection === 'overview' && renderOverview()}
              {isEditing && currentSection === 'name' && renderNameEditor()}
              {isEditing && currentSection === 'avatar' && renderAvatarSelector()}
              {isEditing && currentSection === 'theme' && renderThemeSelector()}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Save Confirmation */}
      <AnimatePresence>
        {showSaveConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-12 text-center max-w-md mx-4"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Profile Saved!</h3>
              <p className="text-xl text-gray-600 mb-6">Your awesome profile is ready to go!</p>
              <div className="text-4xl">{getSelectedAvatar().emoji}</div>
              <p className="text-2xl font-bold text-gray-800 mt-4">{editedProfile.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChildProfileEditor;
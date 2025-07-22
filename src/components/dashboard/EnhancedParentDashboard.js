import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, Bell, Calendar, BookOpen, Brain, Palette, Music, Camera, 
  Gamepad2, Target, Award, TrendingUp, Clock, Shield, Volume2, VolumeX, 
  Moon, Sun, Pause, Play, Home, ChevronRight, Star, Heart, Zap, Gift, 
  Trophy, Medal, BarChart3, PieChart, LineChart, Users, Eye, Lock 
} from 'lucide-react';

const EnhancedParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState('emma');
  const [timeFrame, setTimeFrame] = useState('week');

  // Mock data for demonstration
  const mockChildren = {
    emma: {
      id: 'emma',
      name: 'Emma',
      age: 6,
      avatar: '👧',
      level: 3,
      sparkCoins: 245,
      streak: 7,
      favoriteTheme: 'frozen',
      recentActivity: [
        { game: 'Counting Dragons', score: 95, time: '15 min', date: '2024-01-15' },
        { game: 'Pattern Magic', score: 88, time: '12 min', date: '2024-01-15' },
        { game: 'Memory Quest', score: 92, time: '18 min', date: '2024-01-14' }
      ],
      skillProgress: {
        math: { level: 4, progress: 75 },
        reading: { level: 3, progress: 60 },
        memory: { level: 4, progress: 80 },
        logic: { level: 3, progress: 45 }
      },
      achievements: ['first_correct', 'streak_5', 'level_up'],
      screenTime: {
        today: 45,
        week: 280,
        average: 40
      }
    }
  };

  const currentChild = mockChildren[selectedChild];

  const dashboardTabs = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'screentime', name: 'Screen Time', icon: Clock },
    { id: 'safety', name: 'Safety', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-sm opacity-80">Today</span>
          </div>
          <div className="text-2xl font-bold">{currentChild.screenTime.today}m</div>
          <div className="text-sm opacity-80">Screen Time</div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Gamepad2 className="w-6 h-6" />
            <span className="text-sm opacity-80">Today</span>
          </div>
          <div className="text-2xl font-bold">{currentChild.recentActivity.length}</div>
          <div className="text-sm opacity-80">Games Played</div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="w-6 h-6" />
            <span className="text-sm opacity-80">Total</span>
          </div>
          <div className="text-2xl font-bold">{currentChild.sparkCoins}</div>
          <div className="text-sm opacity-80">Spark Coins</div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-6 h-6" />
            <span className="text-sm opacity-80">Current</span>
          </div>
          <div className="text-2xl font-bold">{currentChild.streak}</div>
          <div className="text-sm opacity-80">Day Streak</div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {currentChild.recentActivity.map((activity, index) => (
            <motion.div 
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {activity.game === 'Counting Dragons' ? '🔢' : 
                   activity.game === 'Pattern Magic' ? '🔮' : '🧩'}
                </div>
                <div>
                  <div className="font-semibold">{activity.game}</div>
                  <div className="text-sm text-gray-600">{activity.time} • {activity.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{activity.score}%</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Skill Progress Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(currentChild.skillProgress).map(([skill, data]) => (
            <div key={skill} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="capitalize font-medium">{skill}</span>
                <span className="text-sm text-gray-600">Level {data.level}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="text-xs text-gray-500">{data.progress}% to next level</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Progress Tab Component
  const ProgressTab = () => (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg">
        {['week', 'month', 'all'].map((frame) => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeFrame === frame 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {frame === 'all' ? 'All Time' : `This ${frame.charAt(0).toUpperCase() + frame.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Detailed Skill Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Detailed Skill Progression
        </h3>
        <div className="space-y-6">
          {Object.entries(currentChild.skillProgress).map(([skill, data]) => (
            <motion.div 
              key={skill}
              className="border rounded-xl p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white">
                    {skill === 'math' ? '🔢' : skill === 'reading' ? '📚' : 
                     skill === 'memory' ? '🧠' : '🧩'}
                  </div>
                  <div>
                    <h4 className="font-semibold capitalize">{skill}</h4>
                    <p className="text-sm text-gray-600">Level {data.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{data.progress}%</div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.progress}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {Math.round((100 - data.progress) * 0.1)} more sessions to level up
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Gallery */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Achievement Gallery
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {currentChild.achievements.map((achievement, index) => (
            <motion.div 
              key={achievement}
              className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xs font-medium capitalize">
                {achievement.replace('_', ' ')}
              </div>
            </motion.div>
          ))}
          {/* Locked achievements */}
          {[...Array(3)].map((_, index) => (
            <div 
              key={`locked-${index}`}
              className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 text-center opacity-50"
            >
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs font-medium">Locked</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Screen Time Tab Component
  const ScreenTimeTab = () => (
    <div className="space-y-6">
      {/* Screen Time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-2">Today</h3>
          <div className="text-3xl font-bold text-blue-600">{currentChild.screenTime.today}m</div>
          <div className="text-sm text-gray-600">of 60m goal</div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(currentChild.screenTime.today / 60) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-2">This Week</h3>
          <div className="text-3xl font-bold text-green-600">{currentChild.screenTime.week}m</div>
          <div className="text-sm text-gray-600">Total time</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {Math.round(currentChild.screenTime.week / 7)}m per day
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-2">Health Status</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Healthy</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>✅ Taking breaks every 20 min</div>
            <div>✅ Maintaining good posture</div>
            <div>✅ Appropriate brightness</div>
          </div>
        </div>
      </div>

      {/* Usage Patterns */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          Usage Patterns
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Most Active Time</span>
            <span className="font-semibold">4:00 PM - 5:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Favorite Learning Session</span>
            <span className="font-semibold">25 minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Break Frequency</span>
            <span className="font-semibold">Every 22 minutes</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold mb-3 text-blue-800">💡 Screen Time Recommendations</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Encourage 10-minute breaks between learning sessions</li>
          <li>• Consider outdoor activities after screen time</li>
          <li>• Emma is doing great with her current routine!</li>
        </ul>
      </div>
    </div>
  );

  // Safety Tab Component
  const SafetyTab = () => (
    <div className="space-y-6">
      {/* Safety Status */}
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-800">All Safety Checks Passed</h3>
            <p className="text-green-600">Your child's learning environment is secure</p>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy Protection
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">No personal data collection</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">COPPA compliant</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Encrypted data storage</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Content Safety
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Age-appropriate content</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">No external links</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">No social features</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Parent Monitoring
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Real-time activity monitoring</span>
              <p className="text-sm text-gray-600">See what your child is learning in real-time</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Enabled</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Progress notifications</span>
              <p className="text-sm text-gray-600">Get alerts when your child achieves milestones</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Enabled</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Tab Component
  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Child Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Child Profile
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-2xl">
            {currentChild.avatar}
          </div>
          <div>
            <h4 className="text-lg font-semibold">{currentChild.name}</h4>
            <p className="text-gray-600">Age {currentChild.age} • Level {currentChild.level}</p>
          </div>
          <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg">Edit Profile</button>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Learning Goals
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Daily screen time limit</span>
            <select className="border rounded-lg px-3 py-1">
              <option>60 minutes</option>
              <option>45 minutes</option>
              <option>30 minutes</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span>Learning session length</span>
            <select className="border rounded-lg px-3 py-1">
              <option>20 minutes</option>
              <option>15 minutes</option>
              <option>25 minutes</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span>Difficulty level</span>
            <select className="border rounded-lg px-3 py-1">
              <option>Adaptive</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h4>
        <div className="space-y-4">
          {[
            { name: 'Achievement notifications', description: 'When your child earns new badges' },
            { name: 'Daily progress summary', description: 'End-of-day learning recap' },
            { name: 'Screen time alerts', description: 'When approaching daily limits' },
            { name: 'Weekly progress report', description: 'Comprehensive weekly analysis' }
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{notification.name}</span>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
              <select 
                value={selectedChild} 
                onChange={(e) => setSelectedChild(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="emma">Emma (Age 6)</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentChild.avatar}</span>
              <div>
                <div className="font-semibold">{currentChild.name}</div>
                <div className="text-sm text-gray-600">Level {currentChild.level}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {dashboardTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'progress' && <ProgressTab />}
            {activeTab === 'screentime' && <ScreenTimeTab />}
            {activeTab === 'safety' && <SafetyTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedParentDashboard;
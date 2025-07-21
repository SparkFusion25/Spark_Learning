import React, { createContext, useContext, useState } from 'react';

const ParentContext = createContext();

export const ParentProvider = ({ children }) => {
  const [parentSettings, setParentSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      achievements: true,
      weeklyReports: true
    },
    screenTime: {
      dailyLimit: 60,
      breakReminders: true
    },
    privacy: {
      shareProgress: false,
      allowSocialFeatures: false
    }
  });

  const updateParentSettings = (newSettings) => {
    setParentSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const value = {
    parentSettings,
    updateParentSettings
  };

  return (
    <ParentContext.Provider value={value}>
      {children}
    </ParentContext.Provider>
  );
};

export const useParent = () => {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error('useParent must be used within a ParentProvider');
  }
  return context;
};

export default ParentContext;
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('meetings');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const saveMeeting = (meetingData) => {
    const newMeeting = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...meetingData
    };
    setMeetings([newMeeting, ...meetings]);
    setCurrentMeeting(newMeeting);
    return newMeeting;
  };

  const updateMeeting = (id, updates) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, ...updates } : m));
    if (currentMeeting?.id === id) {
      setCurrentMeeting({ ...currentMeeting, ...updates });
    }
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter(m => m.id !== id));
    if (currentMeeting?.id === id) {
      setCurrentMeeting(null);
    }
  };

  const value = {
    darkMode,
    toggleDarkMode,
    meetings,
    currentMeeting,
    setCurrentMeeting,
    saveMeeting,
    updateMeeting,
    deleteMeeting,
    isLoading,
    setIsLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

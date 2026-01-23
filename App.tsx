
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { FoodEntry } from './pages/FoodEntry';
import { DailyDetails } from './pages/DailyDetails';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Layout } from './components/Layout';
import { storage } from './services/storageService';
import { UserProfile } from './types';
import { notificationService } from './services/notificationService';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = storage.getUser();
    setProfile(saved);
    setLoading(false);
  }, []);

  // Global effect to check for notifications
  useEffect(() => {
    if (!profile || !profile.notifications?.enabled) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const lastNotified = profile.notifications?.lastNotified || 0;
      const intervalMs = (profile.notifications?.intervalMinutes || 120) * 60 * 1000;

      if (now - lastNotified >= intervalMs) {
        notificationService.send(
          "Hora de cuidar de você! 💧",
          "Já bebeu água ou registrou sua última refeição? Mantenha o foco!"
        );
        
        // Update last notified time
        const updatedProfile: UserProfile = {
          ...profile,
          notifications: {
            ...profile.notifications!,
            lastNotified: now
          }
        };
        setProfile(updatedProfile);
        storage.saveUser(updatedProfile);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [profile]);

  if (loading) return null;

  if (!profile || !profile.isOnboarded) {
    return <Onboarding onComplete={setProfile} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-meal" element={<FoodEntry />} />
          <Route path="/history" element={<DailyDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

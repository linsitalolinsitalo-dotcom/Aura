
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { FoodEntry } from './pages/FoodEntry';
import { DailyDetails } from './pages/DailyDetails';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Layout } from './components/Layout';
import { storage } from './services/storageService';
import { UserProfile } from './types';
import { notificationService } from './services/notificationService';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // 1. Try migration on first load if this is a new user
    const migrated = storage.migrateLegacyData(currentUser.id);
    
    // 2. Load profile
    const saved = migrated || storage.getUser(currentUser.id);
    setProfile(saved);
    setLoading(false);
  }, [currentUser]);

  // Notification logic
  useEffect(() => {
    if (!profile || !profile.notifications?.enabled || !currentUser) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const lastNotified = profile.notifications?.lastNotified || 0;
      const intervalMs = (profile.notifications?.intervalMinutes || 120) * 60 * 1000;

      if (now - lastNotified >= intervalMs) {
        notificationService.send(
          "Hora de cuidar de você! 💧",
          "Já bebeu água ou registrou sua última refeição? Mantenha o foco!"
        );
        
        const updatedProfile: UserProfile = {
          ...profile,
          notifications: { ...profile.notifications!, lastNotified: now }
        };
        setProfile(updatedProfile);
        storage.saveUser(currentUser.id, updatedProfile);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [profile, currentUser]);

  if (isLoading || loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Auth Protection
  if (!currentUser) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Onboarding Protection
  if (!profile || !profile.isOnboarded) {
    return <Onboarding onComplete={(p) => {
      storage.saveUser(currentUser.id, p);
      setProfile(p);
    }} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home profile={profile} />} />
          <Route path="/add-meal" element={<FoodEntry />} />
          <Route path="/history" element={<DailyDetails />} />
          <Route path="/reports" element={<Reports profile={profile} />} />
          <Route path="/settings" element={<Settings profile={profile} onUpdate={(p) => setProfile(p)} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;

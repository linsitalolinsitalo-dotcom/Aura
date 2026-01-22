
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { FoodEntry } from './pages/FoodEntry';
import { DailyDetails } from './pages/DailyDetails';
import { Reports } from './pages/Reports';
import { Layout } from './components/Layout';
import { storage } from './services/storageService';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = storage.getUser();
    setProfile(saved);
    setLoading(false);
  }, []);

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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

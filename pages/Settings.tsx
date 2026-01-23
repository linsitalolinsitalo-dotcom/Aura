
import React from 'react';
import { storage } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC<{ profile: UserProfile; onUpdate: (p: UserProfile) => void }> = ({ profile, onUpdate }) => {
  const { currentUser, logout } = useAuth();

  const toggleNotifications = async (enabled: boolean) => {
    if (!profile || !currentUser) return;

    let canNotify = enabled;
    if (enabled) {
      canNotify = await notificationService.requestPermission();
    }

    const updatedProfile: UserProfile = {
      ...profile,
      notifications: {
        enabled: canNotify,
        intervalMinutes: profile.notifications?.intervalMinutes || 120,
        lastNotified: Date.now()
      }
    };

    onUpdate(updatedProfile);
    storage.saveUser(currentUser.id, updatedProfile);
  };

  const updateInterval = (mins: number) => {
    if (!profile || !currentUser) return;
    const updatedProfile: UserProfile = {
      ...profile,
      notifications: {
        ...(profile.notifications || { enabled: false, lastNotified: Date.now() }),
        intervalMinutes: mins
      }
    };
    onUpdate(updatedProfile);
    storage.saveUser(currentUser.id, updatedProfile);
  };

  return (
    <div className="py-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-slate-400">Personalize seu Aura Health.</p>
      </header>

      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800/50 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Lembretes</h3>
            <p className="text-sm text-slate-400">Notificações push.</p>
          </div>
          <button
            onClick={() => toggleNotifications(!profile.notifications?.enabled)}
            className={`w-14 h-8 rounded-full transition-colors relative ${profile.notifications?.enabled ? 'bg-blue-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${profile.notifications?.enabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {profile.notifications?.enabled && (
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intervalo</label>
            <div className="grid grid-cols-3 gap-3">
              {[60, 120, 180].map(mins => (
                <button
                  key={mins}
                  onClick={() => updateInterval(mins)}
                  className={`py-3 rounded-2xl font-bold text-sm border ${
                    profile.notifications?.intervalMinutes === mins 
                      ? 'bg-blue-500 text-white border-transparent' 
                      : 'border-slate-100 dark:border-zinc-800 text-slate-500'
                  }`}
                >
                  {mins / 60}h
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{currentUser?.name}</p>
              <p className="text-xs text-slate-400">{currentUser?.identifier}</p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-full text-xs font-bold"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </section>
      
      <p className="text-[10px] text-center text-slate-400 font-medium tracking-widest uppercase">Aura Health • V2.0 Auth</p>
    </div>
  );
};

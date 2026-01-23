
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { UserProfile } from '../types';

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(storage.getUser());
  }, []);

  const toggleNotifications = async (enabled: boolean) => {
    if (!profile) return;

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

    setProfile(updatedProfile);
    storage.saveUser(updatedProfile);
  };

  const updateInterval = (mins: number) => {
    if (!profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      notifications: {
        ...(profile.notifications || { enabled: false, lastNotified: Date.now() }),
        intervalMinutes: mins
      }
    };
    setProfile(updatedProfile);
    storage.saveUser(updatedProfile);
  };

  const testNotification = () => {
    notificationService.send("Aura Health ✨", "Isto é um teste! Beba água e registre suas refeições.");
  };

  if (!profile) return null;

  return (
    <div className="py-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-slate-400">Personalize seus lembretes e conta.</p>
      </header>

      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800/50 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Lembretes Inteligentes</h3>
            <p className="text-sm text-slate-400">Notificações push periódicas.</p>
          </div>
          <button
            onClick={() => toggleNotifications(!profile.notifications?.enabled)}
            className={`w-14 h-8 rounded-full transition-colors relative ${profile.notifications?.enabled ? 'bg-blue-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${profile.notifications?.enabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {profile.notifications?.enabled && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Intervalo de tempo</label>
              <div className="grid grid-cols-3 gap-3">
                {[60, 120, 180].map(mins => (
                  <button
                    key={mins}
                    onClick={() => updateInterval(mins)}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all border ${
                      profile.notifications?.intervalMinutes === mins 
                        ? 'bg-blue-500 text-white border-transparent shadow-lg shadow-blue-500/20' 
                        : 'border-slate-100 dark:border-zinc-800 text-slate-500'
                    }`}
                  >
                    {mins / 60}h
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={testNotification}
              className="w-full py-4 text-blue-500 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 rounded-2xl"
            >
              Testar Notificação Agora
            </button>
          </div>
        )}
      </section>

      <section className="p-8 bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-zinc-800">
        <h4 className="font-bold text-slate-700 dark:text-zinc-300 mb-2">Como funcionam as notificações?</h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          Para receber lembretes enquanto o app estiver fechado, certifique-se de ter instalado o App como PWA (Adicionar à Tela de Início) e permitido notificações nas configurações do seu dispositivo.
        </p>
      </section>
      
      <div className="pt-4 flex justify-center">
        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Aura Health v1.2 • Feito com IA</p>
      </div>
    </div>
  );
};

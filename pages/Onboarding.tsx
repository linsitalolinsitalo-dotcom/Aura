
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { storage } from '../services/storageService';

export const Onboarding: React.FC<{ onComplete: (u: UserProfile) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    weight: 70,
    height: 175,
    age: 30,
    gender: 'other',
    waterGoal: 2450, // 70 * 35
    trainingDayBonus: false,
    unit: 'ml',
    isOnboarded: false
  });

  const nextStep = () => setStep(prev => prev + 1);
  
  const finish = () => {
    const finalProfile = { ...profile, isOnboarded: true } as UserProfile;
    // Removed redundant and incorrect storage.saveUser call (missing userId).
    // The App.tsx component's onComplete callback handles saving the profile with the correct userId.
    onComplete(finalProfile);
  };

  const calculateSuggestedWater = (w: number) => {
    return Math.round(w * 35);
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-zinc-950 z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-300">
        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Bem-vindo à Aura.</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-lg">Vamos começar com o básico para personalizar sua experiência.</p>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Seu Nome</span>
                <input
                  type="text"
                  placeholder="Ex: João"
                  className="mt-2 w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-xl"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              </label>
              <button
                onClick={nextStep}
                className="w-full py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold text-lg hover:scale-[0.98] transition-transform"
              >
                Começar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Seus dados.</h1>
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="text-xs font-semibold text-slate-400">PESO (KG)</span>
                <input
                  type="number"
                  className="mt-1 w-full p-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border-none text-2xl font-bold"
                  value={profile.weight}
                  onChange={e => {
                    const w = Number(e.target.value);
                    setProfile({ ...profile, weight: w, waterGoal: calculateSuggestedWater(w) });
                  }}
                />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-400">ALTURA (CM)</span>
                <input
                  type="number"
                  className="mt-1 w-full p-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border-none text-2xl font-bold"
                  value={profile.height}
                  onChange={e => setProfile({ ...profile, height: Number(e.target.value) })}
                />
              </label>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold text-lg"
            >
              Próximo
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Meta de Hidratação.</h1>
            <p className="text-slate-500">Com base no seu peso, sugerimos:</p>
            <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl text-center border border-blue-100 dark:border-blue-900/50">
              <input
                type="number"
                className="bg-transparent border-none text-5xl font-black text-blue-600 text-center w-full focus:ring-0"
                value={profile.waterGoal}
                onChange={e => setProfile({ ...profile, waterGoal: Number(e.target.value) })}
              />
              <span className="block mt-2 text-blue-400 font-bold uppercase tracking-widest">ML POR DIA</span>
            </div>
            <button
              onClick={finish}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700"
            >
              Finalizar Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

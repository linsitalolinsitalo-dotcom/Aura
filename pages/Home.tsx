
import React, { useState, useEffect } from 'react';
import { WaterRing } from '../components/WaterRing';
import { storage } from '../services/storageService';
import { UserProfile, DayLog, WaterLog, Meal } from '../types';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dayLog, setDayLog] = useState<DayLog | null>(null);
  const [showAddWater, setShowAddWater] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setProfile(storage.getUser());
    setDayLog(storage.getDayLog(today));
  }, [today]);

  const addWater = (amount: number) => {
    if (!dayLog) return;
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = { ...dayLog, waterLogs: [...dayLog.waterLogs, newLog] };
    setDayLog(updated);
    storage.saveDayLog(updated);
    setShowAddWater(false);
  };

  const undoWater = () => {
    if (!dayLog || dayLog.waterLogs.length === 0) return;
    const updatedLogs = [...dayLog.waterLogs];
    updatedLogs.pop();
    const updated = { ...dayLog, waterLogs: updatedLogs };
    setDayLog(updated);
    storage.saveDayLog(updated);
  };

  const currentWater = dayLog?.waterLogs.reduce((acc, l) => acc + l.amount, 0) || 0;
  const foodTotals = dayLog?.meals.reduce((acc, m) => ({
    cal: acc.cal + m.totals.calories,
    pro: acc.pro + m.totals.protein_g,
    car: acc.car + m.totals.carbs_g,
    fat: acc.fat + m.totals.fat_g,
  }), { cal: 0, pro: 0, car: 0, fat: 0 }) || { cal: 0, pro: 0, car: 0, fat: 0 };

  if (!profile || !dayLog) return null;

  return (
    <div className="py-6 space-y-6">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Olá, {profile.name || 'Humano'}</h2>
          <p className="text-slate-400 font-medium">Hoje, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-xl">✨</div>
      </header>

      {/* Water Card */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800/50 flex flex-col items-center gap-6">
        <div className="w-full flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Hidratação</h3>
            <p className="text-slate-400 text-sm">Acompanhe sua água</p>
          </div>
          <button onClick={undoWater} className="p-2 text-slate-300 hover:text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          </button>
        </div>

        <WaterRing current={currentWater} goal={profile.waterGoal} />

        <div className="flex gap-3 w-full overflow-x-auto hide-scrollbar pb-1">
          {[200, 300, 500].map(amt => (
            <button
              key={amt}
              onClick={() => addWater(amt)}
              className="flex-1 py-3 px-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl text-blue-500 font-bold hover:bg-blue-50 transition-colors"
            >
              +{amt}ml
            </button>
          ))}
          <button 
            onClick={() => setShowAddWater(true)}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20"
          >
            Outro
          </button>
        </div>
      </section>

      {/* Nutrition Summary Card */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800/50 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Nutrição</h3>
            <p className="text-slate-400 text-sm">Resumo do dia</p>
          </div>
          <Link to="/add-meal" className="px-5 py-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-sm font-bold text-slate-700 dark:text-zinc-200">
            + Refeição
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calorias</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{foodTotals.cal.toFixed(0)}</span>
              <span className="text-xs text-slate-400 font-medium">kcal</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Proteínas</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{foodTotals.pro.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium">g</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Carbos</span>
                <p className="text-sm font-bold">{foodTotals.car.toFixed(1)}g</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-rose-400 rounded-full"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Gorduras</span>
                <p className="text-sm font-bold">{foodTotals.fat.toFixed(1)}g</p>
              </div>
           </div>
        </div>
      </section>

      {/* Quick History List */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Histórico Recente</h3>
        <div className="space-y-2">
          {dayLog.meals.length === 0 && dayLog.waterLogs.length === 0 && (
            <p className="text-center py-8 text-slate-300 italic">Nada registrado ainda.</p>
          )}
          {[...dayLog.meals].reverse().slice(0, 3).map(meal => (
            <div key={meal.id} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800/50 flex justify-between items-center">
              <div>
                <p className="font-bold">{meal.description.slice(0, 30)}...</p>
                <p className="text-xs text-slate-400">{meal.time} • {meal.totals.calories} kcal</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center">🥗</div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Water Modal */}
      {showAddWater && (
        <div className="fixed inset-0 bg-black/40 apple-blur z-[60] flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-full duration-300">
            <h3 className="text-2xl font-bold mb-6">Personalizar Água</h3>
            <input 
              type="number" 
              autoFocus
              className="w-full text-center text-5xl font-black bg-transparent border-none mb-8 focus:ring-0" 
              placeholder="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (val > 0) addWater(val);
                }
              }}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowAddWater(false)} className="flex-1 py-4 font-bold text-slate-400">Cancelar</button>
              <button onClick={() => {
                 const el = document.querySelector('input[type="number"]') as HTMLInputElement;
                 const val = Number(el.value);
                 if (val > 0) addWater(val);
              }} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

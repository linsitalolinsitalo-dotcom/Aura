
import React, { useEffect, useState, useMemo } from 'react';
import { storage } from '../services/storageService';
import { DayLog } from '../types';
import { useAuth } from '../context/AuthContext';

export const DailyDetails: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [log, setLog] = useState<DayLog | null>(null);
  const [showCalendarJump, setShowCalendarJump] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLog(storage.getDayLog(currentUser.id, selectedDate));
    }
  }, [selectedDate, currentUser]);

  const allLogs = useMemo(() => {
    if (!currentUser) return {};
    return storage.getLogs(currentUser.id);
  }, [currentUser, log]);

  const loggedDates = useMemo(() => {
    return Object.keys(allLogs).sort((a, b) => b.localeCompare(a));
  }, [allLogs]);

  if (!log || !currentUser) return null;

  const totalCalories = log.meals.reduce((s, m) => s + m.totals.calories, 0);
  const totalWater = log.waterLogs.reduce((s, w) => s + w.amount, 0);

  const handlePrint = () => window.print();

  const navigateDate = (days: number) => {
    const current = new Date(selectedDate + 'T12:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const formatDateLabel = (isoDate: string) => {
    const date = new Date(isoDate + 'T12:00:00');
    const today = new Date().toISOString().split('T')[0];
    if (isoDate === today) return 'Hoje';
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', weekday: 'short' });
  };

  return (
    <div className="py-6 space-y-8 pb-20">
      {/* Date Navigation Header */}
      <header className="space-y-4 no-print">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
          <button onClick={handlePrint} className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl text-slate-600 dark:text-zinc-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800/50">
          <button onClick={() => navigateDate(-1)} className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button 
            onClick={() => setShowCalendarJump(!showCalendarJump)}
            className="flex flex-col items-center group"
          >
            <span className="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
              {formatDateLabel(selectedDate)}
              <svg className={`w-3 h-3 transition-transform ${showCalendarJump ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{selectedDate}</span>
          </button>

          <button onClick={() => navigateDate(1)} className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </header>

      {/* History Selection Dropdown (Calendar Jump) */}
      {showCalendarJump && (
        <div className="bg-slate-100 dark:bg-zinc-800/50 rounded-3xl p-4 grid grid-cols-1 gap-2 animate-in slide-in-from-top-4 duration-300 no-print">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Dias com registros</p>
          <div className="max-h-48 overflow-y-auto hide-scrollbar space-y-1">
            {loggedDates.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-2">Nenhum registro antigo encontrado.</p>
            ) : (
              loggedDates.map(date => (
                <button
                  key={date}
                  onClick={() => { setSelectedDate(date); setShowCalendarJump(false); }}
                  className={`w-full text-left p-3 rounded-xl flex justify-between items-center transition-colors ${selectedDate === date ? 'bg-blue-500 text-white' : 'bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                >
                  <span className="text-sm font-bold">{formatDateLabel(date)}</span>
                  <div className="flex gap-2 text-[10px] font-medium opacity-80">
                    <span>🔥 {allLogs[date].meals.reduce((s, m) => s + m.totals.calories, 0)}</span>
                    <span>💧 {allLogs[date].waterLogs.reduce((s, w) => s + w.amount, 0)}ml</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Calorias</p>
          <p className="text-2xl font-black text-rose-500">{totalCalories} <span className="text-xs font-bold text-slate-300">kcal</span></p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Água</p>
          <p className="text-2xl font-black text-blue-500">{(totalWater / 1000).toFixed(1)} <span className="text-xs font-bold text-slate-300">L</span></p>
        </div>
      </div>

      {/* Meals List */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 px-1">
          Refeições
          <span className="text-xs bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-slate-400">{log.meals.length}</span>
        </h2>
        {log.meals.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-dashed border-slate-200 dark:border-zinc-800 text-center">
            <p className="text-slate-400 italic">Nenhum registro para esta data.</p>
          </div>
        ) : (
          log.meals.map(meal => (
            <div key={meal.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800/50 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  meal.type === 'breakfast' ? 'bg-amber-100 text-amber-600' :
                  meal.type === 'lunch' ? 'bg-blue-100 text-blue-600' :
                  meal.type === 'dinner' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                }`}>{meal.type}</span>
                <span className="text-xs font-medium text-slate-400">{meal.time}</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-zinc-100">"{meal.description}"</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meal.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{item.quantityText} ({item.estimatedGrams}g)</p>
                    </div>
                    <span className="text-xs font-black text-blue-500 whitespace-nowrap">{item.calories} kcal</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-zinc-800 grid grid-cols-3 gap-2">
                 <div className="text-center">
                   <p className="text-xs font-bold">{meal.totals.protein_g}g</p>
                   <p className="text-[8px] uppercase text-slate-400 font-bold">Prot</p>
                 </div>
                 <div className="text-center">
                   <p className="text-xs font-bold">{meal.totals.carbs_g}g</p>
                   <p className="text-[8px] uppercase text-slate-400 font-bold">Carb</p>
                 </div>
                 <div className="text-center">
                   <p className="text-xs font-bold">{meal.totals.fat_g}g</p>
                   <p className="text-[8px] uppercase text-slate-400 font-bold">Gord</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Water List Section */}
      {log.waterLogs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold px-1">Hidratação</h2>
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/20">
            <div className="space-y-2">
              {log.waterLogs.map(w => (
                <div key={w.id} className="flex justify-between items-center text-sm py-3 border-b border-blue-100/50 dark:border-blue-900/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="font-bold text-blue-700 dark:text-blue-300">+{w.amount} ml</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{w.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Notes Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold px-1">Notas do Dia</h2>
        <textarea
          className="w-full p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-none focus:ring-2 focus:ring-blue-500 shadow-sm min-h-[120px]"
          placeholder="Algo relevante sobre este dia? Humor, energia, sono..."
          value={log.notes}
          onChange={e => {
            const updated = { ...log, notes: e.target.value };
            setLog(updated);
            storage.saveDayLog(currentUser.id, updated);
          }}
        />
      </section>
    </div>
  );
};

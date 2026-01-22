
import React, { useEffect, useState } from 'react';
import { storage } from '../services/storageService';
import { DayLog } from '../types';

export const DailyDetails: React.FC = () => {
  const [log, setLog] = useState<DayLog | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setLog(storage.getDayLog(today));
  }, [today]);

  if (!log) return null;

  const totalCalories = log.meals.reduce((s, m) => s + m.totals.calories, 0);
  const totalWater = log.waterLogs.reduce((s, w) => s + w.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalhes do Dia</h1>
        <button onClick={handlePrint} className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl text-slate-600 dark:text-zinc-300 no-print">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        </button>
      </header>

      {/* Meals List */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Refeições</h2>
        {log.meals.length === 0 ? (
          <p className="text-slate-400 italic">Nenhuma refeição registrada.</p>
        ) : (
          log.meals.map(meal => (
            <div key={meal.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">{meal.type}</span>
                <span className="text-xs text-slate-400">{meal.time}</span>
              </div>
              <p className="text-lg font-medium">"{meal.description}"</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {meal.items.map((item, i) => (
                  <div key={i} className="text-xs p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                    <p className="font-bold line-clamp-1">{item.name}</p>
                    <p className="text-slate-400">{item.calories} kcal</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-50 dark:border-zinc-800 flex gap-4 text-xs font-bold text-slate-500">
                 <span>🔥 {meal.totals.calories} kcal</span>
                 <span>🥩 {meal.totals.protein_g}g</span>
                 <span>🍞 {meal.totals.carbs_g}g</span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Water Log */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Hidratação</h2>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
          <p className="text-3xl font-black text-blue-600 mb-4">{totalWater} ml totais</p>
          <div className="space-y-2">
            {log.waterLogs.map(w => (
              <div key={w.id} className="flex justify-between items-center text-sm py-2 border-b border-blue-100 dark:border-blue-900/20 last:border-0">
                <span className="font-medium">+{w.amount} ml</span>
                <span className="text-slate-400">{w.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-4 pb-12">
        <h2 className="text-xl font-bold">Notas do Dia</h2>
        <textarea
          className="w-full p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          placeholder="Como você se sentiu hoje? Algum desconforto ou observação?"
          value={log.notes}
          onChange={e => {
            const updated = { ...log, notes: e.target.value };
            setLog(updated);
            storage.saveDayLog(updated);
          }}
        />
      </section>

      {/* PRINT VERSION HIDDEN */}
      <div className="print-only fixed inset-0 bg-white p-12 text-black">
        <h1 className="text-4xl font-bold mb-4">Relatório Diário Aura</h1>
        <p className="text-slate-500 mb-8">Data: {today}</p>
        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b-2 border-black mb-4">Nutrição</h2>
          <p className="text-xl">Total de Calorias: {totalCalories} kcal</p>
          <ul className="mt-4 space-y-2">
            {log.meals.map(m => (
              <li key={m.id}>- {m.type.toUpperCase()}: {m.description} ({m.totals.calories} kcal)</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-black mb-4">Hidratação</h2>
          <p className="text-xl">Total de Água: {totalWater} ml</p>
        </div>
      </div>
    </div>
  );
};


import React, { useMemo } from 'react';
import { storage } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

export const Reports: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const { currentUser } = useAuth();

  const weeklyData = useMemo(() => {
    if (!currentUser) return [];
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const day = storage.getDayLog(currentUser.id, iso);
      data.push({
        name: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
        water: day.waterLogs.reduce((s, w) => s + w.amount, 0),
        calories: day.meals.reduce((s, m) => s + m.totals.calories, 0),
        date: iso
      });
    }
    return data;
  }, [currentUser]);

  const avgWater = weeklyData.reduce((s, v) => s + v.water, 0) / (weeklyData.length || 1);
  const avgCals = weeklyData.reduce((s, v) => s + v.calories, 0) / (weeklyData.length || 1);
  const targetWater = profile?.waterGoal || 2000;

  return (
    <div className="py-6 space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-slate-400">Seu desempenho nos últimos 7 dias</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Média Hidratação</p>
          <p className="text-2xl font-black text-blue-500">{(avgWater / 1000).toFixed(1)}L</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Média Calórica</p>
          <p className="text-2xl font-black text-rose-500">{avgCals.toFixed(0)}</p>
        </div>
      </div>

      <section className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800/50 shadow-sm space-y-6">
        <h3 className="text-lg font-bold">Consumo de Água</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="water" radius={[8, 8, 8, 8]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.water >= targetWater ? '#3b82f6' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-4">
        <h3 className="text-xl font-bold">Privacidade & Dados</h3>
        <p className="text-slate-400 text-sm">Seus dados estão vinculados à sua conta no dispositivo.</p>
        <button 
          onClick={() => {
            if (!currentUser) return;
            const data = { profile, logs: storage.getLogs(currentUser.id) };
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-colors"
        >
          Exportar Backup
        </button>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMeal } from '../services/geminiService';
import { storage } from '../services/storageService';
import { AIResponse, Meal } from '../types';

export const FoodEntry: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIResponse | null>(null);
  const [mealType, setMealType] = useState<Meal['type']>('lunch');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMeal(description);
      setAnalysisResult(result);
    } catch (err) {
      alert("Erro ao analisar. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!analysisResult) return;
    
    const today = new Date().toISOString().split('T')[0];
    const log = storage.getDayLog(today);
    
    const newMeal: Meal = {
      id: Date.now().toString(),
      type: mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description,
      items: analysisResult.items.map(it => ({ ...it, id: Math.random().toString(36).substr(2, 9) })),
      totals: analysisResult.totals,
      disclaimer: analysisResult.disclaimer
    };

    log.meals.push(newMeal);
    storage.saveDayLog(log);
    navigate('/');
  };

  return (
    <div className="py-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">O que você comeu?</h1>
        <p className="text-slate-400">A Aura usará IA para estimar os nutrientes.</p>
      </header>

      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {(['breakfast', 'lunch', 'dinner', 'snack', 'other'] as const).map(t => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all shrink-0 ${
                mealType === t ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-slate-200 dark:border-zinc-800 text-slate-400'
              }`}
            >
              {t === 'breakfast' ? 'Café' : t === 'lunch' ? 'Almoço' : t === 'dinner' ? 'Jantar' : t === 'snack' ? 'Lanche' : 'Outro'}
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          className="w-full p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg"
          placeholder="Ex: 2 colheres de arroz, 1 concha de feijão, 1 bife médio e salada à vontade..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>

        {!analysisResult && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !description}
            className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              isAnalyzing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Analisando com IA...
              </>
            ) : 'Analisar Refeição'}
          </button>
        )}
      </div>

      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-zinc-800/50 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📊</span> Resultado Estimado
            </h3>
            
            <div className="space-y-4">
              {analysisResult.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.quantityText}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-500">{item.calories} kcal</p>
                    <p className="text-[10px] text-slate-400">P:{item.protein_g} C:{item.carbs_g} G:{item.fat_g}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-around text-center">
              <div>
                <p className="text-2xl font-black">{analysisResult.totals.calories}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kcal</p>
              </div>
              <div>
                <p className="text-2xl font-black">{analysisResult.totals.protein_g}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Proteína</p>
              </div>
              <div>
                <p className="text-2xl font-black">{analysisResult.totals.carbs_g}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Carbo</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic text-center">
              {analysisResult.disclaimer}
            </p>

            <div className="flex gap-4">
              <button onClick={() => setAnalysisResult(null)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 rounded-2xl">Refazer</button>
              <button onClick={handleSave} className="flex-1 py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold">Salvar no Diário</button>
            </div>
          </div>
          
          {analysisResult.followUpQuestions.length > 0 && (
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] border border-amber-100 dark:border-amber-900/40">
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2">Para maior precisão, considere:</h4>
              <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-200 space-y-1">
                {analysisResult.followUpQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

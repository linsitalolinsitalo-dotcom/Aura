
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMeal } from '../services/geminiService';
import { storage } from '../services/storageService';
import { nutritionService } from '../services/nutritionService';
// Fix: Added DatabaseFood to types import
import { AIResponse, Meal, FoodItem, FoodSource, DatabaseFood } from '../types';
import { useAuth } from '../context/AuthContext';
// Fix: Removed incorrect DatabaseFood import from foodDatabase
import { FOOD_DATABASE } from '../data/foodDatabase';

export const FoodEntry: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'search' | 'ai'>('search');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DatabaseFood[]>([]);
  const [selectedFood, setSelectedFood] = useState<DatabaseFood | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('');
  
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tempMealItems, setTempMealItems] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState<Meal['type']>('lunch');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'search') {
      const results = nutritionService.searchFood(query);
      setSearchResults(results);
    }
  }, [query, activeTab]);

  useEffect(() => {
    if (selectedFood) {
      setUnit(selectedFood.servingSizes[0].unit);
    }
  }, [selectedFood]);

  const handleAddFromSearch = () => {
    if (!selectedFood) return;
    const newItem = nutritionService.calculateMacros(selectedFood, quantity, unit);
    setTempMealItems(prev => [...prev, newItem]);
    setSelectedFood(null);
    setQuery('');
  };

  const handleAnalyzeAI = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMeal(description);
      // Mesclar itens da IA com os já adicionados
      setTempMealItems(prev => [...prev, ...result.items]);
    } catch (err) {
      alert("Erro ao analisar com IA. Tente busca manual.");
    } finally {
      setIsAnalyzing(false);
      setDescription('');
    }
  };

  const calculateTotal = () => {
    return tempMealItems.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein_g: acc.protein_g + item.protein_g,
      carbs_g: acc.carbs_g + item.carbs_g,
      fat_g: acc.fat_g + item.fat_g,
      fiber_g: acc.fiber_g + (item.fiber_g || 0),
    }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 });
  };

  const handleSaveMeal = () => {
    if (tempMealItems.length === 0 || !currentUser) return;
    
    const totals = calculateTotal();
    const today = new Date().toISOString().split('T')[0];
    const log = storage.getDayLog(currentUser.id, today);
    
    const newMeal: Meal = {
      id: Date.now().toString(),
      type: mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: tempMealItems.map(i => i.name).join(', '),
      items: tempMealItems,
      totals,
      disclaimer: "Dados baseados em tabelas oficiais (TACO/TBCA) e IA."
    };

    log.meals.push(newMeal);
    storage.saveDayLog(currentUser.id, log);
    navigate('/');
  };

  return (
    <div className="py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Registro de Refeição</h1>
        <div className="flex gap-4 mt-4">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(t => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                mealType === t ? 'bg-blue-600 text-white border-transparent' : 'border-slate-200 dark:border-zinc-800 text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Selector Tabs */}
      <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'search' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-slate-400'}`}
        >
          🔍 Busca Precisa
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-slate-400'}`}
        >
          ✨ IA Inteligente
        </button>
      </div>

      {activeTab === 'search' ? (
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Procure arroz, feijão, frango..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          
          {selectedFood ? (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedFood.name}</h3>
                  <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-2 py-0.5 rounded-full uppercase">Fonte: {selectedFood.source}</span>
                </div>
                <button onClick={() => setSelectedFood(null)} className="text-slate-400">✕</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Quantidade</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 bg-white dark:bg-zinc-800 border-none rounded-xl p-3 font-bold"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Unidade</label>
                  <select 
                    className="w-full mt-1 bg-white dark:bg-zinc-800 border-none rounded-xl p-3 font-bold"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                  >
                    {selectedFood.servingSizes.map(s => <option key={s.unit} value={s.unit}>{s.unit}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleAddFromSearch}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20"
              >
                Adicionar Alimento
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFood(f)}
                  className="w-full p-4 bg-white dark:bg-zinc-900 rounded-2xl flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border border-slate-50 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-bold">{f.name}</p>
                    <p className="text-xs text-slate-400">{f.per_100g.kcal} kcal/100g • {f.source}</p>
                  </div>
                  <span className="text-blue-500 text-xl">+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            rows={4}
            className="w-full p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border-none shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva sua refeição... ex: Almocei 150g de frango, 4 colheres de arroz e muita salada."
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
          <button 
            onClick={handleAnalyzeAI}
            disabled={isAnalyzing}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isAnalyzing ? 'Analisando...' : '✨ Analisar Refeição'}
          </button>
        </div>
      )}

      {/* Meal Preview */}
      {tempMealItems.length > 0 && (
        <section className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Prato do Dia</h3>
            <button onClick={() => setTempMealItems([])} className="text-xs text-rose-500 font-bold">Limpar tudo</button>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-zinc-800/50 shadow-sm space-y-4">
            {tempMealItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center group">
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {item.name}
                    {item.source !== 'AI-ESTIMATED' && <span className="text-[8px] bg-green-100 text-green-600 px-1 rounded">PRECISO</span>}
                  </p>
                  <p className="text-xs text-slate-400">{item.quantityText} ({item.estimatedGrams}g)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-500">{item.calories} kcal</p>
                  <button 
                    onClick={() => setTempMealItems(prev => prev.filter((_, i) => i !== idx))}
                    className="text-[10px] text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    remover
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-4 text-center">
              <div>
                <p className="text-lg font-black">{calculateTotal().calories}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">kcal</p>
              </div>
              <div>
                <p className="text-lg font-black">{calculateTotal().protein_g.toFixed(0)}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Prot</p>
              </div>
              <div>
                <p className="text-lg font-black">{calculateTotal().carbs_g.toFixed(0)}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Carb</p>
              </div>
              <div>
                <p className="text-lg font-black">{calculateTotal().fat_g.toFixed(0)}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Gord</p>
              </div>
            </div>

            <button 
              onClick={handleSaveMeal}
              className="w-full py-5 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold text-lg"
            >
              Salvar Refeição
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

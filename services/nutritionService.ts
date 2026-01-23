
import { FOOD_DATABASE } from '../data/foodDatabase';
// Fix: Added DatabaseFood to types import and removed it from foodDatabase import
import { DatabaseFood, FoodItem, FoodSource } from '../types';

export const nutritionService = {
  searchFood(query: string): DatabaseFood[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    
    // Busca inteligente: Nome ou qualquer sinônimo
    return FOOD_DATABASE.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.synonyms.some(s => s.toLowerCase().includes(q))
    ).sort((a, b) => {
      // Prioridade: Início do nome > Nome contém > Sinônimo
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
      if (!aName.startsWith(q) && bName.startsWith(q)) return 1;
      return aName.localeCompare(bName);
    });
  },

  calculateMacros(food: DatabaseFood, quantity: number, unitName: string): FoodItem {
    const serving = food.servingSizes.find(s => s.unit === unitName);
    const gramsPerUnit = serving ? serving.grams : 1;
    const totalGrams = quantity * gramsPerUnit;

    const calc = (val100: number | null) => {
      if (val100 === null) return 0;
      return Number(((val100 * totalGrams) / 100).toFixed(1));
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      name: food.name,
      source: food.source as FoodSource,
      quantityText: `${quantity} ${unitName}`,
      selectedQuantity: quantity,
      selectedUnit: unitName,
      estimatedGrams: totalGrams,
      calories: Math.round((food.per_100g.kcal * totalGrams) / 100),
      protein_g: calc(food.per_100g.prot_g),
      carbs_g: calc(food.per_100g.carb_g),
      fat_g: calc(food.per_100g.fat_g),
      fiber_g: calc(food.per_100g.fiber_g),
      sodium_mg: calc(food.per_100g.sodium_mg),
      confidence: 1.0,
      notes: `Estado: ${food.state}. Fonte: ${food.source}.`
    };
  }
};

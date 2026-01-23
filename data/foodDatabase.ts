
import { DatabaseFood } from '../types';

export const FOOD_DATABASE: DatabaseFood[] = [
  // LOTE 1 - Cereais e Massas
  {
    id: 'taco-c1-01',
    name: 'Arroz branco cozido',
    category: 'Cereais',
    state: 'cozido',
    synonyms: ['arroz', 'arroz comum'],
    per_100g: { kcal: 128, carb_g: 28.1, prot_g: 2.5, fat_g: 0.2, fiber_g: 1.6, sodium_mg: 1 },
    source: 'TACO',
    servingSizes: [{ unit: 'colher de sopa', grams: 25 }, { unit: 'escumadeira', grams: 120 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-c1-02',
    name: 'Arroz integral cozido',
    category: 'Cereais',
    state: 'cozido',
    synonyms: ['arroz preto', 'arroz integral'],
    per_100g: { kcal: 124, carb_g: 25.8, prot_g: 2.6, fat_g: 1.0, fiber_g: 2.7, sodium_mg: 1 },
    source: 'TACO',
    servingSizes: [{ unit: 'colher de sopa', grams: 25 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-c1-03',
    name: 'Pão francês',
    category: 'Cereais',
    state: 'natural',
    synonyms: ['pãozinho', 'pão de sal'],
    per_100g: { kcal: 300, carb_g: 58.6, prot_g: 8.0, fat_g: 3.1, fiber_g: 2.3, sodium_mg: 648 },
    source: 'TACO',
    servingSizes: [{ unit: 'unidade', grams: 50 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-c1-04',
    name: 'Aveia em flocos',
    category: 'Cereais',
    state: 'natural',
    synonyms: ['aveia'],
    per_100g: { kcal: 394, carb_g: 66.6, prot_g: 13.9, fat_g: 8.5, fiber_g: 9.1, sodium_mg: 5 },
    source: 'TACO',
    servingSizes: [{ unit: 'colher de sopa', grams: 15 }, { unit: 'g', grams: 1 }]
  },

  // LOTE 2 - Tubérculos e Raízes
  {
    id: 'taco-t2-01',
    name: 'Batata inglesa cozida',
    category: 'Tubérculos',
    state: 'cozido',
    synonyms: ['batata', 'batatinha'],
    per_100g: { kcal: 52, carb_g: 11.9, prot_g: 1.2, fat_g: 0, fiber_g: 1.3, sodium_mg: 2 },
    source: 'TACO',
    servingSizes: [{ unit: 'unidade média', grams: 100 }, { unit: 'colher de sopa (picada)', grams: 30 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-t2-02',
    name: 'Mandioca cozida',
    category: 'Tubérculos',
    state: 'cozido',
    synonyms: ['aipim', 'macaxeira'],
    per_100g: { kcal: 125, carb_g: 30.1, prot_g: 0.6, fat_g: 0.3, fiber_g: 1.6, sodium_mg: 2 },
    source: 'TACO',
    servingSizes: [{ unit: 'pedaço médio', grams: 100 }, { unit: 'g', grams: 1 }]
  },

  // LOTE 3 - Leguminosas
  {
    id: 'taco-l3-01',
    name: 'Feijão carioca cozido',
    category: 'Leguminosas',
    state: 'cozido',
    synonyms: ['feijão'],
    per_100g: { kcal: 76, carb_g: 13.6, prot_g: 4.8, fat_g: 0.5, fiber_g: 8.5, sodium_mg: 2 },
    source: 'TACO',
    servingSizes: [{ unit: 'concha média', grams: 130 }, { unit: 'colher de sopa', grams: 20 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-l3-02',
    name: 'Grão-de-bico cozido',
    category: 'Leguminosas',
    state: 'cozido',
    synonyms: ['grão de bico'],
    per_100g: { kcal: 164, carb_g: 27.4, prot_g: 8.9, fat_g: 2.6, fiber_g: 7.6, sodium_mg: 5 },
    source: 'TACO',
    servingSizes: [{ unit: 'colher de sopa', grams: 25 }, { unit: 'g', grams: 1 }]
  },

  // LOTE 4 - Carnes e Aves
  {
    id: 'taco-m4-01',
    name: 'Frango peito grelhado',
    category: 'Aves',
    state: 'grelhado',
    synonyms: ['frango', 'peito de frango'],
    per_100g: { kcal: 159, carb_g: 0, prot_g: 32.0, fat_g: 2.5, fiber_g: 0, sodium_mg: 50 },
    source: 'TACO',
    servingSizes: [{ unit: 'filé médio', grams: 100 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-m4-02',
    name: 'Carne bovina patinho grelhado',
    category: 'Carnes',
    state: 'grelhado',
    synonyms: ['patinho', 'carne magra'],
    per_100g: { kcal: 219, carb_g: 0, prot_g: 35.9, fat_g: 7.3, fiber_g: 0, sodium_mg: 60 },
    source: 'TACO',
    servingSizes: [{ unit: 'bife médio', grams: 100 }, { unit: 'g', grams: 1 }]
  },

  // LOTE 5 - Ovos e Laticínios
  {
    id: 'taco-e5-01',
    name: 'Ovo de galinha cozido',
    category: 'Ovos',
    state: 'cozido',
    synonyms: ['ovo'],
    per_100g: { kcal: 146, carb_g: 0.6, prot_g: 13.3, fat_g: 9.5, fiber_g: 0, sodium_mg: 146 },
    source: 'TACO',
    servingSizes: [{ unit: 'unidade', grams: 50 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'tbca-d5-01',
    name: 'Iogurte natural integral',
    category: 'Laticínios',
    state: 'natural',
    synonyms: ['iogurte'],
    per_100g: { kcal: 61, carb_g: 4.7, prot_g: 3.5, fat_g: 3.3, fiber_g: 0, sodium_mg: 46 },
    source: 'TBCA',
    servingSizes: [{ unit: 'pote', grams: 170 }, { unit: 'copo', grams: 200 }, { unit: 'g', grams: 1 }]
  },

  // LOTE 6 - Frutas
  {
    id: 'taco-f6-01',
    name: 'Banana prata madura',
    category: 'Frutas',
    state: 'natural',
    synonyms: ['banana'],
    per_100g: { kcal: 98, carb_g: 26.0, prot_g: 1.3, fat_g: 0.1, fiber_g: 2.0, sodium_mg: 1 },
    source: 'TACO',
    servingSizes: [{ unit: 'unidade média', grams: 70 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-f6-02',
    name: 'Maçã fugi com casca',
    category: 'Frutas',
    state: 'natural',
    synonyms: ['maçã'],
    per_100g: { kcal: 56, carb_g: 15.2, prot_g: 0.3, fat_g: 0, fiber_g: 1.3, sodium_mg: 0 },
    source: 'TACO',
    servingSizes: [{ unit: 'unidade pequena', grams: 110 }, { unit: 'unidade média', grams: 150 }, { unit: 'g', grams: 1 }]
  },

  // LOTE 7 - Verduras e Legumes
  {
    id: 'taco-v7-01',
    name: 'Brócolis cozido',
    category: 'Legumes',
    state: 'cozido',
    synonyms: ['brócolis'],
    per_100g: { kcal: 25, carb_g: 4.4, prot_g: 2.1, fat_g: 0.5, fiber_g: 3.4, sodium_mg: 3 },
    source: 'TACO',
    servingSizes: [{ unit: 'ramo médio', grams: 40 }, { unit: 'colher de sopa', grams: 20 }, { unit: 'g', grams: 1 }]
  },
  {
    id: 'taco-v7-02',
    name: 'Alface americana crua',
    category: 'Verduras',
    state: 'natural',
    synonyms: ['alface'],
    per_100g: { kcal: 9, carb_g: 1.7, prot_g: 0.6, fat_g: 0.1, fiber_g: 1.0, sodium_mg: 4 },
    source: 'TACO',
    servingSizes: [{ unit: 'folha média', grams: 15 }, { unit: 'g', grams: 1 }]
  }
];

export const APP_VERSION = "1.1";
export const TOTAL_FOODS = FOOD_DATABASE.length;

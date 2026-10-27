import React, { useState } from 'react';
import { 
  Utensils, Scale, Search, Filter, Plus, CheckSquare, 
  Square, Sparkles, ChefHat, ShoppingBag, Lightbulb, Heart 
} from 'lucide-react';
import { FoodItem, FoodLog } from '../../types';
import { DEFAULT_FOOD_ITEMS } from '../../data/defaultFoods';
import { FoodScaleCalculator } from './FoodScaleCalculator';
import { GuiltFreeLogModal } from './GuiltFreeLogModal';

interface FoodViewProps {
  onAskAI: (prompt: string) => void;
}

export const FoodView: React.FC<FoodViewProps> = ({ onAskAI }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'scale' | 'grocery' | 'leftovers'>('library');
  const [filter, setFilter] = useState<'all' | 'veg' | 'non-veg' | 'budget'>('all');
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isGuiltFreeModalOpen, setIsGuiltFreeModalOpen] = useState(false);

  // Grocery list items state
  const [groceryItems, setGroceryItems] = useState([
    { id: '1', name: 'Sona Masoori Rice (1 kg)', checked: false, category: 'Grains' },
    { id: '2', name: 'Toor Dal (500g)', checked: true, category: 'Pulses' },
    { id: '3', name: 'Ragi Flour / Finger Millet (500g)', checked: false, category: 'Grains' },
    { id: '4', name: 'Farm Eggs (Pack of 6 or 12)', checked: false, category: 'Proteins' },
    { id: '5', name: 'Fresh Boneless Chicken (500g)', checked: false, category: 'Proteins' },
    { id: '6', name: 'French Beans & Carrots (500g)', checked: true, category: 'Vegetables' },
    { id: '7', name: 'Fresh Curd / Milk', checked: false, category: 'Dairy' },
    { id: '8', name: 'Roasted Chana / Puri Kadale (200g)', checked: false, category: 'Snacks' },
    { id: '9', name: 'Tender Coconut (Elaneeru)', checked: false, category: 'Hydration' },
  ]);

  const toggleGrocery = (id: string) => {
    setGroceryItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const filteredFoods = DEFAULT_FOOD_ITEMS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          (f.kannadaName && f.kannadaName.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === 'veg') return f.isVegetarian && !f.isEgg;
    if (filter === 'non-veg') return !f.isVegetarian || f.isEgg;
    if (filter === 'budget') return f.isBudgetFriendly;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Top Header */}
      <div className="rounded-3xl bg-white/90 p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
                Indian Meal Planner & Kitchen Scale
              </h2>
              <p className="text-xs sm:text-sm text-plum-500 font-sans">
                South Indian home food • Non-veg & veg • Accurate raw/cooked scale tracking
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGuiltFreeModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white rounded-2xl text-xs font-bold shadow-soft transition-all active:scale-95 shrink-0"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>I Ate Something Different</span>
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex space-x-1.5 p-1 bg-cream-100 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'library'
                ? 'bg-white text-plum-900 shadow-sm'
                : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            Food Library & Ratios
          </button>
          <button
            onClick={() => setActiveTab('scale')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'scale'
                ? 'bg-white text-plum-900 shadow-sm'
                : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            Scale Converter
          </button>
          <button
            onClick={() => setActiveTab('leftovers')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'leftovers'
                ? 'bg-white text-plum-900 shadow-sm'
                : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            Smart Leftovers
          </button>
          <button
            onClick={() => setActiveTab('grocery')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'grocery'
                ? 'bg-white text-plum-900 shadow-sm'
                : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            Grocery List
          </button>
        </div>
      </div>

      {/* Tab: Scale Converter */}
      {activeTab === 'scale' && (
        <FoodScaleCalculator />
      )}

      {/* Tab: Food Library */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-plum-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rice, ragi, chicken, sambar, curd..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-cream-300 rounded-2xl text-xs sm:text-sm text-plum-900 focus:outline-none focus:border-roseDust-400 shadow-2xs"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'veg', label: 'Vegetarian' },
                { id: 'non-veg', label: 'Non-Veg & Eggs' },
                { id: 'budget', label: 'Pantry / Budget' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-plum-900 text-white shadow-2xs'
                      : 'bg-white hover:bg-cream-100 text-plum-700 border border-cream-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Food Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="p-4 rounded-3xl bg-white/95 border border-cream-200 hover:border-roseDust-300 shadow-soft cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-plum-950 text-sm sm:text-base">
                      {food.name}
                    </h4>
                    {food.kannadaName && (
                      <span className="text-[11px] text-plum-500 block">
                        {food.kannadaName}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    food.state === 'RAW/DRY'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-sageCare-50 text-sageCare-700 border-sageCare-200'
                  }`}>
                    {food.state}
                  </span>
                </div>

                <p className="text-xs text-plum-600 mt-1.5 line-clamp-2">
                  {food.description}
                </p>

                {/* Scale Tip Highlight */}
                <div className="mt-2.5 p-2 bg-cream-50 rounded-xl text-[11px] text-plum-700 border border-cream-200 flex items-start space-x-1.5">
                  <Scale className="w-3.5 h-3.5 text-roseDust-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{food.scaleTip}</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] text-plum-500">
                  <span>Per 100g: ~{food.caloriesPer100g} kcal</span>
                  <span className="font-semibold text-roseDust-600">~{food.proteinPer100g}g protein</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Smart Leftovers */}
      {activeTab === 'leftovers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white/95 border border-cream-300 shadow-soft">
            <div className="flex items-center space-x-2 text-roseDust-600 mb-2">
              <ChefHat className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-plum-950">
                Smart Leftovers & Budget-Friendly Cooking
              </h3>
            </div>
            <p className="text-xs text-plum-600 leading-relaxed mb-4">
              Save time, money, and mental energy by transforming yesterday’s home dishes into fresh, balanced meals.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-600 block">
                  Leftover Sambar
                </span>
                <h4 className="font-bold text-plum-900 text-sm mt-0.5">
                  5-Minute Sambar Avalakki (Flattened Rice)
                </h4>
                <p className="text-xs text-plum-600 mt-1">
                  Rinse 40g of dry poha, heat yesterday\'s sambar, fold the poha into the simmering sambar for 2 minutes, and top with roasted peanuts. Instant high-comfort breakfast!
                </p>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-600 block">
                  Leftover Chicken Curry
                </span>
                <h4 className="font-bold text-plum-900 text-sm mt-0.5">
                  High-Protein Shredded Chicken Chapati Roll
                </h4>
                <p className="text-xs text-plum-600 mt-1">
                  Shred 100g of cooked chicken, warm it in a pan with 1 tbsp gravy, wrap inside 1 warm whole wheat chapati with sliced onions and cucumber. 22g protein in minutes!
                </p>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-600 block">
                  Leftover Steamed Rice
                </span>
                <h4 className="font-bold text-plum-900 text-sm mt-0.5">
                  Cooling Curd Rice (Bagala Bath) with Mustard Tempering
                </h4>
                <p className="text-xs text-plum-600 mt-1">
                  Mash 120g of cooked rice with 100g fresh curd and a splash of milk. Temper with mustard seeds, curry leaves, and grated ginger. The ultimate gut-healing comfort meal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Grocery List */}
      {activeTab === 'grocery' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border border-cream-300 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-roseDust-500" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
                Interactive Weekly Grocery List
              </h3>
            </div>
            <span className="text-xs text-plum-500">
              {groceryItems.filter(g => g.checked).length} of {groceryItems.length} purchased
            </span>
          </div>

          <p className="text-xs text-plum-600 mb-4">
            Curated from your South Indian meal plan. Tap items to check them off as you shop.
          </p>

          <div className="space-y-2">
            {groceryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleGrocery(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  item.checked
                    ? 'bg-sageCare-50/70 border border-sageCare-200 text-plum-400'
                    : 'bg-cream-50 hover:bg-cream-100 border border-cream-200 text-plum-800'
                }`}
              >
                {item.checked ? (
                  <CheckSquare className="w-5 h-5 text-sageCare-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-plum-400 shrink-0" />
                )}
                <span className={`text-xs sm:text-sm flex-1 ${item.checked ? 'line-through' : 'font-medium'}`}>
                  {item.name}
                </span>
                <span className="text-[10px] text-plum-600 bg-white px-2 py-0.5 rounded-md border border-cream-200 font-semibold">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-cream-200 flex justify-between items-center text-xs">
            <span className="text-plum-500 italic">Affordable local staples available in any Bengaluru market.</span>
            <button
              onClick={() => onAskAI('Can you generate a budget-friendly grocery shopping list for me?')}
              className="text-roseDust-600 font-bold hover:underline flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Rosy to customize list</span>
            </button>
          </div>
        </div>
      )}

      {/* Guilt-Free Log Modal */}
      <GuiltFreeLogModal
        isOpen={isGuiltFreeModalOpen}
        onClose={() => setIsGuiltFreeModalOpen(false)}
        onLoggedSuccess={() => {
          alert('Meal saved with self-kindness! ❤️');
        }}
      />
    </div>
  );
};

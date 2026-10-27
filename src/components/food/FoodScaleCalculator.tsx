import React, { useState } from 'react';
import { Scale, ArrowRightLeft, Info, Check, Sparkles } from 'lucide-react';

export const FoodScaleCalculator: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<'rice' | 'chicken' | 'dal' | 'ragi' | 'atta'>('rice');
  const [inputWeight, setInputWeight] = useState<number>(60);
  const [inputState, setInputState] = useState<'RAW' | 'COOKED'>('RAW');

  const conversions = {
    rice: {
      name: 'Sona Masoori White Rice',
      ratio: 2.8, // 1g raw -> 2.8g cooked
      rawNote: 'Dry raw grains before boiling',
      cookedNote: 'Fluffy steamed rice on your dinner plate',
      scaleTip: 'Rice absorbs almost 3x its weight in water! 60g dry raw rice yields ~168g cooked rice.'
    },
    chicken: {
      name: 'Chicken Breast / Tenderloin',
      ratio: 0.75, // 1g raw -> 0.75g cooked
      rawNote: 'Raw boneless meat',
      cookedNote: 'Cooked curry/stir-fry edible meat',
      scaleTip: 'Meat releases water while cooking. 150g raw meat cooks down to ~112g on your plate. We adjust protein so you don\'t under-eat!'
    },
    dal: {
      name: 'Toor / Moong Dal',
      ratio: 2.6, // 1g raw -> 2.6g cooked
      rawNote: 'Dry lentils from the pantry jar',
      cookedNote: 'Boiled thick dal / sambar base',
      scaleTip: '35g dry raw dal expands into a satisfying 150ml bowl of cooked dal.'
    },
    ragi: {
      name: 'Ragi Flour (Finger Millet)',
      ratio: 2.2,
      rawNote: 'Dry ragi flour',
      cookedNote: 'Wholesome cooked Ragi Roti / Mudde',
      scaleTip: '50g dry ragi flour makes 1 nourishing ragi roti loaded with natural calcium and fibre.'
    },
    atta: {
      name: 'Whole Wheat Atta',
      ratio: 1.3,
      rawNote: 'Dry flour before kneading with water',
      cookedNote: 'Rolled and puffed chapati on tava',
      scaleTip: '60g dry atta dough rolls into 2 soft home chapatis (~75g to 80g total cooked weight).'
    }
  };

  const curr = conversions[selectedItem];

  let calculatedEquivalent = 0;
  if (inputState === 'RAW') {
    calculatedEquivalent = Math.round(inputWeight * curr.ratio);
  } else {
    calculatedEquivalent = Math.round(inputWeight / curr.ratio);
  }

  return (
    <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft">
      <div className="flex items-center space-x-2.5 mb-3">
        <div className="p-2 bg-roseDust-100 text-roseDust-600 rounded-2xl">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
            Kitchen Food-Scale Confidence & Converter
          </h3>
          <p className="text-xs text-plum-500">
            Clear distinction between Raw/Dry vs Cooked/Ready-to-eat
          </p>
        </div>
      </div>

      <div className="p-3 bg-cream-100/80 rounded-2xl border border-cream-200 text-xs text-plum-700 mb-4 leading-relaxed flex items-start space-x-2">
        <Info className="w-4 h-4 text-roseDust-500 shrink-0 mt-0.5" />
        <p>
          <strong>Scale Golden Rule:</strong> The kitchen scale is a tool for self-awareness and learning portion sizes — <em>never for obsessive perfection</em>. Cooking adds or removes water weight, which is why raw and cooked weights differ.
        </p>
      </div>

      {/* Select Food Type */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(conversions) as (keyof typeof conversions)[]).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedItem(key);
              setInputWeight(key === 'chicken' ? 150 : 60);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedItem === key
                ? 'bg-plum-900 text-white shadow-2xs'
                : 'bg-cream-100 hover:bg-cream-200 text-plum-700 border border-cream-200'
            }`}
          >
            {conversions[key].name}
          </button>
        ))}
      </div>

      {/* Converter Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gradient-to-r from-cream-50 to-roseDust-50/50 rounded-2xl border border-roseDust-200/80">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-plum-600 block mb-1">
            I am weighing this as:
          </label>
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => setInputState('RAW')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                inputState === 'RAW'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white text-plum-600 border border-cream-200'
              }`}
            >
              RAW / DRY
            </button>
            <button
              onClick={() => setInputState('COOKED')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                inputState === 'COOKED'
                  ? 'bg-sageCare-100 text-sageCare-900 border border-sageCare-300'
                  : 'bg-white text-plum-600 border border-cream-200'
              }`}
            >
              COOKED ON PLATE
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={inputWeight || ''}
              onChange={(e) => setInputWeight(Number(e.target.value) || 0)}
              className="w-28 px-3 py-2 rounded-xl bg-white border border-cream-300 font-bold text-sm text-plum-900 focus:outline-none focus:border-roseDust-400"
            />
            <span className="text-xs font-bold text-plum-600">grams</span>
          </div>
          <span className="text-[10px] text-plum-500 block mt-1">
            {inputState === 'RAW' ? curr.rawNote : curr.cookedNote}
          </span>
        </div>

        {/* Calculated result */}
        <div className="flex flex-col justify-center sm:border-l sm:border-cream-200 sm:pl-4 mt-2 sm:mt-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-roseDust-600 block mb-1">
            Equals Approximately:
          </span>
          <div className="text-2xl font-serif font-bold text-plum-950">
            ~{calculatedEquivalent} grams
          </div>
          <span className="text-xs font-semibold text-plum-700">
            {inputState === 'RAW' ? 'Cooked & Ready-to-eat' : 'Dry / Raw ingredient'}
          </span>
          <div className="text-[11px] text-plum-500 mt-1 italic">
            *Cooking varies with water and simmering time.
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-white rounded-xl border border-cream-200 text-xs text-plum-700 flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{curr.scaleTip}</span>
      </div>
    </div>
  );
};

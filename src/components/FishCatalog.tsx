import React, { useState } from 'react';
import { Search, SlidersHorizontal, Droplets, Waves, Check } from 'lucide-react';
import { FishItem } from '../types';
import { FishCard } from './FishCard';

interface FishCatalogProps {
  items: FishItem[];
  onSelectFish: (fish: FishItem) => void;
}

export const FishCatalog: React.FC<FishCatalogProps> = ({ items, onSelectFish }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'freshwater' | 'seawater'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [boneFilter, setBoneFilter] = useState<'all' | 'single_bone' | 'boneless_fillet'>('all');

  // Filter items
  const filteredItems = items.filter((item) => {
    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Bone filter
    if (boneFilter === 'single_bone' && item.boneType !== 'single_bone') {
      return false;
    }
    if (boneFilter === 'boneless_fillet' && item.boneType !== 'boneless_fillet') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchUrdu = item.urduName.includes(q);
      const matchDesc = item.description.toLowerCase().includes(q) || item.urduDescription.includes(q);
      const matchOrigin = item.origin.toLowerCase().includes(q);
      if (!matchName && !matchUrdu && !matchDesc && !matchOrigin) {
        return false;
      }
    }

    return true;
  });

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-1">
              رحیم یار خان سپیشل مچھلی ورائٹی
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              میٹھے پانی اور سمندری پانی کی تازہ مچھلیاں
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ہر قسم کی کٹائی اور صفائی بالکل مفت، روزانہ تازہ سپلائی
            </p>
          </div>

          {/* Interactive Filter Bar / Segmented Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تمام ورائٹی ({items.length})
            </button>
            <button
              onClick={() => setSelectedCategory('freshwater')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'freshwater'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-600" />
              <span>میٹھے پانی (دریائی)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('seawater')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'seawater'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-blue-600" />
              <span>سمندری مچھلی (کراچی)</span>
            </button>
          </div>
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="مچھلی تلاش کریں (مثلاً: روہو، سنگھارا، سرمئی، پاپلیٹ)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right sm:text-left"
            />
          </div>

          {/* Quick Bone Preference Filters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">کانٹے کا انتخاب:</span>
            <button
              onClick={() => setBoneFilter(boneFilter === 'single_bone' ? 'all' : 'single_bone')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                boneFilter === 'single_bone'
                  ? 'bg-cyan-50 border-cyan-500 text-cyan-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              صرف سنگل کانٹا
            </button>
            <button
              onClick={() => setBoneFilter(boneFilter === 'boneless_fillet' ? 'all' : 'boneless_fillet')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                boneFilter === 'boneless_fillet'
                  ? 'bg-cyan-50 border-cyan-500 text-cyan-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              100% بغیر کانٹے (Boneless)
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((fish) => (
              <FishCard key={fish.id} fish={fish} onSelect={onSelectFish} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <span className="text-4xl mb-3 block">🐟</span>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              اس فلٹر کے مطابق کوئی مچھلی نہیں ملی
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              براہ کرم سرچ کے الفاظ تبدیل کریں یا تمام مچھلیاں دیکھیں۔
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setBoneFilter('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              تمام مچھلیاں دوبارہ دکھائیں
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

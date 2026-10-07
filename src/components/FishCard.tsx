import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { FishItem } from '../types';
import { formatPKR } from '../utils/storage';

interface FishCardProps {
  fish: FishItem;
  onSelect: (fish: FishItem) => void;
}

export const FishCard: React.FC<FishCardProps> = ({ fish, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  const getBoneSummary = (b: string) => {
    switch (b) {
      case 'single_bone': return 'سنگل کانٹا (Single Bone)';
      case 'boneless_fillet': return 'بغیر کانٹے (100% Boneless)';
      case 'low_bones': return 'بہت کم کانٹے';
      default: return 'روایتی قتلے';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full">
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imgError ? (
          <img
            src={fish.image}
            alt={fish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-4xl mb-1">🐟</span>
            <span className="text-xs font-bold text-slate-600">{fish.name}</span>
            <span className="text-[11px] text-slate-400">تازہ مچھلی رحیم یار خان</span>
          </div>
        )}

        {/* Subtle Water Type Tag (Single quiet element) */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold rounded-md">
            {fish.category === 'freshwater' ? 'میٹھے پانی کی' : 'سمندری مچھلی'}
          </span>
        </div>

        {!fish.inStock && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-md shadow">
              آج کا سٹاک ختم (Out of Stock)
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span>{fish.origin}</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-medium">{getBoneSummary(fish.boneType)}</span>
          </div>

          {/* Title in Urdu & English */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
            {fish.name}
          </h3>
          <h4 className="text-sm font-semibold text-slate-600 mb-2">
            {fish.urduName}
          </h4>

          {/* Short description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {fish.urduDescription}
          </p>
        </div>

        {/* Price and CTA Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">ریٹ فی کلو</span>
            <span className="text-base sm:text-lg font-black text-slate-900 font-mono tabular-nums">
              {formatPKR(fish.pricePerKg)}
            </span>
          </div>

          <button
            onClick={() => onSelect(fish)}
            disabled={!fish.inStock}
            className="px-3.5 py-2 bg-slate-900 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>منتخب کریں</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

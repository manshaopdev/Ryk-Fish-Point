import React, { useState } from 'react';
import { X, Check, ShoppingBag, MessageSquare, Flame, Sparkles, Scale, Info } from 'lucide-react';
import { FishItem, CartItem } from '../types';
import { CUTTING_OPTIONS, OFFICIAL_WHATSAPP } from '../data/initialFish';
import { formatPKR } from '../utils/storage';

interface FishDetailModalProps {
  fish: FishItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onDirectOrder: (item: CartItem) => void;
}

export const FishDetailModal: React.FC<FishDetailModalProps> = ({
  fish,
  onClose,
  onAddToCart,
  onDirectOrder
}) => {
  if (!fish) return null;

  const [weightKg, setWeightKg] = useState<number>(fish.minWeightKg || 1);
  const [selectedCutting, setSelectedCutting] = useState<string>(CUTTING_OPTIONS[0].label);
  const [instructions, setInstructions] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState(false);

  const weightPresets = [1, 1.5, 2, 2.5, 3, 4, 5];

  const totalCalculatedPrice = Math.round(weightKg * fish.pricePerKg);

  const handleAdd = () => {
    const cartItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fish,
      weightKg,
      cuttingOption: selectedCutting,
      specialInstructions: instructions.trim() || undefined,
      itemTotal: totalCalculatedPrice
    };

    onAddToCart(cartItem);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  const handleWhatsAppInstant = () => {
    const cartItem: CartItem = {
      cartItemId: `item-${Date.now()}`,
      fish,
      weightKg,
      cuttingOption: selectedCutting,
      specialInstructions: instructions.trim() || undefined,
      itemTotal: totalCalculatedPrice
    };

    const text = encodeURIComponent(
      `السلام علیکم! مجھے رحیم یار خان میں مچھلی آرڈر کرنی ہے:\n\n` +
      `🐟 مچھلی: ${fish.name} (${fish.urduName})\n` +
      `⚖️ وزن: ${weightKg} کلو\n` +
      `🔪 کٹائی و صفائی: ${selectedCutting}\n` +
      `💰 کل قیمت: Rs. ${totalCalculatedPrice.toLocaleString('en-PK')} (${formatPKR(fish.pricePerKg)} فی کلو)\n` +
      (instructions ? `📝 خصوصی ہدایات: ${instructions}\n` : '') +
      `\nبرائے مہربانی ڈیلیوری وقت بتائیں!`
    );

    window.open(`https://wa.me/923023608248?text=${text}`, '_blank');
  };

  const getCookingLabel = (m: string) => {
    switch (m) {
      case 'fry': return 'لاہوری فش فرائی کے لیے بہترین';
      case 'salan': return 'شوربے اور کڑاہی سالن کے لیے زبردست';
      case 'bbq_grill': return 'کوئلہ باربی کیو اور تندوری تکہ';
      case 'steam_tandoor': return 'سٹیم اور بیکنگ کے لیے آئیڈیل';
      default: return 'ہر قسم کے پکوان کے لیے';
    }
  };

  const getBoneLabel = (b: string) => {
    switch (b) {
      case 'single_bone': return 'صرف 1 کانٹا (بغیر باریک کانٹوں کے)';
      case 'low_bones': return 'بہت کم کانٹے (آسانی سے کھانے والی)';
      case 'boneless_fillet': return '100% بغیر کانٹے (خالص گوشت)';
      case 'moderate': return 'روایتی کانٹے (میٹھے پانی کے اصلی قتلے)';
      default: return 'معیاری قتلے';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-sm cursor-pointer"
          aria-label="بند کریں"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Fish Visual Header */}
        <div className="relative h-48 sm:h-64 bg-slate-100 overflow-hidden">
          <img
            src={fish.image}
            alt={fish.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1">
              <span>{fish.category === 'freshwater' ? 'میٹھے پانی کی مچھلی (دریائی)' : 'سمندری مچھلی (کراچی فریش)'}</span>
              <span>·</span>
              <span>{fish.origin}</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {fish.name} <span className="font-bold text-cyan-200 text-lg">({fish.urduName})</span>
              </h2>
              <div className="text-right">
                <span className="text-xs text-slate-300 block">ریٹ فی کلو</span>
                <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tabular-nums">
                  {formatPKR(fish.pricePerKg)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[calc(85vh-16rem)] overflow-y-auto">
          {/* Details & Flavor Notes */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {fish.urduDescription}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-semibold text-slate-800">کانٹے:</span> {getBoneLabel(fish.boneType)}
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold text-slate-800">بہترین پکوان:</span> {getCookingLabel(fish.bestCooking)}
              </div>
            </div>
          </div>

          {/* 1. Weight Selection (وزن کا انتخاب) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-cyan-600" />
                <span>وزن منتخب کریں (Weight in KG):</span>
              </label>
              <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                منتخب: {weightKg} کلو
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {weightPresets.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeightKg(w)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    weightKg === w
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-400 hover:bg-slate-50'
                  }`}
                >
                  {w} کلو
                </button>
              ))}
            </div>

            {/* Custom Weight Stepper */}
            <div className="flex items-center justify-between mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">دیگر مخصوص وزن ایڈجسٹ کریں:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeightKg(Math.max(fish.minWeightKg || 0.5, +(weightKg - 0.5).toFixed(1)))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-900 w-12 text-center text-sm">
                  {weightKg} KG
                </span>
                <button
                  type="button"
                  onClick={() => setWeightKg(+(weightKg + 0.5).toFixed(1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 2. Cutting & Cleaning Selection (صفائی اور کٹائی کا طریقہ) */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-2">
              کٹائی اور صفائی کا انداز (مفت سروس):
            </label>
            <div className="space-y-2">
              {CUTTING_OPTIONS.map((opt) => {
                const isSelected = selectedCutting === opt.label || selectedCutting === opt.urduLabel;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCutting(opt.label)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-50/70 border-cyan-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {opt.urduLabel}
                        </span>
                        <span className="text-xs text-slate-500 font-normal">
                          ({opt.label})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                      isSelected ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Special Request / Notes */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1">
              خصوصی ہدایات (مثلاً: ہلکا مسالا، قتلے پتلے یا موٹے):
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="مثال: براہ کرم قتلے فرائی کے لیے درمیانے سائز کے رکھیں..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Modal Footer with Calculated Total & Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              کل متوقع رقم ({weightKg} کلو):
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {formatPKR(totalCalculatedPrice)}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              onClick={handleWhatsAppInstant}
              type="button"
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>واٹس ایپ آرڈر</span>
            </button>

            <button
              onClick={handleAdd}
              type="button"
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                addedNotice
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>آرڈر میں شامل ہو گیا!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>آرڈر لسٹ میں ڈالیں</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

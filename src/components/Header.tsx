import React from 'react';
import { ShoppingBag, Search, Shield, Phone, MessageSquare, MapPin } from 'lucide-react';
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from '../data/initialFish';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracker,
  onOpenAdmin,
  onNavigateSection
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Notice Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-emerald-400">صرف رحیم یار خان میں سروس</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-300 hidden sm:inline">روزانہ صبح کی تازہ مچھلی | ماہرانہ کٹائی و صفائی</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a 
              href={`https://wa.me/923023608248?text=${encodeURIComponent('السلام علیکم! مجھے رحیم یار خان میں تازہ مچھلی کا آرڈر کرنا ہے۔')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واٹس ایپ: {OFFICIAL_WHATSAPP}</span>
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <a 
              href={`tel:${OFFICIAL_PHONE}`}
              className="hidden md:flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>کال: {OFFICIAL_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element with clean styling) */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🐟</span>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
                RYK FISH POINT
              </span>
              <span className="block text-xs font-semibold text-cyan-700 -mt-0.5">
                رحیم یار خان تازہ مچھلی پوائنٹ
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean text with hover underlines) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <button
            onClick={() => onNavigateSection('freshwater')}
            className="hover:text-cyan-600 transition-colors cursor-pointer"
          >
            میٹھے پانی کی مچھلی (دریائی)
          </button>
          <button
            onClick={() => onNavigateSection('seawater')}
            className="hover:text-cyan-600 transition-colors cursor-pointer"
          >
            سمندری مچھلی (کراچی فریش)
          </button>
          <button
            onClick={onOpenTracker}
            className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <MapPin className="w-4 h-4 text-cyan-600" />
            <span>آرڈر لائیو ٹریک کریں</span>
          </button>
          <button
            onClick={() => onNavigateSection('coverage')}
            className="hover:text-cyan-600 transition-colors cursor-pointer"
          >
            رحیم یار خان ڈلیوری زونز
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Cart + Admin Panel) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Track Mobile Button */}
          <button
            onClick={onOpenTracker}
            className="lg:hidden p-2 text-slate-700 hover:text-cyan-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="آرڈر ٹریک کریں"
          >
            <MapPin className="w-5 h-5 text-cyan-600" />
          </button>

          {/* Admin Panel Button */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
            title="ایڈمن پینل (پاسورڈ درکار ہے)"
          >
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">ایڈمن پینل</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3 sm:px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">آپ کا آرڈر</span>
            {cartCount > 0 && (
              <span className="bg-white text-cyan-700 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

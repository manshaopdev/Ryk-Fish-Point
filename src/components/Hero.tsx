import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles, MapPin, Phone, MessageSquare, ArrowDown } from 'lucide-react';
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from '../data/initialFish';

interface HeroProps {
  onOrderNow: () => void;
  onOpenTracker: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onOpenTracker }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Background Hero Banner with High Contrast Scrim */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/src/assets/images/hero_ryk_fresh_fish_1791374550335.jpg"
          alt="Fresh fish market display Rahim Yar Khan"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-3xl">
          {/* Unboxed Metadata Trust Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-4">
            <span>رحیم یار خان سپیشل</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>صرف RYK شہر و مضافات</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>دریائی پنجند و کراچی سمندری مچھلی</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>فری کٹائی و صفائی</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none mb-6">
            رحیم یار خان میں <span className="text-cyan-400 underline decoration-cyan-500/40">100% تازہ مچھلی</span> آپ کے گھر کی دہلیز پر
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            پنجند اور دریائے سندھ کے میٹھے پانی کی تازہ روہو اور سنگھارا سے لے کر، کراچی کی مشہور سمندری سرمئی اور پاپلیٹ تک۔ ماہر کاریگروں سے حسب پسند کٹائی اور آئس باکس میں لائیو ڈلیوری ٹریکنگ کے ساتھ۔
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onOrderNow}
              className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-xl shadow-cyan-950/50 flex items-center gap-2 cursor-pointer"
            >
              <span>مچھلی منتخب کریں اور آرڈر دیں</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTracker}
              className="px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold rounded-xl text-sm sm:text-base border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>اپنا آرڈر لائیو ٹریک کریں</span>
            </button>

            <a
              href={`https://wa.me/923023608248?text=${encodeURIComponent('السلام علیکم! رحیم یار خان مچھلی کا ریٹ لسٹ اور بکنگ چاہیے۔')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>واٹس ایپ آرڈر: {OFFICIAL_WHATSAPP}</span>
            </a>
          </div>

          {/* Trust Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
              <div className="text-cyan-400 mb-1">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-400 font-medium">ڈلیوری کوریج</div>
              <div className="text-sm font-bold text-white">صرف رحیم یار خان</div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
              <div className="text-emerald-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-400 font-medium">معیار کی ضمانت</div>
              <div className="text-sm font-bold text-white">100% روزانہ تازہ کیچ</div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
              <div className="text-amber-400 mb-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-400 font-medium">صفائی و کٹائی</div>
              <div className="text-sm font-bold text-white">کسٹمر کی مرضی کے قتلے</div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
              <div className="text-purple-400 mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-400 font-medium">سپیڈ ٹائمنگ</div>
              <div className="text-sm font-bold text-white">45-60 منٹ ایکسپریس</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

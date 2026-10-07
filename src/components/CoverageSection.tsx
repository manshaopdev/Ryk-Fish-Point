import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Truck, Navigation } from 'lucide-react';
import { RYK_DELIVERY_AREAS, OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from '../data/initialFish';

export const CoverageSection: React.FC = () => {
  return (
    <section id="coverage-section" className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Info & Areas */}
          <div>
            <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-1">
              خصوصی لوکل سروس (Local Delivery Only)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
              صرف رحیم یار خان شہر اور قریبی علاقوں کے لیے
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              ہماری تمام مچھلی روزانہ صبح تازہ منگوائی جاتی ہے اور برف کے تھرمل کنٹینرز میں رحیم یار خان کے تمام علاقوں میں ایکسپریس ڈلیور کی جاتی ہے۔ دوسرے شہروں میں ڈلیوری نہیں ہوتی تاکہ مچھلی کی تازگی 100% برقرار رہے۔
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">ڈلیوری کے اوقات</h4>
                  <p className="text-xs text-slate-500">صبح 8:00 بجے سے رات 11:00 بجے تک (ہفتے کے تمام 7 دن)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">سپیڈ ایکسپریس ڈلیوری</h4>
                  <p className="text-xs text-slate-500">آرڈر کے 45 سے 60 منٹ میں لائیو لوکیشن پر دستیابی</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">صفائی و کٹائی کی مفت سہولت</h4>
                  <p className="text-xs text-slate-500">کٹائی، کانٹے نکالنا اور نمک و اجوائن کسٹمر کی خواہش کے مطابق</p>
                </div>
              </div>
            </div>

            {/* Official Contact Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <a
                href={`https://wa.me/923023608248?text=${encodeURIComponent('السلام علیکم! رحیم یار خان میں مچھلی کی بکنگ چاہیے۔')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>واٹس ایپ آرڈر: {OFFICIAL_WHATSAPP}</span>
              </a>

              <a
                href={`tel:${OFFICIAL_PHONE}`}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>کال رابطہ: {OFFICIAL_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Active Zones Grid */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  رحیم یار خان کے کورڈ رہائشی علاقے
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                100% کوریج
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              اگر آپ کا علاقہ درج ذیل فہرست میں ہے تو رائیڈر فوری لائیو ٹریکنگ کے ساتھ پہنچے گا:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {RYK_DELIVERY_AREAS.map((area, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white rounded-xl border border-slate-200/80 font-medium text-slate-800 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                  <span className="truncate">{area}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-cyan-50/80 rounded-xl border border-cyan-200 text-xs text-cyan-900">
              <span className="font-bold">نوٹ برائے کسٹمرز:</span> آپ اپنا درست ایڈریس یا پن لوکیشن واٹس ایپ نمبر <strong className="font-mono">{OFFICIAL_WHATSAPP}</strong> پر بھی بھیج سکتے ہیں۔
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

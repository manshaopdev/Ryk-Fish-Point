import React from 'react';
import { Phone, MessageSquare, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from '../data/initialFish';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracker,
  onOpenAdmin,
  onNavigateSection
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐟</span>
              <span className="text-xl font-black text-white tracking-tight">
                RYK FISH POINT
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              رحیم یار خان کی اولین مخصوص تازہ مچھلی سروس۔ پنجند، دریائے سندھ اور کراچی کے ساحل سے روزانہ تازہ کیچ آپ کے گھر تک۔
            </p>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>صرف رحیم یار خان میں سپلائی</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-sm mb-3">اہم لنکس</h4>
            <div>
              <button
                onClick={() => onNavigateSection('freshwater')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                دریائی مچھلی (روہو، سنگھارا، تھیلا)
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigateSection('seawater')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                سمندری مچھلی (سرمئی، پاپلیٹ، جھینگا)
              </button>
            </div>
            <div>
              <button
                onClick={onOpenTracker}
                className="hover:text-cyan-400 transition-colors cursor-pointer text-cyan-400 font-semibold"
              >
                آرڈر لائیو ٹریکنگ (Live Map)
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigateSection('coverage')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                رحیم یار خان ڈلیوری ایریاز
              </button>
            </div>
            <div>
              <button
                onClick={onOpenAdmin}
                className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
              >
                ایڈمن لاگ ان (Admin Login)
              </button>
            </div>
          </div>

          {/* Col 3: Official Contacts */}
          <div className="space-y-3 text-xs md:col-span-2">
            <h4 className="font-bold text-white text-sm mb-3">رابطہ اور واٹس ایپ آرڈر</h4>
            
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">آفیشل واٹس ایپ:</span>
                <a
                  href={`https://wa.me/923023608248?text=${encodeURIComponent('السلام علیکم! رحیم یار خان مچھلی کا آرڈر بک کروانا ہے۔')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{OFFICIAL_WHATSAPP}</span>
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">کال اور شکایات نمبر:</span>
                <a
                  href={`tel:${OFFICIAL_PHONE}`}
                  className="font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{OFFICIAL_PHONE}</span>
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">شاپ لوکیشن:</span>
                <span className="text-slate-300">
                  فش مارکیٹ، ریلوے روڈ نزد ماڈل ٹاؤن، رحیم یار خان
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              * نوٹ: تازہ مچھلی کے آرڈر کے وقت اپنی مرضی کے مطابق کٹائی (گول قتلے، فنگر کٹ، بی بی کیو کٹ) کی مفت سہولت فراہم کی جاتی ہے۔
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} RYK Fresh Fish Point (رحیم یار خان)۔ جملہ حقوق محفوظ ہیں۔
          </div>
          <div className="flex items-center gap-1">
            <span>رحیم یار خان میں خلوص اور تازگی کے ساتھ پیش خدمت</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

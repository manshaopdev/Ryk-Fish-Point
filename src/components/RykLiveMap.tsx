import React, { useState } from 'react';
import { Navigation, MapPin, Compass, Phone, ShieldCheck, Share2, LocateFixed, Check } from 'lucide-react';
import { Order } from '../types';
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from '../data/initialFish';

interface RykLiveMapProps {
  order: Order;
  onUpdateLocation?: (coords: { lat: number; lng: number; accuracy?: number }, link: string) => void;
}

export const RykLiveMap: React.FC<RykLiveMapProps> = ({ order, onUpdateLocation }) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');
  
  // Progress determines rider position on the path
  const progress = Math.min(100, Math.max(5, order.riderProgressPercent ?? 55));
  
  // Hub is RYK Fish Market / Railway Road (coordinates mapped to SVG 1000x600 viewBox)
  const hubSvgPos = { x: 380, y: 360 }; // RYK Fish Point near Railway Road & Gala Mandi
  
  // Customer position based on area or default
  const getDestinationSvgPos = (area: string) => {
    if (area.includes('Model Town')) return { x: 420, y: 190, name: 'Model Town' };
    if (area.includes('Abbasia Town')) return { x: 550, y: 310, name: 'Abbasia Town' };
    if (area.includes('Gulshan-e-Iqbal')) return { x: 620, y: 170, name: 'Gulshan-e-Iqbal' };
    if (area.includes('Trust Colony')) return { x: 710, y: 250, name: 'Trust Colony' };
    if (area.includes('Satellite Town')) return { x: 290, y: 210, name: 'Satellite Town' };
    if (area.includes('Airport Road')) return { x: 210, y: 470, name: 'Airport Road' };
    if (area.includes('Shahbaz Pur')) return { x: 300, y: 420, name: 'Shahbaz Pur' };
    if (area.includes('Khanpur Road')) return { x: 740, y: 190, name: 'Khanpur Road' };
    if (area.includes('Dari Sanghi')) return { x: 490, y: 440, name: 'Dari Sanghi' };
    if (area.includes('Factory Area')) return { x: 510, y: 390, name: 'Factory Area' };
    return { x: 480, y: 230, name: 'RYK Delivery Zone' };
  };

  const destSvgPos = getDestinationSvgPos(order.deliveryArea);

  // Compute rider interpolation along curve
  const t = progress / 100;
  // Quadratic bezier point: P0 = hub, P1 = control point, P2 = dest
  const controlPoint = { x: (hubSvgPos.x + destSvgPos.x) / 2 - 40, y: Math.min(hubSvgPos.y, destSvgPos.y) - 30 };
  const riderX = (1 - t) * (1 - t) * hubSvgPos.x + 2 * (1 - t) * t * controlPoint.x + t * t * destSvgPos.x;
  const riderY = (1 - t) * (1 - t) * hubSvgPos.y + 2 * (1 - t) * t * controlPoint.y + t * t * destSvgPos.y;

  // Handle HTML5 Geolocation detection
  const handleDetectCustomerLocation = () => {
    if (!navigator.geolocation) {
      alert('آپ کے براؤزر میں لوکیشن کی سہولت موجود نہیں۔ براہ کرم واٹس ایپ پر لوکیشن شیئر فرمائیں۔');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const gmapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        
        setLocationSuccessMsg('آپ کی درست لوکیشن حاصل کر لی گئی ہے!');
        if (onUpdateLocation) {
          onUpdateLocation({ lat, lng, accuracy: position.coords.accuracy }, gmapsLink);
        }

        setTimeout(() => setLocationSuccessMsg(''), 6000);
      },
      (error) => {
        setGpsLoading(false);
        let errorMsg = 'لوکیشن حاصل کرنے میں دشواری پیش آئی۔';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'لوکیشن کی اجازت نہیں ملی۔ آپ براہ کرم واٹس ایپ پر رائیڈر کو لوکیشن بھیج سکتے ہیں۔';
        }
        alert(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const eta = order.riderEtaMinutes ?? Math.max(5, Math.round(25 * (1 - progress / 100)));
  const riderName = order.riderName || 'طاہر علی (رحیم یار خان رائیڈر)';
  const riderPhone = order.riderPhone || OFFICIAL_PHONE;

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `السلام علیکم! میں آرڈر #${order.id} کا کسٹمر ہوں۔ برائے مہربانی رائیڈر کو میری لوکیشن چیک کروائیں: ${order.locationLink || order.fullAddress}`
    );
    window.open(`https://wa.me/923023608248?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100">
      {/* Map Header Status Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                رحیم یار خان لائیو ڈلیوری ٹریکر
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                لائیو ٹریکنگ
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              {order.status === 'out_for_delivery'
                ? 'رائیڈر آپ کے گھر کی طرف رواں دواں ہے'
                : order.status === 'cleaning_cutting'
                ? 'مچھلی کی کٹائی، صفائی اور آئس پیکنگ جاری ہے'
                : order.status === 'delivered'
                ? 'آرڈر کامیابی سے پہنچا دیا گیا ہے'
                : 'آرڈر موصول ہو چکا ہے، جلد رائیڈر روانہ ہوگا'}
            </h4>
          </div>
        </div>

        {/* ETA & Distance Metric */}
        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
          <div>
            <span className="text-xs text-slate-400 block text-right">متوقع وقت (ETA)</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tabular-nums">
              {order.status === 'delivered' ? '0 منٹ' : `${eta} منٹ`}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <span className="text-xs text-slate-400 block text-right">فاصلہ</span>
            <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums">
              {order.status === 'delivered' ? 'پہنچ گیا' : `${((100 - progress) * 0.04 + 0.6).toFixed(1)} کلومیٹر`}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Rahim Yar Khan Map Viewport */}
      <div className="relative w-full h-80 sm:h-96 bg-[#0f172a] overflow-hidden select-none">
        <svg 
          viewBox="0 0 900 520" 
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            {/* Pulsing glow gradient */}
            <radialGradient id="riderGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Map Grid */}
          <rect width="900" height="520" fill="#0b1120" />
          <rect width="900" height="520" fill="url(#grid)" />

          {/* Sadiq Branch Canal / Waterways across RYK */}
          <path
            d="M 50 180 Q 250 200 450 160 T 880 140"
            fill="none"
            stroke="#0369a1"
            strokeWidth="10"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
          <text x="70" y="170" fill="#38bdf8" fontSize="11" opacity="0.6" fontWeight="bold">
            صادق برانچ کینال (Sadiq Canal)
          </text>

          {/* Major Roads in Rahim Yar Khan */}
          {/* Shahi Road / National Highway */}
          <line x1="80" y1="360" x2="820" y2="340" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <text x="700" y="332" fill="#94a3b8" fontSize="10">شاہی روڈ (Shahi Road)</text>

          {/* Airport Road & Club Road */}
          <line x1="200" y1="500" x2="400" y2="280" stroke="#334155" strokeWidth="5" />
          <text x="140" y="475" fill="#94a3b8" fontSize="10">ایئرپورٹ روڈ</text>

          {/* Khanpur Road */}
          <line x1="420" y1="350" x2="800" y2="180" stroke="#334155" strokeWidth="5" />
          <text x="760" y="210" fill="#94a3b8" fontSize="10">خان پور روڈ</text>

          {/* Shahbaz Pur Road */}
          <line x1="380" y1="360" x2="280" y2="440" stroke="#334155" strokeWidth="4" />

          {/* RYK Neighborhood / Landmark Badges */}
          <g opacity="0.65">
            {/* Model Town */}
            <circle cx="420" cy="190" r="4" fill="#64748b" />
            <text x="430" y="194" fill="#cbd5e1" fontSize="11" fontWeight="500">ماڈل ٹاؤن (Model Town)</text>

            {/* Abbasia Town */}
            <circle cx="550" cy="310" r="4" fill="#64748b" />
            <text x="560" y="314" fill="#cbd5e1" fontSize="11" fontWeight="500">عباسیہ ٹاؤن</text>

            {/* Gulshan-e-Iqbal */}
            <circle cx="620" cy="170" r="4" fill="#64748b" />
            <text x="630" y="174" fill="#cbd5e1" fontSize="11" fontWeight="500">گلشن اقبال</text>

            {/* Sheikh Zayed Hospital */}
            <circle cx="680" cy="270" r="4" fill="#64748b" />
            <text x="690" y="274" fill="#cbd5e1" fontSize="10">شیخ زید ہسپتال</text>

            {/* Trust Colony */}
            <circle cx="710" cy="230" r="4" fill="#64748b" />
            <text x="720" y="234" fill="#cbd5e1" fontSize="10">ٹرسٹ کالونی</text>

            {/* Railway Station RYK */}
            <circle cx="340" cy="350" r="4" fill="#64748b" />
            <text x="250" y="340" fill="#cbd5e1" fontSize="10">ریلوے اسٹیشن رحیم یار خان</text>
          </g>

          {/* Route Path from Hub to Customer */}
          <path
            d={`M ${hubSvgPos.x} ${hubSvgPos.y} Q ${controlPoint.x} ${controlPoint.y} ${destSvgPos.x} ${destSvgPos.y}`}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Hub: RYK Fish Point Dispatch Center Marker */}
          <g transform={`translate(${hubSvgPos.x}, ${hubSvgPos.y})`}>
            <circle r="18" fill="#0284c7" fillOpacity="0.25" />
            <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
            <text x="-65" y="26" fill="#38bdf8" fontSize="11" fontWeight="bold">
              🐟 RYK فش پوائنٹ (غلہ منڈی)
            </text>
          </g>

          {/* Destination: Customer Delivery Pin */}
          <g transform={`translate(${destSvgPos.x}, ${destSvgPos.y})`}>
            <circle r="22" fill="url(#destGlow)" />
            <circle r="11" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            <text x="-50" y="-18" fill="#34d399" fontSize="11" fontWeight="bold">
              📍 آپ کا پتہ ({order.deliveryArea.split('(')[0].trim()})
            </text>
          </g>

          {/* Live Rider Marker along path */}
          {order.status !== 'delivered' && (
            <g transform={`translate(${riderX}, ${riderY})`}>
              {/* Radar pulse circles */}
              <circle r="26" fill="url(#riderGlow)">
                <animate attributeName="r" values="18;34;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Rider Icon Body */}
              <circle r="13" fill="#06b6d4" stroke="#ffffff" strokeWidth="3" />
              {/* Delivery Bike Silhouette */}
              <circle cx="0" cy="0" r="5" fill="#082f49" />
              {/* Rider Tooltip */}
              <rect x="-42" y="-36" width="84" height="20" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
              <text x="0" y="-23" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                🛵 رائیڈر آن دی وے
              </text>
            </g>
          )}
        </svg>

        {/* Live Map Overlay Tools */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>رحیم یار خان سٹی کوریج ایریا</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleDetectCustomerLocation}
              disabled={gpsLoading}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              {gpsLoading ? 'GPS لوکیشن ڈھونڈ رہا ہے...' : 'میری لائیو لوکیشن رائیڈر کو بھیجیں'}
            </button>
          </div>
        </div>
      </div>

      {/* Success alert when location sent */}
      {locationSuccessMsg && (
        <div className="p-3 bg-emerald-950/80 border-t border-emerald-600/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{locationSuccessMsg} رائیڈر اب آپ کے عین دروازے پر پہنچے گا۔</span>
        </div>
      )}

      {/* Bottom Rider Contact & Details Panel */}
      <div className="p-4 sm:p-5 bg-slate-950/70 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Rider profile */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-cyan-500/40 flex items-center justify-center text-xl text-cyan-400">
            🛵
          </div>
          <div>
            <div className="text-xs text-slate-400">آفیشل ڈیلیوری رائیڈر</div>
            <div className="font-bold text-white text-sm sm:text-base">{riderName}</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تھرمل آئس باکس محفوظ ڈیلیوری</span>
            </div>
          </div>
        </div>

        {/* Route status note */}
        <div className="text-xs sm:text-sm text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-cyan-400 font-semibold block mb-0.5">موجودہ صورتحال:</span>
          {order.riderNotes || 'تازہ مچھلی برف کے تھرمل کنٹینر میں پیک ہو کر تیز رفتار بائیک پر روانہ ہے۔'}
        </div>

        {/* Action buttons to contact driver */}
        <div className="flex items-center gap-2 sm:justify-end">
          <a
            href={`tel:${riderPhone}`}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>کال رائیڈر ({riderPhone})</span>
          </a>
          <button
            onClick={shareViaWhatsApp}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>واٹس ایپ لوکیشن</span>
          </button>
        </div>
      </div>
    </div>
  );
};

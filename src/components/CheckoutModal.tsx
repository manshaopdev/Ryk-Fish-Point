import React, { useState } from 'react';
import { X, Check, MapPin, LocateFixed, Phone, User, Home, ShieldCheck, MessageSquare } from 'lucide-react';
import { CartItem, Order } from '../types';
import { RYK_DELIVERY_AREAS, OFFICIAL_WHATSAPP, OFFICIAL_PHONE } from '../data/initialFish';
import { formatPKR } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState(RYK_DELIVERY_AREAS[0]);
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash_easypaisa'>('cod');
  
  // Geolocation state
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locationLink, setLocationLink] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, curr) => acc + curr.itemTotal, 0);
  const deliveryFee = 0; // Free delivery in Rahim Yar Khan
  const totalAmount = subtotal + deliveryFee;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('آپ کے براؤزر میں لوکیشن کی سہولت دستیاب نہیں۔ براہ کرم نیچے ایڈریس لکھیں۔');
      return;
    }

    setDetectingGps(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectingGps(false);
        const lat = +position.coords.latitude.toFixed(6);
        const lng = +position.coords.longitude.toFixed(6);
        setGpsCoords({ lat, lng, accuracy: position.coords.accuracy });
        const link = `https://maps.google.com/?q=${lat},${lng}`;
        setLocationLink(link);
      },
      (error) => {
        setDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('لوکیشن کی اجازت نہیں ملی۔ آپ اپنا پتہ تفصیل سے درج فرما دیں۔');
        } else {
          setGpsError('لوکیشن حاصل نہیں ہو سکی۔ براہ کرم نیچے پتہ لکھ دیں۔');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !fullAddress.trim()) {
      alert('براہ کرم اپنا نام، موبائل نمبر اور رحیم یار خان کا مکمل پتہ درج فرمائیں۔');
      return;
    }

    setIsSubmitting(true);

    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `RYK-${randomIdNum}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryArea,
      fullAddress: fullAddress.trim(),
      landmark: landmark.trim() || undefined,
      liveLocationCoords: gpsCoords || undefined,
      locationLink: locationLink || (gpsCoords ? `https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}` : undefined),
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: 'کسٹمر کا تازہ آرڈر سسٹم میں موصول ہو گیا'
        }
      ],
      riderName: 'طاہر علی (رحیم یار خان رائیڈر)',
      riderPhone: OFFICIAL_PHONE,
      riderEtaMinutes: 25,
      riderProgressPercent: 10,
      riderNotes: 'آرڈر موصول ہوتے ہی کٹنگ اور برف پیکنگ کا عمل شروع ہو گیا ہے۔'
    };

    // Format WhatsApp message to official WhatsApp: 03023608248
    let itemsListUrdu = items
      .map((it, idx) => `${idx + 1}. ${it.fish.name} (${it.fish.urduName}) - ${it.weightKg} کلو [${it.cuttingOption}]`)
      .join('\n');

    const whatsappMessage = encodeURIComponent(
      `السلام علیکم! میں نے رحیم یار خان مچھلی کا نیا آرڈر بک کیا ہے:\n\n` +
      `🧾 آرڈر نمبر: #${newOrder.id}\n` +
      `👤 کسٹمر نام: ${newOrder.customerName}\n` +
      `📞 فون نمبر: ${newOrder.customerPhone}\n` +
      `📍 علاقہ: ${newOrder.deliveryArea}\n` +
      `🏠 مکمل پتہ: ${newOrder.fullAddress}\n` +
      (newOrder.landmark ? `🏛️ قریبی نشان: ${newOrder.landmark}\n` : '') +
      (newOrder.locationLink ? `🗺️ لائیو لوکیشن لنک: ${newOrder.locationLink}\n` : '') +
      `\n🛒 مچھلی کی تفصیل:\n${itemsListUrdu}\n\n` +
      `💰 کل رقم: Rs. ${totalAmount.toLocaleString('en-PK')} (کیش آن ڈلیوری)\n\n` +
      `برائے مہربانی رائیڈر کو جلد روانہ فرمائیں۔ شکریہ!`
    );

    // Save and callback
    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);

      // Open official WhatsApp window
      window.open(`https://wa.me/923023608248?text=${whatsappMessage}`, '_blank');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>صرف رحیم یار خان میں ہوم ڈلیوری</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              آرڈر بکنگ اور ڈلیوری کی تفصیلات
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-4 max-h-[calc(85vh-10rem)] overflow-y-auto">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                آپ کا پورا نام (Customer Name): *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثلاً: محمد فاروق"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right sm:text-left"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                موبائل نمبر (رابطہ و واٹس ایپ): *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Area in Rahim Yar Khan */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              رحیم یار خان کا علاقہ منتخب کریں: *
            </label>
            <select
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium"
            >
              {RYK_DELIVERY_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Street Address */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              گھر / دکان کا مکمل پتہ (گلی، بلاک، مکان نمبر): *
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="مثال: مکان نمبر 18، گلی نمبر 4، نزد جامع مسجد و پارک، ماڈل ٹاؤن رحیم یار خان"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right sm:text-left"
              />
            </div>
          </div>

          {/* Nearby Landmark */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              مشہور قریبی نشان (Landmark):
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="مثلاً: بالمقابل شیخ زید ہسپتال / نزد عائشہ پارک / ریلوے پھاٹک"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right sm:text-left"
            />
          </div>

          {/* LIVE GPS LOCATION FEATURE */}
          <div className="bg-cyan-50/70 border border-cyan-200 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocateFixed className="w-4 h-4 text-cyan-700" />
                <span className="text-xs font-bold text-cyan-900">
                  اپنی لائیو لوکیشن بھیجیں (Live GPS Location)
                </span>
              </div>
              {gpsCoords && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded">
                  <Check className="w-3 h-3" /> لوکیشن شامل ہے
                </span>
              )}
            </div>

            <p className="text-[11px] text-cyan-800 leading-relaxed">
              ایک کلک سے اپنی درست GPS لوکیشن شامل کریں تاکہ رحیم یار خان میں رائیڈر بلا تاخیر آپ کے دروازے پر پہنچ سکے۔
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={detectingGps}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>{detectingGps ? 'GPS تلاش کر رہا ہے...' : 'میری موجودہ لوکیشن حاصل کریں'}</span>
              </button>

              {gpsCoords && (
                <span className="text-[11px] font-mono text-cyan-900 bg-white px-2 py-1 rounded border border-cyan-300">
                  {gpsCoords.lat}, {gpsCoords.lng}
                </span>
              )}
            </div>

            {gpsError && (
              <p className="text-[11px] text-rose-600 font-medium">
                {gpsError}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              ادائیگی کا طریقہ (Payment Method):
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-xl border text-right transition-colors cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-cyan-600 bg-cyan-50/70 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>کیش آن ڈلیوری (COD)</span>
                  {paymentMethod === 'cod' && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                </div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  مچھلی وصول کرتے وقت ادا کریں
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash_easypaisa')}
                className={`p-2.5 rounded-xl border text-right transition-colors cursor-pointer ${
                  paymentMethod === 'jazzcash_easypaisa'
                    ? 'border-cyan-600 bg-cyan-50/70 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>جاز کیش / ایزی پیسہ</span>
                  {paymentMethod === 'jazzcash_easypaisa' && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                </div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  آن لائن نمبر پر ٹرانسفر
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>آئٹمز کی کل رقم:</span>
              <span className="font-mono font-bold">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ڈلیوری چارجز (رحیم یار خان):</span>
              <span className="text-emerald-600 font-bold">مفت (Free)</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
              <span>قابل ادا رقم (Total):</span>
              <span className="text-cyan-700 font-black font-mono text-base">{formatPKR(totalAmount)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {isSubmitting ? 'آرڈر محفوظ ہو رہا ہے...' : 'آرڈر تصدیق کریں اور واٹس ایپ پر بھیجیں'}
              </span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              آرڈر فوراً ہمارے ایڈمن پینل اور واٹس ایپ (03023608248) پر درج ہو جائے گا۔
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

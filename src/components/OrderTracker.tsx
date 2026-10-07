import React, { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle, Clock, Truck, Package, Phone, MessageSquare, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getStoredOrders, formatPKR, updateOrderStatus } from '../utils/storage';
import { RykLiveMap } from './RykLiveMap';
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from '../data/initialFish';

interface OrderTrackerProps {
  initialOrderId?: string;
  onClose?: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ initialOrderId, onClose }) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  const loadOrders = () => {
    const list = getStoredOrders();
    setAllOrders(list);

    if (initialOrderId) {
      const found = list.find(
        (o) => o.id.toLowerCase() === initialOrderId.toLowerCase()
      );
      if (found) {
        setActiveOrder(found);
        setSearched(true);
      }
    } else if (list.length > 0 && !activeOrder) {
      // Default to first recent order for great UX demonstration
      setActiveOrder(list[0]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [initialOrderId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearched(true);
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      if (allOrders.length > 0) setActiveOrder(allOrders[0]);
      return;
    }

    const matched = allOrders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.id.toLowerCase().includes(q) ||
        o.customerPhone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
        o.customerName.toLowerCase().includes(q)
    );

    setActiveOrder(matched || null);
  };

  const handleUpdateLocation = (coords: { lat: number; lng: number; accuracy?: number }, link: string) => {
    if (!activeOrder) return;
    const updated = updateOrderStatus(activeOrder.id, activeOrder.status, 'کسٹمر نے لائیو لوکیشن اپڈیٹ کر دی');
    if (updated) {
      updated.liveLocationCoords = coords;
      updated.locationLink = link;
      setActiveOrder({ ...updated });
      loadOrders();
    }
  };

  // Status step configuration
  const steps: { key: OrderStatus; label: string; urdu: string; desc: string }[] = [
    { key: 'received', label: 'Order Received', urdu: 'آرڈر موصول ہوا', desc: 'سسٹم نے آرڈر کنفرم کر لیا ہے' },
    { key: 'cleaning_cutting', label: 'Preparation', urdu: 'کٹائی و صفائی جاری', desc: 'مطلوبہ کٹائی اور آئس باکس پیکنگ' },
    { key: 'out_for_delivery', label: 'On The Way', urdu: 'رائیڈر روانہ ہے', desc: 'رحیم یار خان میں رائیڈر آن روٹ ہے' },
    { key: 'delivered', label: 'Delivered', urdu: 'کامیابی سے ڈلیور', desc: 'مچھلی کسٹمر کے حوالے کر دی گئی' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'cleaning_cutting': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-0.5">
              رحیم یار خان لائیو آرڈر ٹریکر
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              اپنا مچھلی کا آرڈر ٹریک کریں
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 transition-colors cursor-pointer"
              title="تازہ ترین معلومات حاصل کریں"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 transition-colors cursor-pointer"
                title="بند کریں"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="آرڈر نمبر (مثلاً: RYK-5821) یا موبائل نمبر لکھیں..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            آرڈر تلاش کریں
          </button>
        </form>

        {/* Active Order Details */}
        {activeOrder ? (
          <div className="space-y-6">
            {/* Order Identity & Key Stats Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                    #{activeOrder.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    بکنگ وقت: {new Date(activeOrder.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  محترم/محترمہ {activeOrder.customerName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  📍 {activeOrder.deliveryArea} — {activeOrder.fullAddress}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">کل بل (کیش آن ڈلیوری)</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {formatPKR(activeOrder.totalAmount)}
                </span>
                <span className="text-xs text-emerald-600 font-semibold block">
                  ڈلیوری فری (رحیم یار خان)
                </span>
              </div>
            </div>

            {/* Step Progress Milestone Bar */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                آرڈر کی موجودہ پیش رفت (Live Order Milestones)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isCurrent
                            ? 'bg-cyan-600 text-white ring-4 ring-cyan-100 shadow-md animate-pulse'
                            : isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isDone ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {step.urdu}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE RAHIM YAR KHAN MAP VIEWPORT */}
            <RykLiveMap order={activeOrder} onUpdateLocation={handleUpdateLocation} />

            {/* Items Summary & Customer Notes */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                آرڈر میں شامل مچھلیاں (Items in Order):
              </h4>

              <div className="divide-y divide-slate-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-900">
                        {item.fish.name} ({item.fish.urduName})
                      </span>
                      <div className="text-xs text-slate-500 mt-0.5">
                        وزن: {item.weightKg} کلو | کٹائی: {item.cuttingOption}
                      </div>
                      {item.specialInstructions && (
                        <div className="text-[11px] text-cyan-700 italic mt-0.5">
                          ہدایات: {item.specialInstructions}
                        </div>
                      )}
                    </div>
                    <span className="font-black font-mono text-slate-900 tabular-nums">
                      {formatPKR(item.itemTotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick WhatsApp Support Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  کوئی سوال یا تبدیلی درکار ہے؟ ہماری شاپ سے رابطہ فرمائیں:
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${OFFICIAL_PHONE}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-600" />
                    <span>کال: {OFFICIAL_PHONE}</span>
                  </a>
                  <a
                    href={`https://wa.me/923023608248?text=${encodeURIComponent(`السلام علیکم! میں آرڈر #${activeOrder.id} کے بارے میں معلومات چاہتا ہوں۔`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>واٹس ایپ ہیلپ: {OFFICIAL_WHATSAPP}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {searched ? 'اس معلومات پر کوئی آرڈر نہیں ملا' : 'کوئی آرڈر منتخب نہیں ہے'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              براہ کرم درست آرڈر نمبر یا اپنا فون نمبر درج کریں، یا مچھلی خرید کر نیا آرڈر بنائیں۔
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

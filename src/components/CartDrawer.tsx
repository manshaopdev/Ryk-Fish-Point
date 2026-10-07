import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';
import { formatPKR } from '../utils/storage';
import { OFFICIAL_WHATSAPP } from '../data/initialFish';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateWeight: (cartItemId: string, newWeight: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateWeight,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.itemTotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                آپ کا آرڈر کارٹ ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="text-4xl mb-3 block">🛒</span>
                <p className="text-sm font-semibold text-slate-700">کارٹ خالی ہے</p>
                <p className="text-xs text-slate-400 mt-1">
                  رحیم یار خان میں تازہ مچھلی منتخب کر کے یہاں شامل کریں۔
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.fish.name} ({item.fish.urduName})
                      </h4>
                      <div className="text-xs text-cyan-700 font-medium">
                        کٹائی: {item.cuttingOption}
                      </div>
                      {item.specialInstructions && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          ہدایات: {item.specialInstructions}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="حذف کریں"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    {/* Weight Controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">وزن:</span>
                      <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateWeight(item.cartItemId, Math.max(0.5, +(item.weightKg - 0.5).toFixed(1)))}
                          className="w-5 h-5 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-12 text-center text-slate-900">
                          {item.weightKg} KG
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateWeight(item.cartItemId, +(item.weightKg + 0.5).toFixed(1))}
                          className="w-5 h-5 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Total for this line */}
                    <span className="text-sm font-black text-slate-900 font-mono tabular-nums">
                      {formatPKR(item.itemTotal)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>ڈلیوری (رحیم یار خان)</span>
                <span className="text-emerald-600 font-bold">مفت ایکسپریس ڈلیوری</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">کل رقم:</span>
                <span className="text-xl font-black text-slate-900 font-mono tabular-nums">
                  {formatPKR(subtotal)}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>آرڈر مکمل کریں (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

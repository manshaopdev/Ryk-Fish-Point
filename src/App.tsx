/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FishCatalog } from './components/FishCatalog';
import { FishDetailModal } from './components/FishDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { AdminPanel } from './components/AdminPanel';
import { CoverageSection } from './components/CoverageSection';
import { Footer } from './components/Footer';
import { FishItem, CartItem, Order } from './types';
import { getStoredFishCatalog, addOrder } from './utils/storage';
import { OFFICIAL_WHATSAPP, OFFICIAL_PHONE } from './data/initialFish';
import { MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Inventory state
  const [catalog, setCatalog] = useState<FishItem[]>([]);
  const [selectedFish, setSelectedFish] = useState<FishItem | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Order Tracker state
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | undefined>(undefined);

  // Admin Panel state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Order success toast/banner
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Load catalog on mount
  useEffect(() => {
    setCatalog(getStoredFishCatalog());
  }, []);

  // Cart handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if duplicate with same fish and cutting
      const existingIdx = prev.findIndex(
        (ci) => ci.fish.id === item.fish.id && ci.cuttingOption === item.cuttingOption
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        const updatedWeight = copy[existingIdx].weightKg + item.weightKg;
        copy[existingIdx] = {
          ...copy[existingIdx],
          weightKg: updatedWeight,
          itemTotal: Math.round(updatedWeight * item.fish.pricePerKg)
        };
        return copy;
      }
      return [...prev, item];
    });
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleUpdateCartWeight = (cartItemId: string, newWeight: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            weightKg: newWeight,
            itemTotal: Math.round(newWeight * item.fish.pricePerKg)
          };
        }
        return item;
      })
    );
  };

  // Checkout Success
  const handleOrderSuccess = (newOrder: Order) => {
    // 1. Save to local storage so admin panel gets it immediately
    addOrder(newOrder);

    // 2. Clear cart & close checkout modal
    setCart([]);
    setIsCheckoutOpen(false);

    // 3. Set last placed order and open live order tracker
    setLastPlacedOrder(newOrder);
    setTrackedOrderId(newOrder.id);
    setIsTrackerOpen(true);

    // Scroll to tracker
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'freshwater' || sectionId === 'seawater') {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'coverage') {
      const el = document.getElementById('coverage-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <Header
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => {
          setIsTrackerOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* If user is actively in Order Tracking mode, show tracker at top with quick exit */}
        {isTrackerOpen ? (
          <div className="bg-slate-100/80 border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 pt-4 flex items-center justify-between">
              <button
                onClick={() => setIsTrackerOpen(false)}
                className="text-xs font-bold text-slate-600 hover:text-cyan-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                ← مچھلی کیٹلاگ پر واپس جائیں
              </button>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>رحیم یار خان لائیو ڈلیوری ٹریکنگ فعال ہے</span>
              </span>
            </div>

            <OrderTracker
              initialOrderId={trackedOrderId}
              onClose={() => setIsTrackerOpen(false)}
            />
          </div>
        ) : (
          <Hero
            onOrderNow={() => scrollToSection('freshwater')}
            onOpenTracker={() => {
              setIsTrackerOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Fish Catalog: Freshwater & Seawater */}
        <FishCatalog
          items={catalog}
          onSelectFish={(fish) => setSelectedFish(fish)}
        />

        {/* Rahim Yar Khan Delivery Coverage */}
        <CoverageSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenTracker={() => {
          setIsTrackerOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* MODALS & DRAWERS */}
      {/* 1. Fish Detail & Customization Modal */}
      <FishDetailModal
        fish={selectedFish}
        onClose={() => setSelectedFish(null)}
        onAddToCart={handleAddToCart}
        onDirectOrder={(item) => {
          handleAddToCart(item);
          setSelectedFish(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 2. Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateWeight={handleUpdateCartWeight}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. Checkout Modal with RYK address and GPS location */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 4. Admin Panel Modal (Protected by Qwsa1212) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onCatalogUpdated={(updatedItems) => setCatalog(updatedItems)}
      />

      {/* Floating Action Buttons for quick Mobile Access */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
        {/* Floating WhatsApp Order Button */}
        <a
          href={`https://wa.me/923023608248?text=${encodeURIComponent('السلام علیکم! رحیم یار خان مچھلی کا آرڈر بک کرنا ہے۔')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-950/40 transition-transform hover:scale-105"
          title="واٹس ایپ پر آرڈر کریں"
          aria-label="WhatsApp Order"
        >
          <MessageSquare className="w-6 h-6" />
        </a>

        {/* Floating Live Track Button */}
        <button
          onClick={() => {
            setIsTrackerOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-12 h-12 rounded-full bg-slate-900 hover:bg-cyan-600 text-white flex items-center justify-center shadow-xl shadow-slate-950/40 transition-transform hover:scale-105 cursor-pointer"
          title="آرڈر ٹریک کریں"
          aria-label="Track Order"
        >
          <MapPin className="w-5 h-5 text-cyan-400" />
        </button>
      </div>
    </div>
  );
}

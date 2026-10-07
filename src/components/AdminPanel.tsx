import React, { useState } from 'react';
import { 
  Lock, KeyRound, ShieldAlert, Plus, Trash2, Edit3, Check, RefreshCw, 
  MapPin, Phone, MessageSquare, ExternalLink, Sliders, Truck, X, Save, AlertCircle 
} from 'lucide-react';
import { FishItem, Order, OrderStatus } from '../types';
import { 
  ADMIN_PASSWORD_REQUIRED, getStoredOrders, saveOrders, 
  getStoredFishCatalog, saveFishCatalog, formatPKR, updateOrderStatus 
} from '../utils/storage';
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP, RYK_DELIVERY_AREAS } from '../data/initialFish';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCatalogUpdated: (items: FishItem[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onCatalogUpdated
}) => {
  // Password authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'settings'>('orders');

  // Orders state
  const [orders, setOrders] = useState<Order[]>(getStoredOrders());
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderStatusFilter, setSelectedOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Inventory state
  const [fishItems, setFishItems] = useState<FishItem[]>(getStoredFishCatalog());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFish, setEditingFish] = useState<FishItem | null>(null);

  // New Fish Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrduName, setNewItemUrduName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'freshwater' | 'seawater'>('freshwater');
  const [newItemPrice, setNewItemPrice] = useState<number>(1200);
  const [newItemMinWeight, setNewItemMinWeight] = useState<number>(1);
  const [newItemBoneType, setNewItemBoneType] = useState<FishItem['boneType']>('single_bone');
  const [newItemCooking, setNewItemCooking] = useState<FishItem['bestCooking']>('fry');
  const [newItemOrigin, setNewItemOrigin] = useState('Panjnad River / Indus Catch RYK');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemUrduDesc, setNewItemUrduDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('/src/assets/images/fish_freshwater_rohu_1791374582267.jpg');
  const [newItemInStock, setNewItemInStock] = useState(true);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD_REQUIRED) {
      setIsAuthenticated(true);
      setPasswordError(false);
      setOrders(getStoredOrders());
      setFishItems(getStoredFishCatalog());
    } else {
      setPasswordError(true);
    }
  };

  const reloadData = () => {
    const freshOrders = getStoredOrders();
    const freshFish = getStoredFishCatalog();
    setOrders(freshOrders);
    setFishItems(freshFish);
  };

  // Status update
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus, `ایڈمن نے سٹیٹس تبدیل کر دیا: ${newStatus}`);
    if (updated) {
      setOrders(getStoredOrders());
    }
  };

  // Rider update simulation
  const handleRiderSimulate = (orderId: string, progress: number, eta: number) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;
    const updated = updateOrderStatus(orderId, target.status, undefined, {
      riderProgressPercent: progress,
      riderEtaMinutes: eta
    });
    if (updated) {
      setOrders(getStoredOrders());
    }
  };

  // Delete Order
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('کیا آپ واقعی یہ آرڈر ختم کرنا چاہتے ہیں؟')) {
      const filtered = orders.filter(o => o.id !== orderId);
      saveOrders(filtered);
      setOrders(filtered);
    }
  };

  // Toggle fish stock
  const handleToggleStock = (fishId: string) => {
    const updated = fishItems.map(f => {
      if (f.id === fishId) return { ...f, inStock: !f.inStock };
      return f;
    });
    saveFishCatalog(updated);
    setFishItems(updated);
    onCatalogUpdated(updated);
  };

  // Quick Price update
  const handleQuickPriceChange = (fishId: string, newPrice: number) => {
    if (newPrice <= 0) return;
    const updated = fishItems.map(f => {
      if (f.id === fishId) return { ...f, pricePerKg: newPrice };
      return f;
    });
    saveFishCatalog(updated);
    setFishItems(updated);
    onCatalogUpdated(updated);
  };

  // Delete fish
  const handleDeleteFish = (fishId: string) => {
    if (window.confirm('کیا آپ واقعی یہ مچھلی کیٹلاگ سے نکالنا چاہتے ہیں؟')) {
      const filtered = fishItems.filter(f => f.id !== fishId);
      saveFishCatalog(filtered);
      setFishItems(filtered);
      onCatalogUpdated(filtered);
    }
  };

  // Add new fish item
  const handleAddNewFish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemUrduName.trim()) {
      alert('براہ کرم مچھلی کا انگریزی اور اردو نام لکھیں۔');
      return;
    }

    const newFish: FishItem = {
      id: `fish-${Date.now()}`,
      name: newItemName.trim(),
      urduName: newItemUrduName.trim(),
      category: newItemCategory,
      pricePerKg: Number(newItemPrice),
      minWeightKg: Number(newItemMinWeight),
      boneType: newItemBoneType,
      bestCooking: newItemCooking,
      origin: newItemOrigin.trim(),
      description: newItemDescription.trim() || `${newItemName} fresh catch delivered in Rahim Yar Khan.`,
      urduDescription: newItemUrduDesc.trim() || `${newItemUrduName} رحیم یار خان میں روزانہ تازہ دستیاب۔ کٹائی اور صفائی بالکل مفت۔`,
      image: newItemImage,
      inStock: newItemInStock
    };

    const updated = [newFish, ...fishItems];
    saveFishCatalog(updated);
    setFishItems(updated);
    onCatalogUpdated(updated);
    setShowAddModal(false);

    // Reset inputs
    setNewItemName('');
    setNewItemUrduName('');
    setNewItemDescription('');
    setNewItemUrduDesc('');
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (selectedOrderStatusFilter !== 'all' && o.status !== selectedOrderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.deliveryArea.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>RYK Fish Point ایڈمن پینل</span>
                {isAuthenticated && (
                  <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    لاگ ان کامیاب
                  </span>
                )}
              </h2>
              <span className="text-xs text-slate-400">
                رحیم یار خان آرڈرز، رائیڈر ٹریکنگ اور مچھلی انوینٹری
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={reloadData}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="ریفریش کریں"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Password Authentication Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto text-cyan-700">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                ایڈمن پاسورڈ درج کریں
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                صرف RYK فش پوائنٹ انتظامیہ کے لیے محفوظ پینل
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="ایڈمن پاسورڈ لکھیں (Qwsa1212)..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-center text-sm"
                />
              </div>

              {passwordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>غلط پاسورڈ! براہ کرم درست پاسورڈ درج کریں۔</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                ایڈمن پینل کھولیں
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-400">
              پاسورڈ: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">Qwsa1212</code>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Management Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'border-cyan-600 text-cyan-700 bg-white rounded-t-lg'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  کسٹمر کے سارے آرڈرز ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'border-cyan-600 text-cyan-700 bg-white rounded-t-lg'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  مچھلی کا اسٹاک اور نئی آئٹمز ({fishItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'border-cyan-600 text-cyan-700 bg-white rounded-t-lg'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  رحیم یار خان سروس تفصیلات
                </button>
              </div>

              {activeTab === 'inventory' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>نئی مچھلی شامل کریں</span>
                </button>
              )}
            </div>

            {/* TAB 1: ALL ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Search & Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="آرڈر نمبر، نام، فون یا علاقہ سے تلاش کریں..."
                    className="flex-1 min-w-[200px] px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">سٹیٹس فلٹر:</span>
                    <select
                      value={selectedOrderStatusFilter}
                      onChange={(e) => setSelectedOrderStatusFilter(e.target.value as any)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="all">تمام آرڈرز</option>
                      <option value="received">موصول شدہ (Received)</option>
                      <option value="cleaning_cutting">کٹائی و صفائی (Prep)</option>
                      <option value="out_for_delivery">رائیڈر روانہ (Out)</option>
                      <option value="delivered">ڈلیور شدہ (Delivered)</option>
                    </select>
                  </div>
                </div>

                {/* Orders Cards List */}
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <span className="text-3xl block mb-2">📋</span>
                    <p className="text-sm font-semibold">کوئی آرڈر نہیں ملا</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm bg-slate-900 text-white px-2 py-0.5 rounded">
                              #{ord.id}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(ord.createdAt).toLocaleString('en-PK')}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                              {ord.deliveryArea}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status changer select */}
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                            >
                              <option value="received">1. آرڈر موصول (Received)</option>
                              <option value="cleaning_cutting">2. صفائی و کٹائی (Prep)</option>
                              <option value="out_for_delivery">3. رائیڈر روانہ (Out)</option>
                              <option value="delivered">4. ڈلیور مکمل (Delivered)</option>
                              <option value="cancelled">5. منسوخ (Cancelled)</option>
                            </select>

                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="حذف کریں"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer & Location Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                          <div>
                            <div className="font-bold text-slate-900 text-sm mb-1">
                              👤 {ord.customerName}
                            </div>
                            <div className="text-slate-600 flex items-center gap-2">
                              <span className="font-mono font-bold">{ord.customerPhone}</span>
                              <a
                                href={`tel:${ord.customerPhone}`}
                                className="text-cyan-700 hover:underline"
                              >
                                [کال کریں]
                              </a>
                              <a
                                href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 hover:underline"
                              >
                                [واٹس ایپ]
                              </a>
                            </div>
                            <div className="text-slate-600 mt-1">
                              🏠 <span className="font-medium">{ord.fullAddress}</span>
                              {ord.landmark && <span className="text-slate-500"> (نشان: {ord.landmark})</span>}
                            </div>
                          </div>

                          <div className="border-t md:border-t-0 md:border-l border-slate-200 md:pl-3">
                            <div className="font-bold text-slate-800 mb-1 flex items-center justify-between">
                              <span>📍 GPS لائیو لوکیشن:</span>
                              {ord.locationLink ? (
                                <a
                                  href={ord.locationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-600 hover:underline font-bold flex items-center gap-1"
                                >
                                  <span>گوگل میپ پر کھولیں</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 font-normal">لوکیشن لنک موجود نہیں</span>
                              )}
                            </div>

                            {/* Rider Controls & Simulation */}
                            <div className="bg-white p-2 rounded border border-slate-200 space-y-1.5 mt-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">رائیڈر سفر پیش رفت (Map Simulation):</span>
                                <span className="font-mono font-bold text-cyan-700">
                                  {ord.riderProgressPercent ?? 50}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="5"
                                max="100"
                                value={ord.riderProgressPercent ?? 50}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const newEta = Math.max(2, Math.round(25 * (1 - val / 100)));
                                  handleRiderSimulate(ord.id, val, newEta);
                                }}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                              />
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>شاپ روانگی (0%)</span>
                                <span>متوقع وقت: {ord.riderEtaMinutes ?? 15} منٹ</span>
                                <span>کسٹمر گیٹ (100%)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ordered Items Breakdown */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            آرڈر آئٹمز اور کٹائی:
                          </span>
                          <div className="divide-y divide-slate-100">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-800">
                                    {it.fish.name} ({it.fish.urduName})
                                  </span>
                                  <span className="text-slate-500 mx-1.5">·</span>
                                  <span className="font-medium text-cyan-700">
                                    {it.weightKg} کلو ({it.cuttingOption})
                                  </span>
                                  {it.specialInstructions && (
                                    <span className="text-amber-700 text-[11px] block">
                                      نوٹ: {it.specialInstructions}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono font-bold text-slate-900">
                                  {formatPKR(it.itemTotal)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer Total */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            طریقہ ادائیگی: {ord.paymentMethod === 'cod' ? 'کیش آن ڈلیوری' : 'جاز کیش / ایزی پیسہ'}
                          </span>
                          <div className="text-sm font-bold text-slate-900">
                            کل رقم: <span className="font-mono text-cyan-700 font-black">{formatPKR(ord.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FISH INVENTORY & ADD NEW ITEM */}
            {activeTab === 'inventory' && (
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fishItems.map((fish) => (
                    <div
                      key={fish.id}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={fish.image}
                          alt={fish.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-cyan-700">
                              {fish.category === 'freshwater' ? 'دریائی میٹھا پانی' : 'کراچی سمندری'}
                            </span>
                            <button
                              onClick={() => handleDeleteFish(fish.id)}
                              className="text-slate-300 hover:text-rose-600 transition-colors"
                              title="حذف کریں"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm truncate">{fish.name}</h4>
                          <h5 className="text-xs font-semibold text-slate-600 truncate">{fish.urduName}</h5>
                        </div>
                      </div>

                      {/* Quick Edit Price & Stock */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block">ریٹ / کلو:</span>
                          <input
                            type="number"
                            value={fish.pricePerKg}
                            onChange={(e) => handleQuickPriceChange(fish.id, Number(e.target.value))}
                            className="w-24 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-xs"
                          />
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block">سٹاک:</span>
                          <button
                            type="button"
                            onClick={() => handleToggleStock(fish.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                              fish.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {fish.inStock ? 'دستیاب ہے' : 'آؤٹ آف سٹاک'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: RYK DELIVERY SETTINGS */}
            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 max-w-2xl">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">
                    رحیم یار خان آفیشل رابطے کی تفصیلات
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-slate-50 rounded">
                      <span className="text-slate-600 font-medium">آفیشل واٹس ایپ نمبر:</span>
                      <span className="font-mono font-bold text-emerald-700">{OFFICIAL_WHATSAPP}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded">
                      <span className="text-slate-600 font-medium">آفیشل کال / رابطہ نمبر:</span>
                      <span className="font-mono font-bold text-cyan-700">{OFFICIAL_PHONE}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded">
                      <span className="text-slate-600 font-medium">ہیڈکوارٹر شاپ:</span>
                      <span className="font-medium text-slate-800">غلہ منڈی / ریلوے روڈ نزد ماڈل ٹاؤن، رحیم یار خان</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">
                    فعال ڈلیوری ایریاز (Rahim Yar Khan Active Zones)
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {RYK_DELIVERY_AREAS.map((area, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD NEW FISH ITEM */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 w-full max-w-lg space-y-4 my-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  نئی مچھلی شامل کریں (Add New Fish)
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNewFish} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">انگریزی نام: *</label>
                    <input
                      type="text"
                      required
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g. Swat Trout"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">اردو نام: *</label>
                    <input
                      type="text"
                      required
                      value={newItemUrduName}
                      onChange={(e) => setNewItemUrduName(e.target.value)}
                      placeholder="مثلاً: سوات ٹراؤٹ مچھلی"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">قسم (Category):</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="freshwater">میٹھے پانی کی (Freshwater River)</option>
                      <option value="seawater">سمندری مچھلی (Arabian Seawater)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">قیمت فی کلو (PKR): *</label>
                    <input
                      type="number"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">کانٹے کی نوعیت (Bones):</label>
                    <select
                      value={newItemBoneType}
                      onChange={(e) => setNewItemBoneType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="single_bone">صرف 1 کانٹا (Single bone)</option>
                      <option value="boneless_fillet">100% بغیر کانٹے (Boneless)</option>
                      <option value="low_bones">کم کانٹے (Low bones)</option>
                      <option value="moderate">روایتی کانٹے (Moderate)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">بہترین پکوان:</label>
                    <select
                      value={newItemCooking}
                      onChange={(e) => setNewItemCooking(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="fry">لاہوری فرائی (Fry)</option>
                      <option value="salan">سالن و کڑاہی (Curry)</option>
                      <option value="bbq_grill">باربی کیو و گرل (BBQ)</option>
                      <option value="steam_tandoor">سٹیم / تندور (Steam)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ذریعہ / مقام (Origin):</label>
                  <input
                    type="text"
                    value={newItemOrigin}
                    onChange={(e) => setNewItemOrigin(e.target.value)}
                    placeholder="مثلاً: دریائے سندھ پنجند / کراچی ساحل"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">مختصر اردو تفصیل:</label>
                  <textarea
                    rows={2}
                    value={newItemUrduDesc}
                    onChange={(e) => setNewItemUrduDesc(e.target.value)}
                    placeholder="مچھلی کا ذائقہ اور خوبی..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-right"
                  />
                </div>

                {/* Preset image selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تصویر کا انتخاب:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'روہو / دریائی', url: '/src/assets/images/fish_freshwater_rohu_1791374582267.jpg' },
                      { label: 'سنگھارا قتلے', url: '/src/assets/images/fish_singhara_slices_1791374603876.jpg' },
                      { label: 'سرمئی و پاپلیٹ', url: '/src/assets/images/fish_surmai_pomfret_1791374619461.jpg' },
                      { label: 'مارکیٹ ڈسپلے', url: '/src/assets/images/hero_ryk_fresh_fish_1791374550335.jpg' },
                    ].map((imgOpt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewItemImage(imgOpt.url)}
                        className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                          newItemImage === imgOpt.url
                            ? 'border-cyan-600 ring-2 ring-cyan-200'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgOpt.url} alt="" className="w-full h-12 object-cover rounded" />
                        <span className="text-[10px] block mt-1 font-medium">{imgOpt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                  >
                    منسوخ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold"
                  >
                    شامل کریں
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

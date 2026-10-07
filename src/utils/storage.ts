import { FishItem, Order } from '../types';
import { INITIAL_FISH_CATALOG } from '../data/initialFish';

const FISH_STORAGE_KEY = 'ryk_fish_catalog_v2';
const ORDERS_STORAGE_KEY = 'ryk_fish_orders_v2';
export const ADMIN_PASSWORD_REQUIRED = 'Qwsa1212';

// Sample demo orders in Rahim Yar Khan for instant testing
const SAMPLE_ORDERS: Order[] = [
  {
    id: 'RYK-5821',
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    customerName: 'محمد احمد چوہدری',
    customerPhone: '03007891234',
    deliveryArea: 'Model Town (ماڈل ٹاؤن)',
    fullAddress: 'مکان نمبر 42، گلی 8، بلاک بی، ماڈل ٹاؤن، رحیم یار خان',
    landmark: 'قریب ماڈل ٹاؤن پارک و جامع مسجد',
    locationLink: 'https://maps.google.com/?q=28.4285,70.3015',
    liveLocationCoords: {
      lat: 28.4285,
      lng: 70.3015,
      accuracy: 12
    },
    items: [
      {
        cartItemId: 'sample-1',
        fish: INITIAL_FISH_CATALOG[1], // Singhara
        weightKg: 2,
        cuttingOption: 'گول قتلے / کڑاہی کٹ',
        specialInstructions: 'تھوڑا نمک اور اجوائن ہلکی لگی ہو',
        itemTotal: 3100
      },
      {
        cartItemId: 'sample-2',
        fish: INITIAL_FISH_CATALOG[0], // Rohu
        weightKg: 1.5,
        cuttingOption: 'بغیر کانٹے فنگر کٹ',
        specialInstructions: 'کرسپی فرائی کے لیے باریک فنگرز',
        itemTotal: 1575
      }
    ],
    subtotal: 4675,
    deliveryFee: 0,
    totalAmount: 4675,
    paymentMethod: 'cod',
    status: 'out_for_delivery',
    statusHistory: [
      {
        status: 'received',
        timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
        note: 'آرڈر سسٹم میں درج ہو گیا'
      },
      {
        status: 'cleaning_cutting',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        note: 'ماہر کاریگر سے صفائی اور کٹائی مکمل، آئس باکس پیکنگ'
      },
      {
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        note: 'رائیڈر طاہر علی تازہ آرڈر لے کر روانہ ہو گیا'
      }
    ],
    riderName: 'طاہر علی (ایکسپریس رائیڈر)',
    riderPhone: '03083312566',
    riderEtaMinutes: 14,
    riderProgressPercent: 65,
    riderNotes: 'قریب ایئرپورٹ چوک سے ماڈل ٹاؤن کی طرف گامزن ہے'
  },
  {
    id: 'RYK-5820',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    customerName: 'شیخ رضوان',
    customerPhone: '03029988776',
    deliveryArea: 'Abbasia Town (عباسیہ ٹاؤن)',
    fullAddress: 'کوٹھی نمبر 15، عباسیہ ٹاؤن، نزد جناح ہال، رحیم یار خان',
    landmark: 'بالمقابل جناح ہال رحیم یار خان',
    locationLink: 'https://maps.google.com/?q=28.4190,70.3090',
    liveLocationCoords: {
      lat: 28.4190,
      lng: 70.3090
    },
    items: [
      {
        cartItemId: 'sample-3',
        fish: INITIAL_FISH_CATALOG[2], // Surmai
        weightKg: 1.5,
        cuttingOption: 'بی بی کیو / گرل درمیان سے کھلا',
        itemTotal: 3675
      }
    ],
    subtotal: 3675,
    deliveryFee: 0,
    totalAmount: 3675,
    paymentMethod: 'cod',
    status: 'cleaning_cutting',
    statusHistory: [
      {
        status: 'received',
        timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
        note: 'آرڈر منظور کر لیا گیا'
      },
      {
        status: 'cleaning_cutting',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        note: 'سرمئی مچھلی کی ماہرانہ کٹائی جاری ہے'
      }
    ],
    riderName: 'کاشف محمود',
    riderPhone: '03083312566',
    riderEtaMinutes: 30,
    riderProgressPercent: 30,
    riderNotes: 'کٹائی کے بعد فوری روانگی ہوگی'
  }
];

export function getStoredFishCatalog(): FishItem[] {
  try {
    const raw = localStorage.getItem(FISH_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FISH_STORAGE_KEY, JSON.stringify(INITIAL_FISH_CATALOG));
      return INITIAL_FISH_CATALOG;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_FISH_CATALOG;
  } catch {
    return INITIAL_FISH_CATALOG;
  }
}

export function saveFishCatalog(items: FishItem[]): void {
  try {
    localStorage.setItem(FISH_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save fish catalog', err);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SAMPLE_ORDERS;
  } catch {
    return SAMPLE_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders', err);
  }
}

export function addOrder(newOrder: Order): void {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  saveOrders(updated);
}

export function updateOrderStatus(
  orderId: string, 
  newStatus: Order['status'], 
  note?: string,
  riderUpdates?: {
    riderName?: string;
    riderPhone?: string;
    riderEtaMinutes?: number;
    riderProgressPercent?: number;
    riderNotes?: string;
  }
): Order | null {
  const current = getStoredOrders();
  const idx = current.findIndex(o => o.id.toLowerCase() === orderId.toLowerCase());
  if (idx === -1) return null;

  const target = current[idx];
  const updatedHistory = [
    ...target.statusHistory,
    {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `آرڈر سٹیٹس تبدیل ہو کر ${newStatus} ہو گیا`
    }
  ];

  const updatedOrder: Order = {
    ...target,
    status: newStatus,
    statusHistory: updatedHistory,
    ...(riderUpdates || {})
  };

  current[idx] = updatedOrder;
  saveOrders(current);
  return updatedOrder;
}

export function formatPKR(num: number): string {
  return `Rs. ${num.toLocaleString('en-PK')}`;
}

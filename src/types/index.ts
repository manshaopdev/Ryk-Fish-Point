export type FishCategory = 'freshwater' | 'seawater';

export type BoneType = 'single_bone' | 'low_bones' | 'moderate' | 'boneless_fillet';

export type CookingMethod = 'fry' | 'salan' | 'bbq_grill' | 'steam_tandoor';

export interface FishItem {
  id: string;
  name: string;
  urduName: string;
  category: FishCategory;
  pricePerKg: number;
  minWeightKg: number;
  description: string;
  urduDescription: string;
  boneType: BoneType;
  bestCooking: CookingMethod;
  origin: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CuttingOption {
  id: string;
  label: string;
  urduLabel: string;
  description: string;
}

export interface CartItem {
  cartItemId: string;
  fish: FishItem;
  weightKg: number;
  cuttingOption: string;
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus = 'received' | 'cleaning_cutting' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  fullAddress: string;
  landmark?: string;
  liveLocationCoords?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  locationLink?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'jazzcash_easypaisa';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  riderName?: string;
  riderPhone?: string;
  riderEtaMinutes?: number;
  riderProgressPercent?: number;
  riderNotes?: string;
}

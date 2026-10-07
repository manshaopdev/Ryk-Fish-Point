import { FishItem, CuttingOption } from '../types';

export const OFFICIAL_PHONE = '03083312566';
export const OFFICIAL_WHATSAPP = '03023608248';
export const RYK_CITY_NAME = 'Rahim Yar Khan';

export const RYK_DELIVERY_AREAS = [
  'Model Town (ماڈل ٹاؤن)',
  'Abbasia Town (عباسیہ ٹاؤن)',
  'Gulshan-e-Iqbal (گلشن اقبال)',
  'Trust Colony (ٹرسٹ کالونی)',
  'Satellite Town (سیٹلائٹ ٹاؤن)',
  'Airport Road & PAF Colony (ایئرپورٹ روڈ)',
  'Shahbaz Pur Road (شہباز پور روڈ)',
  'Khanpur Road (خان پور روڈ)',
  'Thali Road (تھلی روڈ)',
  'Dari Sanghi (دڑی سانگھی)',
  'Factory Area & Jinnah Hall (فیکٹری ایریا)',
  'Shahi Road & City Center (شاہی روڈ)',
  'Gulberg Colony (گلبرگ کالونی)',
  'Iqbal Nagar (اقبال نگر)',
  'Gala Mandi & Railway Road (غلہ منڈی)',
  'Officers Colony (آفیسرز کالونی)',
  'Kot Samaba Road Bypass (کوٹ سمابہ بائی پاس)',
  'Tibbi Larr (ٹبی لاڑ)'
];

export const CUTTING_OPTIONS: CuttingOption[] = [
  {
    id: 'karahi_slices',
    label: 'Karahi Cut / Round Slices',
    urduLabel: 'گول قتلے / کڑاہی کٹ',
    description: 'Perfect round slices for traditional curry, salan and deep frying.'
  },
  {
    id: 'boneless_finger',
    label: 'Boneless Finger / Strips',
    urduLabel: 'بغیر کانٹے فنگر کٹ',
    description: 'Central and pin bones removed, cut into strips for crispy fish fry.'
  },
  {
    id: 'bbq_butterfly',
    label: 'BBQ / Grill Split Cut',
    urduLabel: 'بی بی کیو / گرل درمیان سے کھلا',
    description: 'Split opened from belly/back for charcoal BBQ, masala marination and oven roast.'
  },
  {
    id: 'whole_cleaned',
    label: 'Whole Cleaned (With Head)',
    urduLabel: 'مکمل صاف شدہ (سر کے ساتھ)',
    description: 'Gutted and descaled thoroughly, whole fish with head for steaming or baking.'
  },
  {
    id: 'head_tail_removed',
    label: 'Body Slices (Head & Tail Separate)',
    urduLabel: 'سر اور دم الگ، صرف قتلے',
    description: 'Head and tail packed separately for soup/salan stock, pure slices for eating.'
  }
];

export const INITIAL_FISH_CATALOG: FishItem[] = [
  {
    id: 'fish-rohu',
    name: 'Rohu (Dumbra)',
    urduName: 'روہو / ڈمبرا مچھلی',
    category: 'freshwater',
    pricePerKg: 1050,
    minWeightKg: 1,
    description: 'Pakistan’s most popular river fish from Indus River and local sweet water. Rich in natural oils, very sweet and flavorful meat.',
    urduDescription: 'دریائے سندھ اور پنجند کے میٹھے پانی کی لذیذ ترین مچھلی۔ شوربے والے سالن اور لاہوری فش فرائی کے لیے بہترین انتخاب۔',
    boneType: 'moderate',
    bestCooking: 'fry',
    origin: 'Indus River / Panjnad River Fresh Catch',
    image: '/src/assets/images/fish_freshwater_rohu_1791374582267.jpg',
    inStock: true,
    featured: true
  },
  {
    id: 'fish-singhara',
    name: 'Singhara (Catfish)',
    urduName: 'سنگھارا مچھلی (سنگل کانٹا)',
    category: 'freshwater',
    pricePerKg: 1550,
    minWeightKg: 1,
    description: 'Famous single center bone river fish. Virtually bone-free, firm succulent white meat loved by children and elders.',
    urduDescription: 'صرف ایک درمیان والا کانٹا، بچوں اور بزرگوں کی پہلی پسند۔ سرما کی شاموں میں فرائی اور کڑاہی کے لیے نمبر 1 مچھلی۔',
    boneType: 'single_bone',
    bestCooking: 'fry',
    origin: 'Indus River Basin Fresh Harvest',
    image: '/src/assets/images/fish_singhara_slices_1791374603876.jpg',
    inStock: true,
    featured: true
  },
  {
    id: 'fish-surmai',
    name: 'Surmai (King Mackerel)',
    urduName: 'سرمئی مچھلی (بادشاہ مچھلی)',
    category: 'seawater',
    pricePerKg: 2450,
    minWeightKg: 1,
    description: 'King of seawater fish directly dispatched from Karachi Arabian Sea to RYK. Solid meaty steaks with zero small bones.',
    urduDescription: 'سمندر کی شاہی مچھلی، کراچی سے تازہ رحیم یار خان بذریعہ کولڈ چین۔ بغیر باریک کانٹوں کے موٹے لذیذ قتلے۔',
    boneType: 'single_bone',
    bestCooking: 'bbq_grill',
    origin: 'Karachi Arabian Sea Direct Catch',
    image: '/src/assets/images/fish_surmai_pomfret_1791374619461.jpg',
    inStock: true,
    featured: true
  },
  {
    id: 'fish-white-pomfret',
    name: 'White Pomfret (Safed Paplet)',
    urduName: 'سفید پاپلیٹ مچھلی',
    category: 'seawater',
    pricePerKg: 2850,
    minWeightKg: 1,
    description: 'Exquisite Arabian sea white pomfret. Incredibly tender, sweet buttery meat, single spine, the ultimate luxury seafood.',
    urduDescription: 'سب سے نازک اور لذیذ سمندری مچھلی۔ مکھن جیسا ذائقہ، باریک کانٹے بالکل نہیں، توے پر فرائی کے لیے شاہکار۔',
    boneType: 'single_bone',
    bestCooking: 'fry',
    origin: 'Arabian Sea Deep Water Harvest',
    image: '/src/assets/images/fish_surmai_pomfret_1791374619461.jpg',
    inStock: true,
    featured: true
  },
  {
    id: 'fish-thaila',
    name: 'Thaila (Catla / Bao)',
    urduName: 'تھیلا / باؤ مچھلی',
    category: 'freshwater',
    pricePerKg: 950,
    minWeightKg: 1.5,
    description: 'Large freshwater carp with prominent head and juicy tender body meat. Highly prized for thick gravy fish curry.',
    urduDescription: 'میٹھے پانی کا بڑا تھیلا، جاندار گوشت اور رسیلا ذائقہ۔ سالن اور مچھلی پلاؤ کے شوقین حضرات کی خاص فرمائش۔',
    boneType: 'moderate',
    bestCooking: 'salan',
    origin: 'Panjnad Sweet Water RYK',
    image: '/src/assets/images/fish_freshwater_rohu_1791374582267.jpg',
    inStock: true
  },
  {
    id: 'fish-black-pomfret',
    name: 'Black Pomfret (Kala Paplet)',
    urduName: 'کالا پاپلیٹ مچھلی',
    category: 'seawater',
    pricePerKg: 1950,
    minWeightKg: 1,
    description: 'Rich dark sea fish with profound taste and firm texture. Crisps up extraordinarily well with traditional spices.',
    urduDescription: 'گہرے سمندر کا کالا پاپلیٹ، کرسپی کڑک فرائی اور چٹخارے دار مسالے کے ساتھ انتہائی لذیذ۔',
    boneType: 'low_bones',
    bestCooking: 'fry',
    origin: 'Karachi Coast Arabian Sea',
    image: '/src/assets/images/fish_surmai_pomfret_1791374619461.jpg',
    inStock: true
  },
  {
    id: 'fish-heera',
    name: 'Heera (Red Snapper)',
    urduName: 'ہیرا مچھلی (ریڈ سنیپر)',
    category: 'seawater',
    pricePerKg: 2250,
    minWeightKg: 1,
    description: 'Radiant red sea fish with firm white flakes and delicate sweetness. Celebrated for whole tandoori grill and tikka.',
    urduDescription: 'خوبصورت سرخ رنگ اور سفید ٹھوس گوشت۔ باربی کیو، گرل اور تندوری تکہ بنانے کے لیے پاکستان کی لاجواب مچھلی۔',
    boneType: 'low_bones',
    bestCooking: 'bbq_grill',
    origin: 'Arabian Sea Karachi Fresh Line',
    image: '/src/assets/images/hero_ryk_fresh_fish_1791374550335.jpg',
    inStock: true
  },
  {
    id: 'fish-mori',
    name: 'Mori (Mrigal Carp)',
    urduName: 'موری مچھلی',
    category: 'freshwater',
    pricePerKg: 890,
    minWeightKg: 1,
    description: 'Lean, low-fat freshwater river fish with authentic Punjab taste. Highly economical and nourishing.',
    urduDescription: 'دیسی میٹھے پانی کی موری، ہلکی پھلکی اور روایتی پنجابی ذائقے سے بھرپور۔ روزمرہ گھریلو سالن کے لیے بہترین۔',
    boneType: 'moderate',
    bestCooking: 'salan',
    origin: 'Local RYK Sweet Water Reservoirs',
    image: '/src/assets/images/fish_freshwater_rohu_1791374582267.jpg',
    inStock: true
  },
  {
    id: 'fish-mushka',
    name: 'Mushka (Croaker Fish)',
    urduName: 'مشکا مچھلی (سنگل کانٹا)',
    category: 'seawater',
    pricePerKg: 1650,
    minWeightKg: 1,
    description: 'Substantial seawater white fish with a single central backbone. Doesn’t break apart in high heat curries or frying.',
    urduDescription: 'سمندری مچھلی جس میں چھوٹے کانٹے نہیں ہوتے۔ سالن میں بوٹیاں نہیں ٹوٹتیں، شاندار سوپ اور قتلے بنتے ہیں۔',
    boneType: 'single_bone',
    bestCooking: 'salan',
    origin: 'Gwadar & Karachi Coastal Waters',
    image: '/src/assets/images/fish_singhara_slices_1791374603876.jpg',
    inStock: true
  },
  {
    id: 'fish-gulfam',
    name: 'Gulfam (Common Carp)',
    urduName: 'گلفام مچھلی',
    category: 'freshwater',
    pricePerKg: 850,
    minWeightKg: 1.5,
    description: 'Sweet, tender white meat freshwater fish with juicy thick cuts. Great everyday choice for fish lovers.',
    urduDescription: 'رحیم یار خان کے تازہ فارمز اور نہری پانی کی تازہ گلفام۔ سستی اور لذیذ، بہترین گھریلو کڑاہی۔',
    boneType: 'moderate',
    bestCooking: 'fry',
    origin: 'Rahim Yar Khan Fresh Fish Farm',
    image: '/src/assets/images/fish_freshwater_rohu_1791374582267.jpg',
    inStock: true
  },
  {
    id: 'fish-dawan-tuna',
    name: 'Dawan (Yellowfin Tuna Steaks)',
    urduName: 'ڈاون مچھلی / ٹونا سٹیکس',
    category: 'seawater',
    pricePerKg: 2100,
    minWeightKg: 1,
    description: 'High-protein, red-meat deep sea tuna. 100% boneless solid meat chunks, perfect for gym diet and gourmet grilling.',
    urduDescription: 'سمندری ٹونا مچھلی، خالص گوشت بغیر کسی کانٹے کے۔ ہائی پروٹین اور ڈائٹ کے شوقین افراد کے لیے زبردست۔',
    boneType: 'boneless_fillet',
    bestCooking: 'bbq_grill',
    origin: 'Arabian Sea Deep Water Karachi',
    image: '/src/assets/images/fish_surmai_pomfret_1791374619461.jpg',
    inStock: true
  },
  {
    id: 'fish-jhinga',
    name: 'Fresh Arabian Sea Prawns (Jhinga)',
    urduName: 'سمندری تازہ جھینگا (پرانز)',
    category: 'seawater',
    pricePerKg: 3100,
    minWeightKg: 0.5,
    description: 'Jumbo and medium Arabian Sea prawns, fresh, sweet and cleaned. Zero bones, exquisite seafood delicacy.',
    urduDescription: 'سمندر کے تازہ جھینگے، صاف شدہ۔ ذائقے دار جھینگا کڑاہی، پران فرائی اور بریانی کے لیے تیار۔',
    boneType: 'boneless_fillet',
    bestCooking: 'fry',
    origin: 'Karachi Fresh Seafood Terminal',
    image: '/src/assets/images/hero_ryk_fresh_fish_1791374550335.jpg',
    inStock: true,
    featured: true
  }
];

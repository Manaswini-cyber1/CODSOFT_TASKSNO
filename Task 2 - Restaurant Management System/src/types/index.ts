export type UserRole = 'customer' | 'kitchen' | 'admin';

export type Category = 'All' | 'Chef Specials' | 'Appetizers' | 'Main Courses' | 'Desserts' | 'Cocktails & Drinks';

export interface CustomizationOption {
  id: string;
  name: string;
  choices: {
    id: string;
    label: string;
    extraPrice: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
  dietaryTags: ('Vegan' | 'Vegetarian' | 'Gluten-Free' | 'Spicy' | 'Chef Special')[];
  preparationTimeMins: number;
  calories: number;
  customizationOptions?: CustomizationOption[];
}

export interface SelectedCustomization {
  optionId: string;
  optionName: string;
  choiceId: string;
  choiceLabel: string;
  extraPrice: number;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  itemTotalPrice: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  status: OrderStatus;
  orderType: OrderType;
  tableId?: string;
  tableName?: string;
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  discountAmount: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'card' | 'cash' | 'apple-pay';
  isPaid: boolean;
  createdAt: string; // ISO String
  updatedAt: string;
}

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'cleaning';
export type TableZone = 'Main Dining' | 'Patio Terrace' | 'VIP Booth' | 'Bar Lounge';

export interface Table {
  id: string;
  number: number;
  label: string;
  zone: TableZone;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  reservedTime?: string;
  reservedByName?: string;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  tableId: string;
  tableName: string;
  zone: TableZone;
  status: 'confirmed' | 'seated' | 'cancelled' | 'completed';
  occasion?: string;
  specialNotes?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  dailyRevenue: number;
  ordersTodayCount: number;
  tableOccupancyRate: number;
  averagePrepTimeMins: number;
}

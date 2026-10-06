import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = path.join(__dirname, 'dinedesk-db.json');

const INITIAL_DATA = {
  menuItems: [
    {
      id: 'm1',
      name: 'Truffle Ribeye Steak',
      description: '12oz Prime Angus Ribeye, black truffle butter, roasted garlic mashed potatoes & charred asparagus.',
      price: 48.00,
      category: 'Chef Specials',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Chef Special', 'Gluten-Free'],
      preparationTimeMins: 22,
      calories: 890
    },
    {
      id: 'm2',
      name: 'Pan-Seared Chilean Sea Bass',
      description: 'Wild sea bass over saffron risotto, baby bok choy, citrus beurre blanc.',
      price: 42.50,
      category: 'Chef Specials',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Chef Special', 'Gluten-Free'],
      preparationTimeMins: 18,
      calories: 640
    },
    {
      id: 'm3',
      name: 'Artisanal Burrata & Heirloom Tomato',
      description: 'Fresh Pugliese burrata, heirloom tomatoes, aged balsamic glaze, extra virgin olive oil & toasted sourdough.',
      price: 19.00,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Vegetarian'],
      preparationTimeMins: 10,
      calories: 420
    },
    {
      id: 'm4',
      name: 'Crispy Calamari Fritti',
      description: 'Lightly battered squid, Meyer lemon aioli, spicy marinara dipping sauce.',
      price: 17.50,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Spicy'],
      preparationTimeMins: 12,
      calories: 510
    },
    {
      id: 'm5',
      name: 'Handcrafted Wild Mushroom Fettuccine',
      description: 'Fresh egg pasta, porcini & chanterelle mushrooms, white truffle cream, shaved Parmigiano-Reggiano.',
      price: 29.00,
      category: 'Main Courses',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Vegetarian'],
      preparationTimeMins: 15,
      calories: 720
    },
    {
      id: 'm6',
      name: 'Wood-Fired Wagyu Burger',
      description: '8oz American Wagyu patty, caramelized onions, smoked gouda, truffle aioli on brioche bun with herb fries.',
      price: 26.00,
      category: 'Main Courses',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: [],
      preparationTimeMins: 16,
      calories: 950
    },
    {
      id: 'm7',
      name: 'Spicy Avocado & Tofu Buddha Bowl',
      description: 'Quinoa, charred avocado, crispy spiced tofu, edamame, pickled cucumber, sesame ginger dressing.',
      price: 22.00,
      category: 'Main Courses',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Vegan', 'Gluten-Free', 'Spicy'],
      preparationTimeMins: 12,
      calories: 480
    },
    {
      id: 'm8',
      name: 'Valrhona Dark Chocolate Lava Cake',
      description: 'Warm molten chocolate center, Madagascar vanilla bean gelato & raspberry coulis.',
      price: 14.50,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Vegetarian'],
      preparationTimeMins: 14,
      calories: 580
    },
    {
      id: 'm9',
      name: 'Classic Venetian Tiramisu',
      description: 'Espresso-soaked ladyfingers, mascarpone mousse, dusted with Dutch cocoa powder.',
      price: 13.00,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Vegetarian'],
      preparationTimeMins: 5,
      calories: 430
    },
    {
      id: 'm10',
      name: 'Smoked Old Fashioned Cocktail',
      description: 'Bourbon whiskey, Angostura bitters, raw sugar, applewood smoke infusion.',
      price: 18.00,
      category: 'Cocktails & Drinks',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
      dietaryTags: ['Chef Special'],
      preparationTimeMins: 5,
      calories: 180
    }
  ],
  tables: [
    { id: 't1', number: 1, label: 'T-01', zone: 'Main Dining', capacity: 2, status: 'occupied', currentOrderId: 'ord-101' },
    { id: 't2', number: 2, label: 'T-02', zone: 'Main Dining', capacity: 4, status: 'available' },
    { id: 't3', number: 3, label: 'T-03', zone: 'Main Dining', capacity: 4, status: 'reserved', reservedByName: 'Sophia Martinez', reservedTime: '19:30' },
    { id: 't4', number: 4, label: 'T-04', zone: 'Main Dining', capacity: 6, status: 'occupied', currentOrderId: 'ord-102' },
    { id: 't5', number: 5, label: 'T-05', zone: 'Patio Terrace', capacity: 2, status: 'available' },
    { id: 't6', number: 6, label: 'T-06', zone: 'Patio Terrace', capacity: 4, status: 'cleaning' },
    { id: 't7', number: 7, label: 'T-07', zone: 'Patio Terrace', capacity: 4, status: 'reserved', reservedByName: 'Liam Johnson', reservedTime: '20:00' },
    { id: 't8', number: 8, label: 'VIP-1', zone: 'VIP Booth', capacity: 8, status: 'available' },
    { id: 't9', number: 9, label: 'VIP-2', zone: 'VIP Booth', capacity: 8, status: 'reserved', reservedByName: 'Alexander Wright', reservedTime: '19:00' },
    { id: 't10', number: 10, label: 'BAR-1', zone: 'Bar Lounge', capacity: 2, status: 'available' },
    { id: 't11', number: 11, label: 'BAR-2', zone: 'Bar Lounge', capacity: 2, status: 'occupied', currentOrderId: 'ord-103' }
  ],
  orders: [
    {
      id: 'ord-101',
      orderNumber: '#1001',
      orderType: 'dine-in',
      tableId: 't1',
      tableName: 'T-01 (Main)',
      status: 'preparing',
      customerName: 'Marcus Vance',
      customerPhone: '+1 555-0192',
      subtotal: 67.00,
      taxAmount: 5.36,
      tipAmount: 10.05,
      discountAmount: 0,
      totalAmount: 82.41,
      paymentMethod: 'card',
      isPaid: true,
      createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 60000).toISOString(),
      items: [
        {
          id: 'ci1',
          menuItem: { id: 'm1', name: 'Truffle Ribeye Steak', price: 48.00 },
          quantity: 1,
          selectedCustomizations: [{ optionId: 'opt_steak_temp', optionName: 'Doneness', choiceId: 'c2', choiceLabel: 'Medium Rare', extraPrice: 0 }],
          itemTotalPrice: 48.00
        },
        {
          id: 'ci2',
          menuItem: { id: 'm3', name: 'Artisanal Burrata & Heirloom Tomato', price: 19.00 },
          quantity: 1,
          selectedCustomizations: [],
          itemTotalPrice: 19.00
        }
      ]
    }
  ],
  reservations: [
    {
      id: 'res-1',
      reservationCode: 'RES-8921',
      customerName: 'Sophia Martinez',
      customerEmail: 'sophia.m@example.com',
      customerPhone: '+1 555-0144',
      partySize: 4,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '19:30',
      tableId: 't3',
      tableName: 'T-03',
      zone: 'Main Dining',
      status: 'confirmed',
      occasion: 'Birthday Celebration',
      specialNotes: 'Prefers quiet window seating.',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

class JSONDatabase {
  constructor() {
    this.data = INITIAL_DATA;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch {
      this.data = INITIAL_DATA;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save JSON db:', e);
    }
  }

  // Menu Methods
  getMenuItems() {
    return this.data.menuItems || [];
  }

  addMenuItem(item) {
    const newItem = {
      ...item,
      id: item.id || `m_${Date.now()}`,
      isAvailable: item.isAvailable !== false,
      dietaryTags: item.dietaryTags || []
    };
    this.data.menuItems.unshift(newItem);
    this.save();
    return newItem;
  }

  updateMenuItem(id, updated) {
    this.data.menuItems = this.data.menuItems.map(m => m.id === id ? { ...m, ...updated } : m);
    this.save();
  }

  toggleMenuItemAvailability(id) {
    let newState = false;
    this.data.menuItems = this.data.menuItems.map(m => {
      if (m.id === id) {
        newState = !m.isAvailable;
        return { ...m, isAvailable: newState };
      }
      return m;
    });
    this.save();
    return newState;
  }

  deleteMenuItem(id) {
    this.data.menuItems = this.data.menuItems.filter(m => m.id !== id);
    this.save();
  }

  bulkImportMenuItems(items) {
    const formatted = items.map(item => ({
      ...item,
      id: item.id || `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isAvailable: item.isAvailable !== false,
      dietaryTags: item.dietaryTags || []
    }));
    this.data.menuItems = [...formatted, ...this.data.menuItems];
    this.save();
    return formatted.length;
  }

  // Table Methods
  getTables() {
    return this.data.tables || [];
  }

  updateTableStatus(tableId, status, currentOrderId) {
    this.data.tables = this.data.tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status,
          currentOrderId: currentOrderId !== undefined ? currentOrderId : t.currentOrderId
        };
      }
      return t;
    });
    this.save();
  }

  // Order Methods
  getOrders() {
    return this.data.orders || [];
  }

  addOrder(orderData) {
    const newOrder = {
      ...orderData,
      id: orderData.id || `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };
    this.data.orders.unshift(newOrder);

    if (orderData.orderType === 'dine-in' && orderData.tableId) {
      this.updateTableStatus(orderData.tableId, 'occupied', newOrder.id);
    }

    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    this.data.orders = this.data.orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status, updatedAt: new Date().toISOString() };
        if ((status === 'served' || status === 'completed' || status === 'cancelled') && o.tableId) {
          this.updateTableStatus(o.tableId, status === 'completed' ? 'cleaning' : 'available', null);
        }
        return updated;
      }
      return o;
    });
    this.save();
  }

  // Reservation Methods
  getReservations() {
    return this.data.reservations || [];
  }

  addReservation(resData) {
    const newRes = {
      ...resData,
      id: resData.id || `res_${Date.now()}`,
      reservationCode: resData.reservationCode || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    this.data.reservations.unshift(newRes);
    this.updateTableStatus(resData.tableId, 'reserved');
    this.save();
    return newRes;
  }

  updateReservationStatus(id, status) {
    this.data.reservations = this.data.reservations.map(r => r.id === id ? { ...r, status } : r);
    this.save();
  }

  resetAllData() {
    this.data.orders = [];
    this.data.reservations = [];
    this.data.tables = this.data.tables.map(t => ({ ...t, status: 'available', currentOrderId: null }));
    this.save();
  }
}

export const db = new JSONDatabase();
export default db;

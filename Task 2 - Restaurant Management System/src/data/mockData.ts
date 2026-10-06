import type { MenuItem, Table, Order, Reservation } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
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
    calories: 890,
    customizationOptions: [
      {
        id: 'opt_steak_temp',
        name: 'Doneness Level',
        choices: [
          { id: 'c1', label: 'Rare', extraPrice: 0 },
          { id: 'c2', label: 'Medium Rare', extraPrice: 0 },
          { id: 'c3', label: 'Medium', extraPrice: 0 },
          { id: 'c4', label: 'Medium Well', extraPrice: 0 },
        ]
      },
      {
        id: 'opt_steak_sauce',
        name: 'Extra Sauce',
        choices: [
          { id: 's1', label: 'Truffle Jus', extraPrice: 3.50 },
          { id: 's2', label: 'Peppercorn Cream', extraPrice: 3.00 },
        ]
      }
    ]
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
    calories: 950,
    customizationOptions: [
      {
        id: 'opt_burger_side',
        name: 'Choose Side',
        choices: [
          { id: 'bs1', label: 'Truffle Fries', extraPrice: 2.00 },
          { id: 'bs2', label: 'Sweet Potato Fries', extraPrice: 1.50 },
          { id: 'bs3', label: 'House Green Salad', extraPrice: 0 },
        ]
      }
    ]
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
  },
  {
    id: 'm11',
    name: 'Sparkling Dragonfruit Hibiscus Mocktail',
    description: 'Fresh dragonfruit puree, organic hibiscus tea, lime juice, sparkling soda.',
    price: 10.50,
    category: 'Cocktails & Drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    dietaryTags: ['Vegan'],
    preparationTimeMins: 4,
    calories: 110
  }
];

export const INITIAL_TABLES: Table[] = [
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
];

export const INITIAL_ORDERS: Order[] = [
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
        menuItem: INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedCustomizations: [{ optionId: 'opt_steak_temp', optionName: 'Doneness', choiceId: 'c2', choiceLabel: 'Medium Rare', extraPrice: 0 }],
        itemTotalPrice: 48.00
      },
      {
        id: 'ci2',
        menuItem: INITIAL_MENU_ITEMS[2],
        quantity: 1,
        selectedCustomizations: [],
        itemTotalPrice: 19.00
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: '#1002',
    orderType: 'dine-in',
    tableId: 't4',
    tableName: 'T-04 (Main)',
    status: 'pending',
    customerName: 'Elena Rostova',
    customerPhone: '+1 555-0841',
    subtotal: 97.50,
    taxAmount: 7.80,
    tipAmount: 15.00,
    discountAmount: 10.00,
    totalAmount: 110.30,
    paymentMethod: 'apple-pay',
    isPaid: true,
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60000).toISOString(),
    items: [
      {
        id: 'ci3',
        menuItem: INITIAL_MENU_ITEMS[1],
        quantity: 2,
        selectedCustomizations: [],
        itemTotalPrice: 85.00
      },
      {
        id: 'ci4',
        menuItem: INITIAL_MENU_ITEMS[10],
        quantity: 1,
        selectedCustomizations: [],
        itemTotalPrice: 10.50
      }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: '#1003',
    orderType: 'takeaway',
    status: 'ready',
    customerName: 'David Chen',
    customerPhone: '+1 555-7732',
    subtotal: 44.00,
    taxAmount: 3.52,
    tipAmount: 6.00,
    discountAmount: 0,
    totalAmount: 53.52,
    paymentMethod: 'card',
    isPaid: true,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      {
        id: 'ci5',
        menuItem: INITIAL_MENU_ITEMS[5],
        quantity: 1,
        selectedCustomizations: [{ optionId: 'opt_burger_side', optionName: 'Choose Side', choiceId: 'bs1', choiceLabel: 'Truffle Fries', extraPrice: 2.00 }],
        itemTotalPrice: 28.00
      },
      {
        id: 'ci6',
        menuItem: INITIAL_MENU_ITEMS[7],
        quantity: 1,
        selectedCustomizations: [],
        itemTotalPrice: 14.50
      }
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
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
  },
  {
    id: 'res-2',
    reservationCode: 'RES-7410',
    customerName: 'Alexander Wright',
    customerEmail: 'alex.wright@corporate.com',
    customerPhone: '+1 555-0988',
    partySize: 8,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '19:00',
    tableId: 't9',
    tableName: 'VIP-2',
    zone: 'VIP Booth',
    status: 'confirmed',
    occasion: 'Business Dinner',
    specialNotes: 'Pre-selected wine pair requested.',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

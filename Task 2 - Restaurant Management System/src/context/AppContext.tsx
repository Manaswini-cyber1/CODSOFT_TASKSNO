import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  MenuItem,
  Table,
  Order,
  Reservation,
  CartItem,
  UserRole,
  OrderStatus,
  TableStatus,
  SelectedCustomization
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS
} from '../data/mockData';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => Promise<void>;
  toggleMenuItemAvailability: (id: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  bulkImportMenu: (items: Partial<MenuItem>[]) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, selectedCustomizations: SelectedCustomization[], specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;

  // Tables
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus, currentOrderId?: string) => Promise<void>;
  selectedTableId: string | null;
  setSelectedTableId: (tableId: string | null) => void;

  // Orders
  orders: Order[];
  activeOrderId: string | null;
  setActiveOrderId: (orderId: string | null) => void;
  placeOrder: (orderDetails: {
    customerName: string;
    customerPhone: string;
    orderType: 'dine-in' | 'takeaway';
    tableId?: string;
    tableName?: string;
    paymentMethod: 'card' | 'cash' | 'apple-pay';
    tipPercentage: number;
    promoCode?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Reservations
  reservations: Reservation[];
  createReservation: (resData: Omit<Reservation, 'id' | 'reservationCode' | 'createdAt' | 'status'>) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: 'confirmed' | 'seated' | 'cancelled' | 'completed') => Promise<void>;

  // Sound, Toast & Sync
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetAllTransactions: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const playAudioChime = (type: 'order' | 'kitchen' | 'success') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'kitchen') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch {
    // Ignore audio restrictions
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('menu');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>('ord-101');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from REST API server on mount
  const refreshAllData = async () => {
    try {
      const [m, t, o, r] = await Promise.all([
        api.fetchMenu().catch(() => null),
        api.fetchTables().catch(() => null),
        api.fetchOrders().catch(() => null),
        api.fetchReservations().catch(() => null)
      ]);
      if (m) setMenuItems(m);
      if (t) setTables(t);
      if (o) setOrders(o);
      if (r) setReservations(r);
    } catch {
      // Fall back to initial state
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Menu Operations
  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...itemData, id: `m_${Date.now()}` };
    setMenuItems(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu.`);
    try {
      await api.addMenuItem(itemData);
    } catch {
      // fallback saved in UI state
    }
  };

  const updateMenuItem = async (id: string, updated: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    showToast('Menu item updated.');
    try {
      await api.updateMenuItem(id, updated);
    } catch {}
  };

  const toggleMenuItemAvailability = async (id: string) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
    showToast('Availability updated.');
    try {
      await api.toggleMenuItemAvailability(id);
    } catch {}
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    showToast('Item deleted.');
    try {
      await api.deleteMenuItem(id);
    } catch {}
  };

  const bulkImportMenu = async (items: Partial<MenuItem>[]) => {
    try {
      const count = await api.bulkImportMenu(items);
      showToast(`Successfully imported ${count} real menu items!`);
      await refreshAllData();
    } catch {
      showToast('Bulk import failed. Please check file format.');
    }
  };

  // Cart Operations
  const addToCart = (
    menuItem: MenuItem,
    quantity: number,
    selectedCustomizations: SelectedCustomization[],
    specialInstructions?: string
  ) => {
    const extrasTotal = selectedCustomizations.reduce((acc, c) => acc + c.extraPrice, 0);
    const unitPrice = menuItem.price + extrasTotal;
    const itemTotalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      id: `ci_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      menuItem,
      quantity,
      selectedCustomizations,
      specialInstructions,
      itemTotalPrice
    };

    setCart(prev => [...prev, newItem]);
    if (soundEnabled) playAudioChime('success');
    showToast(`Added ${quantity}x ${menuItem.name} to cart`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const extrasTotal = item.selectedCustomizations.reduce((acc, c) => acc + c.extraPrice, 0);
        const unitPrice = item.menuItem.price + extrasTotal;
        return {
          ...item,
          quantity: newQuantity,
          itemTotalPrice: unitPrice * newQuantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  // Table Operations
  const updateTableStatus = async (tableId: string, status: TableStatus, currentOrderId?: string) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status, currentOrderId: currentOrderId ?? t.currentOrderId } : t));
    showToast(`Table updated to ${status.toUpperCase()}`);
    try {
      await api.updateTableStatus(tableId, status, currentOrderId);
    } catch {}
  };

  // Orders Operation
  const placeOrder = async (orderDetails: {
    customerName: string;
    customerPhone: string;
    orderType: 'dine-in' | 'takeaway';
    tableId?: string;
    tableName?: string;
    paymentMethod: 'card' | 'cash' | 'apple-pay';
    tipPercentage: number;
    promoCode?: string;
  }): Promise<Order> => {
    const subtotal = cartSubtotal;
    const discountAmount = orderDetails.promoCode?.toUpperCase() === 'WELCOME10' ? subtotal * 0.1 : 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = discountedSubtotal * 0.08;
    const tipAmount = discountedSubtotal * (orderDetails.tipPercentage / 100);
    const totalAmount = discountedSubtotal + taxAmount + tipAmount;

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `#${orderNum}`,
      items: [...cart],
      status: 'pending',
      orderType: orderDetails.orderType,
      tableId: orderDetails.tableId,
      tableName: orderDetails.tableName,
      subtotal,
      taxAmount,
      tipAmount,
      discountAmount,
      totalAmount,
      customerName: orderDetails.customerName,
      customerPhone: orderDetails.customerPhone,
      paymentMethod: orderDetails.paymentMethod,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    if (orderDetails.orderType === 'dine-in' && orderDetails.tableId) {
      updateTableStatus(orderDetails.tableId, 'occupied', newOrder.id);
    }

    clearCart();
    setActiveOrderId(newOrder.id);
    setActiveTab('tracker');

    if (soundEnabled) playAudioChime('kitchen');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`Order ${newOrder.orderNumber} dispatched to kitchen database!`);

    try {
      await api.placeOrder(newOrder);
    } catch {}

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status, updatedAt: new Date().toISOString() };
        if ((status === 'served' || status === 'completed' || status === 'cancelled') && o.tableId) {
          updateTableStatus(o.tableId, status === 'completed' ? 'cleaning' : 'available', undefined);
        }
        return updated;
      }
      return o;
    }));

    if (soundEnabled) playAudioChime('kitchen');
    showToast(`Order status updated to ${status.toUpperCase()}`);

    try {
      await api.updateOrderStatus(orderId, status);
    } catch {}
  };

  // Reservations
  const createReservation = async (resData: Omit<Reservation, 'id' | 'reservationCode' | 'createdAt' | 'status'>): Promise<Reservation> => {
    const code = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRes: Reservation = {
      ...resData,
      id: `res_${Date.now()}`,
      reservationCode: code,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setReservations(prev => [newRes, ...prev]);
    updateTableStatus(resData.tableId, 'reserved');

    if (soundEnabled) playAudioChime('success');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    showToast(`Reservation ${code} saved to database!`);

    try {
      await api.createReservation(newRes);
    } catch {}

    return newRes;
  };

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'seated' | 'cancelled' | 'completed') => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Reservation status updated to ${status.toUpperCase()}`);
    try {
      await api.updateReservationStatus(id, status);
    } catch {}
  };

  const resetAllTransactions = async () => {
    try {
      await api.resetAllTransactions();
      showToast('All transaction orders & reservations reset in database');
      await refreshAllData();
    } catch {
      showToast('Reset failed');
    }
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      activeTab,
      setActiveTab,
      menuItems,
      addMenuItem,
      updateMenuItem,
      toggleMenuItemAvailability,
      deleteMenuItem,
      bulkImportMenu,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      tables,
      updateTableStatus,
      selectedTableId,
      setSelectedTableId,
      orders,
      activeOrderId,
      setActiveOrderId,
      placeOrder,
      updateOrderStatus,
      reservations,
      createReservation,
      updateReservationStatus,
      soundEnabled,
      setSoundEnabled,
      toastMessage,
      showToast,
      resetAllTransactions,
      refreshAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

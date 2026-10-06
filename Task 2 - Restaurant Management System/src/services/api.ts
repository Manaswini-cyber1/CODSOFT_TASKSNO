import type { MenuItem, Table, Order, Reservation, OrderStatus, TableStatus } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Menu APIs
  async fetchMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (!res.ok) throw new Error('Failed to fetch menu from database');
    return res.json();
  },

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<{ success: boolean; item: MenuItem }> {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add menu item');
    return res.json();
  },

  async updateMenuItem(id: string, updated: Partial<MenuItem>): Promise<void> {
    await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  },

  async toggleMenuItemAvailability(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/menu/${id}/availability`, {
      method: 'PATCH'
    });
    const data = await res.json();
    return data.isAvailable;
  },

  async deleteMenuItem(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/menu/${id}`, { method: 'DELETE' });
  },

  async bulkImportMenu(items: Partial<MenuItem>[]): Promise<number> {
    const res = await fetch(`${API_BASE_URL}/menu/bulk-import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    return data.count;
  },

  // Tables APIs
  async fetchTables(): Promise<Table[]> {
    const res = await fetch(`${API_BASE_URL}/tables`);
    if (!res.ok) throw new Error('Failed to fetch tables');
    return res.json();
  },

  async updateTableStatus(tableId: string, status: TableStatus, currentOrderId?: string): Promise<void> {
    await fetch(`${API_BASE_URL}/tables/${tableId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, currentOrderId })
    });
  },

  // Orders APIs
  async fetchOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    return data.order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // Reservations APIs
  async fetchReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE_URL}/reservations`);
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return res.json();
  },

  async createReservation(resData: Partial<Reservation>): Promise<Reservation> {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resData)
    });
    const data = await res.json();
    return data.reservation;
  },

  async updateReservationStatus(id: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // Reset API
  async resetAllTransactions(): Promise<void> {
    await fetch(`${API_BASE_URL}/admin/reset-data`, { method: 'POST' });
  }
};

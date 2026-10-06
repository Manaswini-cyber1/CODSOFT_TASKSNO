import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight
} from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    toggleMenuItemAvailability,
    soundEnabled,
    setSoundEnabled
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'tickets' | 'stock'>('tickets');

  // Filter orders for KDS
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  // Timer helper to evaluate elapsed minutes
  const getElapsedMins = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.floor(diffMs / 60000);
  };

  const getTimerBadge = (mins: number) => {
    if (mins < 10) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    } else if (mins < 20) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    } else {
      return 'bg-red-500/30 text-red-400 border-red-500/60 animate-pulse';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* KDS Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold font-serif text-white">Kitchen Display System (KDS)</h2>
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time ticket queue management & dish stock toggles</p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center space-x-3">
          
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTabSub('tickets')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTabSub === 'tickets' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ticket Board ({pendingOrders.length + preparingOrders.length})
            </button>
            <button
              onClick={() => setActiveTabSub('stock')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTabSub === 'stock' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              86 / Stock Toggles
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:border-slate-700 transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

        </div>
      </div>

      {activeTabSub === 'tickets' ? (
        /* KDS Ticket Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Pending (New) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/90 border-l-4 border-l-amber-500 border-slate-800 rounded-2xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">1. Incoming / New ({pendingOrders.length})</h3>
              </div>
            </div>

            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60 text-xs text-slate-500">
                  No pending tickets
                </div>
              ) : (
                pendingOrders.map(order => {
                  const elapsed = getElapsedMins(order.createdAt);
                  return (
                    <div
                      key={order.id}
                      className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="text-lg font-extrabold font-serif text-amber-400">{order.orderNumber}</div>
                          <div className="text-xs text-slate-300 font-semibold">{order.customerName} • {order.tableName || 'Takeaway'}</div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getTimerBadge(elapsed)}`}>
                          ⏱️ {elapsed}m ago
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/40 pb-1.5">
                            <div>
                              <span className="font-bold text-white mr-1.5">{item.quantity}x</span>
                              <span className="text-slate-200">{item.menuItem.name}</span>
                              {item.selectedCustomizations.length > 0 && (
                                <div className="text-[11px] text-amber-300 font-semibold pl-5">
                                  {item.selectedCustomizations.map(c => c.choiceLabel).join(', ')}
                                </div>
                              )}
                              {item.specialInstructions && (
                                <div className="text-[11px] text-red-400 italic pl-5">"{item.specialInstructions}"</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:brightness-110 active:scale-95 transition text-xs"
                      >
                        <span>Start Cooking</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: In Preparation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/90 border-l-4 border-l-blue-500 border-slate-800 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">2. In Preparation ({preparingOrders.length})</h3>
              </div>
            </div>

            <div className="space-y-4">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60 text-xs text-slate-500">
                  No active prep tickets
                </div>
              ) : (
                preparingOrders.map(order => {
                  const elapsed = getElapsedMins(order.createdAt);
                  return (
                    <div
                      key={order.id}
                      className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="text-lg font-extrabold font-serif text-blue-400">{order.orderNumber}</div>
                          <div className="text-xs text-slate-300 font-semibold">{order.customerName} • {order.tableName || 'Takeaway'}</div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getTimerBadge(elapsed)}`}>
                          ⏱️ {elapsed}m
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/40 pb-1.5">
                            <div>
                              <span className="font-bold text-white mr-1.5">{item.quantity}x</span>
                              <span className="text-slate-200">{item.menuItem.name}</span>
                              {item.selectedCustomizations.length > 0 && (
                                <div className="text-[11px] text-amber-300 font-semibold pl-5">
                                  {item.selectedCustomizations.map(c => c.choiceLabel).join(', ')}
                                </div>
                              )}
                              {item.specialInstructions && (
                                <div className="text-[11px] text-red-400 italic pl-5">"{item.specialInstructions}"</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-500 text-slate-950 font-bold rounded-xl hover:brightness-110 active:scale-95 transition text-xs"
                      >
                        <span>Mark Ready for Pass</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 3: Ready to Serve */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/90 border-l-4 border-l-emerald-500 border-slate-800 rounded-2xl">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">3. Ready for Service ({readyOrders.length})</h3>
              </div>
            </div>

            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60 text-xs text-slate-500">
                  No plated tickets on pass
                </div>
              ) : (
                readyOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-lg font-extrabold font-serif text-emerald-400">{order.orderNumber}</div>
                        <div className="text-xs text-slate-300 font-semibold">{order.customerName} • {order.tableName || 'Takeaway'}</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                        READY
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-300">
                          <span className="font-bold text-white mr-1.5">{item.quantity}x</span>
                          {item.menuItem.name}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => updateOrderStatus(order.id, 'served')}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:brightness-110 active:scale-95 transition text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bump / Complete Ticket</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Stock Toggles View (86 list) */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-white">Item Availability & 86 Controls</h3>
              <p className="text-xs text-slate-400">Toggle dish stock state in real-time for customer menu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="text-[11px] text-amber-400 font-mono">${item.price.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleMenuItemAvailability(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    item.isAvailable
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950'
                      : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500 hover:text-slate-950'
                  }`}
                >
                  {item.isAvailable ? 'In Stock' : '86 / Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { OrderStatus } from '../../types';
import {
  Clock,
  ChefHat,
  BellRing,
  CheckCircle2,
  UtensilsCrossed,
  Flame,
  ArrowRight
} from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { orders, activeOrderId, setActiveOrderId, updateOrderStatus, setActiveTab } = useApp();

  // Find active order or fall back to most recent order
  const currentOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  const [timeLeftMins, setTimeLeftMins] = useState(15);

  useEffect(() => {
    if (!currentOrder) return;
    const interval = setInterval(() => {
      setTimeLeftMins(prev => Math.max(1, prev - 1));
    }, 15000);
    return () => clearInterval(interval);
  }, [currentOrder]);

  if (!currentOrder) {
    return (
      <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
        <Clock className="w-16 h-16 text-amber-500 mx-auto opacity-50" />
        <h3 className="text-xl font-bold font-serif text-white">No Active Order Found</h3>
        <p className="text-xs text-slate-400">Place an order from the digital menu to track live kitchen preparation.</p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-2xl hover:brightness-110 transition"
        >
          Browse Digital Menu
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Order Placed', desc: 'Received by hostess & kitchen', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { key: 'preparing', label: 'In Kitchen Prep', desc: 'Chef preparing fresh ingredients', icon: <ChefHat className="w-5 h-5" /> },
    { key: 'ready', label: 'Ready for Service', desc: 'Plated & awaiting runner', icon: <BellRing className="w-5 h-5" /> },
    { key: 'served', label: 'Served to Table', desc: 'Bon Appetit!', icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'served':
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentOrder.status);

  // Simulation step advance for demo testing
  const handleAdvanceSimulation = () => {
    if (currentIndex === 0) updateOrderStatus(currentOrder.id, 'preparing');
    else if (currentIndex === 1) updateOrderStatus(currentOrder.id, 'ready');
    else if (currentIndex === 2) updateOrderStatus(currentOrder.id, 'served');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Order Selector Banner if multiple orders */}
      {orders.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Order History:</span>
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => setActiveOrderId(o.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                currentOrder.id === o.id
                  ? 'bg-amber-500 text-slate-950 border border-amber-400'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {o.orderNumber} ({o.status.toUpperCase()})
            </button>
          ))}
        </div>
      )}

      {/* Main Status Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-2xl font-extrabold font-serif text-amber-400">
                {currentOrder.orderNumber}
              </span>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full capitalize">
                {currentOrder.orderType} {currentOrder.tableName ? `• Table ${currentOrder.tableName}` : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400">Placed on {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          {/* Prep Countdown Pill */}
          {currentOrder.status !== 'served' && currentOrder.status !== 'completed' ? (
            <div className="flex items-center space-x-3 px-5 py-3 bg-slate-950/80 border border-amber-500/30 rounded-2xl shadow-lg">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Estimated Prep Time</div>
                <div className="text-lg font-extrabold text-amber-400 font-serif">~{timeLeftMins} Minutes</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Served & Complete</span>
            </div>
          )}
        </div>

        {/* Dynamic Progress Timeline */}
        <div className="relative py-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full hidden sm:block" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={step.key} className="flex sm:flex-col items-center sm:text-center space-x-4 sm:space-x-0 space-y-0 sm:space-y-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 shadow-lg shadow-amber-500/30 scale-110'
                        : isPassed
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isPassed ? 'text-white' : 'text-slate-500'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo Simulation Trigger Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Simulate Kitchen Dispatch:</span>
          </div>
          <button
            onClick={handleAdvanceSimulation}
            disabled={currentIndex >= 3}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold rounded-xl hover:bg-amber-500 hover:text-slate-950 transition disabled:opacity-40"
          >
            <span>Advance Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Order Summary & Item Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <h3 className="text-base font-bold font-serif text-white border-b border-slate-800 pb-3">
          Order Summary Breakdown
        </h3>

        <div className="space-y-4">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800/50 text-xs">
              <div className="flex space-x-3 items-center">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                  {item.quantity}x
                </span>
                <div>
                  <div className="font-bold text-white">{item.menuItem.name}</div>
                  {item.selectedCustomizations.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      {item.selectedCustomizations.map(c => c.choiceLabel).join(', ')}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-[11px] text-amber-300 italic">"{item.specialInstructions}"</div>
                  )}
                </div>
              </div>
              <span className="font-extrabold text-amber-400 font-mono">${item.itemTotalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="p-4 bg-slate-950 rounded-2xl space-y-1.5 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${currentOrder.subtotal.toFixed(2)}</span>
          </div>
          {currentOrder.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Promo Discount</span>
              <span>-${currentOrder.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Sales Tax (8%)</span>
            <span>${currentOrder.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Staff Tip</span>
            <span>${currentOrder.tipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-white font-serif pt-2 border-t border-slate-800">
            <span>Grand Total</span>
            <span className="text-amber-400">${currentOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

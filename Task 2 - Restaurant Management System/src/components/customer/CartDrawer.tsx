import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    tables,
    selectedTableId,
    setSelectedTableId
  } = useApp();

  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    if (promoCodeInput.trim().toUpperCase() === 'WELCOME10') {
      setAppliedPromo('WELCOME10');
    } else {
      alert('Invalid promo code. Try "WELCOME10" for 10% off.');
    }
  };

  const discountAmount = appliedPromo === 'WELCOME10' ? cartSubtotal * 0.1 : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = discountedSubtotal * 0.08;
  const tipAmount = discountedSubtotal * (tipPercentage / 100);
  const totalAmount = discountedSubtotal + taxAmount + tipAmount;

  const selectedTable = tables.find(t => t.id === selectedTableId);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs animate-fade-in">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-slate-900 border-l border-amber-500/20 shadow-2xl flex flex-col justify-between">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-serif text-white">Your Order Basket</h2>
                  <p className="text-xs text-slate-400">{cart.length} unique items selected</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Dine-in vs Takeaway Toggle */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400">Order Service Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine-in')}
                    className={`py-2 text-xs font-bold rounded-xl transition ${
                      orderType === 'dine-in'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🍽️ Dine-in Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2 text-xs font-bold rounded-xl transition ${
                      orderType === 'takeaway'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🛍️ Takeaway Counter
                  </button>
                </div>

                {/* Table Picker if Dine-in */}
                {orderType === 'dine-in' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Select Table Number</span>
                      {selectedTable && <span className="text-amber-400 font-bold">{selectedTable.zone}</span>}
                    </label>
                    <select
                      value={selectedTableId || ''}
                      onChange={e => setSelectedTableId(e.target.value || null)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    >
                      <option value="">-- Choose Available Table --</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.label} ({t.zone} - {t.capacity} seats) [{t.status.toUpperCase()}]
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">Your basket is currently empty.</p>
                  <p className="text-xs text-slate-500">Explore the digital menu and add gourmet dishes.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex space-x-3">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-14 h-14 object-cover rounded-xl border border-slate-800"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white font-serif">{item.menuItem.name}</h4>
                            <div className="text-xs font-bold text-amber-400">
                              ${item.itemTotalPrice.toFixed(2)}
                            </div>
                            
                            {/* Customizations summary */}
                            {item.selectedCustomizations.length > 0 && (
                              <div className="text-[11px] text-slate-400 mt-1">
                                {item.selectedCustomizations.map(c => c.choiceLabel).join(', ')}
                              </div>
                            )}

                            {item.specialInstructions && (
                              <div className="text-[11px] italic text-amber-300/80 mt-0.5">
                                "{item.specialInstructions}"
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-red-400 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                        <span className="text-slate-400 font-medium">Quantity</span>
                        <div className="flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Promo & Tip Section */}
              {cart.length > 0 && (
                <div className="space-y-4 border-t border-slate-800 pt-5">
                  {/* Promo Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Promo Code (Try "WELCOME10")</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={e => setPromoCodeInput(e.target.value)}
                        placeholder="WELCOME10"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 rounded-xl hover:bg-slate-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <p className="text-[11px] text-emerald-400 font-semibold">10% Welcome Promo Applied!</p>
                    )}
                  </div>

                  {/* Tip Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Staff Tip Gratitude</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 15, 20, 25].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setTipPercentage(pct)}
                          className={`py-1.5 text-xs font-bold rounded-xl border transition ${
                            tipPercentage === pct
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Price Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Sales Tax (8%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tip ({tipPercentage}%)</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white font-serif pt-2 border-t border-slate-800">
                    <span>Total Amount</span>
                    <span className="text-amber-400">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onCompleteOrder={onClose}
        orderType={orderType}
        tableId={selectedTableId || undefined}
        tableName={selectedTable ? selectedTable.label : undefined}
        tipPercentage={tipPercentage}
        appliedPromo={appliedPromo || undefined}
      />
    </>
  );
};

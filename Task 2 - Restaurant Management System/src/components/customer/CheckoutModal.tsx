import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Smartphone, Banknote, ShieldCheck, Lock, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: () => void;
  orderType: 'dine-in' | 'takeaway';
  tableId?: string;
  tableName?: string;
  tipPercentage: number;
  appliedPromo?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onCompleteOrder,
  orderType,
  tableName,
  tipPercentage,
  appliedPromo,
  tableId
}) => {
  const { cart, cartSubtotal, placeOrder } = useApp();

  const [customerName, setCustomerName] = useState('Gourmet Guest');
  const [customerPhone, setCustomerPhone] = useState('+1 555-0199');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'apple-pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const discountAmount = appliedPromo === 'WELCOME10' ? cartSubtotal * 0.1 : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = discountedSubtotal * 0.08;
  const tipAmount = discountedSubtotal * (tipPercentage / 100);
  const totalAmount = discountedSubtotal + taxAmount + tipAmount;

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      placeOrder({
        customerName,
        customerPhone,
        orderType,
        tableId,
        tableName,
        paymentMethod,
        tipPercentage,
        promoCode: appliedPromo
      });
      setIsProcessing(false);
      onClose();
      onCompleteOrder();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/20 rounded-3xl shadow-2xl shadow-amber-500/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 border border-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Secure Checkout</h2>
              <p className="text-xs text-slate-400">Complete payment to dispatch order to kitchen</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitCheckout} className="p-6 space-y-6">
          
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Guest Contact Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Your Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Phone Number (SMS Alert)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Payment Option</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                  paymentMethod === 'apple-pay'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Pay at Table</span>
              </button>
            </div>
          </div>

          {/* Card Simulation Inputs */}
          {paymentMethod === 'card' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">CVC / CVV</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary Box */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Selected Service</span>
              <span className="font-bold text-white capitalize">{orderType} {tableName ? `(${tableName})` : ''}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Order Items ({cart.length})</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Promo Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Tax + Tip</span>
              <span>${(taxAmount + tipAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white font-serif pt-2 border-t border-slate-800">
              <span>Total Charged</span>
              <span className="text-amber-400">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Authorize ${totalAmount.toFixed(2)}</span>
              </span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

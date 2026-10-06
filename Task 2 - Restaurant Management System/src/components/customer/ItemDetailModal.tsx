import React, { useState } from 'react';
import type { MenuItem, SelectedCustomization } from '../../types';
import { X, Plus, Minus, Clock, Flame, Sparkles, Check } from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedCustomizations: SelectedCustomization[],
    specialInstructions?: string
  ) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Track selections for each option group
  const [selectedChoices, setSelectedChoices] = useState<Record<string, { choiceId: string; choiceLabel: string; extraPrice: number }>>(() => {
    const initial: Record<string, { choiceId: string; choiceLabel: string; extraPrice: number }> = {};
    item.customizationOptions?.forEach(opt => {
      if (opt.choices.length > 0) {
        initial[opt.id] = {
          choiceId: opt.choices[0].id,
          choiceLabel: opt.choices[0].label,
          extraPrice: opt.choices[0].extraPrice
        };
      }
    });
    return initial;
  });

  const handleSelectChoice = (optionId: string, choiceId: string, choiceLabel: string, extraPrice: number) => {
    setSelectedChoices(prev => ({
      ...prev,
      [optionId]: { choiceId, choiceLabel, extraPrice }
    }));
  };

  const customizationsArray: SelectedCustomization[] = Object.entries(selectedChoices).map(([optionId, val]) => {
    const optionObj = item.customizationOptions?.find(o => o.id === optionId);
    return {
      optionId,
      optionName: optionObj?.name || 'Customization',
      choiceId: val.choiceId,
      choiceLabel: val.choiceLabel,
      extraPrice: val.extraPrice
    };
  });

  const extraTotal = customizationsArray.reduce((sum, c) => sum + c.extraPrice, 0);
  const unitPrice = item.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirmAdd = () => {
    onAddToCart(item, quantity, customizationsArray, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/20 rounded-3xl shadow-2xl shadow-amber-500/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-t-3xl">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {item.dietaryTags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Metadata Bar */}
          <div className="flex items-center justify-between py-3 px-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{item.preparationTimeMins} mins prep</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{item.calories} kcal</span>
              </div>
            </div>
            <div className="text-xl font-extrabold text-amber-400 font-serif">
              ${item.price.toFixed(2)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {item.description}
          </p>

          {/* Customization Options */}
          {item.customizationOptions && item.customizationOptions.length > 0 && (
            <div className="space-y-5 border-t border-slate-800 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Customize Your Dish</span>
              </h3>

              {item.customizationOptions.map(opt => (
                <div key={opt.id} className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{opt.name}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {opt.choices.map(choice => {
                      const isSelected = selectedChoices[opt.id]?.choiceId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => handleSelectChoice(opt.id, choice.id, choice.label, choice.extraPrice)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            <span>{choice.label}</span>
                          </div>
                          {choice.extraPrice > 0 && (
                            <span className="text-amber-400 font-bold">+${choice.extraPrice.toFixed(2)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions Input */}
          <div className="space-y-2 border-t border-slate-800 pt-5">
            <label className="text-xs font-semibold text-slate-300">Special Instructions or Allergies</label>
            <textarea
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra dressing on the side, no onion..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Footer Quantity & Add Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-amber-400">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleConfirmAdd}
              className="w-full sm:w-auto flex-1 flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 text-slate-950 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
            >
              <span>Add to Order Cart</span>
              <span className="text-base font-extrabold font-serif">
                ${totalPrice.toFixed(2)}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

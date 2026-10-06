import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MenuItem, Category } from '../../types';
import { ItemDetailModal } from './ItemDetailModal';
import {
  Search,
  Plus,
  Sparkles,
  Flame,
  Clock,
  MapPin,
  Utensils,
  ChevronRight,
  Filter
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Chef Specials',
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Cocktails & Drinks'
];

const DIETARY_TAGS = ['All Tags', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Spicy', 'Chef Special'];

export const DigitalMenu: React.FC = () => {
  const { menuItems, addToCart, tables, selectedTableId, setActiveTab } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All Tags');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTag = selectedTag === 'All Tags' || item.dietaryTags.includes(selectedTag as any);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    if (item.customizationOptions && item.customizationOptions.length > 0) {
      setActiveModalItem(item);
    } else {
      addToCart(item, 1, []);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/20 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L'Étoile Modern Bistro • Spring Season Menu</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white leading-tight tracking-tight">
            Culinary Craftsmanship <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Delivered to Your Table.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal">
            Explore handcrafted gourmet cuisine, seasonal cocktails, and artisanal desserts. Order directly from your device for instant kitchen dispatch.
          </p>

          {/* Table Callout */}
          {selectedTable ? (
            <div className="inline-flex items-center space-x-3 px-4 py-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-xs font-bold text-amber-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Ordering for Table {selectedTable.label} ({selectedTable.zone})</span>
              <button
                onClick={() => setActiveTab('reservation')}
                className="underline hover:text-white transition ml-2"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-300">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Dine-in or Takeaway ordering.</span>
              <button
                onClick={() => setActiveTab('reservation')}
                className="text-amber-400 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Select Table</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-4">
        
        {/* Search & Tags */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, drinks..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
            {DIETARY_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition ${
                  selectedTag === tag
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800/80">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/70 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No dishes found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className={`group relative flex flex-col justify-between bg-slate-900/80 border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
                item.isAvailable
                  ? 'border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10'
                  : 'border-slate-800 opacity-60'
              }`}
            >
              {/* Card Image */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Dietary Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {item.dietaryTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-950/80 border border-slate-700/80 text-amber-400 backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Sold Out Overlay */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-4 py-1.5 bg-red-500/20 border border-red-500/50 text-red-400 font-extrabold text-xs tracking-wider uppercase rounded-full">
                      Sold Out Today
                    </span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold font-serif text-white group-hover:text-amber-400 transition">
                      {item.name}
                    </h3>
                    <span className="text-lg font-extrabold font-serif text-amber-400">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Meta & Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-medium text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.preparationTimeMins}m</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.calories} cal</span>
                    </span>
                  </div>

                  <button
                    onClick={e => handleQuickAdd(e, item)}
                    disabled={!item.isAvailable}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                      item.isAvailable
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{item.customizationOptions?.length ? 'Customize' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onAddToCart={(item, qty, cust, notes) => addToCart(item, qty, cust, notes)}
      />
    </div>
  );
};

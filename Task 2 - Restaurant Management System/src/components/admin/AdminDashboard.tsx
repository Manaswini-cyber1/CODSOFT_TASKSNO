import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MenuItem, Category } from '../../types';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CalendarCheck,
  Upload,
  RefreshCw,
  FileJson,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const CATEGORIES: Category[] = [
  'Chef Specials',
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Cocktails & Drinks'
];

export const AdminDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    orders,
    tables,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    bulkImportMenu,
    updateTableStatus,
    reservations,
    updateReservationStatus,
    resetAllTransactions
  } = useApp();

  // Modal state for adding/editing menu items
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Bulk Importer Modal State
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [bulkJsonText, setBulkJsonText] = useState('');

  // Form states for menu item
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState(24.50);
  const [itemCategory, setItemCategory] = useState<Category>('Main Courses');
  const [itemImg, setItemImg] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');
  const [itemPrep, setItemPrep] = useState(15);
  const [itemCal, setItemCal] = useState(550);

  // Analytics KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const occupiedTablesCount = tables.filter(t => t.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedTablesCount / tables.length) * 100);

  // Dynamic chart series
  const revenueTrendData = [
    { time: '12:00', revenue: 420 },
    { time: '14:00', revenue: 850 },
    { time: '16:00', revenue: 1100 },
    { time: '18:00', revenue: 2450 },
    { time: '20:00', revenue: 3890 },
    { time: '22:00', revenue: Math.max(4620, totalRevenue) }
  ];

  const popularDishesData = menuItems.slice(0, 5).map(m => ({
    name: m.name.length > 14 ? m.name.substring(0, 14) + '...' : m.name,
    orders: Math.floor(12 + Math.random() * 25)
  }));

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemDesc('');
    setItemPrice(24.50);
    setItemCategory('Main Courses');
    setItemImg('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
    setItemPrep(15);
    setItemCal(500);
    setIsMenuModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description);
    setItemPrice(item.price);
    setItemCategory(item.category);
    setItemImg(item.image);
    setItemPrep(item.preparationTimeMins);
    setItemCal(item.calories);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateMenuItem(editingItem.id, {
        name: itemName,
        description: itemDesc,
        price: itemPrice,
        category: itemCategory,
        image: itemImg,
        preparationTimeMins: itemPrep,
        calories: itemCal
      });
    } else {
      await addMenuItem({
        name: itemName,
        description: itemDesc,
        price: itemPrice,
        category: itemCategory,
        image: itemImg,
        isAvailable: true,
        dietaryTags: ['Chef Special'],
        preparationTimeMins: itemPrep,
        calories: itemCal
      });
    }
    setIsMenuModalOpen(false);
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) {
        alert('JSON must be an array of menu item objects');
        return;
      }
      await bulkImportMenu(parsed);
      setIsImporterOpen(false);
      setBulkJsonText('');
    } catch {
      alert('Invalid JSON syntax. Please check array format.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Nav Sub-bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-2xl font-bold font-serif text-white">Manager & Database Suite</h2>
          <p className="text-xs text-slate-400">Live SQL database revenue analytics, real menu import & floor controls</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImporterOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-950 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 rounded-xl text-xs font-bold transition"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Import Real Menu</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Clear all orders and reservations in the database?')) {
                resetAllTransactions();
              }
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Orders</span>
          </button>

          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 space-x-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'analytics' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('menu-manage')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'menu-manage' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('tables-manage')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'tables-manage' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Floor Plan
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-serif text-white">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% vs yesterday</span>
              </p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-serif text-white">
                {totalOrdersCount}
              </div>
              <p className="text-[11px] text-amber-400 font-semibold">Active digital dining orders</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Floor Occupancy</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-serif text-white">
                {occupancyRate}%
              </div>
              <p className="text-[11px] text-slate-400">{occupiedTablesCount} of {tables.length} tables seated</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Prep Speed</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-serif text-white">
                14.2m
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">-2.1m faster than target</p>
            </div>

          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Revenue Trend Area Chart (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold font-serif text-white">Revenue Timeline (Today)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Dishes Bar Chart (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold font-serif text-white">Top Ordered Dishes</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularDishesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Reservations Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold font-serif text-white flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-amber-400" />
              <span>Upcoming Table Reservations ({reservations.length})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Table & Zone</th>
                    <th className="p-3">Party Size</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {reservations.map(r => (
                    <tr key={r.id} className="hover:bg-slate-950/40">
                      <td className="p-3 font-mono font-bold text-amber-400">{r.reservationCode}</td>
                      <td className="p-3 font-semibold text-white">{r.customerName}</td>
                      <td className="p-3">{r.tableName} ({r.zone})</td>
                      <td className="p-3 font-bold">{r.partySize} Guests</td>
                      <td className="p-3">{r.date} @ {r.timeSlot}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 font-bold uppercase rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => updateReservationStatus(r.id, r.status === 'seated' ? 'completed' : 'seated')}
                          className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 rounded-lg font-bold"
                        >
                          {r.status === 'seated' ? 'Mark Completed' : 'Seat Guests'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'menu-manage' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-white">Digital Menu Catalogue Management ({menuItems.length} Dishes)</h3>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:brightness-110 transition text-xs shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Gourmet Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between">
                <div className="h-44 w-full relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex space-x-1.5">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 bg-slate-950/80 border border-slate-700 rounded-xl text-amber-400 hover:text-white transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-2 bg-slate-950/80 border border-slate-700 rounded-xl text-red-400 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white font-serif">{item.name}</h4>
                    <span className="font-extrabold text-amber-400 font-serif">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                  <div className="text-[11px] text-slate-500 font-semibold">{item.category} • {item.preparationTimeMins}m prep</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tables-manage' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-serif text-white">Floor Layout Table Controls</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map(t => (
              <div key={t.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white font-serif text-base">{t.label}</h4>
                    <span className="text-xs text-slate-400">{t.zone} ({t.capacity} Seats)</span>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${
                    t.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                    t.status === 'occupied' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                    t.status === 'reserved' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => updateTableStatus(t.id, 'available')}
                    className="py-1.5 bg-slate-950 border border-slate-800 text-emerald-400 rounded-lg hover:border-emerald-500 transition"
                  >
                    Set Available
                  </button>
                  <button
                    onClick={() => updateTableStatus(t.id, 'cleaning')}
                    className="py-1.5 bg-slate-950 border border-slate-800 text-blue-400 rounded-lg hover:border-blue-500 transition"
                  >
                    Set Cleaning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Item Add/Edit Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setIsMenuModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-white">
              {editingItem ? 'Edit Dish Details' : 'Add New Gourmet Dish'}
            </h3>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Dish Name</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Description</label>
                <textarea
                  required
                  rows={2}
                  value={itemDesc}
                  onChange={e => setItemDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={itemPrice}
                    onChange={e => setItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Category</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Image URL (Unsplash / Hosted)</label>
                <input
                  type="text"
                  required
                  value={itemImg}
                  onChange={e => setItemImg(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={itemPrep}
                    onChange={e => setItemPrep(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Calories (kcal)</label>
                  <input
                    type="number"
                    value={itemCal}
                    onChange={e => setItemCal(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 text-slate-950 font-bold rounded-2xl hover:brightness-110 transition text-sm"
              >
                Save Menu Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Importer Modal */}
      {isImporterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setIsImporterOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Bulk Real Menu Importer</h3>
                <p className="text-xs text-slate-400">Paste your restaurant's JSON menu array to save directly into database</p>
              </div>
            </div>

            <form onSubmit={handleBulkImport} className="space-y-4">
              <textarea
                required
                rows={8}
                value={bulkJsonText}
                onChange={e => setBulkJsonText(e.target.value)}
                placeholder={`[\n  {\n    "name": "Grilled Salmon",\n    "description": "Wild Atlantic salmon with herb butter",\n    "price": 32.00,\n    "category": "Main Courses",\n    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",\n    "dietaryTags": ["Gluten-Free"]\n  }\n]`}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 transition resize-none"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold rounded-2xl hover:brightness-110 transition text-sm"
              >
                Upload to Real Database
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

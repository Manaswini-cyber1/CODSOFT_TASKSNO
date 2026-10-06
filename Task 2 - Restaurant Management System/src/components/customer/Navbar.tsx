import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  ChefHat,
  LayoutDashboard,
  ShoppingCart,
  CalendarCheck,
  Volume2,
  VolumeX,
  Clock,
  MapPin
} from 'lucide-react';
import type { UserRole } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const {
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    cart,
    orders,
    soundEnabled,
    setSoundEnabled,
    tables,
    selectedTableId
  } = useApp();

  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'customer') setActiveTab('menu');
    else if (role === 'kitchen') setActiveTab('kds');
    else if (role === 'admin') setActiveTab('analytics');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleRoleChange('customer')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold font-serif bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wide">
                  DineDesk
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  Gourmet Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Fine Dining & Digital Kitchen Systems</p>
            </div>
          </div>

          {/* Navigation Links according to Role */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {userRole === 'customer' && (
              <>
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'menu'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Digital Menu</span>
                </button>
                <button
                  onClick={() => setActiveTab('reservation')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'reservation'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve Table</span>
                </button>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'tracker'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Live Tracker</span>
                </button>
              </>
            )}

            {userRole === 'kitchen' && (
              <button
                onClick={() => setActiveTab('kds')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'kds'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Kitchen Display Board</span>
                {pendingOrdersCount > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-slate-950 text-amber-400 rounded-full animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            )}

            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'analytics'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab('menu-manage')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'menu-manage'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Menu Admin</span>
                </button>
                <button
                  onClick={() => setActiveTab('tables-manage')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'tables-manage'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Floor Plan</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            
            {/* Table Badge if selected */}
            {selectedTable && userRole === 'customer' && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-400">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedTable.label} ({selectedTable.zone})</span>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alerts' : 'Enable Audio Alerts'}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>

            {/* Cart Trigger Button for Customer */}
            {userRole === 'customer' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/25 transition active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Order Cart</span>
                {cartItemCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-extrabold bg-slate-950 text-amber-400 rounded-full border border-amber-400/40">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="relative group">
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleRoleChange('customer')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    userRole === 'customer'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => handleRoleChange('kitchen')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    userRole === 'kitchen'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kitchen KDS
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    userRole === 'admin'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60">
          {userRole === 'customer' && (
            <>
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-lg ${
                  activeTab === 'menu' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>
              <button
                onClick={() => setActiveTab('reservation')}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-lg ${
                  activeTab === 'reservation' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Reserve</span>
              </button>
              <button
                onClick={() => setActiveTab('tracker')}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-lg ${
                  activeTab === 'tracker' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Tracker</span>
              </button>
            </>
          )}

          {userRole === 'kitchen' && (
            <button
              onClick={() => setActiveTab('kds')}
              className="flex items-center space-x-2 text-xs font-semibold py-1.5 px-3 rounded-lg text-amber-400 bg-amber-500/10"
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen Display ({pendingOrdersCount} Active)</span>
            </button>
          )}

          {userRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-lg ${
                  activeTab === 'analytics' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('menu-manage')}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-lg ${
                  activeTab === 'menu-manage' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>
              <button
                onClick={() => setActiveTab('tables-manage')}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-lg ${
                  activeTab === 'tables-manage' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Floor</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/customer/Navbar';
import { DigitalMenu } from './components/customer/DigitalMenu';
import { ReservationView } from './components/reservation/ReservationView';
import { OrderTracker } from './components/customer/OrderTracker';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/customer/CartDrawer';
import { Toast } from './components/common/Toast';
import { UtensilsCrossed, Clock, MapPin } from 'lucide-react';

const AppContent: React.FC = () => {
  const { userRole, activeTab } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      <div>
        {/* Navigation Bar */}
        <Navbar onOpenCart={() => setIsCartOpen(true)} />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {userRole === 'customer' && (
            <>
              {activeTab === 'menu' && <DigitalMenu />}
              {activeTab === 'reservation' && <ReservationView />}
              {activeTab === 'tracker' && <OrderTracker />}
            </>
          )}

          {userRole === 'kitchen' && <KitchenDashboard />}

          {userRole === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Toast Notification */}
      <Toast />

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <span className="text-lg font-bold font-serif text-white">DineDesk</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                End-to-end digital restaurant operations platform connecting customers, table floor management, and kitchen display systems.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Restaurant Hours</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mon - Thu: 11:30 AM - 10:00 PM</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fri - Sun: 11:30 AM - 11:30 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Location & Contact</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>450 Gourmet Avenue, Suite 100</span>
                </li>
                <li>Phone: +1 (800) 555-DINE</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">System Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {['React 19', 'Vite', 'Tailwind CSS v4', 'TypeScript', 'Recharts', 'KDS Realtime', 'LocalStorage Persistence'].map(tech => (
                  <span key={tech} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-semibold text-amber-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} DineDesk Systems Inc. All rights reserved.</p>
            <p className="flex items-center space-x-1 mt-2 sm:mt-0">
              <span>Crafted for modern restaurants & digital dining</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

import { NavLink } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Bell, 
  Users, 
  FileText, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/sales', label: 'Sales & Billing', icon: ShoppingCart },
    { path: '/expiry-alerts', label: 'Expiry Alerts', icon: Bell },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/invoices', label: 'Invoices', icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] z-[100] flex flex-col bg-slate-900 overflow-hidden border-r border-slate-800">
      <div className="w-full p-6 lg:p-8 pb-4">
        <div className="flex items-center gap-3 group px-1">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform shrink-0">
            <ShieldCheck size={24} strokeWidth={2.5} style={{ color: 'white' }} />
          </div>
          <div className="font-poppins overflow-hidden">
            <h2 className="text-lg font-black tracking-tighter leading-none truncate" style={{ color: 'white' }}>PharmaCare</h2>
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1 truncate">Pharmacy System</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full px-3 py-4 space-y-6 overflow-y-auto scrollbar-hide">
        <div className="w-full space-y-1">
          <p className="px-3 mb-3 text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">Strategic Menu</p>
          {menuItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className="block w-full mb-1"
            >
              {({ isActive }) => (
                <div className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all group ${
                  isActive ? 'bg-indigo-600 shadow-md shadow-indigo-600/20' : 'hover:bg-slate-800/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"} />
                    <span className={`text-[14px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`}>{item.label}</span>
                  </div>
                  {item.label === 'Expiry Alerts' && (
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

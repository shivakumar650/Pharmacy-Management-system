import { Outlet, NavLink } from 'react-router-dom';
import { Info, Cpu } from 'lucide-react';
import Sidebar from './ui/Sidebar';
import Navbar from './ui/Navbar';

function Layout({ children }) {
  const secondaryItems = [
    { path: '/about', label: 'About System', icon: Info },
    { path: '/tech-stack', label: 'Tech Stack', icon: Cpu },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content flex flex-col min-h-screen">
        <Navbar />
        <main className="page-content flex-1 pb-10">
          {children || <Outlet />}
        </main>
        
        {/* Footer for System Information */}
        <footer className="w-full bg-slate-50 border-t border-slate-200 mt-auto py-4 px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">System Information</p>
            <div className="flex items-center gap-6">
              {secondaryItems.map(item => (
                <NavLink 
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-2 text-sm font-semibold transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                    }`
                  }
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
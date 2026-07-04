import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BellOutlined, SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/inventory');
    }
  };

  return (
    <nav className="sticky top-0 z-50 h-[80px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 shadow-sm">
      <div className="flex-1"></div>
      
      <div className="flex items-center justify-center gap-4 flex-1">
        <form onSubmit={handleSearch} className="relative group max-w-md w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <SearchOutlined />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicines, batches..." 
            className="w-full text-center bg-slate-100/50 hover:bg-slate-100 focus:bg-white text-slate-800 text-sm font-medium rounded-2xl py-3 pl-10 pr-10 outline-none border border-transparent focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
          />
        </form>
      </div>
      
      <div className="flex-1 flex justify-end items-center gap-6">
        <button 
          onClick={() => navigate('/expiry-alerts')}
          className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          title="View Expiry Alerts"
        >
          <BellOutlined className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/30">
            S
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-black tracking-tight text-slate-800">Shiva Kumar</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user?.role || 'Administrator'}</div>
          </div>
          <button 
            onClick={handleLogout} 
            className="ml-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
            title="Logout"
          >
            <LogoutOutlined className="text-xl group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

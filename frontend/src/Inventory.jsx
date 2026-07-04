import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { exportToCSV } from "./utils/exportCsv";
import { 
  Package, 
  Plus, 
  Download, 
  Trash2, 
  DollarSign, 
  AlertTriangle,
  Search,
  LayoutGrid,
  FileText
} from "lucide-react";

function Inventory() {
  const [data, setData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reports/inventory', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch inventory');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error('Fetch inventory error:', e);
      setData([]);
    }
  };

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch batches');
      const json = await res.json();
      setBatches(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error('Fetch batches error:', e);
      setBatches([]);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchInventory(), fetchBatches()]);
      } catch (err) {
        console.error('Error loading inventory:', err);
        setError('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDeleteBatch = async (id) => {
    if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/batches/${id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Delete failed');
        return;
      }
      setBatches(prev => prev.filter(b => b._id !== id));
      fetchInventory();
    } catch (e) { console.error(e); alert('Error deleting batch'); }
  };

  const handleSell = async (batch) => {
    const qty = prompt(`Enter quantity to sell (Internal Quick Sale)\nAvailable: ${batch.quantity} units`);
    if (!qty || qty <= 0) return;
    if (Number(qty) > batch.quantity) {
      alert('Insufficient stock in this batch!');
      return;
    }
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ batchId: batch._id, quantity: Number(qty) })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Sale registration failed');
        return;
      }
      alert('Quick sale recorded successfully!');
      fetchBatches();
      fetchInventory();
    } catch (e) { console.error(e); alert('Error recording sale'); }
  };

  const filteredBatches = batches.filter(b => 
    (b.medicine?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.batchNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Synchronizing inventory system...</p>
    </div>
  );
  
  if (error) return (
    <div className="glass-panel p-8 text-center max-w-2xl mx-auto mt-10 border-red-100">
      <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Inventory Sync Failed</h2>
      <p className="text-slate-500 mb-6">{error}. Please verify your connection to the central database server.</p>
      <button onClick={() => window.location.reload()} className="primary">Retry Connection</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-600" size={32} />
             Inventory Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage medicine batches, track stock levels, and monitor warehouse operations.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="relative group w-64 mr-2">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Search batch or med..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full !pl-10 !pr-4 !py-2 bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
             />
          </div>
          <button 
            onClick={() => exportToCSV('inventory-report.csv', data)} 
            className="export-btn flex items-center gap-2"
          >
            <Download size={18} /> Export Data
          </button>
          <Link to="/inventory/add">
            <button className="primary flex items-center gap-2 shadow-indigo-200">
              <Plus size={18} /> New Stock Entry
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Batches Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid size={20} className="text-indigo-500" /> Live Batches
            </h2>
          </div>
          
          <div className="table-container glass-panel border-none shadow-xl">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch / Expiry</th>
                  <th>Stock Level</th>
                  <th className="text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20 text-slate-400">
                      No active batches found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map(b => {
                    const isExpired = new Date(b.expiryDate) <= new Date();
                    const isLow = b.quantity < 20;
                    
                    return (
                      <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                        <td>
                          <div className="font-bold text-slate-800">{b.medicine?.name || 'Unknown'}</div>
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">ID: {b._id.slice(-8)}</div>
                        </td>
                        <td>
                          <div className="font-semibold text-slate-600">{b.batchNo}</div>
                          <div className={`text-xs flex items-center gap-1 ${isExpired ? 'text-red-500 font-bold' : 'text-slate-400 font-medium'}`}>
                            {isExpired && <AlertTriangle size={12} />}
                            Exp: {new Date(b.expiryDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className={`text-lg font-extrabold ${isLow ? 'text-orange-600' : 'text-slate-700'}`}>
                            {b.quantity} <span className="text-xs font-normal text-slate-400">units</span>
                          </div>
                          {isExpired ? (
                            <span className="status-badge status-critical !py-0.5 mt-1">Expired</span>
                          ) : isLow ? (
                            <span className="status-badge status-warning !py-0.5 mt-1">Low Stock</span>
                          ) : (
                            <span className="status-badge status-good !py-0.5 mt-1">Optimal</span>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleSell(b)} 
                              className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 text-[#059669] hover:bg-[#059669] hover:text-white transition-all border border-emerald-100 shadow-sm"
                              title="Quick Sale"
                            >
                              <DollarSign size={18} color="currentColor" strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleDeleteBatch(b._id)} 
                              className="w-10 h-10 rounded-lg flex items-center justify-center bg-rose-50 text-[#e11d48] hover:bg-[#e11d48] hover:text-white transition-all border border-rose-100 shadow-sm"
                              title="Delete Batch"
                            >
                              <Trash2 size={18} color="currentColor" strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6" style={{ marginTop: '3.5rem' }}>
          <div className="glass-panel p-6 bg-white border border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <FileText className="mb-4 text-indigo-500" size={32} />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Stock Valuation</h3>
            <p className="text-slate-500 text-sm mb-6">Total estimated capital currently held in warehouse inventory.</p>
            <div className="text-4xl font-black font-poppins text-indigo-600">
              ${data.reduce((sum, item) => sum + (item.totalStockValue || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Item Distribution</h3>
            {data.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 italic text-center">No catalog items tracked.</p>
            ) : (
              <div className="space-y-3">
                {data.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{item.medicineName}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Value: ${item.totalStockValue?.toFixed(2)}</span>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${item.totalQuantity < 50 ? 'bg-orange-100 text-orange-700' : 'bg-indigo-50 text-indigo-700'}`}>
                      {item.totalQuantity}
                    </span>
                  </div>
                ))}
                {data.length > 6 && (
                   <div className="text-center pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+{data.length - 6} more products</span>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;

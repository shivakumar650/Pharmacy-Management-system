import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  CreditCard,
  ArrowRight,
  Calculator,
  Info
} from 'lucide-react';

function RecordSalePage() {
  const [batches, setBatches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ batchId: '', quantity: '', customerId: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
    fetchCustomers();
  }, []);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/batches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBatches(Array.isArray(data) ? data.filter(b => b.quantity > 0) : []);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          batchId: form.batchId,
          quantity: Number(form.quantity),
          customerId: form.customerId || null
        })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Failed to record transaction');
        setLoading(false);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => navigate('/sales-history'), 1500);
    } catch (err) {
      console.error('Error recording sale:', err);
      alert('Network Error: Transaction could not be finalized.');
    } finally {
      setLoading(false);
    }
  };

  const selectedBatch = batches.find(b => b._id === form.batchId);
  const totalAmount = selectedBatch ? (selectedBatch.sellingPrice || 0) * Number(form.quantity || 0) : 0;

  if (showSuccess) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in slide-in-from-top-4 duration-700">
      <div className="bg-indigo-100 p-6 rounded-full text-indigo-600 mb-6 shadow-xl shadow-indigo-50 border-4 border-white">
        <CreditCard size={64} strokeWidth={2.5} className="animate-bounce" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">Transaction Finalized</h2>
      <p className="text-slate-500 font-medium">Digital receipt generated and inventory synchronized. Redirecting to ledger...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm text-indigo-600">
                <ShoppingCart size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Record New Sale</h1>
           </div>
           <p className="text-slate-500 font-medium">Capture real-time transaction data and update stock levels instantly.</p>
        </div>
        <div className="text-[10px] font-black tracking-widest uppercase text-emerald-500 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
          POS Terminal Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6 shadow-2xl border-none">
            
            {/* Customer Selection */}
            <div className="form-group space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                <User size={14} className="text-indigo-400" /> 1. Customer Identification
              </label>
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className="w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 !border-transparent focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-700"
              >
                <option value="">-- Generic Walk-in Customer --</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} ({customer.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Medicine Selection */}
            <div className="form-group space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                <Package size={14} className="text-indigo-400" /> 2. Inventory Retrieval (Available Batches)
              </label>
              <select
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                required
                className="w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 !border-transparent focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-700"
              >
                <option value="">-- Select Active Batch from Stock --</option>
                {batches.map(batch => (
                  <option key={batch._id} value={batch._id}>
                    {batch.medicine?.name} | Batch: {batch.batchNo} | Qty: {batch.quantity}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Details Display */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${selectedBatch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none h-0 p-0 m-0 overflow-hidden'}`}>
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                   <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">Unit Valuation</div>
                   <div className="text-2xl font-black text-indigo-600 font-poppins">${selectedBatch?.sellingPrice?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
                   <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Available Reserve</div>
                   <div className="text-2xl font-black text-slate-700 font-poppins">{selectedBatch?.quantity || 0} <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">units</span></div>
                </div>
            </div>

            {/* Quantity and Finalization */}
            <div className="form-group space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                <Calculator size={14} className="text-indigo-400" /> 3. Quantity Dispersement
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  min="1"
                  max={selectedBatch?.quantity || 1}
                  required
                  placeholder="Enter unit count..."
                  className="w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 !border-transparent focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">UNITS</div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
               <div className={`flex items-center justify-between p-6 bg-slate-900 rounded-2xl text-white transform transition-all duration-500 ${totalAmount > 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Transaction Value</div>
                    <div className="text-4xl font-black font-poppins tracking-tighter">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <DollarSign size={24} className={totalAmount > 0 ? "animate-pulse" : ""} />
                  </div>
               </div>

               <button 
                type="submit" 
                disabled={loading || !form.batchId || !form.quantity} 
                className="primary w-full !p-5 !text-lg !rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
               >
                 {loading ? (
                   <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <>
                     Process Payment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-2 space-y-6 pt-10">
           <div className="glass-panel p-6 border-l-4 border-indigo-500">
              <h4 className="flex items-center gap-2 font-black text-slate-800 mb-2 uppercase tracking-tighter text-sm">
                <Info size={16} className="text-indigo-500" /> Order Guidelines
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Quantities cannot exceed live stock levels. Customer identification is required for insurance billing and credit tracking. Verify medicine name and batch number before processing as transactions represent final sales.
              </p>
           </div>

           <div className="glass-panel p-6 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Available Reserve Snapshot</h4>
              <div className="space-y-3">
                 {batches.slice(0, 5).map(b => (
                    <div key={b._id} className="flex items-center justify-between group cursor-default">
                       <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{b.medicine?.name}</span>
                       <span className={`text-[10px] font-black px-2 py-0.5 rounded ${b.quantity < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                         {b.quantity}
                       </span>
                    </div>
                 ))}
                 {batches.length > 5 && <div className="text-center text-[10px] uppercase font-black text-slate-300">+{batches.length - 5} more batches</div>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default RecordSalePage;

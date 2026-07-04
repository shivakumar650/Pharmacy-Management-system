import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  PackagePlus,
  Info
} from "lucide-react";

export default function AddStockPage() {
  const [form, setForm] = useState({ 
    medicineId: '', 
    medicineName: '', 
    batchNo: '', 
    expiryDate: '', 
    quantity: '', 
    costPrice: '', 
    sellingPrice: '' 
  });
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines', { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const json = await res.json();
      setMedicines(Array.isArray(json) ? json : []);
    } catch (e) { console.error('Medicine fetch error:', e); setMedicines([]);}
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.medicineId && !form.medicineName) newErrors.medicine = 'Required: Select existing or enter new medicine name.';
    if (!form.batchNo) newErrors.batchNo = 'Batch number identifier is required.';
    if (!form.expiryDate) newErrors.expiryDate = 'Expiration date is mandatory.';
    if (form.expiryDate && new Date(form.expiryDate) <= new Date()) newErrors.expiryDate = 'Expiration must be in the future.';
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) newErrors.quantity = 'Valid positive quantity required.';
    if (form.costPrice && isNaN(form.costPrice)) newErrors.costPrice = 'Must be a numeric value.';
    if (form.sellingPrice && isNaN(form.sellingPrice)) newErrors.sellingPrice = 'Must be a numeric value.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let medicineIdToUse = form.medicineId;
      if (!medicineIdToUse && form.medicineName && form.medicineName.trim() !== '') {
        const createMedRes = await fetch('/api/medicines', { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }, 
          body: JSON.stringify({ name: form.medicineName.trim() }) 
        });
        if (!createMedRes.ok) { 
          const err = await createMedRes.json(); 
          setErrors({ submit: err.message || 'Failed to initialize new medicine entry.' }); 
          setLoading(false); 
          return; 
        }
        const createdMed = await createMedRes.json();
        medicineIdToUse = createdMed._id;
      }

      const res = await fetch('/api/batches', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }, 
        body: JSON.stringify({ 
          medicineId: medicineIdToUse, 
          batchNo: form.batchNo, 
          expiryDate: form.expiryDate, 
          quantity: Number(form.quantity), 
          costPrice: Number(form.costPrice) || 0, 
          sellingPrice: Number(form.sellingPrice) || 0 
        }) 
      });
      
      if (!res.ok) { 
        const err = await res.json(); 
        setErrors({ submit: err.message || 'Operation failed: Could not record batch in database.' }); 
        setLoading(false); 
        return; 
      }
      
      setShowSuccess(true);
      setTimeout(() => navigate('/inventory'), 1500);
    } catch (e) { 
      console.error('Submit error:', e); 
      setErrors({ submit: 'Network Error: Backend service unreachable.' }); 
      setLoading(false); 
    }
  };

  if (showSuccess) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in slide-in-from-top-4 duration-700">
      <div className="bg-emerald-100 p-6 rounded-full text-emerald-600 mb-6 shadow-xl shadow-emerald-50 border-4 border-white">
        <CheckCircle2 size={64} strokeWidth={2.5} />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">Inventory Synchronized!</h2>
      <p className="text-slate-500 font-medium">Batch recorded successfully. Redirecting to warehouse overview...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/inventory')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </button>
        <div className="text-[10px] font-black tracking-widest uppercase text-indigo-500 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
          Warehouse Operation
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <PackagePlus className="text-indigo-600" size={32} />
              Stock Intake
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Register a new batch delivery for existing or new pharmaceutical items.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6 shadow-2xl border-none">
            {errors.submit && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-shake font-bold text-sm">
                <AlertCircle size={20} className="shrink-0" />
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group space-y-2 col-span-2">
                <label className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                  1. Identify Medicine
                  {errors.medicine && <AlertCircle size={14} className="text-red-500" />}
                </label>
                <div className="space-y-3">
                  <select 
                    name="medicineId" 
                    value={form.medicineId} 
                    onChange={handleInput} 
                    className={`w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 ${errors.medicine ? '!border-red-400 !bg-red-50/20' : '!border-transparent'} focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-700`}
                  >
                    <option value="">Select existing stock entry...</option>
                    {medicines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-100"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400">
                      <span className="bg-white px-2">OR NEW ENTRY</span>
                    </div>
                  </div>
                  <input 
                    name="medicineName" 
                    value={form.medicineName} 
                    onChange={handleInput} 
                    placeholder="Type new medicine name exactly..." 
                    className={`w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 ${errors.medicine ? '!border-red-400 !bg-red-50/20' : '!border-transparent'} focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800`}
                  />
                  {errors.medicine && <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">{errors.medicine}</span>}
                </div>
              </div>

              <div className="form-group space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">2. Batch Identifier</label>
                <input 
                  name="batchNo" 
                  value={form.batchNo} 
                  onChange={handleInput} 
                  placeholder="e.g. BTC-992-01"
                  className={`w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 ${errors.batchNo ? '!border-red-400' : '!border-transparent'} focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800`}
                />
              </div>

              <div className="form-group space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">3. Expiration</label>
                <input 
                  name="expiryDate" 
                  type="date" 
                  value={form.expiryDate} 
                  onChange={handleInput} 
                  className={`w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 ${errors.expiryDate ? '!border-red-400' : '!border-transparent'} focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800`}
                />
              </div>

              <div className="form-group space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">4. Intake Quantity</label>
                <input 
                  name="quantity" 
                  type="number" 
                  value={form.quantity} 
                  onChange={handleInput} 
                  placeholder="0"
                  className={`w-full !p-4 !rounded-xl !bg-slate-50/50 !border-2 ${errors.quantity ? '!border-red-400' : '!border-transparent'} focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800`}
                />
              </div>

              <div className="form-group space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">5. Unit Pricing ($)</label>
                <div className="grid grid-cols-2 gap-3">
                   <input 
                     name="costPrice" 
                     type="number" 
                     step="0.01" 
                     value={form.costPrice} 
                     onChange={handleInput} 
                     placeholder="Cost"
                     className="w-full !p-4 !rounded-xl !bg-slate-50/50 border-2 !border-transparent focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800"
                   />
                   <input 
                     name="sellingPrice" 
                     type="number" 
                     step="0.01" 
                     value={form.sellingPrice} 
                     onChange={handleInput} 
                     placeholder="Sell"
                     className="w-full !p-4 !rounded-xl !bg-slate-50/50 border-2 !border-transparent focus:!border-indigo-500 focus:!bg-white outline-none transition-all font-bold text-slate-800"
                   />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-4">
               <button 
                 type="submit" 
                 disabled={loading} 
                 className="primary flex-1 !p-5 !text-lg !rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
               >
                 {loading ? (
                   <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <>
                     <PlusCircle size={22} /> Authenticate & Record
                   </>
                 )}
               </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6 pt-20">
           <div className="glass-panel p-6 border-l-4 border-indigo-500 shadow-md">
              <h4 className="flex items-center gap-2 font-black text-slate-800 mb-2 uppercase tracking-tighter text-sm">
                <Info size={16} className="text-indigo-500" /> Intake Policy
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Every batch must have a unique identifier. Expiration dates are validated against the current system time to prevent outdated stock entry. Recorded batches immediately reflect in global inventory reports.
              </p>
           </div>
           
           <div className="glass-panel p-6 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Stock Overview</h4>
              <div className="flex items-end justify-between">
                 <div>
                    <div className="text-3xl font-black">{medicines.length}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Registered Medicines</div>
                 </div>
                 <div className="text-right">
                    <div className="text-xl font-bold text-indigo-400">Live</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Database Status</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

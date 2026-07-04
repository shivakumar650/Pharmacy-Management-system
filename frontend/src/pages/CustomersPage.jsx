import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Network Error: Could not synchronize customer directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer._id}` : '/api/customers';
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast.success(editingCustomer ? 'Customer profile updated' : 'New customer registered successfully');
        fetchCustomers();
        closeModal();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Verification Error: Operation rejected.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Communication Error: Backend is unreachable.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('IRREVERSIBLE OPERATION: Delete this customer profile permanently?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Customer entry purged.');
        fetchCustomers();
      }
    } catch (error) {
      toast.error('Purge Error: System prevented deletion.');
    }
  };

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setForm({
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      address: customer?.address || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setForm({ name: '', phone: '', email: '', address: '' });
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm text-indigo-600">
                <Users size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
           </div>
           <p className="text-slate-500 font-medium">Maintain comprehensive records of client profiles, prescriptions, and contact logs.</p>
        </div>
        <button 
           className="primary flex items-center gap-2 !px-6 shadow-indigo-100" 
           onClick={() => openModal()}
        >
          <UserPlus size={18} /> Register Profile
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
            {customers.length} ACTIVE PROFILES
          </div>
          <div className="relative group w-80">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Search by name or contact..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full !pl-10 !pr-4 !py-3 !bg-white !border-2 !border-slate-100 focus:!border-indigo-500 !rounded-2xl outline-none shadow-sm transition-all text-sm font-bold text-slate-700"
             />
          </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Synchronizing Directory...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-panel p-20 text-center space-y-4 border-none shadow-xl">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
             <Users size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Directory Empty</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            {searchTerm ? "No profiles matching your query. Try a different identifier." : "You haven't registered any customers yet. Start building your database today."}
          </p>
          {!searchTerm && <button onClick={() => openModal()} className="primary mt-4">Initialize First Entry</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div key={customer._id} className="glass-panel group relative overflow-hidden p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                     <button onClick={() => openModal(customer)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <Edit3 size={14} />
                     </button>
                     <button onClick={() => handleDelete(customer._id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={14} />
                     </button>
                  </div>
               </div>

               <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black font-poppins shadow-inner border border-white">
                    {customer.name.slice(0, 2).toUpperCase()}
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-800 line-clamp-1">{customer.name}</h3>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">CLIENT ID: {customer._id.slice(-8)}</div>
                 </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone size={14} /></div>
                     <span className="text-sm font-bold">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={14} /></div>
                     <span className="text-sm font-bold truncate">{customer.email || 'NO_SYSTEM_EMAIL'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={14} /></div>
                     <span className="text-sm font-bold line-clamp-1 italic">{customer.address || 'PENDING_LOCATION_LOG'}</span>
                  </div>
               </div>
               
               <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Profile Status</span>
                  <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase">
                     <CheckCircle2 size={12} /> Synchronized
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}>
          <div className="glass-panel w-full max-w-lg p-0 overflow-hidden shadow-2xl border-none animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-900 p-8 text-white relative">
               <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
               </button>
               <h2 className="text-2xl font-black mb-1">{editingCustomer ? 'Update Profile' : 'Register Profile'}</h2>
               <p className="text-slate-400 text-sm font-medium">Capture comprehensive details for encrypted database entry.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="form-group space-y-1.5 col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity *</label>
                   <input
                     type="text"
                     required
                     value={form.name}
                     onChange={e => setForm({...form, name: e.target.value})}
                     placeholder="Client full legal name"
                     className="w-full !p-4 !bg-slate-50 !border-2 !border-transparent focus:!border-indigo-500 !rounded-xl outline-none transition-all font-bold text-slate-800"
                     autoFocus
                   />
                 </div>
                 
                 <div className="form-group space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone *</label>
                   <input
                     type="tel"
                     required
                     value={form.phone}
                     onChange={e => setForm({...form, phone: e.target.value})}
                     placeholder="+1 (555) 000-0000"
                     className="w-full !p-4 !bg-slate-50 !border-2 !border-transparent focus:!border-indigo-500 !rounded-xl outline-none transition-all font-bold text-slate-800"
                   />
                 </div>
                 
                 <div className="form-group space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Interface</label>
                   <input
                     type="email"
                     value={form.email}
                     onChange={e => setForm({...form, email: e.target.value})}
                     placeholder="client@network.com"
                     className="w-full !p-4 !bg-slate-50 !border-2 !border-transparent focus:!border-indigo-500 !rounded-xl outline-none transition-all font-bold text-slate-800"
                   />
                 </div>
                 
                 <div className="form-group space-y-1.5 col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Logistics Address</label>
                   <textarea
                     value={form.address}
                     onChange={e => setForm({...form, address: e.target.value})}
                     placeholder="Physical delivery location"
                     className="w-full !p-4 !bg-slate-50 !border-2 !border-transparent focus:!border-indigo-500 !rounded-xl outline-none transition-all font-bold text-slate-800 resize-none"
                     rows="2"
                   />
                 </div>
              </div>

              <div className="pt-6 mt-2 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 !py-4 !bg-slate-100 hover:!bg-slate-200 text-slate-600 font-black uppercase tracking-widest text-xs rounded-xl transition-all">Abort</button>
                <button type="submit" className="primary flex-1 !py-4 flex items-center justify-center gap-2">
                   {editingCustomer ? 'Apply Changes' : 'Record Entry'} <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;

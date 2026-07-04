import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { 
  AlertTriangle, 
  Hourglass, 
  Search, 
  Calendar,
  DollarSign,
  TrendingDown,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

function ExpiryAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [losses, setLosses] = useState({ 
    expiredBatches: [], 
    summary: { totalLoss: 0, totalExpiredQuantity: 0, totalExpiredBatches: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");

  const prevCriticalRef = useRef(0);
  const abortRef = useRef(null);

  const fetchData = () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    const token = localStorage.getItem("token");
    const headers = { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` };

    Promise.all([
      fetch(`/api/reports/expiry?days=${days}`, {
        headers,
        signal: abortRef.current.signal
      }),
      fetch(`/api/reports/losses`, {
        headers,
        signal: abortRef.current.signal
      })
    ])
    .then(([expiryRes, lossRes]) => {
      if (!expiryRes.ok || !lossRes.ok) throw new Error("Unauthorized access to expiry reports.");
      return Promise.all([expiryRes.json(), lossRes.json()]);
    })
    .then(([expiryData, lossData]) => {
      setAlerts(Array.isArray(expiryData) ? expiryData : []);
      setLosses(lossData || { expiredBatches: [], summary: { totalLoss: 0, totalExpiredQuantity: 0, totalExpiredBatches: 0 } });

      const criticalCount = (Array.isArray(expiryData) ? expiryData : []).filter(
        item => item.daysLeft <= 7
      ).length;

      if (criticalCount > 0 && prevCriticalRef.current === 0) {
        toast.error(`🚨 ${criticalCount} crucial batch(es) expiring within 7 days!`, { autoClose: 10000 });
      }

      prevCriticalRef.current = criticalCount;
      setLoading(false);
    })
    .catch(err => {
      if (err.name !== "AbortError") {
        console.error('Expiry page data fetch error:', err);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [days]);

  const filteredAlerts = alerts.filter(item =>
    (item.medicineName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = alerts.filter(item => item.daysLeft <= 7).length;
  const warningCount = alerts.filter(item => item.daysLeft <= 30 && item.daysLeft > 7).length;
  const potentialLoss = alerts.reduce((sum, item) => sum + (item.potentialLoss || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 shadow-sm text-rose-600">
                <Hourglass size={24} className="animate-pulse" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expiry Alerts</h1>
           </div>
           <p className="text-slate-500 font-medium">Monitoring pharmaceutical shelf-life to prevent stock loss and ensure patient safety.</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/50 shadow-sm">
           {[7, 15, 30, 60].map(v => (
             <button
               key={v}
               onClick={() => setDays(v)}
               className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 days === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
               }`}
             >
               {v} Days
             </button>
           ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-rose-500 relative overflow-hidden group">
           <AlertTriangle className="absolute -right-2 -bottom-2 text-rose-500/10 group-hover:scale-125 transition-transform" size={80} />
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Critical Expiry</h3>
           <div className="text-4xl font-black text-rose-600 font-poppins">{criticalCount}</div>
           <div className="text-xs font-bold text-rose-400 mt-1 uppercase tracking-tighter flex items-center gap-1">
             <ArrowRight size={10} /> expiring within 7 days
           </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-amber-500 relative overflow-hidden group">
           <Activity className="absolute -right-2 -bottom-2 text-amber-500/10 group-hover:scale-125 transition-transform" size={80} />
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Warning Level</h3>
           <div className="text-4xl font-black text-amber-600 font-poppins">{warningCount}</div>
           <div className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-tighter flex items-center gap-1">
             <ArrowRight size={10} /> expiring within 30 days
           </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-indigo-500 relative overflow-hidden group">
           <ShieldCheck className="absolute -right-2 -bottom-2 text-indigo-500/10 group-hover:scale-125 transition-transform" size={80} />
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Potential Loss</h3>
           <div className="text-4xl font-black text-slate-800 font-poppins">${potentialLoss.toFixed(2)}</div>
           <div className="text-xs font-bold text-indigo-400 mt-1 uppercase tracking-tighter flex items-center gap-1">
             <ArrowRight size={10} /> if stock remains unsold
           </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-slate-800 bg-slate-900 text-white relative overflow-hidden group">
           <TrendingDown className="absolute -right-2 -bottom-2 text-white/5 group-hover:scale-125 transition-transform" size={80} />
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Actual Losses</h3>
           <div className="text-4xl font-black text-white font-poppins">${losses.summary.totalLoss.toFixed(2)}</div>
           <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter flex items-center gap-1">
             <CheckCircle2 size={10} className="text-emerald-500" /> {losses.summary.totalExpiredBatches} expired batches
           </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-500" /> Threshold Report
            </h2>
            <div className="relative group w-72">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search medicine identifier..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full !pl-10 !pr-4 !py-3 !bg-white !border-2 !border-transparent focus:!border-indigo-500 !rounded-2xl outline-none shadow-sm transition-all text-sm font-bold text-slate-700"
               />
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] glass-panel border-none shadow-xl">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Scanning Expiry Logs...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="glass-panel p-20 text-center space-y-4 border-none shadow-xl">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
               <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Clear Records</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              No medicines found expiring in the next <span className="text-indigo-600 font-bold">{days} days</span>. Your inventory shelf-life is healthy.
            </p>
          </div>
        ) : (
          <div className="table-container glass-panel border-none shadow-2xl">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch ID</th>
                  <th>Expiration</th>
                  <th>Time Left</th>
                  <th>Quantity</th>
                  <th>Valuation</th>
                  <th className="text-right">Risk Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlerts.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td>
                      <div className="font-bold text-slate-800">{item.medicineName}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter tracking-tighter">System ID: 00{index + 101}</div>
                    </td>
                    <td className="font-mono text-xs font-extrabold text-slate-500">{item.batchNo}</td>
                    <td className="font-semibold text-slate-600">{new Date(item.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <div className={`px-2 py-1 rounded-lg inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-tight ${
                        item.daysLeft <= 7 ? 'bg-rose-50 text-rose-600' :
                        item.daysLeft <= 30 ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                         <Hourglass size={12} /> {item.daysLeft} d
                      </div>
                    </td>
                    <td className="font-extrabold text-slate-700">{item.quantity} <span className="text-[10px] font-bold text-slate-400 uppercase">units</span></td>
                    <td className="font-black text-slate-800">${(item.potentialLoss || 0).toFixed(2)}</td>
                    <td className="text-right">
                       <span className={`status-badge !text-[10px] font-black !py-1 !px-3 shadow-sm ${
                         item.daysLeft <= 7 ? 'status-critical border border-rose-200 shadow-rose-50' :
                         item.daysLeft <= 30 ? 'status-warning border border-amber-200 shadow-amber-50' : 'status-good border border-emerald-200 shadow-emerald-50'
                       }`}>
                         {item.daysLeft <= 7 ? 'CRITICAL RISK' :
                          item.daysLeft <= 30 ? 'ELEVATED WARNING' : 'NOMINAL MONITORING'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpiryAlertsPage;
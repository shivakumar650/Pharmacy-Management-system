import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { exportToCSV } from "../utils/exportCsv";
import { 
  BarChart3, 
  ShoppingCart, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Package, 
  TrendingUp,
  FileText,
  Printer
} from "lucide-react";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales', { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      if (!res.ok) throw new Error('Failed to synchronize transaction ledger.');
      const json = await res.json();
      setSales(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const totalItems = sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
  
  const filteredSales = sales.filter(sale => 
    (sale.medicine?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.customer?.name || "Walk-in").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printInvoice = (invoice) => {
    const printWindow = window.open('', '', 'width=800,height=800');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber || 'TXN'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 50px; color: #1e293b; line-height: 1.5; }
            .header { border-bottom: 4px solid #4f46e5; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { color: #4f46e5; font-size: 32px; font-weight: 900; }
            .details { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .label { font-size: 10px; text-transform: uppercase; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-size: 14px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin: 40px 0; border: 1px solid #f1f5f9; }
            th { background: #f8fafc; text-align: left; padding: 15px; font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748b; }
            td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 500; }
            .summary { margin-top: 20px; text-align: right; }
            .total-box { display: inline-block; background: #1e293b; color: white; padding: 20px 40px; border-radius: 12px; }
            .total-label { font-size: 12px; font-weight: 600; opacity: 0.7; }
            .total-value { font-size: 24px; font-weight: 900; margin-top: 4px; }
            .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">PharmaCare</div>
              <div style="font-size: 12px; font-weight: 600; color: #64748b;">Enterprise Pharmacy Management</div>
            </div>
            <div style="text-align: right">
              <div style="font-size: 20px; font-weight: 900;">INVOICE</div>
              <div style="font-size: 14px; font-weight: 700; color: #4f46e5;">#${invoice.invoiceNumber || 'INV-'+invoice._id.slice(-6).toUpperCase()}</div>
            </div>
          </div>
          
          <div class="details">
            <div>
              <div class="label">Billed To</div>
              <div class="value">${invoice.customer?.name || 'Authorized Walk-in Customer'}</div>
              ${invoice.customer?.phone ? `<div class="value">${invoice.customer.phone}</div>` : ''}
              ${invoice.customer?.email ? `<div class="value" style="font-size: 12px; font-weight: 500;">${invoice.customer.email}</div>` : ''}
            </div>
            <div style="text-align: right">
              <div class="label">Processing Date</div>
              <div class="value">${new Date(invoice.soldAt).toLocaleString()}</div>
              <div class="label" style="margin-top: 15px">Payment Status</div>
              <div class="value" style="color: #059669">PAID IN FULL</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Batch Reference</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th style="text-align: right">Amout</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700;">${invoice.medicine?.name || 'N/A'}</td>
                <td style="font-family: monospace;">${invoice.batch?.batchNo || 'N/A'}</td>
                <td>$${invoice.sellingPrice?.toFixed(2) || '0.00'}</td>
                <td>${invoice.quantity}</td>
                <td style="text-align: right; font-weight: 700;">$${invoice.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="summary">
            <div class="total-box">
              <div class="total-label">Grand Total Paid</div>
              <div class="total-value">$${invoice.totalAmount.toFixed(2)}</div>
            </div>
          </div>
          
          <div class="footer">
            Generated on ${new Date().toLocaleString()} by PharmaCare System. All prices inclusive of taxes.
            <br/>Electronic Receipt - No Signature Required.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Accessing Transaction Records...</p>
     </div>
  );
  
  if (error) return (
    <div className="glass-panel p-10 text-center border-none shadow-xl max-w-lg mx-auto mt-20">
       <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={32} />
       </div>
       <h2 className="text-2xl font-black text-slate-800 mb-2">Sync Error</h2>
       <p className="text-slate-500 font-medium mb-6">System could not retrieve the encrypted sales ledger. {error}</p>
       <button onClick={() => window.location.reload()} className="primary">Retry Authentication</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="flex flex-col items-center">
           <div className="flex items-center justify-center gap-3 mb-2">
             <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm text-indigo-600">
                <BarChart3 size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Ledger</h1>
           </div>
           <p className="text-slate-500 font-medium">Historical record of all transactions, asset liquidation, and revenue generation.</p>
        </div>
        <div className="flex justify-center gap-3">
          <button 
            className="export-btn flex items-center gap-2" 
            onClick={() => exportToCSV('sales-report.csv', sales)}
          >
            <Download size={18} /> Export CSV
          </button>
          <Link to="/record-sale">
            <button className="primary flex items-center gap-2 shadow-indigo-100">
              <ShoppingCart size={18} /> Record New Sale
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 border-l-4 border-l-emerald-500 relative overflow-hidden group">
            <TrendingUp className="absolute -right-2 -bottom-2 text-emerald-500/10 group-hover:scale-125 transition-transform" size={80} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Gross Revenue</h3>
            <div className="text-4xl font-black text-emerald-600 font-poppins tracking-tighter">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Lifetime Accumulated</div>
         </div>
         
         <div className="glass-panel p-6 border-l-4 border-l-indigo-500 relative overflow-hidden group">
            <FileText className="absolute -right-2 -bottom-2 text-indigo-500/10 group-hover:scale-125 transition-transform" size={80} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Invoices Issued</h3>
            <div className="text-4xl font-black text-indigo-600 font-poppins">{sales.length}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Verified transactions</div>
         </div>
         
         <div className="glass-panel p-6 border-l-4 border-l-slate-800 bg-slate-900 text-white relative overflow-hidden group">
            <Package className="absolute -right-2 -bottom-2 text-white/5 group-hover:scale-125 transition-transform" size={80} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Units Liquidated</h3>
            <div className="text-4xl font-black text-white font-poppins tracking-tighter">{totalItems.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Inventory movement</div>
         </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-500" /> Transaction Log
            </h2>
            <div className="relative group w-80">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search customer, med or invoice..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full !pl-10 !pr-4 !py-3 !bg-white !border-2 !border-transparent focus:!border-indigo-500 !rounded-2xl outline-none shadow-sm transition-all text-sm font-bold text-slate-700"
               />
            </div>
        </div>

        <div className="table-container glass-panel border-none shadow-2xl">
          <table className="w-full">
            <thead>
              <tr>
                <th>Date / Invoice</th>
                <th>Stakeholder</th>
                <th>Asset Identity</th>
                <th>Metrics</th>
                <th className="text-right">Total Payable</th>
                <th className="text-right">Auth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                   <td colSpan="6" className="text-center py-20">
                      <div className="max-w-xs mx-auto text-slate-400 font-medium">No records found matching the specific search parameters.</div>
                   </td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale._id} className="hover:bg-slate-50/50 transition-colors">
                    <td>
                       <div className="font-bold text-slate-700">{new Date(sale.soldAt).toLocaleDateString()}</div>
                       <div className="text-[11px] font-black text-indigo-500 tracking-tighter uppercase">{sale.invoiceNumber || `TXN-${sale._id.slice(-6).toUpperCase()}`}</div>
                    </td>
                    <td>
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                             {(sale.customer?.name || "W").slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                             <div className="font-bold text-slate-800 text-sm">{sale.customer?.name || 'Walk-in Customer'}</div>
                             <div className="text-[10px] font-bold text-slate-400 tracking-tighter">{sale.customer?.phone || 'ANONYMOUS_POS'}</div>
                          </div>
                       </div>
                    </td>
                    <td>
                       <div className="font-bold text-slate-800 text-sm">{sale.medicine?.name || 'Purged Item'}</div>
                       <div className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">Batch: {sale.batch?.batchNo || 'N/A'}</div>
                    </td>
                    <td>
                       <div className="text-sm font-bold text-slate-700">{sale.quantity} <span className="text-[10px] font-medium text-slate-400 uppercase">units</span></div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">@ ${sale.sellingPrice?.toFixed(2)}</div>
                    </td>
                    <td className="text-right">
                       <div className="text-lg font-black font-poppins text-slate-900 tracking-tighter">${sale.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="text-right">
                       <button 
                         onClick={() => printInvoice(sale)}
                         className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                         title="Print Invoice"
                       >
                         <Printer size={16} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

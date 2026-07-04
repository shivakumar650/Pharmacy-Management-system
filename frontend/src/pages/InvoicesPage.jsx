import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Printer, 
  Search, 
  Download, 
  Calendar, 
  User, 
  Package, 
  DollarSign,
  Briefcase,
  ExternalLink,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sales', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    (inv.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.customer?.name || "Walk-in").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.medicine?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printInvoice = (invoice) => {
    const printWindow = window.open('', '', 'width=800,height=800');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber || 'TXN'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 60px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 3px solid #6366f1; padding-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .brand { color: #6366f1; font-size: 36px; font-weight: 900; letter-spacing: -1px; }
            .meta { text-align: right; }
            .meta h2 { font-size: 24px; font-weight: 900; margin: 0; color: #0f172a; }
            .meta p { margin: 4px 0 0 0; font-weight: 700; color: #6366f1; }
            .client-box { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
            .info-item { margin-bottom: 20px; }
            .label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 6px; }
            .value { font-size: 15px; font-weight: 700; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin: 40px 0; border-radius: 12px; overflow: hidden; }
            th { background: #f8fafc; text-align: left; padding: 18px; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; }
            td { padding: 18px; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 500; }
            .total-area { margin-top: 30px; display: flex; justify-content: flex-end; }
            .total-panel { background: #0f172a; color: white; padding: 30px 50px; border-radius: 20px; text-align: right; }
            .total-caption { font-size: 12px; font-weight: 600; opacity: 0.6; }
            .total-sum { font-size: 32px; font-weight: 900; font-family: 'Inter', sans-serif; margin-top: 4px; }
            .notices { margin-top: 100px; padding-top: 30px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">PharmaCare</div>
              <div style="font-size: 14px; color: #64748b; font-weight: 600; margin-top: 4px;">Premium Healthcare Logistics</div>
            </div>
            <div class="meta">
              <h2>DIGITAL INVOICE</h2>
              <p>ID: ${invoice.invoiceNumber || 'INV-'+invoice._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          
          <div class="client-box">
            <div class="info-item">
              <div class="label">Recipient Identity</div>
              <div class="value">${invoice.customer?.name || 'Walk-in Customer / Guest'}</div>
              ${invoice.customer?.phone ? `<div class="value" style="font-weight: 600; color: #64748b; margin-top: 4px;">${invoice.customer.phone}</div>` : ''}
              ${invoice.customer?.address ? `<div class="value" style="font-weight: 500; font-size: 13px; color: #94a3b8; margin-top: 4px;">${invoice.customer.address}</div>` : ''}
            </div>
            <div class="info-item" style="text-align: right">
              <div class="label">Date of Issuance</div>
              <div class="value">${new Date(invoice.soldAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
              <div class="label" style="margin-top: 25px">Payment Authorization</div>
              <div class="value" style="color: #059669; font-weight: 900;">AUTHORIZED • COMPLETED</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 45%">Description & Product Identification</th>
                <th style="text-align: center">Qty</th>
                <th style="text-align: right">Unit Price</th>
                <th style="text-align: right">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">${invoice.medicine?.name || 'N/A'}</div>
                  <div style="font-size: 11px; font-weight: 700; color: #94a3b8;">BATCH REF: ${invoice.batch?.batchNo || 'N/A'}</div>
                </td>
                <td style="text-align: center; font-weight: 800;">${invoice.quantity}</td>
                <td style="text-align: right; font-weight: 600; color: #64748b;">$${invoice.sellingPrice.toFixed(2)}</td>
                <td style="text-align: right; font-weight: 900; color: #0f172a;">$${invoice.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total-area">
            <div class="total-panel">
              <div class="total-caption">TOTAL TRANSACTION VALUE</div>
              <div class="total-sum">$${invoice.totalAmount.toFixed(2)}</div>
            </div>
          </div>
          
          <div class="notices">
            Thank you for choosing PharmaCare. This document is a valid electronic proof of purchase.
            <br/>Generated by Admin System [UID: ${invoice._id}] on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm text-indigo-600">
                <FileText size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Invoice Archive</h1>
           </div>
           <p className="text-slate-500 font-medium">Digital records of all processed sales transactions and generated receipts.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200/50 shadow-sm">
           <div className="relative group w-80">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search invoice or customer..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full !pl-10 !pr-4 !py-3 !bg-transparent border-none outline-none transition-all text-sm font-bold text-slate-700"
               />
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
           <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
           <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Accessing Secure Archive...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="glass-panel p-20 text-center space-y-4 border-none shadow-xl">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
             <FileText size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">No Invoices Found</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            {searchTerm ? "No search results found. Try matching with full invoice ID." : "The archive is currently empty. Generated invoices will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map(invoice => (
            <div key={invoice._id} className="glass-panel group p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                     <FileText size={24} />
                  </div>
                  <button 
                    onClick={() => printInvoice(invoice)}
                    className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    title="Print Document"
                  >
                    <Printer size={18} />
                  </button>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Ref: {invoice.invoiceNumber || 'TXN-'+invoice._id.slice(-6).toUpperCase()}</div>
                     <h3 className="text-xl font-black text-slate-800 mt-1">${invoice.totalAmount.toFixed(2)}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Client</div>
                        <div className="text-xs font-black text-slate-700 truncate">{invoice.customer?.name || 'Walk-in'}</div>
                     </div>
                     <div className="space-y-1 text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Date</div>
                        <div className="text-xs font-black text-slate-700">{new Date(invoice.soldAt).toLocaleDateString()}</div>
                     </div>
                  </div>
                  
                  <div className="p-3 bg-slate-50/50 rounded-xl flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-400 border border-slate-100">
                        <Package size={14} />
                     </div>
                     <span className="text-xs font-bold text-slate-600 truncate">{invoice.medicine?.name || 'Purged Item'}</span>
                  </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Authorized
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">Click icon to print</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoicesPage;

import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, BarChartOutlined, ArrowRightOutlined } from '@ant-design/icons';

function SalesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-fade-in relative z-10">
      {/* Decorative background orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full point-events-none -z-10"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-500/10 blur-[100px] rounded-full point-events-none -z-10"></div>

      <div className="text-center mb-16">
         <h2 className="text-4xl font-extrabold text-slate-800 font-poppins tracking-tight mb-4">Sales Operations</h2>
         <p className="text-slate-500 text-[15px] max-w-lg mx-auto font-medium">
            Manage your daily transactions or review historical revenue data from our unified financial hub.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Link to="/record-sale" className="group block focus:outline-none">
          <div className="glass-panel p-10 rounded-3xl h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 border border-transparent hover:border-emerald-200/50 relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-emerald-50 to-teal-50 flex items-center justify-center mb-8 shadow-inner border border-emerald-100/50 group-hover:scale-110 transition-transform duration-300">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <ShoppingCartOutlined className="text-3xl" />
               </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3 font-poppins">Record Transaction</h3>
            <p className="text-slate-500 text-[14px] leading-relaxed mb-8 flex-grow">
               Process new customer purchases, select from available batches, and update your inventory automatically in real-time.
            </p>
            
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[13px] uppercase tracking-widest group-hover:gap-4 transition-all pb-2">
               Proceed to POS <ArrowRightOutlined />
            </div>
          </div>
        </Link>

        <Link to="/sales-history" className="group block focus:outline-none">
          <div className="glass-panel p-10 rounded-3xl h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 border border-transparent hover:border-indigo-200/50 relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 to-fuchsia-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-indigo-50 to-fuchsia-50 flex items-center justify-center mb-8 shadow-inner border border-indigo-100/50 group-hover:scale-110 transition-transform duration-300">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <BarChartOutlined className="text-3xl" />
               </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3 font-poppins">Sales Ledger</h3>
            <p className="text-slate-500 text-[14px] leading-relaxed mb-8 flex-grow">
               Access comprehensive historical logs of all transactions, monitor total revenue, and track customer purchasing patterns.
            </p>
            
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-[13px] uppercase tracking-widest group-hover:gap-4 transition-all pb-2">
               View History <ArrowRightOutlined />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SalesPage;

import { Link } from "react-router-dom";
import { 
  Braces, 
  Server, 
  Database, 
  Lock, 
  LayoutDashboard, 
  Package, 
  Bell, 
  ArrowRight,
  Monitor,
  Cloud,
  Layers,
  Box
} from "lucide-react";

function TechStackPage() {
  const stack = [
    { title: "Frontend Implementation", icon: <Monitor size={28} />, tech: "React 19, Vite, Tailwind CSS", desc: "Adaptive SPA architecture with sub-second HMR and glassmorphic UI system.", color: "blue" },
    { title: "Distributed Backend", icon: <Server size={28} />, tech: "Node.js, Express.js REST API", desc: "Non-blocking I/O event loop for handling simultaneous POS and report requests.", color: "emerald" },
    { title: "Data Persistence", icon: <Database size={28} />, tech: "MongoDB, Mongoose ODM", desc: "NoSQL document storage for flexible pharmaceutical data schemas and batch history.", color: "amber" },
    { title: "Security Protocols", icon: <Lock size={28} />, tech: "JWT (Json Web Token), Bcrypt", desc: "Encrypted authentication tokens with salt-rounds for immutable stakeholder security.", color: "rose" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <Layers size={32} className="text-indigo-600" /> Technology Foundation
            </h1>
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl">Architecture audit of the core technologies enabling the PharmaCare Enterprise platform.</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2 self-start md:self-auto">
           <Cloud size={14} /> Full Stack Operations
        </div>
      </div>

      {/* Grid of stack items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stack.map((item, i) => (
          <div key={i} className="bg-white p-6 sm:p-8 space-y-4 rounded-3xl border border-slate-100 shadow-lg hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-900/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
             <div className="p-3 bg-slate-50 text-slate-400 rounded-xl w-fit shadow-sm group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors border border-slate-100">
                {item.icon}
             </div>
             <div>
               <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tighter">{item.title}</h3>
               <div className="text-[10px] sm:text-[11px] font-black uppercase text-indigo-500 tracking-widest mt-1">{item.tech}</div>
             </div>
             <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
         <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
               <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest">Active System Modules</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { icon: Package, link: "/inventory", label: "Warehouse Controller", desc: "Batch track, stock intake, and audit logs.", color: "indigo" },
                 { icon: Bell, link: "/expiry-alerts", label: "Threshold Monitor", desc: "Real-time shelf-life risk alerts.", color: "rose" },
                 { icon: LayoutDashboard, link: "/dashboard", label: "Analytics Hub", desc: "Data visualization and asset metrics.", color: "emerald" },
                 { icon: Box, link: "/record-sale", label: "POS Terminal", desc: "Fast-track transaction processing.", color: "amber" }
               ].map((mod, i) => (
                 <Link key={i} to={mod.link} style={{ padding: '1.25rem' }} className="bg-white flex items-center justify-between gap-4 group rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-50 text-slate-400 group-hover:text-indigo-600 rounded-xl transition-all shadow-sm border border-slate-100 shrink-0">
                         <mod.icon size={22} />
                       </div>
                       <div className="flex flex-col justify-center">
                         <h4 className="font-black text-slate-800 tracking-tight uppercase text-xs sm:text-sm">{mod.label}</h4>
                         <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5">{mod.desc}</p>
                       </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                 </Link>
               ))}
            </div>
         </div>

          <div className="lg:col-span-2 flex flex-col">
             <div className="bg-indigo-50 p-8 sm:p-10 text-slate-800 relative overflow-hidden border border-indigo-100 shadow-sm rounded-[2rem] flex flex-col justify-center h-full">
                <div className="z-10 relative">
                  <Braces size={40} className="text-indigo-500 mb-6" />
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 text-slate-900">Enterprise-Ready Infrastructure</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                    PharmaCare is architected to prioritize data integrity and sub-second response times. Our asynchronous event loop ensures that high-volume POS operations never stall administrative reporting.
                  </p>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Scalable NoSQL Schema</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">JWT-Shielded REST API</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Real-Time Data Streams</span>
                     </div>
                  </div>
                </div>
             </div>
          </div>
      </div>

      <div className="flex justify-center pt-4">
         <Link to="/about" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase tracking-widest text-[10px] transition-all group">
            Strategic Overview <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
}

export default TechStackPage;
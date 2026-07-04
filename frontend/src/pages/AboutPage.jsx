import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Instagram,
  LayoutDashboard,
  Layers,
  CheckCircle2
} from "lucide-react";

function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-16 py-12 px-6 sm:px-8 animate-in fade-in duration-700">
      
      {/* 1. Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-2">
          <Activity size={32} className="text-indigo-600" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Modernizing Pharmacy Logistics
        </h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          The next generation of pharmaceutical management, engineered for simplicity, precision, and healthcare excellence.
        </p>
      </div>

      {/* 2. Core Features (Clean Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
            <LayoutDashboard size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Strategic Mission</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            PharmaCare empowers clinical professionals with intuitive data architecture. We eliminate manual tracking errors to ensure every patient receives safe, valid medication through uncompromising expiry monitoring and instant inventory synchronization.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Enterprise Security</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Built with robust architecture, including JWT authentication and Bcrypt encryption, to ensure your clinical data remains completely secure and immutable at all times.
          </p>
        </div>
      </div>

      {/* 3. Bullet Points - Simplified */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 text-center border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">System Capabilities</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-3xl mx-auto">
          {[
            "Automated Inventory Tracking",
            "Intelligent Expiry Alerts",
            "Financial Reporting",
            "Secure Access Control",
            "Real-time Dashboard"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-700 font-semibold bg-white px-5 py-3 rounded-full shadow-sm border border-slate-100">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Connect & Navigation - Clean Light Theme */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 sm:p-14 text-center flex flex-col items-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ready to evolve?
          </h3>
          <p className="text-slate-500 font-medium text-base sm:text-lg">
            Reach out for deployment support or custom system tailoring. We are continuously adapting to modern industry standards.
          </p>
        </div>
        
        <div className="flex flex-row justify-center items-center gap-4 mt-8 mb-6">
          <a href="https://www.instagram.com/shiva_pashamwad_0208/" target="_blank" rel="noopener noreferrer" 
             style={{ textDecoration: 'none', color: 'white', padding: '0.75rem 1.5rem' }}
             className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
             <Instagram size={18} />
             <span>Instagram</span>
          </a>
          
          <a href="https://wa.me/9542066782" target="_blank" rel="noopener noreferrer" 
             style={{ textDecoration: 'none', color: 'white', padding: '0.75rem 1.5rem' }}
             className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
             {/* Official WhatsApp SVG */}
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
             </svg>
             <span>WhatsApp</span>
          </a>
        </div>

        <div className="w-full h-px bg-slate-100 my-8 max-w-lg mx-auto"></div>

        <div className="flex flex-row justify-center items-center gap-4 sm:gap-8 mt-6">
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#475569' }} className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200">
            <LayoutDashboard size={18} className="text-indigo-500" />
            <span >Return Dashboard</span>
          </Link>
          <Link to="/tech-stack" style={{ textDecoration: 'none', color: '#475569'}} className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200">
            <Layers size={18} className="text-emerald-500" />
            <span>System Stack</span>
          </Link>
        </div>
      </div>
      
    </div>
  );
}

export default AboutPage;


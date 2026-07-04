import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, Mail, UserPlus } from "lucide-react";
import { SafetyCertificateFilled, ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      let data = {};
      try {
        const text = await res.text();
        if (text) data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e);
      }

      if (!res.ok) {
        throw new Error(data.message || `Registration failed (Status: ${res.status})`);
      }

      toast.success("Admin account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-slate-50 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Global Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1200px] h-full sm:h-[700px] flex flex-col md:flex-row-reverse glass-panel-strong rounded-[2rem] overflow-hidden relative z-10"
      >
        {/* Right Side - Visual Focus (Flipped for Signup) */}
        <div className="w-full md:w-5/12 relative hidden md:flex flex-col justify-between overflow-hidden bg-slate-900 border-l border-white/10 p-12 shrink-0">
          <motion.div 
            animate={{ x: [20, -20, 20], y: [20, -30, 20] }} 
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[-20%] right-[-20%] w-[140%] h-[140%] opacity-40 mix-blend-screen pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.4) 0%, transparent 60%)' }} 
          />
          <motion.div 
            animate={{ x: [-30, 30, -30], y: [-30, 20, -30] }} 
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[-20%] left-[-20%] w-[120%] h-[120%] opacity-30 mix-blend-screen pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.4) 0%, transparent 60%)' }} 
          />

          <div className="relative z-10 text-right">
            <div className="flex items-center justify-end gap-3">
              <h1 className="text-2xl font-extrabold font-poppins text-white tracking-tight">
                PharmaCare
              </h1>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <SafetyCertificateFilled className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto text-right">
            <h2 className="text-4xl font-bold text-white mb-4 leading-[1.15] font-poppins">
               Join The <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-emerald-400">
                  Enterprise Network.
               </span>
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-sm ml-auto">
               Scalable security, real-time analytics, and uncompromising control over your pharmacy fleet.
            </p>
          </div>
        </div>

        {/* Left Side - Signup Form */}
        <div className="w-full md:w-7/12 flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-20 relative bg-white/40">
          <div className="w-full max-w-md mx-auto relative z-10">
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-slate-900 mb-2 font-poppins tracking-tight">Request Access</h3>
              <p className="text-slate-500 font-medium">Register a new centralized pharmacy manager account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100/50 shadow-sm flex items-start gap-3 backdrop-blur-sm"
                >
                  <Lock size={16} className="mt-0.5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              <div className="mb-5 space-y-1.5 group">
                <label htmlFor="email" className="block text-[11px] font-bold text-emerald-600 uppercase tracking-widest pl-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="w-full !pl-10 !pr-4 !py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-slate-800 font-medium backdrop-blur-sm shadow-sm focus:shadow-md focus:bg-white"
                    placeholder="admin@pharmacare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-5 space-y-1.5 group">
                <label htmlFor="password" className="block text-[11px] font-bold text-emerald-600 uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="w-full !pl-10 !pr-4 !py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-slate-800 font-medium backdrop-blur-sm shadow-sm focus:shadow-md focus:bg-white"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="mb-8 space-y-1.5 group">
                <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-emerald-600 uppercase tracking-widest pl-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full !pl-10 !pr-4 !py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-slate-800 font-medium backdrop-blur-sm shadow-sm focus:shadow-md focus:bg-white"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-slate-900/30 overflow-hidden relative group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none"></span>
                {loading ? <LoadingOutlined /> : 'Initialize Account'} 
                {!loading && <UserPlus className="text-sm group-hover:translate-x-1 transition-transform" size={18} />}
              </button>
              
              <div className="mt-8 text-center pt-2">
                <p className="text-slate-500 font-medium text-sm">
                  Already have access? <br className="sm:hidden" />
                  <Link to="/" className="text-emerald-600 font-bold ml-1 hover:underline">Sign In Here</Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="absolute bottom-6 left-8 hidden lg:block">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Architecture v2.4</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
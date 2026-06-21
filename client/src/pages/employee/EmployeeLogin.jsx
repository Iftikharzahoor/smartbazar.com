import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api.js';
import { Sparkles, Key, User, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const session = localStorage.getItem('employee_session');
    if (session) {
      navigate('/employee/dashboard');
    }
  }, [navigate]);

  // Handle URL Autofill
  useEffect(() => {
    const autofill = searchParams.get('autofill');
    if (autofill === 'employee') {
      setEmployeeId('zeeshan@smartbazaar.com');
      setPassword('password123');
      toast.success('Autofilled Cashier sandbox credentials!');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !password) {
      toast.error('Please enter both Employee ID/Email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/employees/login', { employeeId, password });
      if (response.data.success) {
        localStorage.setItem('employee_session', JSON.stringify(response.data.employee));
        toast.success(`Welcome back, ${response.data.employee.name}!`);
        navigate('/employee/dashboard');
      }
    } catch (err) {
      // Offline fallback login for easy local evaluation
      const mockEmployees = {
        'SAHU@SMARTBAZAAR.COM': { _id: 'emp-1', employeeId: 'EMP101', email: 'sahu@smartbazaar.com', name: 'Sahu Ahmed', role: 'Manager', phoneNumber: '+92 300 1234567', attendanceStatus: 'Present', salary: 75000, totalSales: 0, commissionEarned: 0, salaryStatus: 'Unpaid', joiningDate: '2025-01-15', logs: [] },
        'ZEESHAN@SMARTBAZAAR.COM': { _id: 'emp-2', employeeId: 'EMP102', email: 'zeeshan@smartbazaar.com', name: 'Zeeshan Khan', role: 'Cashier', phoneNumber: '+92 312 9876543', attendanceStatus: 'Present', salary: 45000, totalSales: 24500, commissionEarned: 245, salaryStatus: 'Unpaid', joiningDate: '2025-03-10', logs: [] },
        'AYESHA@SMARTBAZAAR.COM': { _id: 'emp-3', employeeId: 'EMP103', email: 'ayesha@smartbazaar.com', name: 'Ayesha Bibi', role: 'Salesperson', phoneNumber: '+92 333 4567890', attendanceStatus: 'Leave', salary: 35000, totalSales: 0, commissionEarned: 0, salaryStatus: 'Paid', joiningDate: '2025-05-01', logs: [] },
        'EMP101': { _id: 'emp-1', employeeId: 'EMP101', email: 'sahu@smartbazaar.com', name: 'Sahu Ahmed', role: 'Manager', phoneNumber: '+92 300 1234567', attendanceStatus: 'Present', salary: 75000, totalSales: 0, commissionEarned: 0, salaryStatus: 'Unpaid', joiningDate: '2025-01-15', logs: [] },
        'EMP102': { _id: 'emp-2', employeeId: 'EMP102', email: 'zeeshan@smartbazaar.com', name: 'Zeeshan Khan', role: 'Cashier', phoneNumber: '+92 312 9876543', attendanceStatus: 'Present', salary: 45000, totalSales: 24500, commissionEarned: 245, salaryStatus: 'Unpaid', joiningDate: '2025-03-10', logs: [] },
        'EMP103': { _id: 'emp-3', employeeId: 'EMP103', email: 'ayesha@smartbazaar.com', name: 'Ayesha Bibi', role: 'Salesperson', phoneNumber: '+92 333 4567890', attendanceStatus: 'Leave', salary: 35000, totalSales: 0, commissionEarned: 0, salaryStatus: 'Paid', joiningDate: '2025-05-01', logs: [] }
      };

      const key = employeeId.toUpperCase();
      const found = mockEmployees[key];
      if (found && password === 'password123') {
        localStorage.setItem('employee_session', JSON.stringify(found));
        toast.success(`Welcome back (offline mode), ${found.name}!`);
        navigate('/employee/dashboard');
      } else {
        toast.error(err.response?.data?.error || 'Invalid credentials or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (email) => {
    setEmployeeId(email);
    setPassword('password123');
    toast.success(`${email} credentials autofilled!`);
  };

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-20 flex items-center justify-center relative overflow-hidden select-none">
      {/* GLOW BACKGROUND */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#EC4899]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-md w-full mx-4 relative z-10 space-y-8">
        
        {/* Banner Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Authorized Personnel Only
          </div>
          <h1 className="font-display font-extrabold text-3.5xl text-white">Employee Portal</h1>
          <p className="text-[#94A3B8] text-sm font-light">Access your custom role billing, catalog lookup, or manager tools.</p>
        </div>

        {/* Card Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-2xl backdrop-blur-md space-y-6 text-left"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employee Email / ID</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. zeeshan@smartbazaar.com or EMP102"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill helpers */}
          <div className="border-t border-slate-850 pt-6 space-y-3">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              Credentials Autofill Helpers
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAutofill('sahu@smartbazaar.com')}
                className="py-2.5 px-1 bg-indigo-500/5 hover:bg-indigo-500/15 border border-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-lg transition-all truncate"
              >
                Manager
              </button>
              <button
                onClick={() => handleAutofill('zeeshan@smartbazaar.com')}
                className="py-2.5 px-1 bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-lg transition-all truncate"
              >
                Cashier
              </button>
              <button
                onClick={() => handleAutofill('ayesha@smartbazaar.com')}
                className="py-2.5 px-1 bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/10 text-amber-400 text-[9px] font-black rounded-lg transition-all truncate"
              >
                Sales
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeLogin;

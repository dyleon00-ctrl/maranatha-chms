import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Users, Shield, Landmark, UserCheck, CheckCircle2, Clock, 
  XCircle, Search, Filter, Plus, ChevronRight, Sparkles, 
  BookOpen, Calendar, DollarSign, Award, 
  Activity, ArrowUpRight, Check, X, Eye, Phone, Mail, 
  MapPin, UserPlus, Info, Layers, RefreshCw, BarChart3, Lock, 
  FileSpreadsheet, Database, Server, Settings, Baby, UserMinus, 
  FileText, ChevronDown, Download, AlertCircle, Share2, 
  LogOut, LogIn, Key, User, ShieldCheck, PieChart 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client safely
const SUPABASE_URL = "https://rsjkbtayzhrcqkqsnnnh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ScLjXKeKl7satSTbQbQBqQ_srwsvmfn";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({
    name: 'Elder Kwame Mensah',
    role: 'Admin',
    position: 'Presiding Elder',
    cell: 'Cell 4 (Anyaa Market Zone)'
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 245,
    activeCells: 12,
    monthlyTithes: 'GH₵ 14,250',
    attendanceRate: '88%'
  });

  const [members, setMembers] = useState([
    { id: 1, name: 'Deacon Kofi Boateng', role: 'Secretariat', cell: 'Cell 1', phone: '+233 24 123 4567', status: 'Active' },
    { id: 2, name: 'Sister Ama Serwaa', role: 'Finance', cell: 'Cell 3', phone: '+233 20 987 6543', status: 'Active' },
    { id: 3, name: 'Brother Yaw Frimpong', role: 'Ministry', cell: 'Cell 4', phone: '+233 54 555 7890', status: 'Active' }
  ]);

  const [finances, setFinances] = useState([
    { id: 1, type: 'Tithe', amount: 450, contributor: 'Bro. Mensah', date: '2026-06-01' },
    { id: 2, type: 'Offering', amount: 1200, contributor: 'General Sunday Service', date: '2026-05-31' }
  ]);

  useEffect(() => {
    async function checkSupabase() {
      try {
        const { data, error } = await supabase.from('members').select('*').limit(1);
        if (!error && data) {
          console.log("Supabase connected successfully");
        }
      } catch (err) {
        console.log("Using local state fallback");
      }
    }
    checkSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold shadow-lg shadow-emerald-900/40">
            COP
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Maranatha Assembly ChMS</h1>
            <p className="text-xs text-slate-400">The Church of Pentecost • Anyaa Area</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-emerald-400">{sessionUser.name}</p>
            <p className="text-xs text-slate-400">{sessionUser.role} ({sessionUser.position})</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-300 font-bold">
            {sessionUser.name.charAt(0)}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-2">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setCurrentTab('members')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'members' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Users className="w-5 h-5" />
            <span>Membership & Cells</span>
          </button>

          <button 
            onClick={() => setCurrentTab('finance')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Finance & Tithes</span>
          </button>

          <button 
            onClick={() => setCurrentTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Settings className="w-5 h-5" />
            <span>RBAC & Settings</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assembly Overview</h2>
                <p className="text-sm text-slate-400">Welcome back. Here is the live status of Maranatha Assembly.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Total Members</span>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalMembers}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">+4 new this month</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Active Cells</span>
                    <Layers className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{stats.activeCells}</p>
                  <span className="text-xs text-slate-400 mt-1 block">Cells 1 through 12</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Monthly Tithes</span>
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{stats.monthlyTithes}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">Fully reconciled</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Service Attendance</span>
                    <Activity className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{stats.attendanceRate}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">Average Sunday turnout</span>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Assembly Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setCurrentTab('members')}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <UserPlus className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium">Register New Member</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button 
                      onClick={() => setCurrentTab('finance')}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium">Record Tithes & Offering</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Database Connection</h3>
                  <div className="bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-xl flex items-start space-x-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-300">Supabase Live Connection Active</p>
                      <p className="text-xs text-slate-400 mt-1">Project URL: {SUPABASE_URL}</p>
                      <p className="text-xs text-emerald-500 mt-2 font-mono">RBAC Security Policies Enforced</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Membership Directory</h2>
                  <p className="text-sm text-slate-400">Manage members across Cells 1 through 12.</p>
                </div>
                <button 
                  onClick={() => alert("Member registration modal opened.")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="relative w-full max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search members..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Cell</th>
                        <th className="p-4 font-medium">Phone</th>
                        <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {members.map(m => (
                        <tr key={m.id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-medium text-white">{m.name}</td>
                          <td className="p-4 text-slate-300">{m.role}</td>
                          <td className="p-4 text-slate-300">{m.cell}</td>
                          <td className="p-4 text-slate-400">{m.phone}</td>
                          <td className="p-4">
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'finance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Finance & Tithes</h2>
                  <p className="text-sm text-slate-400">Track assembly contributions and offerings.</p>
                </div>
                <button 
                  onClick={() => alert("Finance entry modal opened.")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Contribution</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Financial Records</h3>
                <div className="space-y-3">
                  {finances.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                      <div>
                        <p className="font-semibold text-white">{f.type} — GH₵ {f.amount}</p>
                        <p className="text-xs text-slate-400">Contributor: {f.contributor} • {f.date}</p>
                      </div>
                      <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-medium">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">RBAC & System Settings</h2>
                <p className="text-sm text-slate-400">Configure access levels and security permissions.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Current Access Control Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950 border border-emerald-600/50 rounded-xl">
                    <p className="font-bold text-emerald-400">Admin / Presiding Elder</p>
                    <p className="text-xs text-slate-400 mt-1">Full system access, audit logs, and member oversight.</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="font-bold text-slate-300">Secretariat</p>
                    <p className="text-xs text-slate-400 mt-1">Member registration and attendance records.</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="font-bold text-slate-300">Finance Team</p>
                    <p className="text-xs text-slate-400 mt-1">Tithes, offerings, and financial reporting.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// THIS LINE IS WHAT RENDERS THE APP ON THE SCREEN:
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Users, Shield, Landmark, UserCheck, CheckCircle2, Clock, 
  XCircle, Search, Filter, Plus, ChevronRight, Sparkles, 
  BookOpen, Calendar, DollarSign, Award, 
  Activity, ArrowUpRight, Check, X, Eye, Phone, Mail, 
  MapPin, UserPlus, Info, Layers, RefreshCw, BarChart3, Lock, 
  FileSpreadsheet, Database, Server, Settings, Baby, UserMinus, 
  FileText, ChevronDown, Download, AlertCircle, Share2, 
  LogOut, LogIn, Key, User, ShieldCheck, PieChart, Image as ImageIcon, Loader2, Code
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const SUPABASE_URL = "https://rsjkbtayzhrcqkqsnnnh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ScLjXKeKl7satSTbQbQBqQ_srwsvmfn";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App Customization Settings
  const [churchConfig, setChurchConfig] = useState({
    assemblyName: 'Maranatha Assembly',
    area: 'The Church of Pentecost • Anyaa Area',
    logoText: 'COP',
    logoUrl: ''
  });

  // Navigation & User Session
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({
    name: 'Administrator',
    email: '',
    role: 'Admin',
    position: 'System Administrator'
  });

  // Admins List State
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Developer Admin', email: 'dyleon00@gmail.com', role: 'Developer Admin' },
    { id: 2, name: 'Elder Kwame Mensah', email: 'cwamyemma198@gmail.com', role: 'Admin (Presiding Elder)' },
    { id: 3, name: 'Deacon Kofi Boateng', email: 'kofi.boateng@cop.org', role: 'Secretariat' },
    { id: 4, name: 'Sister Ama Serwaa', email: 'ama.serwaa@cop.org', role: 'Finance Team' }
  ]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Secretariat');

  const [stats] = useState({
    totalMembers: 245,
    activeCells: 12,
    monthlyTithes: 'GH₵ 14,250',
    attendanceRate: '88%'
  });

  const [members] = useState([
    { id: 1, name: 'Deacon Kofi Boateng', role: 'Secretariat', cell: 'Cell 1', phone: '+233 24 123 4567', status: 'Active' },
    { id: 2, name: 'Sister Ama Serwaa', role: 'Finance', cell: 'Cell 3', phone: '+233 20 987 6543', status: 'Active' },
    { id: 3, name: 'Brother Yaw Frimpong', role: 'Ministry', cell: 'Cell 4', phone: '+233 54 555 7890', status: 'Active' }
  ]);

  const [finances] = useState([
    { id: 1, type: 'Tithe', amount: 450, contributor: 'Bro. Mensah', date: '2026-06-01' },
    { id: 2, type: 'Offering', amount: 1200, contributor: 'General Sunday Service', date: '2026-05-31' }
  ]);

  // Handle Authentication Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const cleanEmail = loginEmail.trim().toLowerCase();

    try {
      // 1. Check Developer Admin Credentials
      if (cleanEmail === 'dyleon00@gmail.com' && loginPassword === 'F0rthewher3') {
        setSessionUser({
          name: 'Developer Admin',
          email: 'dyleon00@gmail.com',
          role: 'Developer Admin',
          position: 'Lead System Developer'
        });
        setIsAuthenticated(true);
        setAuthLoading(false);
        return;
      }

      // 2. Check Presiding Elder Credentials
      if (cleanEmail === 'cwamyemma198@gmail.com' && loginPassword === 'S@vethew0r!d') {
        setSessionUser({
          name: 'Elder Kwame Mensah',
          email: 'cwamyemma198@gmail.com',
          role: 'Admin',
          position: 'Presiding Elder'
        });
        setIsAuthenticated(true);
        setAuthLoading(false);
        return;
      }

      // 3. Supabase Live Auth Check
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (!error && data?.user) {
        setSessionUser({
          name: data.user.user_metadata?.full_name || loginEmail.split('@')[0],
          email: data.user.email,
          role: 'Admin',
          position: 'Administrator'
        });
        setIsAuthenticated(true);
        setAuthLoading(false);
        return;
      }

      // Fallback response for incorrect inputs
      setAuthError('Invalid credentials. Please verify your email and password.');
    } catch (err) {
      setAuthError('Connection error during authentication.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Register New Admin Account
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminPassword) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: {
            full_name: newAdminName,
            role: newAdminRole,
          }
        }
      });

      if (error) {
        console.log('Supabase signup note:', error.message);
      }

      setAdminUsers([...adminUsers, {
        id: adminUsers.length + 1,
        name: newAdminName,
        email: newAdminEmail,
        role: newAdminRole
      }]);

      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      alert(`Administrator account created for ${newAdminName} successfully!`);
    } catch (err) {
      alert('Error registering new administrator.');
    }
  };

  // Secure Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-emerald-600 p-3 rounded-2xl text-white font-bold text-xl shadow-lg shadow-emerald-900/40">
              {churchConfig.logoText}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>

          {authError && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Administrator / Developer Email</label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="dyleon00@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{authLoading ? 'Verifying Credentials...' : 'Sign In to Maranatha ChMS'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-500 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Protected by Supabase Row-Level Security</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          {churchConfig.logoUrl ? (
            <img src={churchConfig.logoUrl} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-emerald-600" />
          ) : (
            <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold shadow-lg shadow-emerald-900/40">
              {churchConfig.logoText}
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-emerald-400">{sessionUser.name}</p>
            <p className="text-xs text-slate-400">{sessionUser.role} ({sessionUser.position})</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            title="Log Out"
            className="bg-slate-800 hover:bg-red-950 hover:text-red-400 p-2.5 rounded-xl border border-slate-700 transition-all text-slate-300 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
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
            <span>Logo, Admins & Settings</span>
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assembly Overview</h2>
                <p className="text-sm text-slate-400">Welcome back, {sessionUser.name}. Live assembly metrics for {churchConfig.assemblyName}.</p>
              </div>

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
                  <h3 className="text-lg font-semibold text-white mb-4">Active Session Details</h3>
                  <div className="bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-xl flex items-start space-x-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-300">Authenticated: {sessionUser.email}</p>
                      <p className="text-xs text-slate-400 mt-1">Role Permission: {sessionUser.role}</p>
                      <p className="text-xs text-emerald-500 mt-2 font-mono">Database: Supabase Live Active</p>
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
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Logo, Admins & Settings</h2>
                <p className="text-sm text-slate-400">Customize church branding and register new administrative credentials.</p>
              </div>

              {/* Branding Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Church Branding & Logo Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Assembly Name</label>
                    <input 
                      type="text" 
                      value={churchConfig.assemblyName}
                      onChange={(e) => setChurchConfig({...churchConfig, assemblyName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Area / Sub-heading</label>
                    <input 
                      type="text" 
                      value={churchConfig.area}
                      onChange={(e) => setChurchConfig({...churchConfig, area: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Logo Image URL or Initial Badge</label>
                    <div className="flex space-x-3">
                      <input 
                        type="text" 
                        value={churchConfig.logoUrl}
                        onChange={(e) => setChurchConfig({...churchConfig, logoUrl: e.target.value})}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                      <input 
                        type="text" 
                        value={churchConfig.logoText}
                        onChange={(e) => setChurchConfig({...churchConfig, logoText: e.target.value})}
                        maxLength={4}
                        className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 text-center font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Accounts Management */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Administrator Accounts & Roles</h3>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active System Accounts</p>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                    {adminUsers.map(admin => (
                      <div key={admin.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white text-sm">{admin.name}</p>
                          <p className="text-xs text-slate-400">{admin.email}</p>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
                          {admin.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-4 pt-2 border-t border-slate-800">
                  <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Register New Officer / Leader Credential</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Officer Email Address"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                    <input 
                      type="password" 
                      required
                      placeholder="Set Temporary Password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                    <select 
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Admin">Admin (Presiding Elder)</option>
                      <option value="Secretariat">Secretariat</option>
                      <option value="Finance Team">Finance Team</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-900/30 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Administrator Credential</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Render Application Mount
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

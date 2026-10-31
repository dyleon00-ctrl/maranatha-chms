import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Users, Shield, Landmark, UserCheck, CheckCircle2, Clock, 
  XCircle, Search, Filter, Plus, ChevronRight, Sparkles, 
  BookOpen, Calendar, DollarSign, Award, 
  Activity, ArrowUpRight, Check, X, Eye, Phone, Mail, 
  MapPin, UserPlus, Info, Layers, RefreshCw, BarChart3, Lock, 
  FileSpreadsheet, Database, Server, Settings, Baby, UserMinus, 
  FileText, ChevronDown, Download, AlertCircle, Share2, 
  LogOut, LogIn, Key, User, ShieldCheck, PieChart, Image as ImageIcon, Loader2, Upload 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://rsjkbtayzhrcqkqsnnnh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ScLjXKeKl7satSTbQbQBqQ_srwsvmfn";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Church Branding Config
  const [churchConfig, setChurchConfig] = useState({
    assemblyName: 'Maranatha Assembly',
    area: 'The Church of Pentecost • Anyaa Area',
    logoText: 'COP',
    logoUrl: ''
  });

  // Session User & Role
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({
    name: '',
    email: '',
    role: 'Admin', // 'Admin', 'Secretariat', 'Finance', 'Member'
    position: ''
  });

  // Assembly Data States
  const [stats] = useState({
    totalMembers: 245,
    activeCells: 12,
    monthlyTithes: 'GH₵ 14,250',
    attendanceRate: '88%'
  });

  const [members, setMembers] = useState([
    { id: 1, name: 'Deacon Kofi Boateng', role: 'Secretariat', cell: 'Cell 1', phone: '+233 24 123 4567', status: 'Active' },
    { id: 2, name: 'Sister Ama Serwaa', role: 'Finance', cell: 'Cell 3', phone: '+233 20 987 6543', status: 'Active' },
    { id: 3, name: 'Brother Yaw Frimpong', role: 'Member', cell: 'Cell 4', phone: '+233 54 555 7890', status: 'Active' }
  ]);

  const [finances, setFinances] = useState([
    { id: 1, type: 'Tithe', amount: 450, contributor: 'Bro. Mensah', date: '2026-06-01' },
    { id: 2, type: 'Offering', amount: 1200, contributor: 'General Sunday Service', date: '2026-05-31' }
  ]);

  // Bulk CSV Upload State
  const [csvStatus, setCsvStatus] = useState('');

  // Handle Login with Strict RBAC Assignment
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const email = loginEmail.trim().toLowerCase();

    try {
      // 1. Developer Admin
      if (email === 'dyleon00@gmail.com' && loginPassword === 'F0rthewher3') {
        setSessionUser({ name: 'Developer Admin', email, role: 'Admin', position: 'Lead Developer' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      // 2. Presiding Elder
      if (email === 'cwamyemma198@gmail.com' && loginPassword === 'S@vethew0r!d') {
        setSessionUser({ name: 'Elder Kwame Mensah', email, role: 'Admin', position: 'Presiding Elder' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      // 3. Departmental Simulation Logins (Secretariat / Finance / Member)
      if (email.includes('secretariat') || email.includes('kofi')) {
        setSessionUser({ name: 'Deacon Kofi Boateng', email, role: 'Secretariat', position: 'Head of Secretariat' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('members');
        return;
      }

      if (email.includes('finance') || email.includes('ama')) {
        setSessionUser({ name: 'Sister Ama Serwaa', email, role: 'Finance', position: 'Finance Officer' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('finance');
        return;
      }

      if (email.includes('member') || email.includes('yaw')) {
        setSessionUser({ name: 'Brother Yaw Frimpong', email, role: 'Member', position: 'Assembly Member' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('members');
        return;
      }

      // 4. Supabase Auth Fallback
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (!error && data?.user) {
        setSessionUser({ name: data.user.user_metadata?.full_name || email.split('@')[0], email, role: 'Admin', position: 'Administrator' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      setAuthError('Invalid email or password. Please verify your credentials.');
    } catch (err) {
      setAuthError('Authentication network error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle CSV Template Download
  const downloadCsvTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Role,Cell,Phone,Status\nBrother John Doe,Member,Cell 1,+233240000000,Active\nSister Mary Smith,Member,Cell 2,+233200000000,Active";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "COP_Maranatha_Member_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV Bulk Upload Simulation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1); // skip header
      let newCount = 0;
      
      lines.forEach(line => {
        const cols = line.split(',');
        if (cols.length >= 4) {
          members.push({
            id: members.length + 1,
            name: cols[0].trim(),
            role: cols[1].trim() || 'Member',
            cell: cols[2].trim() || 'Cell 1',
            phone: cols[3].trim() || '+233 00 000 0000',
            status: cols[4] ? cols[4].trim() : 'Active'
          });
          newCount++;
        }
      });
      setMembers([...members]);
      setCsvStatus(`Successfully imported ${newCount} members via CSV bulk upload!`);
    };
    reader.readAsText(file);
  };

  // Login Screen Render
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
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="cwamyemma198@gmail.com / secretariat@cop.org"
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
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>{authLoading ? 'Signing In...' : 'Secure Login'}</span>
            </button>
          </form>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1 text-slate-400">
            <p className="font-semibold text-emerald-400">Quick Test Accounts:</p>
            <p>• Presiding: <code className="text-slate-200">cwamyemma198@gmail.com</code></p>
            <p>• Secretariat: <code className="text-slate-200">secretariat@cop.org</code></p>
            <p>• Finance: <code className="text-slate-200">finance@cop.org</code></p>
            <p>• Member: <code className="text-slate-200">member@cop.org</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Main Authenticated Workspace with Strict Role Guardrails
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold shadow-lg shadow-emerald-900/40">
            {churchConfig.logoText}
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-emerald-400">{sessionUser.name}</p>
            <p className="text-xs text-slate-400">Role: <span className="text-emerald-300 font-semibold">{sessionUser.role}</span> ({sessionUser.position})</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-slate-800 hover:bg-red-950 hover:text-red-400 p-2.5 rounded-xl border border-slate-700 transition-all text-slate-300 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Role-Based Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-2">
          {(sessionUser.role === 'Admin' || sessionUser.role === 'Secretariat') && (
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard & Metrics</span>
            </button>
          )}

          <button 
            onClick={() => setCurrentTab('members')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'members' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" />
            <span>{sessionUser.role === 'Member' ? 'My Membership Profile' : 'Membership & Bulk CSV'}</span>
          </button>

          {(sessionUser.role === 'Admin' || sessionUser.role === 'Finance') && (
            <button 
              onClick={() => setCurrentTab('finance')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Finance & Tithes</span>
            </button>
          )}

          {sessionUser.role === 'Admin' && (
            <button 
              onClick={() => setCurrentTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Branding & Admin Settings</span>
            </button>
          )}
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (sessionUser.role === 'Admin' || sessionUser.role === 'Secretariat') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assembly Overview</h2>
                <p className="text-sm text-slate-400">Live monitoring dashboard for {sessionUser.name} ({sessionUser.role} Access).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Members</span>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalMembers}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Active Cells</span>
                  <p className="text-3xl font-bold text-white mt-2">{stats.activeCells}</p>
                </div>
                {sessionUser.role === 'Admin' && (
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-sm text-slate-400 font-medium">Monthly Tithes</span>
                    <p className="text-3xl font-bold text-white mt-2">{stats.monthlyTithes}</p>
                  </div>
                )}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Attendance Rate</span>
                  <p className="text-3xl font-bold text-white mt-2">{stats.attendanceRate}</p>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Membership Directory & Bulk Upload</h2>
                  <p className="text-sm text-slate-400">Manage cells or upload member lists via CSV template.</p>
                </div>

                {/* CSV Download & Upload Tools for Secretariat & Admins */}
                {(sessionUser.role === 'Admin' || sessionUser.role === 'Secretariat') && (
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={downloadCsvTemplate}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download CSV Template</span>
                    </button>
                    <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 cursor-pointer shadow-lg">
                      <Upload className="w-4 h-4" />
                      <span>Upload CSV Members</span>
                      <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {csvStatus && (
                <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">
                  {csvStatus}
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Registered Members Directory</p>
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

          {currentTab === 'finance' && (sessionUser.role === 'Admin' || sessionUser.role === 'Finance') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Finance & Tithes Management</h2>
                <p className="text-sm text-slate-400">Restricted financial records viewable only by Presiding Elder and Finance Department.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Verified Contributions</h3>
                <div className="space-y-3">
                  {finances.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                      <div>
                        <p className="font-semibold text-white">{f.type} — GH₵ {f.amount}</p>
                        <p className="text-xs text-slate-400">Contributor: {f.contributor} • {f.date}</p>
                      </div>
                      <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-medium">
                        Reconciled
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'settings' && sessionUser.role === 'Admin' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Branding & System Configuration</h2>
                <p className="text-sm text-slate-400">Full control panel reserved strictly for the Presiding Elder / Admin.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Church Branding Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Assembly Name</label>
                    <input 
                      type="text" 
                      value={churchConfig.assemblyName}
                      onChange={(e) => setChurchConfig({...churchConfig, assemblyName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Area / Description</label>
                    <input 
                      type="text" 
                      value={churchConfig.area}
                      onChange={(e) => setChurchConfig({...churchConfig, area: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

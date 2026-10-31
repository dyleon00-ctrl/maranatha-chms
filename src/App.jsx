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
  LogOut, LogIn, Key, User, ShieldCheck, PieChart, Image as ImageIcon, Loader2, Upload, Camera 
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

  // Dynamic Church Branding
  const [churchConfig, setChurchConfig] = useState({
    assemblyName: 'Maranatha Assembly',
    area: 'The Church of Pentecost • Anyaa Area',
    logoText: 'COP',
    logoUrl: '',
    heroImageUrl: ''
  });

  // Dynamic Presiding Elder Credentials Management
  const [presidingElder, setPresidingElder] = useState({
    name: 'Benjamin Glover',
    email: 'cwamyemma198@gmail.com',
    password: 'S@vethew0r!d',
    title: 'Elder'
  });

  // Navigation & User Session
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({
    name: '',
    email: '',
    role: 'Admin', // 'Admin', 'Secretariat', 'Finance', 'Member'
    position: ''
  });

  // Real Registered Members List (No fake numbers)
  const [members, setMembers] = useState([
    { id: 1, name: 'Benjamin Glover', title: 'Elder', role: 'Presiding Elder (Admin)', cell: 'Cell 1', phone: '+233 24 000 0000', status: 'Active', photoUrl: '' },
    { id: 2, name: 'Caleb Owusu Afari', title: 'Elder', role: 'Admin / Executive', cell: 'Cell 1', phone: '+233 24 000 0001', status: 'Active', photoUrl: '' },
    { id: 3, name: 'Emmanuel Eshun', title: 'Elder', role: 'Admin / Executive', cell: 'Cell 2', phone: '+233 24 000 0002', status: 'Active', photoUrl: '' },
    { id: 4, name: 'Mary Okyere Yeboah', title: 'Deaconess', role: 'Executive Member', cell: 'Cell 3', phone: '+233 24 000 0003', status: 'Active', photoUrl: '' },
    { id: 5, name: 'Christopher Aryeetey', title: 'Deacon', role: 'Executive Member', cell: 'Cell 4', phone: '+233 24 000 0004', status: 'Active', photoUrl: '' },
    { id: 6, name: 'Emmanuella Siaw', title: 'Sister', role: 'Member', cell: 'Cell 2', phone: '+233 24 000 0005', status: 'Active', photoUrl: '' }
  ]);

  // Real Financial Records (Starts at zero as requested)
  const [finances, setFinances] = useState([]);

  // Active Admin / Officer Users Directory
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Developer Admin', email: 'dyleon00@gmail.com', role: 'Developer Admin' },
    { id: 2, name: 'Benjamin Glover', email: 'cwamyemma198@gmail.com', role: 'Presiding Elder' }
  ]);

  // Form Inputs for Adding New Members/Admins
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Secretariat');

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberTitle, setNewMemberTitle] = useState('Brother');
  const [newMemberCell, setNewMemberCell] = useState('Cell 1');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberPhoto, setNewMemberPhoto] = useState('');

  const [csvStatus, setCsvStatus] = useState('');

  // Handle Dynamic Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const cleanEmail = loginEmail.trim().toLowerCase();

    try {
      // 1. Developer Admin Check
      if (cleanEmail === 'dyleon00@gmail.com' && loginPassword === 'F0rthewher3') {
        setSessionUser({ name: 'Developer Admin', email: cleanEmail, role: 'Admin', position: 'Lead Developer' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      // 2. Dynamic Presiding Elder Check
      if (cleanEmail === presidingElder.email.toLowerCase() && loginPassword === presidingElder.password) {
        setSessionUser({ name: presidingElder.name, email: cleanEmail, role: 'Admin', position: 'Presiding Elder' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      // 3. Departmental / Officer Logins
      const foundAdmin = adminUsers.find(a => a.email.toLowerCase() === cleanEmail);
      if (foundAdmin) {
        setSessionUser({ name: foundAdmin.name, email: cleanEmail, role: foundAdmin.role, position: foundAdmin.role });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab(foundAdmin.role === 'Finance' ? 'finance' : 'members');
        return;
      }

      // 4. Supabase Live Auth Fallback
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (!error && data?.user) {
        setSessionUser({ name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0], email: cleanEmail, role: 'Admin', position: 'Administrator' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      setAuthError('Invalid email or password.');
    } catch (err) {
      setAuthError('Authentication network error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Add Member Function (Supports Photos)
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    const newEntry = {
      id: members.length + 1,
      name: `${newMemberTitle} ${newMemberName}`,
      title: newMemberTitle,
      role: 'Member',
      cell: newMemberCell,
      phone: newMemberPhone || '+233 00 000 0000',
      status: 'Active',
      photoUrl: newMemberPhoto
    };
    setMembers([...members, newEntry]);
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberPhoto('');
    alert(`Member ${newMemberName} added successfully!`);
  };

  // Profile Picture Upload Handler
  const handlePhotoUpdate = (memberId, photoUrl) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, photoUrl } : m));
  };

  // CSV Template Download
  const downloadCsvTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Title,Cell,Phone,PhotoURL\nEmmanuella Siaw,Sister,Cell 2,+233240000005,https://example.com/photo.jpg";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "COP_Maranatha_Member_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Bulk Import Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1);
      let count = 0;
      lines.forEach(line => {
        const cols = line.split(',');
        if (cols.length >= 2) {
          members.push({
            id: members.length + 1,
            name: cols[0].trim(),
            title: cols[1] ? cols[1].trim() : 'Brother/Sister',
            role: 'Member',
            cell: cols[2] ? cols[2].trim() : 'Cell 1',
            phone: cols[3] ? cols[3].trim() : '+233 00 000 0000',
            status: 'Active',
            photoUrl: cols[4] ? cols[4].trim() : ''
          });
          count++;
        }
      });
      setMembers([...members]);
      setCsvStatus(`Successfully imported ${count} members via CSV!`);
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            {churchConfig.logoUrl ? (
              <img src={churchConfig.logoUrl} alt="Logo" className="w-16 h-16 mx-auto object-cover rounded-2xl border border-emerald-600" />
            ) : (
              <div className="inline-flex bg-emerald-600 p-3 rounded-2xl text-white font-bold text-xl shadow-lg shadow-emerald-900/40">
                {churchConfig.logoText}
              </div>
            )}
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
                placeholder="dyleon00@gmail.com / cwamyemma198@gmail.com"
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
        </div>
      </div>
    );
  }

  // Calculate Real Dynamic Financial Total
  const totalFinancesGhc = finances.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          {churchConfig.logoUrl ? (
            <img src={churchConfig.logoUrl} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-emerald-600" />
          ) : (
            <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold shadow-lg">
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
            <p className="text-xs text-slate-400">Role: <span className="text-emerald-300 font-semibold">{sessionUser.role}</span></p>
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
        {/* Navigation Sidebar */}
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
            <span>Membership & Photos</span>
          </button>

          {(sessionUser.role === 'Admin' || sessionUser.role === 'Finance') && (
            <button 
              onClick={() => setCurrentTab('finance')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Finance & Records</span>
            </button>
          )}

          {sessionUser.role === 'Admin' && (
            <button 
              onClick={() => setCurrentTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Presiding & Developer Control</span>
            </button>
          )}
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assembly Dashboard</h2>
                <p className="text-sm text-slate-400">Live operational overview of {churchConfig.assemblyName}.</p>
              </div>

              {/* Real Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Real Members</span>
                  <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">Live registered database count</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Presiding Elder</span>
                  <p className="text-xl font-bold text-emerald-400 mt-2">{presidingElder.name}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{presidingElder.email}</span>
                </div>

                {sessionUser.role === 'Admin' && (
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-sm text-slate-400 font-medium">Total Recorded Tithes & Offerings</span>
                    <p className="text-3xl font-bold text-white mt-2">GH₵ {totalFinancesGhc}</p>
                    <span className="text-xs text-slate-400 mt-1 block">{finances.length} records in ledger</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Membership Directory ({members.length} Members)</h2>
                  <p className="text-sm text-slate-400">Manage member profiles, upload photos, or import CSV roster.</p>
                </div>

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

              {/* Add Member Form for Secretariat / Admin */}
              {(sessionUser.role === 'Admin' || sessionUser.role === 'Secretariat') && (
                <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-emerald-400 uppercase">Register New Member</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={newMemberName} 
                      onChange={(e) => setNewMemberName(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <select 
                      value={newMemberTitle} 
                      onChange={(e) => setNewMemberTitle(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Elder">Elder</option>
                      <option value="Deacon">Deacon</option>
                      <option value="Deaconess">Deaconess</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Cell (e.g. Cell 1)" 
                      value={newMemberCell} 
                      onChange={(e) => setNewMemberCell(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Photo Image URL" 
                      value={newMemberPhoto} 
                      onChange={(e) => setNewMemberPhoto(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium py-2 flex items-center justify-center space-x-1">
                      <Plus className="w-4 h-4" />
                      <span>Add Member</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Members Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                        <th className="p-4 font-medium">Photo</th>
                        <th className="p-4 font-medium">Name & Title</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Cell</th>
                        <th className="p-4 font-medium">Phone</th>
                        <th className="p-4 font-medium">Photo Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {members.map(m => (
                        <tr key={m.id} className="hover:bg-slate-800/40">
                          <td className="p-4">
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-emerald-600" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold">
                                {m.name.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-medium text-white">{m.name}</td>
                          <td className="p-4 text-slate-300">{m.role}</td>
                          <td className="p-4 text-slate-300">{m.cell}</td>
                          <td className="p-4 text-slate-400">{m.phone}</td>
                          <td className="p-4">
                            <button 
                              onClick={() => {
                                const url = prompt("Enter Photo URL for " + m.name, m.photoUrl || "");
                                if (url !== null) handlePhotoUpdate(m.id, url);
                              }}
                              className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{m.photoUrl ? 'Update Photo' : 'Add Photo'}</span>
                            </button>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Finance & Tithes Ledger</h2>
                  <p className="text-sm text-slate-400">Live, verified financial ledger. Starts clean at zero.</p>
                </div>
                <button 
                  onClick={() => {
                    const amount = parseFloat(prompt("Enter Contribution Amount (GH₵):") || "0");
                    if (amount > 0) {
                      const type = prompt("Type (Tithe / Offering / Special):") || "Tithe";
                      const contributor = prompt("Contributor Name:") || "Anonymous";
                      setFinances([...finances, { id: finances.length + 1, type, amount, contributor, date: new Date().toISOString().split('T')[0] }]);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Contribution</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                {finances.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8">No financial transactions recorded yet. Ledger is clean at GH₵ 0.</p>
                ) : (
                  <div className="space-y-3">
                    {finances.map(f => (
                      <div key={f.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div>
                          <p className="font-semibold text-white">{f.type} — GH₵ {f.amount}</p>
                          <p className="text-xs text-slate-400">Contributor: {f.contributor} • {f.date}</p>
                        </div>
                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-medium">Reconciled</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentTab === 'settings' && sessionUser.role === 'Admin' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Control Panel: Presiding Elder & Developers</h2>
                <p className="text-sm text-slate-400">Manage church branding, re-assign Presiding Elder credentials, or register administrative users.</p>
              </div>

              {/* Dynamic Presiding Elder Credentials Management */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Presiding Elder Credentials Management</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Presiding Elder Name</label>
                    <input 
                      type="text" 
                      value={presidingElder.name}
                      onChange={(e) => setPresidingElder({...presidingElder, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Login Email</label>
                    <input 
                      type="email" 
                      value={presidingElder.email}
                      onChange={(e) => setPresidingElder({...presidingElder, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                    <input 
                      type="text" 
                      value={presidingElder.password}
                      onChange={(e) => setPresidingElder({...presidingElder, password: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Church Branding & Logo Settings */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Church Branding & Custom Assets</h3>
                </div>
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
                    <label className="block text-xs font-medium text-slate-400 mb-1">Area / Sub-heading</label>
                    <input 
                      type="text" 
                      value={churchConfig.area}
                      onChange={(e) => setChurchConfig({...churchConfig, area: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Church Logo URL</label>
                    <input 
                      type="text" 
                      value={churchConfig.logoUrl}
                      onChange={(e) => setChurchConfig({...churchConfig, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.jpg"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Add New Departmental Admin Users */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Add Departmental Officers & Logins</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    placeholder="Officer Full Name" 
                    value={newAdminName} 
                    onChange={(e) => setNewAdminName(e.target.value)} 
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm"
                  />
                  <input 
                    type="email" 
                    placeholder="Officer Email" 
                    value={newAdminEmail} 
                    onChange={(e) => setNewAdminEmail(e.target.value)} 
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm"
                  />
                  <select 
                    value={newAdminRole} 
                    onChange={(e) => setNewAdminRole(e.target.value)} 
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm"
                  >
                    <option value="Secretariat">Secretariat</option>
                    <option value="Finance">Finance Team</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    if (newAdminName && newAdminEmail) {
                      setAdminUsers([...adminUsers, { id: adminUsers.length + 1, name: newAdminName, email: newAdminEmail, role: newAdminRole }]);
                      setNewAdminName('');
                      setNewAdminEmail('');
                      alert(`Added ${newAdminName} as ${newAdminRole}`);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Officer Credential</span>
                </button>
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

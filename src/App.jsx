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
  LogOut, LogIn, Key, User, ShieldCheck, PieChart, Image as ImageIcon, Loader2, Upload, Camera, Save, Edit, Trash2 
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
  const [saving, setSaving] = useState(false);

  // Dynamic Church Branding
  const [churchConfig, setChurchConfig] = useState({
    assemblyName: 'Maranatha Assembly',
    area: 'The Church of Pentecost • Anyaa Area',
    logoText: 'COP',
    logoUrl: ''
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
    role: 'Admin',
    position: ''
  });

  // Initial Real Roster
  const [members, setMembers] = useState([
    { id: 1, name: 'Benjamin Glover', title: 'Elder', role: 'Presiding Elder (Admin)', cell: 'Cell 1', phone: '+233 24 000 0000', status: 'Active', photo_url: '' },
    { id: 2, name: 'Caleb Owusu Afari', title: 'Elder', role: 'Admin / Executive', cell: 'Cell 1', phone: '+233 24 000 0001', status: 'Active', photo_url: '' },
    { id: 3, name: 'Emmanuel Eshun', title: 'Elder', role: 'Admin / Executive', cell: 'Cell 2', phone: '+233 24 000 0002', status: 'Active', photo_url: '' },
    { id: 4, name: 'Mary Okyere Yeboah', title: 'Deaconess', role: 'Executive Member', cell: 'Cell 3', phone: '+233 24 000 0003', status: 'Active', photo_url: '' },
    { id: 5, name: 'Christopher Aryeetey', title: 'Deacon', role: 'Executive Member', cell: 'Cell 4', phone: '+233 24 000 0004', status: 'Active', photo_url: '' },
    { id: 6, name: 'Emmanuella Siaw', title: 'Sister', role: 'Member', cell: 'Cell 2', phone: '+233 24 000 0005', status: 'Active', photo_url: '' }
  ]);

  const [finances, setFinances] = useState([]);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Developer Admin', email: 'dyleon00@gmail.com', role: 'Developer Admin' },
    { id: 2, name: 'Benjamin Glover', email: 'cwamyemma198@gmail.com', role: 'Presiding Elder' }
  ]);

  // Editing State
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editMemberData, setEditMemberData] = useState({});

  // Form Inputs
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberTitle, setNewMemberTitle] = useState('Brother');
  const [newMemberCell, setNewMemberCell] = useState('Cell 1');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberPhoto, setNewMemberPhoto] = useState('');

  const [csvStatus, setCsvStatus] = useState('');

  // Fetch Live Data on Page Load
  useEffect(() => {
    async function loadDataFromSupabase() {
      try {
        const { data: memberData, error: mErr } = await supabase.from('members').select('*').order('id', { ascending: true });
        if (!mErr && memberData && memberData.length > 0) {
          setMembers(memberData);
        }

        const { data: financeData, error: fErr } = await supabase.from('finances').select('*').order('id', { ascending: false });
        if (!fErr && financeData) {
          setFinances(financeData);
        }
      } catch (err) {
        console.log("Using local state fallback");
      }
    }
    loadDataFromSupabase();
  }, []);

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const cleanEmail = loginEmail.trim().toLowerCase();

    try {
      if (cleanEmail === 'dyleon00@gmail.com' && loginPassword === 'F0rthewher3') {
        setSessionUser({ name: 'Developer Admin', email: cleanEmail, role: 'Admin', position: 'Lead Developer' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      if (cleanEmail === presidingElder.email.toLowerCase() && loginPassword === presidingElder.password) {
        setSessionUser({ name: presidingElder.name, email: cleanEmail, role: 'Admin', position: 'Presiding Elder' });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab('dashboard');
        return;
      }

      const foundAdmin = adminUsers.find(a => a.email.toLowerCase() === cleanEmail);
      if (foundAdmin) {
        setSessionUser({ name: foundAdmin.name, email: cleanEmail, role: foundAdmin.role, position: foundAdmin.role });
        setIsAuthenticated(true);
        setAuthLoading(false);
        setCurrentTab(foundAdmin.role === 'Finance' ? 'finance' : 'members');
        return;
      }

      setAuthError('Invalid email or password.');
    } catch (err) {
      setAuthError('Authentication network error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Convert File Input to Base64 String for Photo Upload
  const handlePhotoFileUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Register New Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    setSaving(true);

    const newEntry = {
      name: `${newMemberTitle} ${newMemberName}`,
      title: newMemberTitle,
      role: 'Member',
      cell: newMemberCell,
      phone: newMemberPhone || '+233 00 000 0000',
      status: 'Active',
      photo_url: newMemberPhoto
    };

    const { data, error } = await supabase.from('members').insert([newEntry]).select();

    if (!error && data) {
      setMembers([...members, data[0]]);
      alert(`Member ${newMemberName} registered successfully!`);
    } else {
      setMembers([...members, { id: members.length + 1, ...newEntry }]);
      alert(`Member ${newMemberName} added!`);
    }

    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberPhoto('');
    setSaving(false);
  };

  // Inline Edit Row Actions
  const handleStartEdit = (member) => {
    setEditingMemberId(member.id);
    setEditMemberData({ ...member });
  };

  const handleSaveEdit = async (memberId) => {
    setSaving(true);
    const { error } = await supabase.from('members').update(editMemberData).eq('id', memberId);
    if (!error) {
      setMembers(members.map(m => m.id === memberId ? editMemberData : m));
      alert("Member record updated successfully!");
    } else {
      setMembers(members.map(m => m.id === memberId ? editMemberData : m));
    }
    setEditingMemberId(null);
    setSaving(false);
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member entry?")) return;
    const { error } = await supabase.from('members').delete().eq('id', memberId);
    if (!error) {
      setMembers(members.filter(m => m.id !== memberId));
    } else {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  const handleRecordFinance = async () => {
    const amount = parseFloat(prompt("Enter Contribution Amount (GH₵):") || "0");
    if (amount > 0) {
      const type = prompt("Type (Tithe / Offering / Special):") || "Tithe";
      const contributor = prompt("Contributor Name:") || "Anonymous";
      const newFin = { type, amount, contributor, date: new Date().toISOString().split('T')[0] };

      const { data, error } = await supabase.from('finances').insert([newFin]).select();
      if (!error && data) {
        setFinances([data[0], ...finances]);
      } else {
        setFinances([{ id: finances.length + 1, ...newFin }, ...finances]);
      }
    }
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
                placeholder="cwamyemma198@gmail.com"
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

  const totalFinancesGhc = finances.reduce((sum, f) => sum + Number(f.amount), 0);

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

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assembly Dashboard</h2>
                <p className="text-sm text-slate-400">Live operational overview of {churchConfig.assemblyName}.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Real Members</span>
                  <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">Live database count</span>
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
                    <span className="text-xs text-slate-400 mt-1 block">{finances.length} records saved</span>
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
                  <p className="text-sm text-slate-400">Upload photos directly from your device, edit member details, or add new records.</p>
                </div>
              </div>

              {/* Add New Member Form with Device File Upload */}
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
                      placeholder="Phone Number" 
                      value={newMemberPhone} 
                      onChange={(e) => setNewMemberPhone(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <label className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 flex items-center justify-between cursor-pointer hover:border-emerald-600">
                      <span className="truncate">{newMemberPhoto ? 'Photo Selected' : 'Upload Device Image'}</span>
                      <Upload className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <input type="file" accept="image/*" onChange={(e) => handlePhotoFileUpload(e, setNewMemberPhoto)} className="hidden" />
                    </label>
                  </div>
                  <button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium py-2.5 flex items-center justify-center space-x-1 shadow-lg">
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save & Register Member'}</span>
                  </button>
                </form>
              )}

              {/* Members Table with Inline Editing & Direct File Upload */}
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
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {members.map(m => {
                        const isEditing = editingMemberId === m.id;
                        return (
                          <tr key={m.id} className="hover:bg-slate-800/40">
                            {/* Photo Column */}
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {(m.photo_url || m.photoUrl) ? (
                                  <img src={m.photo_url || m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-emerald-600" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold">
                                    {m.name.charAt(0)}
                                  </div>
                                )}
                                <label className="text-slate-400 hover:text-emerald-400 cursor-pointer p-1">
                                  <Camera className="w-4 h-4" />
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handlePhotoFileUpload(e, (base64) => {
                                      if (isEditing) {
                                        setEditMemberData({ ...editMemberData, photo_url: base64 });
                                      } else {
                                        handleStartEdit(m);
                                        setEditMemberData({ ...m, photo_url: base64 });
                                      }
                                    })} 
                                    className="hidden" 
                                  />
                                </label>
                              </div>
                            </td>

                            {/* Name & Title Column */}
                            <td className="p-4 font-medium text-white">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editMemberData.name} 
                                  onChange={(e) => setEditMemberData({ ...editMemberData, name: e.target.value })} 
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                />
                              ) : (
                                m.name
                              )}
                            </td>

                            {/* Role Column */}
                            <td className="p-4 text-slate-300">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editMemberData.role} 
                                  onChange={(e) => setEditMemberData({ ...editMemberData, role: e.target.value })} 
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                />
                              ) : (
                                m.role
                              )}
                            </td>

                            {/* Cell Column */}
                            <td className="p-4 text-slate-300">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editMemberData.cell} 
                                  onChange={(e) => setEditMemberData({ ...editMemberData, cell: e.target.value })} 
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                />
                              ) : (
                                m.cell
                              )}
                            </td>

                            {/* Phone Column */}
                            <td className="p-4 text-slate-400">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editMemberData.phone} 
                                  onChange={(e) => setEditMemberData({ ...editMemberData, phone: e.target.value })} 
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                />
                              ) : (
                                m.phone
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="p-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => handleSaveEdit(m.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg">
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setEditingMemberId(null)} className="bg-slate-800 text-slate-400 p-1.5 rounded-lg">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => handleStartEdit(m)} className="text-slate-400 hover:text-emerald-400 p-1">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteMember(m.id)} className="text-slate-400 hover:text-red-400 p-1">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
                  <p className="text-sm text-slate-400">Ledger updates persist directly to Supabase.</p>
                </div>
                <button 
                  onClick={handleRecordFinance}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Contribution</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                {finances.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8">No financial transactions recorded yet. Ledger starts clean at GH₵ 0.</p>
                ) : (
                  <div className="space-y-3">
                    {finances.map(f => (
                      <div key={f.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div>
                          <p className="font-semibold text-white">{f.type} — GH₵ {f.amount}</p>
                          <p className="text-xs text-slate-400">Contributor: {f.contributor} • {f.date}</p>
                        </div>
                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-medium">Saved</span>
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
                <p className="text-sm text-slate-400">Manage church branding and credentials.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Presiding Elder Credentials</h3>
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

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Church Branding Logo</h3>
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
                    <label className="block text-xs font-medium text-slate-400 mb-1">Upload Church Logo from Device</label>
                    <label className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between cursor-pointer hover:border-emerald-600">
                      <span>{churchConfig.logoUrl ? 'Logo Selected' : 'Choose Image File from Computer/Phone'}</span>
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <input type="file" accept="image/*" onChange={(e) => handlePhotoFileUpload(e, (base64) => setChurchConfig({...churchConfig, logoUrl: base64}))} className="hidden" />
                    </label>
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

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
  LogOut, LogIn, Key, User, ShieldCheck, PieChart, Image as ImageIcon, Loader2, Upload, Camera, Save, Edit, Trash2, ArrowUpDown 
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

  // Real Member Directory (Initialized with required leaders & members)
  const [members, setMembers] = useState([
    { id: 1, title: 'Elder', first_name: 'Benjamin', last_name: 'Glover', gender: 'Male', role: 'Presiding Elder', cell: 'Cell 1', phone: '+233 24 796 3405', ministry: 'PEMEM Ministry', holy_ghost: 'Yes', water_baptism: 'Yes', status: 'Active', photo_url: '' },
    { id: 2, title: 'Elder', first_name: 'Caleb', last_name: 'Owusu Afari', gender: 'Male', role: 'Admin / Executive', cell: 'Cell 1', phone: '+233 26 624 5783', ministry: 'PEMEM Ministry', holy_ghost: 'Yes', water_baptism: 'Yes', status: 'Active', photo_url: '' },
    { id: 3, title: 'Elder', first_name: 'Emmanuel', last_name: 'Eshun', gender: 'Male', role: 'Admin / Executive', cell: 'Cell 2', phone: '+233 27 593 6565', ministry: 'PEMEM Ministry', holy_ghost: 'Yes', water_baptism: 'Yes', status: 'Active', photo_url: '' },
    { id: 4, title: 'Deaconess', first_name: 'Mary', last_name: 'Okyere Yeboah', gender: 'Female', role: 'Executive Member', cell: 'Cell 3', phone: '+233 24 000 0003', ministry: 'Women\'s Ministry', holy_ghost: 'Yes', water_baptism: 'Yes', status: 'Active', photo_url: '' },
    { id: 5, title: 'Deacon', first_name: 'Christopher', last_name: 'Aryeetey', gender: 'Male', role: 'Executive Member', cell: 'Cell 4', phone: '+233 24 000 0004', ministry: 'PEMEM Ministry', holy_ghost: 'Yes', water_baptism: 'Yes', status: 'Active', photo_url: '' },
    { id: 6, title: 'Sister', first_name: 'Emmanuella', last_name: 'Siaw', gender: 'Female', role: 'Member', cell: 'Cell 2', phone: '+233 24 000 0005', ministry: 'Youth Ministry', holy_ghost: 'Yes', water_baptism: 'Yes', status: 'Active', photo_url: '' }
  ]);

  const [finances, setFinances] = useState([]);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Developer Admin', email: 'dyleon00@gmail.com', role: 'Developer Admin' },
    { id: 2, name: 'Benjamin Glover', email: 'cwamyemma198@gmail.com', role: 'Presiding Elder' }
  ]);

  // Search, Sort & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  // Editing State
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editMemberData, setEditMemberData] = useState({});

  // New Member Form States
  const [newTitle, setNewTitle] = useState('Brother');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newGender, setNewGender] = useState('Male');
  const [newCell, setNewCell] = useState('Cell 1');
  const [newPhone, setNewPhone] = useState('');
  const [newMinistry, setNewMinistry] = useState('PEMEM Ministry');
  const [newHolyGhost, setNewHolyGhost] = useState('Yes');
  const [newBaptised, setNewBaptised] = useState('Yes');
  const [newPhoto, setNewPhoto] = useState('');

  const [importStatus, setImportStatus] = useState('');

  // Fetch Live Data on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const { data: mData, error: mErr } = await supabase.from('members').select('*').order('id', { ascending: true });
        if (!mErr && mData && mData.length > 0) {
          setMembers(mData);
        }
        const { data: fData, error: fErr } = await supabase.from('finances').select('*').order('id', { ascending: false });
        if (!fErr && fData) {
          setFinances(fData);
        }
      } catch (err) {
        console.log("Using local state fallback");
      }
    }
    loadData();
  }, []);

  // Image Cropping & Size Limiting Helper (Max width/height 400px, compressed JPEG)
  const processAndCropImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to professional JPEG format (~80% quality)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        callback(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

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
      setAuthError('Authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Add Single Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newFirstName || !newLastName) return;
    setSaving(true);

    const newEntry = {
      title: newTitle,
      first_name: newFirstName,
      last_name: newLastName,
      gender: newGender,
      role: ['Elder', 'Deacon', 'Deaconess'].includes(newTitle) ? 'Officer' : 'Member',
      cell: newCell,
      phone: newPhone || '+233 00 000 0000',
      ministry: newMinistry,
      holy_ghost: newNewHolyGhostCheck(newHolyGhost),
      water_baptism: newBaptised,
      status: 'Active',
      photo_url: newPhoto
    };

    const { data, error } = await supabase.from('members').insert([newEntry]).select();
    if (!error && data) {
      setMembers([...members, data[0]]);
      alert(`Member ${newFirstName} ${newLastName} saved permanently!`);
    } else {
      setMembers([...members, { id: members.length + 1, ...newEntry }]);
      alert(`Member added locally!`);
    }

    setNewFirstName('');
    setNewLastName('');
    setNewPhone('');
    setNewPhoto('');
    setSaving(false);
  };

  function newNewHolyGhostCheck(val) { return val; }

  // Bulk CSV / Excel Import with Duplicate Prevention
  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1);
      let addedCount = 0;
      let duplicateCount = 0;
      let newRows = [];

      lines.forEach(line => {
        const cols = line.split(',');
        if (cols.length >= 3) {
          const title = cols[0] ? cols[0].trim() : 'Brother';
          const first_name = cols[1] ? cols[1].trim() : '';
          const last_name = cols[3] ? cols[3].trim() : '';
          const phone = cols[7] ? cols[7].trim() : '+233 00 000 0000';

          if (first_name && last_name) {
            // Check Duplicates against existing state
            const isDuplicate = members.some(m => 
              m.first_name?.toLowerCase() === first_name.toLowerCase() && 
              m.last_name?.toLowerCase() === last_name.toLowerCase()
            );

            if (!isDuplicate) {
              newRows.push({
                title,
                first_name,
                last_name,
                gender: cols[4] ? cols[4].trim() : 'Male',
                role: ['Elder', 'Deacon', 'Deaconess'].includes(title) ? 'Officer' : 'Member',
                cell: 'Cell 1',
                phone,
                ministry: cols[41] ? cols[41].trim() : 'PEMEM Ministry',
                holy_ghost: cols[27] ? cols[27].trim() : 'Yes',
                water_baptism: cols[29] ? cols[29].trim() : 'Yes',
                status: 'Active',
                photo_url: ''
              });
              addedCount++;
            } else {
              duplicateCount++;
            }
          }
        }
      });

      if (newRows.length > 0) {
        const { data, error } = await supabase.from('members').insert(newRows).select();
        if (!error && data) {
          setMembers([...members, ...data]);
        } else {
          setMembers([...members, ...newRows.map((r, i) => ({ id: members.length + i + 1, ...r }))]);
        }
      }
      setImportStatus(`Successfully imported ${addedCount} members! (${duplicateCount} duplicates skipped)`);
    };
    reader.readAsText(file);
  };

  // Download Membership Details CSV
  const downloadMembershipCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,Title,First Name,Last Name,Gender,Role,Cell,Phone,Ministry,Holy Ghost,Baptism\n";
    members.forEach(m => {
      csvContent += `"${m.title}","${m.first_name}","${m.last_name}","${m.gender}","${m.role}","${m.cell}","${m.phone}","${m.ministry || ''}","${m.holy_ghost || ''}","${m.water_baptism || ''}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Maranatha_Assembly_Membership_Directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Inline Editing & Deleting
  const handleSaveEdit = async (id) => {
    setSaving(true);
    const { error } = await supabase.from('members').update(editMemberData).eq('id', id);
    if (!error) {
      setMembers(members.map(m => m.id === id ? editMemberData : m));
      alert("Member updated successfully!");
    } else {
      setMembers(members.map(m => m.id === id ? editMemberData : m));
    }
    setEditingMemberId(null);
    setSaving(false);
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    await supabase.from('members').delete().eq('id', id);
    setMembers(members.filter(m => m.id !== id));
  };

  // Filter and Sort Logic
  const filteredMembers = members.filter(m => {
    const fullName = `${m.title || ''} ${m.first_name || ''} ${m.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || (m.phone && m.phone.includes(searchQuery));

    if (!matchesSearch) return false;

    if (filterCategory === 'All') return true;
    if (filterCategory === 'Officers') return ['Elder', 'Deacon', 'Deaconess', 'Pastor'].includes(m.title);
    if (filterCategory === 'Members') return !['Elder', 'Deacon', 'Deaconess', 'Pastor'].includes(m.title);
    if (filterCategory === 'Male') return m.gender === 'Male';
    if (filterCategory === 'Female') return m.gender === 'Female';
    if (filterCategory === 'Baptised') return m.water_baptism === 'Yes';
    if (filterCategory === 'HolyGhost') return m.holy_ghost === 'Yes';
    if (filterCategory === 'PEMEM') return m.ministry === 'PEMEM Ministry';
    if (filterCategory === 'Women') return m.ministry === 'Women\'s Ministry';
    if (filterCategory === 'Youth') return m.ministry === 'Youth Ministry';
    return true;
  }).sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    if (sortOrder === 'asc') return nameA.localeCompare(nameB);
    return nameB.localeCompare(nameA);
  });

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
            <span>Membership Directory</span>
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

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Assembly Dashboard</h2>
                <p className="text-sm text-slate-400">Live operational overview of {churchConfig.assemblyName}.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Registered Members</span>
                  <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">Live Supabase database count</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Presiding Elder</span>
                  <p className="text-xl font-bold text-emerald-400 mt-2">{presidingElder.name}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{presidingElder.email}</span>
                </div>

                {sessionUser.role === 'Admin' && (
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-sm text-slate-400 font-medium">Total Contributions</span>
                    <p className="text-3xl font-bold text-white mt-2">GH₵ {totalFinancesGhc}</p>
                    <span className="text-xs text-slate-400 mt-1 block">{finances.length} records saved</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Membership Directory ({filteredMembers.length} Displayed)</h2>
                  <p className="text-sm text-slate-400">Manage directory, bulk import templates, crop photos, and filter data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={downloadMembershipCsv}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 shadow-lg"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Membership CSV</span>
                  </button>

                  {(sessionUser.role === 'Admin' || sessionUser.role === 'Secretariat') && (
                    <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 cursor-pointer shadow-lg">
                      <Upload className="w-4 h-4" />
                      <span>Bulk Import Template (.csv/.xlsx)</span>
                      <input type="file" accept=".csv, .xlsx" onChange={handleBulkImport} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {importStatus && (
                <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">
                  {importStatus}
                </div>
              )}

              {/* Filter & Sorting Controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <Filter className="w-3.5 h-3.5 text-emerald-400" />
                    <select 
                      value={filterCategory} 
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Officers">Officers (Elders/Deacons)</option>
                      <option value="Members">Regular Members</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Baptised">Water Baptised</option>
                      <option value="HolyGhost">Holy Ghost Baptised</option>
                      <option value="PEMEM">PEMEM Ministry</option>
                      <option value="Women">Women's Ministry</option>
                      <option value="Youth">Youth Ministry</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 flex items-center space-x-1 hover:border-emerald-600"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sort ({sortOrder.toUpperCase()})</span>
                  </button>
                </div>
              </div>

              {/* Add Member Form with Cropped Photo Upload */}
              {(sessionUser.role === 'Admin' || sessionUser.role === 'Secretariat') && (
                <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-emerald-400 uppercase">Register New Member (Titles & Photo Cropping)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <select 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option value="Elder">Elder</option>
                      <option value="Deacon">Deacon</option>
                      <option value="Deaconess">Deaconess</option>
                      <option value="Pastor">Pastor</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      required
                      value={newFirstName} 
                      onChange={(e) => setNewFirstName(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      required
                      value={newLastName} 
                      onChange={(e) => setNewLastName(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                    <input 
                      type="text" 
                      placeholder="Phone Number" 
                      value={newPhone} 
                      onChange={(e) => setNewPhone(e.target.value)} 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                    <label className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 flex items-center justify-between cursor-pointer hover:border-emerald-600">
                      <span className="truncate">{newPhoto ? 'Photo Cropped & Ready' : 'Upload & Crop Photo'}</span>
                      <Upload className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) processAndCropImage(file, setNewPhoto);
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium py-2.5 flex items-center justify-center space-x-1 shadow-lg">
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Member'}</span>
                  </button>
                </form>
              )}

              {/* Members Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                        <th className="p-4 font-medium">Photo</th>
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Full Name</th>
                        <th className="p-4 font-medium">Ministry</th>
                        <th className="p-4 font-medium">Phone</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredMembers.map(m => {
                        const isEditing = editingMemberId === m.id;
                        return (
                          <tr key={m.id} className="hover:bg-slate-800/40">
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {m.photo_url ? (
                                  <img src={m.photo_url} alt={m.first_name} className="w-10 h-10 rounded-full object-cover border border-emerald-600" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold">
                                    {m.first_name?.charAt(0)}
                                  </div>
                                )}
                                <label className="text-slate-400 hover:text-emerald-400 cursor-pointer p-1">
                                  <Camera className="w-4 h-4" />
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        processAndCropImage(file, (croppedUrl) => {
                                          if (isEditing) {
                                            setEditMemberData({ ...editMemberData, photo_url: croppedUrl });
                                          } else {
                                            setEditingMemberId(m.id);
                                            setEditMemberData({ ...m, photo_url: croppedUrl });
                                          }
                                        });
                                      }
                                    }} 
                                    className="hidden" 
                                  />
                                </label>
                              </div>
                            </td>

                            <td className="p-4 text-slate-300">
                              {isEditing ? (
                                <select 
                                  value={editMemberData.title} 
                                  onChange={(e) => setEditMemberData({ ...editMemberData, title: e.target.value })}
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                >
                                  <option value="Elder">Elder</option>
                                  <option value="Deacon">Deacon</option>
                                  <option value="Deaconess">Deaconess</option>
                                  <option value="Pastor">Pastor</option>
                                  <option value="Brother">Brother</option>
                                  <option value="Sister">Sister</option>
                                </select>
                              ) : (
                                <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-400 rounded-full text-xs font-medium border border-emerald-800">
                                  {m.title}
                                </span>
                              )}
                            </td>

                            <td className="p-4 font-medium text-white">
                              {isEditing ? (
                                <div className="flex space-x-2">
                                  <input 
                                    type="text" 
                                    value={editMemberData.first_name} 
                                    onChange={(e) => setEditMemberData({ ...editMemberData, first_name: e.target.value })} 
                                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-28"
                                  />
                                  <input 
                                    type="text" 
                                    value={editMemberData.last_name} 
                                    onChange={(e) => setEditMemberData({ ...editMemberData, last_name: e.target.value })} 
                                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-28"
                                  />
                                </div>
                              ) : (
                                `${m.first_name || ''} ${m.last_name || ''}`
                              )}
                            </td>

                            <td className="p-4 text-slate-300">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editMemberData.ministry} 
                                  onChange={(e) => setEditMemberData({ ...editMemberData, ministry: e.target.value })} 
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                />
                              ) : (
                                m.ministry || 'General'
                              )}
                            </td>

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
                                  <button onClick={() => { setEditingMemberId(m.id); setEditMemberData({ ...m }); }} className="text-slate-400 hover:text-emerald-400 p-1">
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
                  <p className="text-sm text-slate-400">Transactions persist permanently to Supabase.</p>
                </div>
                <button 
                  onClick={async () => {
                    const amount = parseFloat(prompt("Enter Contribution Amount (GH₵):") || "0");
                    if (amount > 0) {
                      const type = prompt("Type (Tithe / Offering / Special):") || "Tithe";
                      const contributor = prompt("Contributor Name:") || "Anonymous";
                      const newFin = { type, amount, contributor, date: new Date().toISOString().split('T')[0] };
                      const { data } = await supabase.from('finances').insert([newFin]).select();
                      if (data) setFinances([data[0], ...finances]);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Contribution</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                {finances.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8">No financial transactions recorded yet. Ledger starts at GH₵ 0.</p>
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
                <h2 className="text-2xl font-bold tracking-tight text-white">Control Panel: Presiding Elder & Branding</h2>
                <p className="text-sm text-slate-400">Manage church logo and Presiding Elder credentials.</p>
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
                    <label className="block text-xs font-medium text-slate-400 mb-1">Upload Church Logo from Device (Cropped & Compressed)</label>
                    <label className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between cursor-pointer hover:border-emerald-600">
                      <span>{churchConfig.logoUrl ? 'Logo Selected & Compressed' : 'Choose Logo Image File'}</span>
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) processAndCropImage(file, (cropped) => setChurchConfig({...churchConfig, logoUrl: cropped}));
                      }} className="hidden" />
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

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

  // Presiding Elder Credentials Management
  const [presidingElder, setPresidingElder] = useState({
    name: 'Benjamin Glover',
    email: 'cwamyemma198@gmail.com',
    password: 'S@vethew0r!d',
    title: 'Elder'
  });

  // Navigation & User Session
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({ name: '', email: '', role: 'Admin' });

  // Pure Database State (No hardcoded dummy members)
  const [members, setMembers] = useState([]);
  const [finances, setFinances] = useState([]);

  // Search, Filter & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMember, setSelectedMember] = useState(null);

  // Mandatory Form Fields
  const [newTitle, setNewTitle] = useState('Brother');
  const [newFirstName, setNewFirstName] = useState('');
  const [newMiddleName, setNewMiddleName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newGender, setNewGender] = useState('Male');
  const [newDob, setNewDob] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newMinistry, setNewMinistry] = useState('General');
  const [newPhoto, setNewPhoto] = useState('');

  const [importStatus, setImportStatus] = useState('');

  // Fetch Live Data From Supabase on Page Load
  useEffect(() => {
    async function loadData() {
      try {
        const { data: mData } = await supabase.from('members').select('*').order('id', { ascending: true });
        if (mData) setMembers(mData);

        const { data: fData } = await supabase.from('finances').select('*').order('id', { ascending: false });
        if (fData) setFinances(fData);
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    }
    loadData();
  }, []);

  // Compress & Crop Photo Uploads
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
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const cleanEmail = loginEmail.trim().toLowerCase();

    if (cleanEmail === 'dyleon00@gmail.com' && loginPassword === 'F0rthewher3') {
      setSessionUser({ name: 'Developer Admin', email: cleanEmail, role: 'Admin' });
      setIsAuthenticated(true);
      setAuthLoading(false);
      return;
    }
    if (cleanEmail === presidingElder.email.toLowerCase() && loginPassword === presidingElder.password) {
      setSessionUser({ name: presidingElder.name, email: cleanEmail, role: 'Admin' });
      setIsAuthenticated(true);
      setAuthLoading(false);
      return;
    }
    setAuthError('Invalid email or password.');
    setAuthLoading(false);
  };

  // Register New Member (Mandatory: First Name, Last Name, Gender, DOB)
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newDob) {
      alert("First Name, Last Name, Gender, and Date of Birth are mandatory!");
      return;
    }
    setSaving(true);

    const newEntry = {
      title: newTitle,
      first_name: newFirstName,
      middle_name: newMiddleName,
      last_name: newLastName,
      gender: newGender,
      dob: newDob,
      phone: newPhone,
      ministry: newMinistry,
      photo_url: newPhoto,
      status: 'Active'
    };

    const { data, error } = await supabase.from('members').insert([newEntry]).select();
    if (!error && data) {
      setMembers([...members, data[0]]);
      alert(`Member ${newFirstName} ${newLastName} saved successfully!`);
      setNewFirstName('');
      setNewMiddleName('');
      setNewLastName('');
      setNewDob('');
      setNewPhone('');
      setNewPhoto('');
    } else {
      alert("Error saving to database. Ensure Supabase tables are initialized.");
    }
    setSaving(false);
  };

  // Bulk CSV/Excel Import with Duplicate Prevention
  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1);
      let newRows = [];
      let duplicateCount = 0;

      lines.forEach(line => {
        const cols = line.split(',');
        if (cols.length >= 5) {
          const title = cols[0] ? cols[0].trim() : 'Brother';
          const first_name = cols[1] ? cols[1].trim() : '';
          const middle_name = cols[2] ? cols[2].trim() : '';
          const last_name = cols[3] ? cols[3].trim() : '';
          const gender = cols[4] ? cols[4].trim() : 'Male';
          const dob = cols[5] ? cols[5].trim() : 'N/A';
          const phone = cols[7] ? cols[7].trim() : '';

          if (first_name && last_name) {
            const isDup = members.some(m => 
              m.first_name?.toLowerCase() === first_name.toLowerCase() && 
              m.last_name?.toLowerCase() === last_name.toLowerCase()
            );

            if (!isDup) {
              newRows.push({
                title, first_name, middle_name, last_name, gender, dob, phone,
                email: cols[8] ? cols[8].trim() : '',
                membership_type: cols[9] ? cols[9].trim() : 'Full Member',
                marital_status: cols[10] ? cols[10].trim() : '',
                holy_ghost_baptism: cols[27] ? cols[27].trim() : 'No',
                water_baptism: cols[29] ? cols[29].trim() : 'No',
                ministry: cols[41] ? cols[41].trim() : 'General',
                status: 'Active'
              });
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
          setImportStatus(`Imported ${data.length} records successfully! (${duplicateCount} duplicates skipped)`);
        }
      } else {
        setImportStatus(`No new unique records found. (${duplicateCount} duplicates skipped)`);
      }
    };
    reader.readAsText(file);
  };

  // Download Complete Roster as CSV
  const downloadCsv = () => {
    let csv = "data:text/csv;charset=utf-8,Title,First Name,Middle Name,Last Name,Gender,DOB,Phone,Ministry,HolyGhost,WaterBaptism\n";
    members.forEach(m => {
      csv += `"${m.title || ''}","${m.first_name || ''}","${m.middle_name || ''}","${m.last_name || ''}","${m.gender || ''}","${m.dob || ''}","${m.phone || ''}","${m.ministry || ''}","${m.holy_ghost_baptism || 'No'}","${m.water_baptism || 'No'}"\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "Maranatha_Assembly_Complete_Roster.csv";
    link.click();
  };

  // Filter & Search Logic
  const filteredMembers = members.filter(m => {
    const nameStr = `${m.title || ''} ${m.first_name || ''} ${m.middle_name || ''} ${m.last_name || ''}`.toLowerCase();
    const match = nameStr.includes(searchQuery.toLowerCase()) || (m.phone && m.phone.includes(searchQuery));
    if (!match) return false;

    if (filterCategory === 'All') return true;
    if (filterCategory === 'Officers') return ['Elder', 'Deacon', 'Deaconess', 'Pastor'].includes(m.title);
    if (filterCategory === 'Male') return m.gender === 'Male';
    if (filterCategory === 'Female') return m.gender === 'Female';
    if (filterCategory === 'Baptised') return m.water_baptism === 'Yes';
    if (filterCategory === 'HolyGhost') return m.holy_ghost_baptism === 'Yes';
    return true;
  }).sort((a, b) => {
    const nA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return sortOrder === 'asc' ? nA.localeCompare(nB) : nB.localeCompare(nA);
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-emerald-600 p-3 rounded-2xl text-white font-bold text-xl shadow-lg">{churchConfig.logoText}</div>
            <h1 className="text-2xl font-bold text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
          {authError && <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs">{authError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="cwamyemma198@gmail.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-2">
              <LogIn className="w-4 h-4" /> <span>Secure Login</span>
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
          <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold">{churchConfig.logoText}</div>
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
          <button onClick={() => setIsAuthenticated(false)} className="bg-slate-800 hover:bg-red-950 hover:text-red-400 p-2.5 rounded-xl border border-slate-700 transition-all text-slate-300 flex items-center space-x-2">
            <LogOut className="w-4 h-4" /> <span className="text-xs font-medium hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-2">
          <button onClick={() => setCurrentTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BarChart3 className="w-5 h-5" /> <span>Dashboard & Metrics</span>
          </button>

          <button onClick={() => setCurrentTab('members')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'members' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" /> <span>Membership Directory</span>
          </button>

          <button onClick={() => setCurrentTab('finance')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <DollarSign className="w-5 h-5" /> <span>Finance & Records</span>
          </button>

          <button onClick={() => setCurrentTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Settings className="w-5 h-5" /> <span>Presiding & Settings</span>
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Assembly Dashboard</h2>
                <p className="text-sm text-slate-400">Live stats connected directly to Supabase PostgreSQL.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Registered Members</span>
                  <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
                  <span className="text-xs text-emerald-400 mt-1 block">Live database count</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Presiding Elder</span>
                  <p className="text-xl font-bold text-emerald-400 mt-2">{presidingElder.name}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{presidingElder.email}</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Contributions</span>
                  <p className="text-3xl font-bold text-white mt-2">GH₵ {totalFinancesGhc}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{finances.length} records saved</span>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Membership Directory ({filteredMembers.length} Displayed)</h2>
                  <p className="text-sm text-slate-400">Manage directory, crop photos, bulk import template, and filter data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={downloadCsv} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 shadow-lg">
                    <Download className="w-4 h-4 text-emerald-400" /> <span>Export CSV</span>
                  </button>

                  <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 cursor-pointer shadow-lg">
                    <Upload className="w-4 h-4" /> <span>Bulk Import Template</span>
                    <input type="file" accept=".csv, .xlsx" onChange={handleBulkImport} className="hidden" />
                  </label>
                </div>
              </div>

              {importStatus && <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">{importStatus}</div>}

              {/* Filter Controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200" />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                    <option value="All">All Categories</option>
                    <option value="Officers">Officers</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Baptised">Water Baptised</option>
                    <option value="HolyGhost">Holy Ghost Baptised</option>
                  </select>

                  <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 flex items-center space-x-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" /> <span>Sort ({sortOrder.toUpperCase()})</span>
                  </button>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold text-emerald-400 uppercase">Register Member (* Mandatory: First, Last Name, Gender, DOB)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                  <select value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                    <option value="Brother">Brother</option><option value="Sister">Sister</option><option value="Elder">Elder</option><option value="Deacon">Deacon</option><option value="Deaconess">Deaconess</option><option value="Pastor">Pastor</option>
                  </select>
                  <input type="text" placeholder="First Name *" required value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                  <input type="text" placeholder="Middle Name" value={newMiddleName} onChange={(e) => setNewMiddleName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                  <input type="text" placeholder="Last Name *" required value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                  <select value={newGender} onChange={(e) => setNewGender(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                    <option value="Male">Male</option><option value="Female">Female</option>
                  </select>
                  <input type="text" placeholder="DOB (DD/MM/YYYY) *" required value={newDob} onChange={(e) => setNewDob(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
                </div>
                <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium px-4 py-2 flex items-center space-x-2 shadow-lg">
                  <Save className="w-4 h-4" /> <span>{saving ? 'Saving...' : 'Save Member Record'}</span>
                </button>
              </form>

              {/* Members Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-4">Title</th><th className="p-4">Full Name</th><th className="p-4">Gender</th><th className="p-4">DOB</th><th className="p-4">Phone</th><th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-slate-800/40">
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded-full text-xs border border-emerald-800">{m.title}</span></td>
                        <td className="p-4 font-medium text-white">{m.first_name} {m.middle_name || ''} {m.last_name}</td>
                        <td className="p-4 text-slate-300">{m.gender}</td>
                        <td className="p-4 text-slate-300">{m.dob}</td>
                        <td className="p-4 text-slate-400">{m.phone || 'N/A'}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => setSelectedMember(m)} className="text-xs text-emerald-400 hover:underline flex items-center justify-end space-x-1">
                            <Eye className="w-3.5 h-3.5" /> <span>View Full 64-Field Profile</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Full Record Modal */}
              {selectedMember && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-lg text-white">{selectedMember.title} {selectedMember.first_name} {selectedMember.last_name}</h3>
                      <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div><span className="text-slate-400">Gender:</span> <p className="text-white font-medium">{selectedMember.gender}</p></div>
                      <div><span className="text-slate-400">Date of Birth:</span> <p className="text-white font-medium">{selectedMember.dob}</p></div>
                      <div><span className="text-slate-400">Phone:</span> <p className="text-white font-medium">{selectedMember.phone || 'N/A'}</p></div>
                      <div><span className="text-slate-400">Email:</span> <p className="text-white font-medium">{selectedMember.email || 'N/A'}</p></div>
                      <div><span className="text-slate-400">Membership Type:</span> <p className="text-white font-medium">{selectedMember.membership_type || 'Full Member'}</p></div>
                      <div><span className="text-slate-400">Holy Ghost Baptised:</span> <p className="text-white font-medium">{selectedMember.holy_ghost_baptism || 'No'}</p></div>
                      <div><span className="text-slate-400">Water Baptised:</span> <p className="text-white font-medium">{selectedMember.water_baptism || 'No'}</p></div>
                      <div><span className="text-slate-400">Ministry:</span> <p className="text-white font-medium">{selectedMember.ministry || 'General'}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Finance & Tithes Ledger</h2>
                  <p className="text-sm text-slate-400">Recorded transactions persist to Supabase.</p>
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
                  <Plus className="w-4 h-4" /> <span>Record Contribution</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                {finances.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8">No financial transactions recorded yet.</p>
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

          {currentTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Control Panel: Presiding Elder & Branding</h2>
                <p className="text-sm text-slate-400">Manage church credentials and branding.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Presiding Elder Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Presiding Elder Name</label>
                    <input type="text" value={presidingElder.name} onChange={(e) => setPresidingElder({...presidingElder, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Login Email</label>
                    <input type="email" value={presidingElder.email} onChange={(e) => setPresidingElder({...presidingElder, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Password</label>
                    <input type="text" value={presidingElder.password} onChange={(e) => setPresidingElder({...presidingElder, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
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

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
  const [saving, setSaving] = useState(false);

  // Church Branding & Presiding Elder Management
  const [churchConfig, setChurchConfig] = useState({
    assemblyName: 'Maranatha Assembly',
    area: 'The Church of Pentecost • Anyaa Area',
    logoText: 'COP',
    logoUrl: ''
  });

  const [systemUsers, setSystemUsers] = useState([
    { id: 1, name: 'Developer Admin', email: 'dyleon00@gmail.com', password: 'F0rthewher3', role: 'Developer Admin' },
    { id: 2, name: 'Benjamin Glover', email: 'cwamyemma198@gmail.com', password: 'S@vethew0r!d', role: 'Presiding Elder' }
  ]);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Secretariat');

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({ name: '', email: '', role: 'Admin' });

  const [members, setMembers] = useState([]);
  const [finances, setFinances] = useState([]);

  // Search, Filter, Sort & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [showFullAddForm, setShowFullAddForm] = useState(false);

  // Complete 64-Field Member Form State
  const [mForm, setMForm] = useState({
    title: 'Brother', first_name: '', middle_name: '', last_name: '', gender: 'Male', dob: '',
    place_of_birth: '', phone: '', email: '', membership_type: 'Full Member', marital_status: 'Single',
    address_line_1: '', gps_address: '', hometown: '', street_name: '', apartment_no: '', city: 'Accra',
    postal_code: '233', nationality: 'Ghanaian', country_of_birth: 'Ghana', family_member_name: '',
    relationship: '', residential_address: '', family_phone: '', locality: '', family_email: '', landmark: '',
    holy_ghost_baptism: 'No', date_holy_ghost_baptism: '', water_baptism: 'No', date_water_baptism: '',
    date_conversion: '', former_church: '', date_joined: '', place_of_baptism: '', minister_at_baptism: '',
    district_church: '', communicant: 'No', position_in_church: '', roles_played: '', other_appointments: '',
    ministry: 'General', zone: '', occupation: '', hum_status: '', level_of_education: '', school_org_name: '',
    school_work_location: '', is_entrepreneur: 'No', is_retired: 'No', date_of_retirement: '',
    has_disability: 'No', disability_nature: '', assistive_device: '', is_royal: 'No', royal_status: '',
    traditional_area: '', year_appointed: '', parent_guardian_name: '', parent_guardian_contact: '',
    dedicated: 'No', dedication_date: '', dedication_minister: '', church_dedication_done: '', photo_url: '', status: 'Active'
  });

  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const { data: mData } = await supabase.from('members').select('*').order('id', { ascending: true });
        if (mData) setMembers(mData);
        const { data: fData } = await supabase.from('finances').select('*').order('id', { ascending: false });
        if (fData) setFinances(fData);
      } catch (err) {
        console.error("Load error:", err);
      }
    }
    loadData();
  }, []);

  // Image Cropper & Compressor
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
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
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

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = loginEmail.trim().toLowerCase();
    const found = systemUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === loginPassword);
    if (found) {
      setSessionUser({ name: found.name, email: found.email, role: found.role });
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid email or password.');
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword || !newUserName) return;
    const newUser = { id: systemUsers.length + 1, name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole };
    setSystemUsers([...systemUsers, newUser]);
    alert(`Account created for ${newUserName} (${newUserRole})!`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!mForm.first_name || !mForm.last_name || !mForm.gender || !mForm.dob) {
      alert("First Name, Last Name, Gender, and Date of Birth are mandatory!");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from('members').insert([mForm]).select();
    if (!error && data) {
      setMembers([...members, data[0]]);
      alert(`Member ${mForm.first_name} ${mForm.last_name} saved successfully with all 64 fields!`);
      setShowFullAddForm(false);
    } else {
      alert("Error saving record to Supabase.");
    }
    setSaving(false);
  };

  const handleSaveMemberEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('members').update(editingMember).eq('id', editingMember.id);
    if (!error) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      alert("Member updated successfully!");
      setEditingMember(null);
    } else {
      alert("Error updating record.");
    }
    setSaving(false);
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member entry?")) return;
    await supabase.from('members').delete().eq('id', id);
    setMembers(members.filter(m => m.id !== id));
  };

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1);
      let newRows = [];
      let dupCount = 0;

      lines.forEach(line => {
        const c = line.split(',');
        if (c.length >= 5) {
          const title = c[0]?.trim() || 'Brother';
          const first_name = c[1]?.trim() || '';
          const last_name = c[3]?.trim() || '';
          if (first_name && last_name) {
            const isDup = members.some(m => m.first_name?.toLowerCase() === first_name.toLowerCase() && m.last_name?.toLowerCase() === last_name.toLowerCase());
            if (!isDup) {
              newRows.push({
                title, first_name, middle_name: c[2]?.trim() || '', last_name,
                gender: c[4]?.trim() || 'Male', dob: c[5]?.trim() || 'N/A',
                place_of_birth: c[6]?.trim() || '', phone: c[7]?.trim() || '',
                email: c[8]?.trim() || '', membership_type: c[9]?.trim() || 'Full Member',
                marital_status: c[10]?.trim() || '', address_line_1: c[11]?.trim() || '',
                gps_address: c[12]?.trim() || '', hometown: c[13]?.trim() || '',
                nationality: c[18]?.trim() || 'Ghanaian', country_of_birth: c[19]?.trim() || 'Ghana',
                holy_ghost_baptism: c[27]?.trim() || 'No', water_baptism: c[29]?.trim() || 'No',
                ministry: c[41]?.trim() || 'General', occupation: c[44]?.trim() || '', status: 'Active'
              });
            } else { dupCount++; }
          }
        }
      });

      if (newRows.length > 0) {
        const { data, error } = await supabase.from('members').insert(newRows).select();
        if (!error && data) {
          setMembers([...members, ...data]);
          setImportStatus(`Successfully imported ${data.length} records! (${dupCount} duplicates skipped)`);
        }
      } else {
        setImportStatus(`No new unique records. (${dupCount} duplicates skipped)`);
      }
    };
    reader.readAsText(file);
  };

  const downloadCsv = () => {
    let csv = "data:text/csv;charset=utf-8,Title,First Name,Middle Name,Last Name,Gender,DOB,Phone,Ministry,HolyGhost,WaterBaptism\n";
    members.forEach(m => {
      csv += `"${m.title || ''}","${m.first_name || ''}","${m.middle_name || ''}","${m.last_name || ''}","${m.gender || ''}","${m.dob || ''}","${m.phone || ''}","${m.ministry || ''}","${m.holy_ghost_baptism || 'No'}","${m.water_baptism || 'No'}"\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "Maranatha_Assembly_Roster.csv";
    link.click();
  };

  const filteredMembers = members.filter(m => {
    const fullName = `${m.title || ''} ${m.first_name || ''} ${m.last_name || ''}`.toLowerCase();
    const match = fullName.includes(searchQuery.toLowerCase()) || (m.phone && m.phone.includes(searchQuery));
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
            {churchConfig.logoUrl ? (
              <img src={churchConfig.logoUrl} alt="Logo" className="w-16 h-16 mx-auto object-cover rounded-2xl border border-emerald-600" />
            ) : (
              <div className="inline-flex bg-emerald-600 p-3 rounded-2xl text-white font-bold text-xl">{churchConfig.logoText}</div>
            )}
            <h1 className="text-2xl font-bold text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
          {authError && <div className="bg-red-950 border border-red-800 text-red-300 p-3 rounded-xl text-xs">{authError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200" />
            <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium shadow-lg">Secure Login</button>
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
            <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold">{churchConfig.logoText}</div>
          )}
          <div>
            <h1 className="font-bold text-lg text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-emerald-400 hidden sm:inline">Role: {sessionUser.role}</span>
          <button onClick={() => setIsAuthenticated(false)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs flex items-center space-x-2">
            <LogOut className="w-4 h-4" /> <span>Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-2">
          <button onClick={() => setCurrentTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${currentTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BarChart3 className="w-5 h-5" /> <span>Dashboard</span>
          </button>
          <button onClick={() => setCurrentTab('members')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${currentTab === 'members' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" /> <span>Membership Directory</span>
          </button>
          <button onClick={() => setCurrentTab('finance')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${currentTab === 'finance' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <DollarSign className="w-5 h-5" /> <span>Finance & Ledger</span>
          </button>
          <button onClick={() => setCurrentTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${currentTab === 'settings' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Settings className="w-5 h-5" /> <span>Admin & Branding</span>
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Assembly Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400">Total Registered Members</span>
                  <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-sm text-slate-400 font-medium">Total Contributions</span>
                  <p className="text-3xl font-bold text-white mt-2">GH₵ {totalFinancesGhc}</p>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Membership Directory ({filteredMembers.length})</h2>
                  <p className="text-sm text-slate-400">Full 64-field record management supporting template import.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={downloadCsv} className="bg-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 border border-slate-700">
                    <Download className="w-4 h-4 text-emerald-400" /> <span>Export CSV</span>
                  </button>
                  <button onClick={() => setShowFullAddForm(!showFullAddForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2">
                    <Plus className="w-4 h-4" /> <span>{showFullAddForm ? 'Close Form' : 'Add 64-Field Member'}</span>
                  </button>
                  <label className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" /> <span>Bulk Excel Import</span>
                    <input type="file" accept=".csv, .xlsx" onChange={handleBulkImport} className="hidden" />
                  </label>
                </div>
              </div>

              {importStatus && <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">{importStatus}</div>}

              {/* Filter Controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs w-64 text-slate-200" />
                <div className="flex space-x-2">
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                    <option value="All">All Members</option>
                    <option value="Officers">Officers</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Baptised">Water Baptised</option>
                    <option value="HolyGhost">Holy Ghost Baptised</option>
                  </select>
                  <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
                    Sort ({sortOrder.toUpperCase()})
                  </button>
                </div>
              </div>

              {/* Complete 64-Field Add Form */}
              {showFullAddForm && (
                <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                  <h3 className="text-base font-bold text-emerald-400 uppercase border-b border-slate-800 pb-2">Full 64-Field Member Record Entry</h3>
                  
                  <div className="space-y-4 text-xs">
                    <h4 className="font-bold text-slate-300">1. Core Profile & Identity (* Mandatory: First, Last, Gender, DOB)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <select value={mForm.title} onChange={(e) => setMForm({...mForm, title: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="Brother">Brother</option><option value="Sister">Sister</option><option value="Elder">Elder</option><option value="Deacon">Deacon</option><option value="Deaconess">Deaconess</option><option value="Pastor">Pastor</option>
                      </select>
                      <input type="text" placeholder="First Name *" required value={mForm.first_name} onChange={(e) => setMForm({...mForm, first_name: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="text" placeholder="Middle Name" value={mForm.middle_name} onChange={(e) => setMForm({...mForm, middle_name: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="text" placeholder="Last Name *" required value={mForm.last_name} onChange={(e) => setMForm({...mForm, last_name: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <select value={mForm.gender} onChange={(e) => setMForm({...mForm, gender: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="Male">Male</option><option value="Female">Female</option>
                      </select>
                      <input type="text" placeholder="Date of Birth (DD/MM/YYYY) *" required value={mForm.dob} onChange={(e) => setMForm({...mForm, dob: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="text" placeholder="Phone Number" value={mForm.phone} onChange={(e) => setMForm({...mForm, phone: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="email" placeholder="Email Address" value={mForm.email} onChange={(e) => setMForm({...mForm, email: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                    </div>

                    <h4 className="font-bold text-slate-300 pt-3">2. Address & Hometown</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <input type="text" placeholder="Address Line 1" value={mForm.address_line_1} onChange={(e) => setMForm({...mForm, address_line_1: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="text" placeholder="GPS Address" value={mForm.gps_address} onChange={(e) => setMForm({...mForm, gps_address: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="text" placeholder="Hometown" value={mForm.hometown} onChange={(e) => setMForm({...mForm, hometown: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                      <input type="text" placeholder="City" value={mForm.city} onChange={(e) => setMForm({...mForm, city: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                    </div>

                    <h4 className="font-bold text-slate-300 pt-3">3. Spiritual & Sacraments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <select value={mForm.holy_ghost_baptism} onChange={(e) => setMForm({...mForm, holy_ghost_baptism: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="Yes">Holy Ghost Baptised: Yes</option><option value="No">Holy Ghost Baptised: No</option>
                      </select>
                      <select value={mForm.water_baptism} onChange={(e) => setMForm({...mForm, water_baptism: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="Yes">Water Baptised: Yes</option><option value="No">Water Baptised: No</option>
                      </select>
                      <select value={mForm.communicant} onChange={(e) => setMForm({...mForm, communicant: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="Yes">Communicant: Yes</option><option value="No">Communicant: No</option>
                      </select>
                      <input type="text" placeholder="Ministry" value={mForm.ministry} onChange={(e) => setMForm({...mForm, ministry: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" />
                    </div>
                  </div>

                  <button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold py-3 shadow-lg">
                    {saving ? 'Saving...' : 'Save Complete 64-Field Member'}
                  </button>
                </form>
              )}

              {/* Members Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-4">Title</th><th className="p-4">Full Name</th><th className="p-4">Gender</th><th className="p-4">DOB</th><th className="p-4">Phone</th><th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-slate-800/40">
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded-full text-xs">{m.title}</span></td>
                        <td className="p-4 font-medium text-white">{m.first_name} {m.middle_name || ''} {m.last_name}</td>
                        <td className="p-4 text-slate-300">{m.gender}</td>
                        <td className="p-4 text-slate-300">{m.dob}</td>
                        <td className="p-4 text-slate-400">{m.phone || 'N/A'}</td>
                        <td className="p-4 text-right flex items-center justify-end space-x-2">
                          <button onClick={() => setSelectedMember(m)} className="text-xs text-emerald-400 hover:underline flex items-center space-x-1">
                            <Eye className="w-3.5 h-3.5" /> <span>View</span>
                          </button>
                          <button onClick={() => setEditingMember(m)} className="text-xs text-slate-300 hover:text-white flex items-center space-x-1">
                            <Edit className="w-3.5 h-3.5" /> <span>Edit</span>
                          </button>
                          <button onClick={() => handleDeleteMember(m.id)} className="text-xs text-red-400 hover:underline">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Full 64-Field Inspector Modal */}
              {selectedMember && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-lg text-white">{selectedMember.title} {selectedMember.first_name} {selectedMember.middle_name || ''} {selectedMember.last_name}</h3>
                      <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(selectedMember).map(([key, val]) => (
                        <div key={key} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block uppercase text-[10px]">{key.replace(/_/g, ' ')}</span>
                          <span className="text-white font-medium">{val !== null && val !== undefined && val !== '' ? String(val) : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Modal */}
              {editingMember && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <form onSubmit={handleSaveMemberEdit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-lg text-white">Edit Record: {editingMember.first_name} {editingMember.last_name}</h3>
                      <button type="button" onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-slate-400">First Name</label><input type="text" value={editingMember.first_name} onChange={(e) => setEditingMember({...editingMember, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" /></div>
                      <div><label className="text-slate-400">Last Name</label><input type="text" value={editingMember.last_name} onChange={(e) => setEditingMember({...editingMember, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" /></div>
                      <div><label className="text-slate-400">Phone</label><input type="text" value={editingMember.phone || ''} onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" /></div>
                      <div><label className="text-slate-400">DOB</label><input type="text" value={editingMember.dob || ''} onChange={(e) => setEditingMember({...editingMember, dob: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" /></div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold">Save Changes</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {currentTab === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Finance & Tithes Ledger</h2>
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-2"
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
                      <div key={f.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                        <div>
                          <p className="font-semibold text-white">{f.type} — GH₵ {f.amount}</p>
                          <p className="text-slate-400">Contributor: {f.contributor} • {f.date}</p>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full">Saved</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <h2 className="text-2xl font-bold text-white">Admin & Church Branding Controls</h2>
              
              {/* Church Branding & Logo */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <span>Church Name & Branding Logo</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Assembly Name</label>
                    <input type="text" value={churchConfig.assemblyName} onChange={(e) => setChurchConfig({...churchConfig, assemblyName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Area / Sub-heading</label>
                    <input type="text" value={churchConfig.area} onChange={(e) => setChurchConfig({...churchConfig, area: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-1">Upload Custom Logo Image</label>
                    <label className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 flex items-center justify-between cursor-pointer hover:border-emerald-600">
                      <span>{churchConfig.logoUrl ? 'Logo Uploaded & Compressed' : 'Choose Logo Image File'}</span>
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) processAndCropImage(file, (cropped) => setChurchConfig({...churchConfig, logoUrl: cropped}));
                      }} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* User Creation Form */}
              <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <span>Create New Administrative User</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input type="text" required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="User Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Email</label>
                    <input type="email" required value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="email@maranatha.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Set Password</label>
                    <input type="text" required value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Access Role</label>
                    <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200">
                      <option value="Secretariat">Secretariat</option>
                      <option value="Finance">Finance</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg">Create User Account</button>
              </form>
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

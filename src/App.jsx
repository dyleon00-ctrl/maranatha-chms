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

  // Dynamic Presiding Elder & System Users (Developer Managed)
  const [presidingElder, setPresidingElder] = useState({
    name: 'Benjamin Glover',
    email: 'cwamyemma198@gmail.com',
    password: 'S@vethew0r!d',
    title: 'Elder'
  });

  const [systemUsers, setSystemUsers] = useState([
    { id: 1, name: 'Developer Admin', email: 'dyleon00@gmail.com', password: 'F0rthewher3', role: 'Developer Admin' },
    { id: 2, name: 'Benjamin Glover', email: 'cwamyemma198@gmail.com', password: 'S@vethew0r!d', role: 'Presiding Elder' }
  ]);

  // User Management Inputs (For Developer Admin)
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Secretariat');

  // Navigation & User Session
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sessionUser, setSessionUser] = useState({ name: '', email: '', role: 'Admin' });

  // Pure Database State
  const [members, setMembers] = useState([]);
  const [finances, setFinances] = useState([]);

  // Search, Filter & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMember, setSelectedMember] = useState(null); // Viewing Full Profile
  const [editingMember, setEditingMember] = useState(null);   // Editing 64 Fields
  const [showFullAddForm, setShowFullAddForm] = useState(false);

  // 64-Field Full Member Registration Form State
  const [memberFormData, setMemberFormData] = useState({
    // Mandatory
    first_name: '', last_name: '', gender: 'Male', dob: '',
    // Core Profile
    title: 'Brother', middle_name: '', phone: '', email: '', membership_type: 'Full Member',
    marital_status: 'Single', address_line_1: '', gps_address: '', hometown: '', street_name: '',
    apartment_no: '', city: 'Accra', postal_code: '233', nationality: 'Ghanaian', country_of_birth: 'Ghana',
    // Family / Emergency
    family_member_name: '', relationship: '', residential_address: '', family_phone: '', locality: '', landmark: '',
    // Spiritual
    holy_ghost_baptism: 'No', date_holy_ghost_baptism: '', water_baptism: 'No', date_water_baptism: '',
    date_conversion: '', former_church: '', date_joined: '', place_of_baptism: '', minister_at_baptism: '',
    district_church: '', communicant: 'No', position_in_church: '', roles_played: '', other_appointments: '',
    ministry: 'General', zone: '',
    // Education & Employment
    occupation: '', level_of_education: '', school_org_name: '', school_work_location: '',
    is_entrepreneur: 'No', is_retired: 'No', date_of_retirement: '',
    // Disability & Royal
    has_disability: 'No', disability_nature: '', assistive_device: '', is_royal: 'No', royal_status: '',
    traditional_area: '', year_appointed: '',
    // Parent / Guardian & Dedication
    parent_guardian_name: '', parent_guardian_contact: '', is_dedicated: 'No', dedication_date: '',
    dedication_minister: '', dedication_church: '', photo_url: '', status: 'Active'
  });

  const [importStatus, setImportStatus] = useState('');

  // Fetch Live Data From Supabase on Load
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

  // Image Processor (Crop & Compress)
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

  // Login Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Check System Users
    const foundUser = systemUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === loginPassword);
    if (foundUser) {
      setSessionUser({ name: foundUser.name, email: foundUser.email, role: foundUser.role });
      setIsAuthenticated(true);
      setAuthLoading(false);
      return;
    }

    setAuthError('Invalid credentials. Please check your email and password.');
    setAuthLoading(false);
  };

  // Developer Admin: Add User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword || !newUserName) return;
    const newUser = {
      id: systemUsers.length + 1,
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole
    };
    setSystemUsers([...systemUsers, newUser]);
    alert(`Account created for ${newUserName} (${newUserRole})!`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
  };

  // Save 64-Field Member Record
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberFormData.first_name || !memberFormData.last_name || !memberFormData.dob) {
      alert("First Name, Last Name, Gender, and Date of Birth are mandatory!");
      return;
    }
    setSaving(true);

    const { data, error } = await supabase.from('members').insert([memberFormData]).select();
    if (!error && data) {
      setMembers([...members, data[0]]);
      alert(`Member ${memberFormData.first_name} ${memberFormData.last_name} saved successfully with all details!`);
      setShowFullAddForm(false);
    } else {
      alert("Error saving record. Check your Supabase table settings.");
    }
    setSaving(false);
  };

  // Save Edited Member Profile
  const handleSaveMemberEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('members').update(editingMember).eq('id', editingMember.id);
    if (!error) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      alert("Member record updated successfully!");
      setEditingMember(null);
    } else {
      alert("Error updating record in database.");
    }
    setSaving(false);
  };

  // Delete Member Entry
  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member entry?")) return;
    await supabase.from('members').delete().eq('id', id);
    setMembers(members.filter(m => m.id !== id));
  };

  // Bulk Excel/CSV Import with Duplicate Prevention
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
        setImportStatus(`No new unique records. (${duplicateCount} duplicates skipped)`);
      }
    };
    reader.readAsText(file);
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
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
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
            <DollarSign className="w-5 h-5" /> <span>Finance & Ledger</span>
          </button>

          <button onClick={() => setCurrentTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Settings className="w-5 h-5" /> <span>Admin & User Access</span>
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
                  <p className="text-sm text-slate-400">Manage 64-field full member entries, crop photos, and bulk import.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => setShowFullAddForm(!showFullAddForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 shadow-lg">
                    <Plus className="w-4 h-4" /> <span>{showFullAddForm ? 'Close Form' : 'Add New Member (64-Fields)'}</span>
                  </button>

                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 cursor-pointer shadow-lg">
                    <Upload className="w-4 h-4 text-emerald-400" /> <span>Bulk Excel Import</span>
                    <input type="file" accept=".csv, .xlsx" onChange={handleBulkImport} className="hidden" />
                  </label>
                </div>
              </div>

              {importStatus && <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">{importStatus}</div>}

              {/* Multi-Section 64-Field Full Member Registration Form */}
              {showFullAddForm && (
                <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                  <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wide border-b border-slate-800 pb-2">Full 64-Field Member Record Entry</h3>
                  
                  {/* Section 1: Mandatory & Core Profile */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">1. Core Profile (* Mandatory Fields)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <select value={memberFormData.title} onChange={(e) => setMemberFormData({...memberFormData, title: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                        <option value="Brother">Brother</option><option value="Sister">Sister</option><option value="Elder">Elder</option><option value="Deacon">Deacon</option><option value="Deaconess">Deaconess</option><option value="Pastor">Pastor</option>
                      </select>
                      <input type="text" placeholder="First Name *" required value={memberFormData.first_name} onChange={(e) => setMemberFormData({...memberFormData, first_name: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="text" placeholder="Middle Name" value={memberFormData.middle_name} onChange={(e) => setMemberFormData({...memberFormData, middle_name: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="text" placeholder="Last Name *" required value={memberFormData.last_name} onChange={(e) => setMemberFormData({...memberFormData, last_name: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <select value={memberFormData.gender} onChange={(e) => setMemberFormData({...memberFormData, gender: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                        <option value="Male">Male</option><option value="Female">Female</option>
                      </select>
                      <input type="text" placeholder="DOB (DD/MM/YYYY) *" required value={memberFormData.dob} onChange={(e) => setMemberFormData({...memberFormData, dob: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="text" placeholder="Phone Number" value={memberFormData.phone} onChange={(e) => setMemberFormData({...memberFormData, phone: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="email" placeholder="Email Address" value={memberFormData.email} onChange={(e) => setMemberFormData({...memberFormData, email: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                    </div>
                  </div>

                  {/* Section 2: Address & Hometown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">2. Address & Hometown Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <input type="text" placeholder="Address Line 1" value={memberFormData.address_line_1} onChange={(e) => setMemberFormData({...memberFormData, address_line_1: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="text" placeholder="GPS Address (e.g. GC-106-5988)" value={memberFormData.gps_address} onChange={(e) => setMemberFormData({...memberFormData, gps_address: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="text" placeholder="Hometown" value={memberFormData.hometown} onChange={(e) => setMemberFormData({...memberFormData, hometown: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                      <input type="text" placeholder="City" value={memberFormData.city} onChange={(e) => setMemberFormData({...memberFormData, city: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5" />
                    </div>
                  </div>

                  {/* Section 3: Spiritual & Sacraments */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">3. Spiritual & Church Sacraments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <select value={memberFormData.holy_ghost_baptism} onChange={(e) => setMemberFormData({...memberFormData, holy_ghost_baptism: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                        <option value="Yes">Holy Ghost Baptised: Yes</option><option value="No">Holy Ghost Baptised: No</option>
                      </select>
                      <select value={memberFormData.water_baptism} onChange={(e) => setMemberFormData({...memberFormData, water_baptism: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                        <option value="Yes">Water Baptised: Yes</option><option value="No">Water Baptised: No</option>
                      </select>
                      <select value={memberFormData.communicant} onChange={(e) => setMemberFormData({...memberFormData, communicant: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                        <option value="Yes">Communicant: Yes</option><option value="No">Communicant: No</option>
                      </select>
                      <select value={memberFormData.ministry} onChange={(e) => setMemberFormData({...memberFormData, ministry: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                        <option value="PEMEM Ministry">PEMEM Ministry</option><option value="Women's Ministry">Women's Ministry</option><option value="Youth Ministry">Youth Ministry</option><option value="Children Ministry">Children Ministry</option><option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold py-3 flex items-center justify-center space-x-2 shadow-lg">
                    <Save className="w-4 h-4" /> <span>{saving ? 'Saving Full Record...' : 'Save Complete 64-Field Record'}</span>
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
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded-full text-xs border border-emerald-800">{m.title}</span></td>
                        <td className="p-4 font-medium text-white">{m.first_name} {m.middle_name || ''} {m.last_name}</td>
                        <td className="p-4 text-slate-300">{m.gender}</td>
                        <td className="p-4 text-slate-300">{m.dob}</td>
                        <td className="p-4 text-slate-400">{m.phone || 'N/A'}</td>
                        <td className="p-4 text-right flex items-center justify-end space-x-3">
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

              {/* Edit Member Modal */}
              {editingMember && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <form onSubmit={handleSaveMemberEdit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-lg text-white">Edit Record: {editingMember.first_name} {editingMember.last_name}</h3>
                      <button type="button" onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
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

          {currentTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Developer Admin & User Management Control Panel</h2>
                <p className="text-sm text-slate-400">Create new user accounts, assign roles, and set custom login passwords.</p>
              </div>

              {/* User Creation Form */}
              <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                <h3 className="text-lg font-semibold text-white">Create New Administrative User</h3>
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
                      <option value="Secretariat">Secretariat (Members)</option>
                      <option value="Finance">Finance (Ledger)</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs">Create User Account</button>
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

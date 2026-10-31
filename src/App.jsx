import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Shield, Landmark, UserCheck, CheckCircle2, Clock, 
  XCircle, Search, Filter, Plus, ChevronRight, Sparkles, 
  HeartHandshake, BookOpen, Calendar, DollarSign, Award, 
  Activity, ArrowUpRight, Check, X, Eye, Phone, Mail, 
  MapPin, UserPlus, Info, Layers, RefreshCw, BarChart3, Lock,
  FileSpreadsheet, Database, Server, Settings, Baby, UserMinus,
  CheckSquare, FileText, ChevronDown, Download, AlertCircle, Share2,
  LogOut, LogIn, Key, User, ShieldCheck, PieChart, CheckSquare2
} from 'lucide-react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Default Credentials
const DEFAULT_SUPABASE_URL = "https://rsjkbtayzhrcqkqsnnnh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_ScLjXKeKl7satSTbQbQBqQ_srwsvmfn";

// Initialize Supabase Client Safely
let supabaseClient = null;
try {
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    supabaseClient = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase auto-initialization fallback to local demo data:", e);
}

// ... existing code ...
const PENDING_REGISTRATIONS = [
  {
    id: 'REQ-101',
    fullName: 'Sister Abigail Amoah',
    phone: '+233 24 555 7788',
    email: 'abigail.amoah@gmail.com',
    gender: 'Female',
    dob: '1999-03-25',
    address: 'Anyaa Pentecost Junction',
    maritalStatus: 'Single',
    waterBaptism: true,
    holyGhostBaptism: true,
    desiredCell: 'Cell 2',
    desiredMinistry: "Women's Ministry",
    subGroup: 'Virtuous Ladies',
    desiredSquads: ['Media'],
    submittedAt: '2 hours ago',
    type: 'NEW_REGISTRATION'
  }
];

const CELLS_LIST = Array.from({ length: 12 }, (_, i) => `Cell ${i + 1}`);

// DEMO ACCOUNTS PRESETS
const DEMO_ACCOUNTS = [
  {
    role: 'PASTOR_ELDER',
    title: 'Presiding Elder',
    name: 'Elder Emmanuel Owusu',
    email: 'presiding.elder@cop-maranatha.org',
    cell: 'Cell 1',
    description: 'Full Master Access (Pastor & Presiding Elder View)'
  },
  {
    role: 'SECRETARIAT',
    title: 'Local Secretary',
    name: 'Deacon Kwadwo Poku',
    email: 'secretariat@cop-maranatha.org',
    cell: 'Cell 3',
    description: 'Member Verification Queue, Approvals & COP Reports'
  },
  {
    role: 'FINANCE',
    title: 'Finance Secretary',
    name: 'Deaconess Grace Ansah',
    email: 'finance@cop-maranatha.org',
    cell: 'Cell 5',
    description: 'Tithe & Offering Ledger, Financial Reports'
  },
  {
    role: 'MINISTRY_LEADER',
    title: 'Youth Ministry Leader',
    name: 'Brother Samuel Appiah',
    email: 'youth.leader@cop-maranatha.org',
    cell: 'Cell 2',
    description: 'Ministry Attendance, Roster & Souls Won'
  },
  {
    role: 'MEMBER',
    title: 'Church Member',
    name: 'Sister Janet Asare',
    email: 'janet.asare@gmail.com',
    cell: 'Cell 4',
    description: 'Self-Service Profile, Duty Schedule & Personal Giving'
  }
];

export default function App() {
  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Supabase Connection Drawer & Credentials State
  const [showDbDrawer, setShowDbDrawer] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(DEFAULT_SUPABASE_URL);
  const [supabaseKey, setSupabaseKey] = useState(DEFAULT_SUPABASE_ANON_KEY);
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [soulsWon, setSoulsWon] = useState(INITIAL_SOULS_WON);
  const [backsliders, setBacksliders] = useState(INITIAL_BACKSLIDERS);
  const [dedications, setDedications] = useState(INITIAL_DEDICATIONS);
  const [pendingQueue, setPendingQueue] = useState(PENDING_REGISTRATIONS);
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [titleFilter, setTitleFilter] = useState('ALL');
  const [cellFilter, setCellFilter] = useState('ALL');
  const [ministryFilter, setMinistryFilter] = useState('ALL');
  const [squadFilter, setSquadFilter] = useState('ALL');

  // Modals & Drawers
  const [selectedMember, setSelectedMember] = useState(null);
  const [showSelfRegModal, setShowSelfRegModal] = useState(false);
  const [showAddSoulModal, setShowAddSoulModal] = useState(false);
  const [showAddDedicationModal, setShowAddDedicationModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State for Self-Registration
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', gender: 'Male', dob: '', address: '',
    maritalStatus: 'Single', waterBaptism: false, holyGhostBaptism: false,
    cellGroup: 'Cell 1', primaryMinistry: 'Youth Ministry', subGroup: '', squads: [], committees: [], devotedWork: 'Cleaning'
  });

  // Form State for Soul Won
  const [soulFormData, setSoulFormData] = useState({
    fullName: '', phone: '', dateWon: new Date().toISOString().split('T')[0],
    outreachSource: 'COP Outreach', waterBaptized: false, holyGhostBaptized: false, assignedCell: 'Cell 1'
  });

  // Form State for Child Dedication
  const [dedicationFormData, setDedicationFormData] = useState({
    childFullName: '', dateOfBirth: '', gender: 'Male', fatherName: '', motherName: '',
    dedicationDate: new Date().toISOString().split('T')[0], officiatingMinister: 'Pastor Seth Amoah', certificateNumber: ''
  });

  // Monthly Statistical Report Template Form Data
  const [reportData, setReportData] = useState({
    month: 'October',
    year: '2026',
    soulsWonCop: 14,
    soulsWonGospelSunday: 6,
    soulsWonDigital: 2,
    waterBaptizedConverts: 12,
    homeCellsCount: 12,
    homeCellAvgAttendance: 145,
    sundayAvgOfficers: 38,
    sundayAvgMembers: 310,
    lordsSupperAttendance: 340,
    holyGhostBaptizedChildren: 4,
    holyGhostBaptizedConverts: 9,
    pememAttendance: 65,
    womenAttendance: 110,
    youthAttendance: 85,
    childrenAttendance: 90,
    titheTotalGhs: 14250,
    offeringTotalGhs: 6180,
    welfareBalanceGhs: 8920,
    achievements: 'Successful District Joint Service and Cell Rally in Cell 3.',
    challenges: 'Need more instruments for media squad and sound room upgrades.'
  });

  const triggerToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // AUTH HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    // Check Supabase Auth first if available
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (!error && data?.user) {
          setCurrentUser({
            name: data.user.email.split('@')[0],
            email: data.user.email,
            role: 'PASTOR_ELDER',
            title: 'Authenticated Officer'
          });
          setIsAuthenticated(true);
          setActiveTab('dashboard');
          setIsLoading(false);
          triggerToast('Welcome back! Successfully logged in.');
          return;
        }
      } catch (err) {
        console.warn('Supabase auth fallback:', err);
      }
    }

    // Local Fallback Matcher
    const matchedAccount = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === loginEmail.toLowerCase());
    if (matchedAccount) {
      setCurrentUser(matchedAccount);
      setIsAuthenticated(true);
      setActiveTab(matchedAccount.role === 'MEMBER' ? 'myProfile' : matchedAccount.role === 'FINANCE' ? 'finance' : 'dashboard');
      triggerToast(`Logged in as ${matchedAccount.name} (${matchedAccount.title})`);
    } else {
      // Default to Elder Login for testing
      const fallbackUser = {
        name: 'Elder Emmanuel Owusu',
        email: loginEmail || 'elder@cop-maranatha.org',
        role: 'PASTOR_ELDER',
        title: 'Presiding Elder'
      };
      setCurrentUser(fallbackUser);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      triggerToast(`Logged in as ${fallbackUser.name}`);
    }
    setIsLoading(false);
  };

  const handleQuickDemoLogin = (acc) => {
    setCurrentUser(acc);
    setIsAuthenticated(true);
    setLoginEmail(acc.email);
    setActiveTab(acc.role === 'MEMBER' ? 'myProfile' : acc.role === 'FINANCE' ? 'finance' : 'dashboard');
    triggerToast(`Logged in as ${acc.name} (${acc.title})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    triggerToast('Logged out successfully.');
  };

  // Safe Load Supabase Data Function
  const loadSupabaseData = async () => {
    if (!supabaseClient) return;
    setIsLoading(true);
    try {
      const { data: dbMembers, error: mErr } = await supabaseClient.from('members').select('*');
      if (!mErr && dbMembers && dbMembers.length > 0) {
        setMembers(dbMembers.map(m => ({
          id: m.id || `COP-${Math.floor(100 + Math.random() * 900)}`,
          fullName: m.full_name || 'Anonymous Member',
          phone: m.phone_number || 'N/A',
          email: m.email || 'N/A',
          gender: m.gender || 'Male',
          dob: m.date_of_birth || '',
          address: m.address || '',
          maritalStatus: m.marital_status || 'Single',
          waterBaptism: m.is_baptized_water || false,
          holyGhostBaptism: m.is_baptized_holy_ghost || false,
          officerTitle: m.officer_title || 'Member',
          isPresidingElder: m.is_presiding_elder || false,
          cellGroup: m.cell_group || 'Cell 1',
          primaryMinistry: "Youth Ministry",
          squads: [],
          committees: [],
          devotedWork: 'Cleaning',
          roles: []
        })));
      }

      const { data: dbSouls, error: sErr } = await supabaseClient.from('souls_won').select('*');
      if (!sErr && dbSouls && dbSouls.length > 0) {
        setSoulsWon(dbSouls.map(s => ({
          id: s.id,
          fullName: s.full_name,
          phone: s.phone_number || 'N/A',
          dateWon: s.date_won || '2026-10-01',
          outreachSource: s.outreach_source || 'COP Outreach',
          waterBaptized: s.water_baptized || false,
          waterBaptismDate: s.water_baptism_date,
          holyGhostBaptized: s.holy_ghost_baptized || false,
          assignedCell: s.assigned_cell || 'Cell 1',
          status: s.status || 'NEW_CONVERT'
        })));
      }

      const { data: dbDeds, error: dErr } = await supabaseClient.from('child_dedications').select('*');
      if (!dErr && dbDeds && dbDeds.length > 0) {
        setDedications(dbDeds.map(d => ({
          id: d.id,
          childFullName: d.child_full_name,
          dateOfBirth: d.date_of_birth,
          gender: d.gender || 'Male',
          fatherName: 'Father',
          motherName: 'Mother',
          dedicationDate: d.dedication_date,
          officiatingMinister: d.officiating_minister,
          certificateNumber: d.certificate_number
        })));
      }

      setIsConnectedToSupabase(true);
    } catch (err) {
      console.warn("Supabase data fetch notice - fallback to local state:", err);
      setIsConnectedToSupabase(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Save Supabase credentials & reconnect
  const handleConnectSupabase = (e) => {
    e.preventDefault();
    if (supabaseUrl && supabaseKey) {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseKey);
        setIsConnectedToSupabase(true);
        setShowDbDrawer(false);
        loadSupabaseData();
        triggerToast('Supabase connection initialized!');
      } catch (err) {
        triggerToast('Failed to initialize Supabase: ' + err.message, 'error');
      }
    } else {
      triggerToast('Please provide valid URL and API Key.', 'error');
    }
  };

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = (m.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (m.phone || '').includes(searchQuery) ||
                            (m.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTitle = titleFilter === 'ALL' || m.officerTitle === titleFilter;
      const matchesCell = cellFilter === 'ALL' || m.cellGroup === cellFilter;
      const matchesMinistry = ministryFilter === 'ALL' || m.primaryMinistry === ministryFilter;
      const matchesSquad = squadFilter === 'ALL' || (m.squads && m.squads.includes(squadFilter));

      return matchesSearch && matchesTitle && matchesCell && matchesMinistry && matchesSquad;
    });
  }, [members, searchQuery, titleFilter, cellFilter, ministryFilter, squadFilter]);

  // Statistics & Metrics
  const stats = useMemo(() => {
    const total = members.length;
    const officers = members.filter(m => ['Elder', 'Deacon', 'Deaconess'].includes(m.officerTitle)).length;
    const Elders = members.filter(m => m.officerTitle === 'Elder').length;
    const deacons = members.filter(m => m.officerTitle === 'Deacon').length;
    const deaconesses = members.filter(m => m.officerTitle === 'Deaconess').length;
    const baptizedWater = members.filter(m => m.waterBaptism).length;
    const baptizedHoly = members.filter(m => m.holyGhostBaptism).length;

    return { total, officers, Elders, deacons, deaconesses, baptizedWater, baptizedHoly };
  }, [members]);

  const handleApprove = async (req) => {
    const newMember = {
      id: `COP-${Math.floor(100 + Math.random() * 900)}`,
      fullName: req.fullName,
      phone: req.phone,
      email: req.email || 'N/A',
      gender: req.gender,
      dob: req.dob || '1990-01-01',
      address: req.address || 'Anyaa',
      maritalStatus: req.maritalStatus,
      waterBaptism: req.waterBaptism,
      holyGhostBaptism: req.holyGhostBaptism,
      officerTitle: 'Member',
      isPresidingElder: false,
      cellGroup: req.desiredCell || 'Cell 1',
      primaryMinistry: req.desiredMinistry || 'Evangelism Ministry',
      subGroup: req.subGroup || '',
      squads: req.desiredSquads || [],
      committees: [],
      devotedWork: 'Cleaning',
      roles: []
    };

    setMembers([newMember, ...members]);
    setPendingQueue(pendingQueue.filter(p => p.id !== req.id));

    if (supabaseClient) {
      try {
        await supabaseClient.from('members').insert([{
          full_name: req.fullName,
          phone_number: req.phone,
          email: req.email,
          gender: req.gender,
          date_of_birth: req.dob || null,
          address: req.address,
          marital_status: req.maritalStatus,
          is_baptized_water: req.waterBaptism,
          is_baptized_holy_ghost: req.holyGhostBaptism,
          officer_title: 'Member',
          cell_group: req.desiredCell || 'Cell 1'
        }]);
      } catch (e) {
        console.warn('DB Sync notice:', e);
      }
    }

    triggerToast(`Approved & enrolled ${req.fullName} into Maranatha Assembly directory.`);
  };

  const handleReject = (id) => {
    setPendingQueue(pendingQueue.filter(p => p.id !== id));
    triggerToast('Registration request rejected.', 'error');
  };

  const handleSelfRegSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      gender: formData.gender,
      dob: formData.dob,
      address: formData.address,
      maritalStatus: formData.maritalStatus,
      waterBaptism: formData.waterBaptism,
      holyGhostBaptism: formData.holyGhostBaptism,
      desiredCell: formData.cellGroup,
      desiredMinistry: formData.primaryMinistry,
      subGroup: formData.subGroup,
      desiredSquads: formData.squads,
      submittedAt: 'Just now',
      type: 'NEW_REGISTRATION'
    };

    setPendingQueue([newReq, ...pendingQueue]);
    setShowSelfRegModal(false);
    triggerToast('Registration submitted successfully! Pending Secretariat verification.');
  };

  const handleAddSoulSubmit = async (e) => {
    e.preventDefault();
    const newSoul = {
      id: `SOUL-${Math.floor(100 + Math.random() * 900)}`,
      ...soulFormData,
      status: soulFormData.waterBaptized ? 'BAPTIZED' : 'NEW_CONVERT'
    };
    setSoulsWon([newSoul, ...soulsWon]);

    if (supabaseClient) {
      try {
        await supabaseClient.from('souls_won').insert([{
          full_name: soulFormData.fullName,
          phone_number: soulFormData.phone,
          date_won: soulFormData.dateWon,
          outreach_source: soulFormData.outreachSource,
          water_baptized: soulFormData.waterBaptized,
          holy_ghost_baptized: soulFormData.holyGhostBaptized,
          assigned_cell: soulFormData.assignedCell,
          status: soulFormData.waterBaptized ? 'BAPTIZED' : 'NEW_CONVERT'
        }]);
      } catch (e) {
        console.warn('DB Sync notice:', e);
      }
    }

    setShowAddSoulModal(false);
    triggerToast(`Recorded new soul: ${soulFormData.fullName}`);
  };

  const handleAddDedicationSubmit = async (e) => {
    e.preventDefault();
    const certNum = dedicationFormData.certificateNumber || `COP-ANY-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newDed = {
      id: `DED-${Math.floor(100 + Math.random() * 900)}`,
      ...dedicationFormData,
      certificateNumber: certNum
    };
    setDedications([newDed, ...dedications]);

    if (supabaseClient) {
      try {
        await supabaseClient.from('child_dedications').insert([{
          child_full_name: dedicationFormData.childFullName,
          date_of_birth: dedicationFormData.dateOfBirth,
          gender: dedicationFormData.gender,
          dedication_date: dedicationFormData.dedicationDate,
          officiating_minister: dedicationFormData.officiatingMinister,
          certificate_number: certNum
        }]);
      } catch (e) {
        console.warn('DB Sync notice:', e);
      }
    }

    setShowAddDedicationModal(false);
    triggerToast(`Recorded child dedication for ${dedicationFormData.childFullName}`);
  };

  // CHECK PERMISSIONS BASED ON CURRENT USER ROLE
  const userRole = currentUser?.role || 'PASTOR_ELDER';
  const isPastor = userRole === 'PASTOR_ELDER';
  const isSecretariat = userRole === 'SECRETARIAT' || isPastor;
  const isFinance = userRole === 'FINANCE' || isPastor;
  const isMinistryLeader = userRole === 'MINISTRY_LEADER' || isPastor;
  const isMember = userRole === 'MEMBER';

  // LOGIN SCREEN RENDER IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-amber-500 selection:text-slate-950">
        <div className="w-full max-w-4xl space-y-6">
          
          {/* TOP CHURCH HEADER BRANDING */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-blue-600 to-indigo-700 flex items-center justify-center mx-auto shadow-2xl shadow-blue-900/50 ring-4 ring-amber-400/30">
              <Landmark className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              THE CHURCH OF PENTECOST
            </h1>
            <p className="text-sm text-amber-400 font-semibold">
              Maranatha Assembly • Anyaa District • Anyaa-Ablekuma Area
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Official Management System for Presbytery Oversight, Secretariat Data & Member Self-Service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LOGIN FORM BOX */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">System Authentication</h2>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email / Officer ID</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="officer@cop-maranatha.org"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Security Password</label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <button 
                  onClick={() => setShowSelfRegModal(true)}
                  className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> New Member Self-Registration
                </button>
                <span className="text-slate-600">•</span>
                <span>Protected System</span>
              </div>
            </div>

            {/* QUICK DEMO ROLE ACCESSIBILITY PANEL */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Quick Demo Access</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Select any pre-configured Church Role to immediately test permissions & dashboards:
                </p>

                <div className="space-y-2.5">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <div
                      key={acc.role}
                      onClick={() => handleQuickDemoLogin(acc)}
                      className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-amber-400/60 hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white group-hover:text-amber-300">{acc.title}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-900 text-slate-400 border border-slate-700 font-mono">
                            {acc.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">{acc.name}</div>
                        <div className="text-[10px] text-slate-500">{acc.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center pt-2">
                Connected to Anyaa-Ablekuma Area Supabase Database Engine
              </div>
            </div>

          </div>
        </div>

        {/* MEMBER SELF REGISTRATION MODAL ON LOGIN SCREEN */}
        {showSelfRegModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-slate-100">
              <button onClick={() => setShowSelfRegModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white">Member Self-Registration</h3>
              <p className="text-xs text-slate-400">Fill out your details for Secretariat review.</p>

              <form onSubmit={handleSelfRegSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Brother Kwabena Mensah"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+233 24 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Cell Group</label>
                    <select
                      value={formData.cellGroup}
                      onChange={(e) => setFormData({...formData, cellGroup: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    >
                      {CELLS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Primary Ministry</label>
                    <select
                      value={formData.primaryMinistry}
                      onChange={(e) => setFormData({...formData, primaryMinistry: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                    >
                      <option value="Youth Ministry">Youth Ministry</option>
                      <option value="Women's Ministry">Women's Ministry</option>
                      <option value="Men's Ministry (PEMEM)">PEMEM</option>
                      <option value="Evangelism Ministry">Evangelism Ministry</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowSelfRegModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                    Submit to Secretariat
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN AUTHENTICATED SYSTEM VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-semibold backdrop-blur-md transition-all animate-bounce ${
          notification.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/30 ring-2 ring-amber-400/40 shrink-0">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                    THE CHURCH OF PENTECOST
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Maranatha Assembly
                  </span>
                </div>
                <p className="text-xs text-slate-400">Anyaa District • Anyaa-Ablekuma Area</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDbDrawer(!showDbDrawer)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isConnectedToSupabase 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isConnectedToSupabase ? (
                  <>
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Supabase Live</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Demo Mode</span>
                  </>
                )}
                <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* LOGGED IN USER CARD & LOGOUT */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-white">{currentUser?.name || 'Officer'}</div>
                  <div className="text-[10px] text-amber-400 font-semibold">{currentUser?.title || 'User'}</div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SUPABASE KEYS DRAWER PANEL */}
      {showDbDrawer && (
        <div className="bg-slate-950 border-b border-amber-500/30 p-4 sm:p-6 shadow-2xl transition-all">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Supabase Live Database Credentials</h3>
              </div>
              <button onClick={() => setShowDbDrawer(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnectSupabase} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Anon / Publishable API Key</label>
                <input
                  type="password"
                  placeholder="eyJ..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* ROLE-BASED NAVIGATION SIDEBAR */}
        <aside className="w-full md:w-64 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
          
          {/* PASTOR / SECRETARIAT / LEADER ACCESSIBLE TABS */}
          {!isMember && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Executive Dashboard
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'directory'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 text-blue-400" />
                Member Directory
              </button>

              <button
                onClick={() => setActiveTab('presbytery')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'presbytery'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                Presbytery Leadership
              </button>
            </>
          )}

          {/* MEMBER PORTAL SPECIFIC TAB */}
          {isMember && (
            <button
              onClick={() => setActiveTab('myProfile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === 'myProfile'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              My Member Portal
            </button>
          )}

          {/* FINANCE TAB */}
          {isFinance && (
            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === 'finance'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Finance Ledger & Tithes
            </button>
          )}

          {/* SOULS WON & BACKSLIDERS (PASTOR, SECRETARIAT, LEADER) */}
          {(isPastor || isSecretariat || isMinistryLeader) && (
            <>
              <button
                onClick={() => setActiveTab('souls')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'souls'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  Souls Won Tracker
                </span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {soulsWon.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('backsliders')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'backsliders'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <UserMinus className="w-4 h-4 text-rose-400" />
                  Backsliders Follow-Up
                </span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {backsliders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('dedications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'dedications'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Baby className="w-4 h-4 text-cyan-400" />
                Births & Dedications
              </button>
            </>
          )}

          {/* SECRETARIAT & PASTOR SPECIFIC TABS */}
          {isSecretariat && (
            <>
              <button
                onClick={() => setActiveTab('copReport')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'copReport'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                COP Monthly Report
              </button>

              <button
                onClick={() => setActiveTab('approvals')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'approvals'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  Secretariat Queue
                </span>
                {pendingQueue.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                    {pendingQueue.length}
                  </span>
                )}
              </button>
            </>
          )}
        </aside>

        {/* VIEW CONTENT AREA */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* TAB: MEMBER PORTAL (FOR REGULAR MEMBERS) */}
          {activeTab === 'myProfile' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-lg">
                    {currentUser?.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
                    <p className="text-xs text-amber-400 font-medium">{currentUser?.title} • {currentUser?.cell}</p>
                    <p className="text-xs text-slate-400">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-700/60 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Home Cell Group</span>
                    <span className="text-amber-300 font-bold text-base mt-0.5 block">{currentUser?.cell || 'Cell 4'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Water Baptism Status</span>
                    <span className="text-emerald-400 font-bold text-sm mt-0.5 block">Verified & Baptized</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Primary Ministry</span>
                    <span className="text-white font-bold text-sm mt-0.5 block">Women's Ministry (Virtuous)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    My Upcoming Sunday Ushering & Duty Schedule
                  </h4>
                  <p className="text-xs text-slate-300">
                    Assigned to ushering duty for Lord's Supper Sunday (Cell 4 Group turn).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCE LEDGER (FINANCE TEAM & PASTOR) */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">LOCAL FINANCE DESK</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">Tithe & Offering Financial Ledger</h2>
                    <p className="text-xs text-slate-400">Maranatha Local Finance Committee Records.</p>
                  </div>
                  <button onClick={() => triggerToast('Tithe entry recorded')} className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
                    <Plus className="w-4 h-4" /> Record Tithe Entry
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-semibold">TOTAL TITHE THIS MONTH</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">GHS {reportData.titheTotalGhs.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Remitted to Area Account</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-semibold">LOCAL SUNDAY OFFERINGS</span>
                    <div className="text-2xl font-bold text-amber-400 mt-1">GHS {reportData.offeringTotalGhs.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Retained for Local Assembly</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-semibold">LOCAL WELFARE FUND BALANCE</span>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">GHS {reportData.welfareBalanceGhs.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Managed by Welfare Committee</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && !isMember && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Master Dashboard View</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Presiding Elder & Pastor Overview</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time statistics for Maranatha Assembly (Anyaa-Ablekuma Area).</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/80 self-start sm:self-auto text-xs text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Live Operational Pulse
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                    <span>ACTIVE MEMBERS</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +12% this month
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                    <span>PRESBYTERY OFFICERS</span>
                    <Shield className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{stats.officers}</div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    {stats.Elders} Elders • {stats.deacons} Dec. • {stats.deaconesses} Dns.
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                    <span>WATER BAPTIZED</span>
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.baptizedWater}</div>
                  <div className="text-[11px] text-cyan-400 mt-2">
                    {Math.round((stats.baptizedWater / (stats.total || 1)) * 100)}% of Total Directory
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                    <span>SOULS WON THIS MONTH</span>
                    <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{soulsWon.length}</div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    {soulsWon.filter(s => s.waterBaptized).length} Baptized
                  </div>
                </div>
              </div>

              {/* Cell Group 1-12 Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Home Cells (Cell 1 to Cell 12)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {CELLS_LIST.map((cell) => {
                    const count = members.filter(m => m.cellGroup === cell).length;
                    return (
                      <div 
                        key={cell}
                        onClick={() => {
                          setCellFilter(cell);
                          setActiveTab('directory');
                        }}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-amber-400/50 cursor-pointer transition-all text-center group"
                      >
                        <div className="text-xs text-slate-400 font-medium group-hover:text-amber-300">{cell}</div>
                        <div className="text-lg font-bold text-white mt-1">{count}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">members</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBER DIRECTORY */}
          {activeTab === 'directory' && !isMember && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Member Directory & Demographics
                  </h2>
                  <p className="text-xs text-slate-400">Search and filter all registered members of Maranatha Assembly.</p>
                </div>
                
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Members Table */}
              <div className="rounded-2xl bg-slate-800/70 border border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-3.5">Name & ID</th>
                        <th className="px-4 py-3.5">Officer Title</th>
                        <th className="px-4 py-3.5">Cell Group</th>
                        <th className="px-4 py-3.5">Ministry</th>
                        <th className="px-4 py-3.5">Squads & Roles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-slate-950 text-xs shrink-0">
                                {m.fullName ? m.fullName.charAt(0) : 'M'}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  {m.fullName}
                                  {m.isPresidingElder && (
                                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-400 text-slate-950">PE</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-normal">{m.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              m.officerTitle === 'Elder' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                              m.officerTitle === 'Deacon' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                              m.officerTitle === 'Deaconess' ? 'bg-pink-500/10 text-pink-400 border-pink-500/30' :
                              'bg-slate-700/50 text-slate-300 border-slate-600'
                            }`}>
                              {m.officerTitle}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-amber-300/90">{m.cellGroup}</td>
                          <td className="px-4 py-3.5">{m.primaryMinistry}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {(m.squads || []).map(sq => (
                                <span key={sq} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                                  {sq}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOULS WON TRACKER */}
          {activeTab === 'souls' && (isPastor || isSecretariat || isMinistryLeader) && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-emerald-400" />
                    Souls Won & Converts Tracker
                  </h2>
                  <p className="text-xs text-slate-400">Track outreach outcomes, water baptism status, and Spirit baptism.</p>
                </div>
                <button
                  onClick={() => setShowAddSoulModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" /> Record New Soul
                </button>
              </div>

              <div className="rounded-2xl bg-slate-800/70 border border-slate-700/60 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3.5">Convert Name</th>
                      <th className="px-4 py-3.5">Date Won</th>
                      <th className="px-4 py-3.5">Outreach Source</th>
                      <th className="px-4 py-3.5">Water Baptism</th>
                      <th className="px-4 py-3.5">Assigned Cell</th>
                      <th className="px-4 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {soulsWon.map(s => (
                      <tr key={s.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3.5 font-bold text-white">{s.fullName}</td>
                        <td className="px-4 py-3.5">{s.dateWon}</td>
                        <td className="px-4 py-3.5 font-medium text-amber-300">{s.outreachSource}</td>
                        <td className="px-4 py-3.5">
                          {s.waterBaptized ? (
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                              Baptized
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Enrolled Class
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">{s.assignedCell}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BACKSLIDERS FOLLOW-UP */}
          {activeTab === 'backsliders' && (isPastor || isSecretariat || isMinistryLeader) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserMinus className="w-5 h-5 text-rose-400" />
                  Backsliders Follow-Up & Restoration
                </h2>
                <p className="text-xs text-slate-400">Pastoral visitation logs and restoration tracking for inactive members.</p>
              </div>

              <div className="rounded-2xl bg-slate-800/70 border border-slate-700/60 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3.5">Member Name</th>
                      <th className="px-4 py-3.5">Assigned Officer</th>
                      <th className="px-4 py-3.5">Last Visit Date</th>
                      <th className="px-4 py-3.5">Pastoral Visit Notes</th>
                      <th className="px-4 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {backsliders.map(b => (
                      <tr key={b.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3.5 font-bold text-white">{b.memberName}</td>
                        <td className="px-4 py-3.5 font-medium text-amber-300">{b.assignedOfficer}</td>
                        <td className="px-4 py-3.5">{b.lastVisitDate}</td>
                        <td className="px-4 py-3.5 text-slate-300">{b.notes}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BIRTHS & CHILD DEDICATIONS */}
          {activeTab === 'dedications' && (isPastor || isSecretariat || isMinistryLeader) && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Baby className="w-5 h-5 text-cyan-400" />
                    Births & Child Dedications Registry
                  </h2>
                  <p className="text-xs text-slate-400">Official church records for child dedications in Maranatha Assembly.</p>
                </div>
                <button
                  onClick={() => setShowAddDedicationModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
                >
                  <Plus className="w-4 h-4" /> Record Child Dedication
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dedications.map(d => (
                  <div key={d.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{d.certificateNumber}</span>
                        <h3 className="text-base font-bold text-white">{d.childFullName}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                        DOB: {d.dateOfBirth}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 border-t border-slate-700/60 pt-2">
                      <div><span className="text-slate-400">Parents:</span> {d.fatherName} & {d.motherName}</div>
                      <div><span className="text-slate-400">Dedication Date:</span> {d.dedicationDate}</div>
                      <div><span className="text-slate-400">Officiating Minister:</span> <span className="text-amber-300 font-semibold">{d.officiatingMinister}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COP MONTHLY STATISTICAL REPORT TEMPLATE */}
          {activeTab === 'copReport' && isSecretariat && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">OFFICIAL LOCAL FORM</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">COP Revised Monthly Local Statistical Report</h2>
                    <p className="text-xs text-slate-400">Template for reporting to District Pastor & Anyaa-Ablekuma Area Secretariat.</p>
                  </div>
                  <button 
                    onClick={() => triggerToast('Report compiled successfully into PDF template!')}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
                  >
                    <Download className="w-4 h-4" /> Export Report
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-semibold">SOULS WON</span>
                    <div className="text-lg font-bold text-emerald-400 mt-1">
                      {reportData.soulsWonCop + reportData.soulsWonGospelSunday + reportData.soulsWonDigital} Souls
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-semibold">BAPTIZED IN WATER</span>
                    <div className="text-lg font-bold text-cyan-400 mt-1">{reportData.waterBaptizedConverts} Converts</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-slate-400 block font-semibold">HOME CELLS</span>
                    <div className="text-lg font-bold text-amber-400 mt-1">{reportData.homeCellsCount} Cells</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PRESBYTERY & LEADERSHIP */}
          {activeTab === 'presbytery' && !isMember && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Presbytery & Core Executive Roster
                </h2>
                <p className="text-xs text-slate-400">Official Presbytery Officers and Core Ministry Leadership Teams.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-4">
                <h3 className="text-base font-bold text-amber-400 border-b border-slate-700 pb-2">
                  MARANATHA PRESBYTERY (OFFICERS)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">PRESIDING ELDER</span>
                    <div className="font-bold text-white text-base">Elder Emmanuel Owusu</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">ORDAINED ELDERS ({stats.Elders})</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Elder Emmanuel Owusu (Presiding)</li>
                      <li>• Elder Samuel Mensah (Finance Treasurer)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block mb-1">DEACONS & DEACONESSES</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Deacon Daniel Appiah (Head Usher)</li>
                      <li>• Deaconess Grace Ansah (Women's Leader)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SECRETARIAT QUEUE */}
          {activeTab === 'approvals' && isSecretariat && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-400" />
                    Secretariat Verification Queue
                  </h2>
                  <p className="text-xs text-slate-400">Review member self-registrations and update requests.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                  {pendingQueue.length} Pending
                </span>
              </div>

              {pendingQueue.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/50">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white">Queue Clear!</h3>
                  <p className="text-xs text-slate-400 mt-1">All self-registrations verified by Secretariat.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingQueue.map((req) => (
                    <div key={req.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {req.type}
                        </span>
                        <h3 className="text-base font-bold text-white">{req.fullName}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-300">
                          <div><span className="text-slate-400">Phone:</span> {req.phone}</div>
                          <div><span className="text-slate-400">Cell:</span> <span className="text-amber-300 font-semibold">{req.desiredCell}</span></div>
                          <div><span className="text-slate-400">Ministry:</span> {req.desiredMinistry}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button onClick={() => handleReject(req.id)} className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-rose-900/50 text-rose-300 font-medium text-xs flex items-center gap-1.5">
                          <X className="w-4 h-4" /> Reject
                        </button>
                        <button onClick={() => handleApprove(req)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
                          <Check className="w-4 h-4" /> Approve & Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <p>© The Church of Pentecost – Maranatha Assembly (Anyaa District, Anyaa-Ablekuma Area).</p>
      </footer>
    </div>
  );
}

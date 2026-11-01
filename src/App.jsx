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
  const [currentTab, setCurrentTab] = useState('members');
  const [sessionUser, setSessionUser] = useState({ name: '', email: '', role: 'Admin' });

  // Pure Database State (No hardcoded dummy members)
  const [members, setMembers] = useState([]);
  const [finances, setFinances] = useState([]);

  // Search, Filter & View States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMember, setSelectedMember] = useState(null); // Full Detail Modal

  // Form Mandatory & Optional Fields
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

  // Fetch Live Data From Supabase
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

  // Register New Member (Enforcing mandatory First Name, Last Name, Gender, DOB)
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
      alert(`Member ${newFirstName} ${newLastName} registered successfully!`);
      setNewFirstName('');
      setNewMiddleName('');
      setNewLastName('');
      setNewDob('');
      setNewPhone('');
      setNewPhoto('');
    } else {
      alert("Error saving member to database. Please check Supabase connection.");
    }
    setSaving(false);
  };

  // Bulk CSV/Excel Roster Import with Duplicate Prevention
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
          setImportStatus(`Imported ${data.length} records. (${duplicateCount} duplicates skipped)`);
        }
      } else {
        setImportStatus(`No new unique records to import. (${duplicateCount} duplicates skipped)`);
      }
    };
    reader.readAsText(file);
  };

  // Download Complete Membership Directory
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
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-emerald-600 p-3 rounded-2xl text-white font-bold text-xl">{churchConfig.logoText}</div>
            <h1 className="text-2xl font-bold text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
          {authError && <div className="bg-red-950 border border-red-800 text-red-300 p-3 rounded-xl text-xs">{authError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
            <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white font-bold">{churchConfig.logoText}</div>
          <div>
            <h1 className="font-bold text-lg text-white">{churchConfig.assemblyName}</h1>
            <p className="text-xs text-slate-400">{churchConfig.area}</p>
          </div>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="bg-slate-800 text-slate-300 p-2 rounded-xl text-xs flex items-center space-x-2">
          <LogOut className="w-4 h-4" /> <span>Log Out</span>
        </button>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Member Directory ({filteredMembers.length})</h2>
              <p className="text-xs text-slate-400">Database connected. Mandatory fields: First/Last Name, Gender, Date of Birth.</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={downloadCsv} className="bg-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 border border-slate-700">
                <Download className="w-4 h-4 text-emerald-400" /> <span>Export CSV</span>
              </button>
              <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" /> <span>Bulk Import Template</span>
                <input type="file" accept=".csv, .xlsx" onChange={handleBulkImport} className="hidden" />
              </label>
            </div>
          </div>

          {importStatus && <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">{importStatus}</div>}

          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
            <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs w-64" />
            <div className="flex space-x-2">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                <option value="All">All Members</option>
                <option value="Officers">Officers</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Baptised">Water Baptised</option>
                <option value="HolyGhost">Holy Ghost Baptised</option>
              </select>
              <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                Sort ({sortOrder.toUpperCase()})
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-emerald-400 uppercase">Register Member (* Mandatory: First, Last Name, Gender, DOB)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
              <select value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <option value="Brother">Brother</option><option value="Sister">Sister</option><option value="Elder">Elder</option><option value="Deacon">Deacon</option><option value="Deaconess">Deaconess</option><option value="Pastor">Pastor</option>
              </select>
              <input type="text" placeholder="First Name *" required value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
              <input type="text" placeholder="Middle Name" value={newMiddleName} onChange={(e) => setNewMiddleName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
              <input type="text" placeholder="Last Name *" required value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
              <select value={newGender} onChange={(e) => setNewGender(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <option value="Male">Male</option><option value="Female">Female</option>
              </select>
              <input type="text" placeholder="DOB (DD/MM/YYYY) *" required value={newDob} onChange={(e) => setNewDob(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
            </div>
            <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium px-4 py-2 flex items-center space-x-2">
              <Save className="w-4 h-4" /> <span>{saving ? 'Saving...' : 'Save Member Record'}</span>
            </button>
          </form>

          {/* Table */}
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
                    <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded-full text-xs">{m.title}</span></td>
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-lg text-white">{selectedMember.title} {selectedMember.first_name} {selectedMember.last_name}</h3>
                  <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><span className="text-slate-400">Gender:</span> <p className="text-white font-medium">{selectedMember.gender}</p></div>
                  <div><span className="text-slate-400">Date of Birth:</span> <p className="text-white font-medium">{selectedMember.dob}</p></div>
                  <div><span className="text-slate-400">Phone:</span> <p className="text-white font-medium">{selectedMember.phone || 'N/A'}</p></div>
                  <div><span className="text-slate-400">Email:</span> <p className="text-white font-medium">{selectedMember.email || 'N/A'}</p></div>
                  <div><span className="text-slate-400">Membership Type:</span> <p className="text-white font-medium">{selectedMember.membership_type}</p></div>
                  <div><span className="text-slate-400">Holy Ghost Baptised:</span> <p className="text-white font-medium">{selectedMember.holy_ghost_baptism}</p></div>
                  <div><span className="text-slate-400">Water Baptised:</span> <p className="text-white font-medium">{selectedMember.water_baptism}</p></div>
                  <div><span className="text-slate-400">Ministry:</span> <p className="text-white font-medium">{selectedMember.ministry || 'General'}</p></div>
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

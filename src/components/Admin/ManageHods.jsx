// File Path: src/components/Admin/ManageHods.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { supabase } from "../../supabaseClient";
import { 
  User, 
  Mail, 
  KeyRound, 
  Building2, 
  Trash2, 
  Plus,
  Search,
  Shield,
  Crown,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Edit3,
  Calendar,
  Grid3X3,
  List,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Phone,
  MapPin
} from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore';

const ManageHodsPage = () => {
  // Add this to EVERY page component (AdminReportsPage, ManageHods, etc.)

const [darkMode, setDarkMode] = useState(() => 
  document.documentElement.classList.contains('dark')
);

// 🔥 Universal Dark Mode Listener - Add this useEffect to every page
useEffect(() => {
  const handleDarkModeChange = (event) => {
    setDarkMode(event.detail.darkMode);
  };

  window.addEventListener('darkModeChange', handleDarkModeChange);
  
  return () => {
    window.removeEventListener('darkModeChange', handleDarkModeChange);
  };
}, []);


  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const { profile } = useAuthStore();


  const fetchHods = useCallback(async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'hod')
        .eq('college_id', profile.college_id);

      if (error) throw error;
      setHods(data || []);
    } catch (error) {
      console.error('Error fetching HODs:', error);
      toast.error('Failed to fetch HODs');
    }
  }, [profile]);

  useEffect(() => {
    fetchHods();
  }, [fetchHods]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    if (!profile?.college_id) {
      return toast.error("Could not identify your college. Please refresh and try again.");
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'hod',
            department: formData.department,
            college_id: profile.college_id
          }
        }
      });

      if (error) throw error;

      toast.success("HOD added successfully!");
      setFormData({
        fullName: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: ''
      });
      setShowAddForm(false);
      fetchHods();
    } catch (error) {
      console.error('Error adding HOD:', error);
      toast.error(error.message || 'Failed to add HOD');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hodId, hodName) => {
    if (!window.confirm(`Are you sure you want to delete ${hodName}?`)) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', hodId);

      if (error) throw error;
      
      toast.success('HOD deleted successfully!');
      fetchHods();
    } catch (error) {
      console.error('Error deleting HOD:', error);
      toast.error('Failed to delete HOD');
    }
  };

  // Sorting and filtering logic
  const filteredAndSortedHods = hods
    .filter(hod => {
      const matchesSearch = 
        hod.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hod.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hod.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'verified') return matchesSearch && hod.is_verified;
      if (filterBy === 'unverified') return matchesSearch && !hod.is_verified;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.full_name || '';
          bValue = b.full_name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'department':
          aValue = a.department || '';
          bValue = b.department || '';
          break;
        case 'date':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const TableView = () => (
    <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-300 ${
      darkMode 
        ? 'bg-slate-800/50 border-slate-700/50' 
        : 'bg-white/70 border-slate-200/50'
    }`}>
      <div className="p-6 border-b border-slate-200/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              All HODs ({filteredAndSortedHods.length})
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All HODs</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${darkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-purple-500 transition-colors duration-200"
                >
                  <span>Name</span>
                  {sortBy === 'name' && (
                    <div className={`ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}>
                      ↑
                    </div>
                  )}
                </button>
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center space-x-1 hover:text-purple-500 transition-colors duration-200"
                >
                  <span>Email</span>
                  {sortBy === 'email' && (
                    <div className={`ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}>
                      ↑
                    </div>
                  )}
                </button>
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-1 hover:text-purple-500 transition-colors duration-200"
                >
                  <span>Department</span>
                  {sortBy === 'department' && (
                    <div className={`ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}>
                      ↑
                    </div>
                  )}
                </button>
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
                Status
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-purple-500 transition-colors duration-200"
                >
                  <span>Joined</span>
                  {sortBy === 'date' && (
                    <div className={`ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}>
                      ↑
                    </div>
                  )}
                </button>
              </th>
              <th className={`px-6 py-4 text-right text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/20">
            {filteredAndSortedHods.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Crown className={`w-8 h-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {searchTerm ? 'No HODs found' : 'No HODs added yet'}
                      </h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                        {searchTerm 
                          ? 'Try adjusting your search or filters' 
                          : 'Get started by adding your first Head of Department'
                        }
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedHods.map((hod, index) => (
                <tr 
                  key={hod.id} 
                  className={`group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-200`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                          hod.is_verified ? 'bg-emerald-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {hod.full_name || 'Unknown Name'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Head of Department
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Mail className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} truncate max-w-xs`}>
                        {hod.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} font-medium`}>
                        {hod.department || 'Not specified'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                      hod.is_verified 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {hod.is_verified ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{hod.is_verified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {hod.created_at 
                          ? new Date(hod.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : 'Unknown'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          darkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                        }`}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          darkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                        }`}
                        title="Edit HOD"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hod.id, hod.full_name)}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          darkMode ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300' : 'hover:bg-red-50 text-red-500 hover:text-red-700'
                        }`}
                        title="Delete HOD"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (if needed) */}
      {filteredAndSortedHods.length > 10 && (
        <div className="px-6 py-4 border-t border-slate-200/20 flex items-center justify-between">
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Showing {filteredAndSortedHods.length} of {hods.length} HODs
          </p>
          <div className="flex items-center space-x-2">
            <button className={`px-3 py-1 rounded-lg text-sm ${
              darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
            }`}>
              Previous
            </button>
            <button className={`px-3 py-1 rounded-lg text-sm ${
              darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
            }`}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const GridView = () => (
    <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-300 ${
      darkMode 
        ? 'bg-slate-800/50 border-slate-700/50' 
        : 'bg-white/70 border-slate-200/50'
    }`}>
      <div className="p-6 border-b border-slate-200/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Current HODs ({filteredAndSortedHods.length})
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredAndSortedHods.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6">
              <Crown className={`w-12 h-12 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {searchTerm ? 'No HODs found' : 'No HODs added yet'}
            </h3>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
              {searchTerm 
                ? 'Try adjusting your search criteria to find HODs' 
                : 'Get started by adding your first Head of Department'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add First HOD</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedHods.map((hod) => (
              <div key={hod.id} className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50/50 hover:bg-slate-100/50'
              } border border-slate-200/20`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => handleDelete(hod.id, hod.full_name)}
                    className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 ${
                      darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {hod.full_name || 'Unknown Name'}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Head of Department
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} truncate`}>
                      {hod.email}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Building2 className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} truncate`}>
                      {hod.department}
                    </span>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t border-slate-200/20 flex items-center justify-between`}>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    hod.is_verified 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {hod.is_verified ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {hod.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Manage HODs
            </h1>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Add and manage Head of Departments for your institution
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              placeholder="Search HODs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64`}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add HOD</span>
          </button>
        </div>
      </div>

      {/* Add HOD Form */}
      {showAddForm && (
        <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/70 border-slate-200/50'
        }`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Add New HOD
                </h2>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-xl transition-colors duration-200 ${
                  darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Department - Free Input */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Department *
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="e.g., Computer Science, Mechanical Engineering"
                    />
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Enter the department name (you can type any department)
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Password *
                  </label>
                  <div className="relative">
                    <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 md:col-span-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Confirm Password *
                  </label>
                  <div className="relative max-w-md">
                    <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/20">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    darkMode 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Adding HOD...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Add HOD</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HODs Display */}
      {viewMode === 'table' ? <TableView /> : <GridView />}
    </div>
  );
};

export default ManageHodsPage;

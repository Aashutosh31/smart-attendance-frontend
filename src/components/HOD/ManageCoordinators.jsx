import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Trash2, X, Mail, User, Search, GraduationCap, Calendar, ChevronDown, Building2, Lock, RefreshCw, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient.js';

const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon, name, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options.find(opt => opt.value === value) || null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}`}>
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <span className={selectedOption ? "" : "text-gray-400"}>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className={`absolute z-50 w-full mt-2 border rounded-xl shadow-lg max-h-60 overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {options.map((option) => (
            <div key={option.value} onClick={() => handleSelect(option)} className={`px-4 py-3 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-purple-50'}`}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ManageCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', department: '', dateOfJoining: '' });
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentOptions = [
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'CE', label: 'Civil Engineering' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'MBA', label: 'Business Administration' }
  ];

  // Sync with global dark mode
  useEffect(() => {
    const updateDarkMode = () => {
      const saved = localStorage.getItem('darkMode');
      setIsDarkMode(saved === 'true');
    };
    
    updateDarkMode(); // Initial load
    window.addEventListener('darkModeChange', updateDarkMode);
    return () => window.removeEventListener('darkModeChange', updateDarkMode);
  }, []);

  const fetchCoordinators = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to continue');
        return;
      }

      const { data: hodData, error: hodError } = await supabase.from('hod').select('department').eq('user_id', user.id).single();
      if (hodError) throw hodError;

      const { data: coordinatorsData, error: coordError } = await supabase.from('coordinator').select('*').eq('department', hodData.department).order('created_at', { ascending: false });
      if (coordError) throw coordError;
      
      setCoordinators(coordinatorsData || []);
    } catch (error) {
      toast.error('Failed to load coordinators');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCoordinators(); }, [fetchCoordinators]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: hodData } = await supabase.from('hod').select('department').eq('user_id', user.id).single();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { role: 'coordinator', full_name: formData.fullName, department: formData.department } }
      });
      if (authError) throw authError;

      const { error: coordError } = await supabase.from('coordinator').insert([{
        user_id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        department: formData.department,
        date_of_joining: formData.dateOfJoining,
        hod_department: hodData.department
      }]);
      if (coordError) throw coordError;

      toast.success('Coordinator added successfully!');
      setIsModalOpen(false);
      setFormData({ email: '', password: '', fullName: '', department: '', dateOfJoining: '' });
      fetchCoordinators();
    } catch (error) {
      toast.error(error.message || 'Failed to add coordinator');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.admin.updateUserById(selectedCoordinator.user_id, { password: newPassword });
      if (error) throw error;
      toast.success('Password reset successfully!');
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setSelectedCoordinator(null);
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoordinator = async (coordinator) => {
    if (!window.confirm(`Delete ${coordinator.full_name}?`)) return;
    try {
      await supabase.from('coordinator').delete().eq('id', coordinator.id);
      await supabase.auth.admin.deleteUser(coordinator.user_id);
      toast.success('Coordinator deleted successfully!');
      fetchCoordinators();
    } catch (error) {
      toast.error('Failed to delete coordinator');
    }
  };

  const filteredCoordinators = coordinators.filter(coord =>
    coord.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coord.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coord.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading Coordinators...</p>
        </div>
      </div>
    );
  }

  const dark = isDarkMode;

  return (
    <div className={`min-h-screen p-8 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Manage Coordinators</h1>
              <p className={dark ? 'text-gray-400' : 'text-gray-500'}>Add and manage program coordinators</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-2xl shadow-sm p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${dark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'}`}>Active</span>
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{coordinators.length}</h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Total Coordinators</p>
          </div>
          <div className={`rounded-2xl shadow-sm p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${dark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{new Set(coordinators.map(c => c.department)).size}</h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Departments</p>
          </div>
          <div className={`rounded-2xl shadow-sm p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${dark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{coordinators.length}</h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Active</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className={`rounded-2xl shadow-sm p-6 mb-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search coordinators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${dark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200'}`}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={fetchCoordinators} className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium ${dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 font-medium shadow-lg">
                <UserPlus className="w-5 h-5" />
                Add Coordinator
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-2xl shadow-sm overflow-hidden ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <div className={`p-6 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>All Coordinators</h2>
            <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Manage all program coordinators</p>
          </div>
          
          {filteredCoordinators.length === 0 ? (
            <div className="p-12 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <User className={`w-8 h-8 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>No coordinators found</h3>
              <p className={dark ? 'text-gray-400' : 'text-gray-500'}>{searchTerm ? 'Try adjusting your search' : 'Get started by adding a coordinator'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${dark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <th className={`text-left py-4 px-6 text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                    <th className={`text-left py-4 px-6 text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Email</th>
                    <th className={`text-left py-4 px-6 text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Department</th>
                    <th className={`text-left py-4 px-6 text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Joining Date</th>
                    <th className={`text-right py-4 px-6 text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoordinators.map((coord) => (
                    <tr key={coord.id} className={`border-b ${dark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {coord.full_name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{coord.full_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">Program Coordinator</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Mail className="w-4 h-4 text-gray-400" />
                          {coord.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                          <Building2 className="w-4 h-4" />
                          {coord.department}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {coord.date_of_joining ? new Date(coord.date_of_joining).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setSelectedCoordinator(coord); setIsPasswordModalOpen(true); }} className={`p-2 rounded-lg ${dark ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-50'}`}>
                            <KeyRound className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteCoordinator(coord)} className={`p-2 rounded-lg ${dark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}>
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${dark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`sticky top-0 border-b p-6 flex items-center justify-between ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Add New Coordinator</h2>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Fill in the coordinator details</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className={`p-2 rounded-lg ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className={`w-6 h-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>

              <form onSubmit={handleAddCoordinator} className="p-6 space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${dark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200'}`} />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="coordinator@university.edu" className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${dark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200'}`} />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="6" placeholder="Minimum 6 characters" className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${dark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200'}`} />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Department</label>
                  <CustomSelect name="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} placeholder="Select department" icon={Building2} isDarkMode={dark} />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Date of Joining</label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} required className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${dark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200'}`} />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 px-6 py-3 rounded-xl font-medium ${dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" />Adding...</> : <><UserPlus className="w-5 h-5" />Add Coordinator</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-2xl max-w-md w-full ${dark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Reset Password</h2>
                </div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Resetting password for <span className="font-semibold">{selectedCoordinator?.full_name}</span></p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 6 characters)" minLength="6" className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200'}`} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setIsPasswordModalOpen(false); setNewPassword(''); setSelectedCoordinator(null); }} className={`flex-1 px-6 py-3 rounded-xl font-medium ${dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
                  <button onClick={handleResetPassword} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" />Resetting...</> : <><KeyRound className="w-5 h-5" />Reset Password</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoordinators;

import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Trash2, X, Mail, User, Search, GraduationCap, Calendar, ChevronDown, Building2, Lock, RefreshCw, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient.js';

const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-purple-300" />}
          <span className={selectedOption ? "text-white" : "text-purple-300"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-purple-300 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-xl backdrop-blur-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
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
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [errors, setErrors] = useState({});

  // Course options for the coordinator
  const courseOptions = [
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'information_technology', label: 'Information Technology' },
    { value: 'electronics', label: 'Electronics Engineering' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'electrical', label: 'Electrical Engineering' },
  ];

  const fetchCoordinators = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, department')
        .eq('role', 'program_coordinator');
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched coordinators:', data);
      setCoordinators(data || []);
      setFilteredCoordinators(data || []);
    } catch (error) {
      console.error('Failed to fetch coordinators:', error);
      toast.error('Failed to fetch coordinators: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  useEffect(() => {
    const filtered = coordinators.filter(coordinator =>
      coordinator.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordinator.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoordinators(filtered);
  }, [searchTerm, coordinators]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.match(/^\S+@\S+$/)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Creating coordinator with data:', formData);
      
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: 'program_coordinator',
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message);
      }
      if (data?.error) {
        console.error('Edge function returned error:', data.error);
        throw new Error(data.error);
      }
      
      console.log('Coordinator created successfully:', data);
      toast.success(`Program Coordinator "${formData.full_name}" created successfully!`);
      
      // Reset form and close modal
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: ''
      });
      setShowModal(false);
      
      // Refresh coordinators list with delay
      setTimeout(() => {
        fetchCoordinators();
      }, 1000);
      
    } catch (error) {
      console.error('Create coordinator error:', error);
      toast.error('Failed to create coordinator: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCoordinator = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete coordinator "${name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Coordinator "${name}" deleted successfully!`);
      fetchCoordinators();
    } catch (error) {
      console.error('Delete coordinator error:', error);
      toast.error('Failed to delete coordinator: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-white" />
          <p className="text-white text-lg font-medium">Loading Coordinators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Program Coordinators</h1>
            <p className="text-purple-200 text-lg">Add and manage program coordinators</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchCoordinators}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold border border-white/20 transition-all duration-200 flex items-center space-x-2"
              title="Refresh coordinators list"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Coordinator</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Coordinators</p>
                <p className="text-white text-3xl font-bold">{coordinators.length}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <GraduationCap className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Departments</p>
                <p className="text-white text-3xl font-bold">{new Set(coordinators.map(c => c.department)).size}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Active</p>
                <p className="text-white text-3xl font-bold">{coordinators.length}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Coordinators Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Program Coordinators</h2>
                <p className="text-purple-200">Manage all program coordinators</p>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search coordinators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
          
          {filteredCoordinators.length === 0 ? (
            <div className="p-12 text-center">
              <GraduationCap className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No Coordinators Found' : 'No Coordinators Added Yet'}
              </h3>
              <p className="text-purple-200 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first program coordinator'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Add First Coordinator</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left py-4 px-6 text-purple-200 font-semibold uppercase tracking-wider text-sm">Name</th>
                    <th className="text-left py-4 px-6 text-purple-200 font-semibold uppercase tracking-wider text-sm">Department</th>
                    <th className="text-center py-4 px-6 text-purple-200 font-semibold uppercase tracking-wider text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCoordinators.map((coordinator) => (
                    <tr key={coordinator.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {coordinator.full_name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{coordinator.full_name || 'Unknown Name'}</p>
                            <p className="text-purple-200 text-sm">Program Coordinator</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                          {coordinator.department || 'No Department'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => deleteCoordinator(coordinator.id, coordinator.full_name)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 p-2 rounded-lg transition-colors duration-200 hover:scale-110 transform"
                          title={`Delete ${coordinator.full_name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md transform scale-100 transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Coordinator</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({
                    full_name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    department: ''
                  });
                  setErrors({});
                }}
                className="text-purple-200 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <p className="text-red-300 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter department"
                />
                {errors.department && (
                  <p className="text-red-300 text-sm mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      full_name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      department: ''
                    });
                    setErrors({});
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create Coordinator"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoordinators;

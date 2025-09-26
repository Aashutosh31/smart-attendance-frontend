// File Path: ManageCoordinators.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Trash2, X, Mail, User, Search, GraduationCap, Calendar, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient.js';
import { useAuthStore } from '../../store/AuthStore.jsx';

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
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500 z-10" />
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glow-input w-full pl-10 pr-10 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none text-left flex items-center justify-between"
      >
        <span className={selectedOption ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-slate-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AddCoordinatorModal = ({ isOpen, onClose, onCoordinatorAdded }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    course: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { collegeId, user } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
     if (!collegeId || !user?.department) {
        return toast.error("Could not identify your college or department. Please refresh and try again.");
    }

    setIsLoading(true);

    try {
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName,
                role: 'program_coordinator',
                course: formData.course,
                year: parseInt(formData.year, 10),
                department: user.department, // Assign HOD's department
                college_id: collegeId,
              },
            },
        });

      if (error) throw error;
      toast.success('Program Coordinator added successfully!');
      onCoordinatorAdded();
      setFormData({
        fullName: '', email: '', course: '', year: '', password: '', confirmPassword: ''
      });
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md mx-4 snake-border-modal">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Add Program Coordinator
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                name="course"
                placeholder="Course/Program"
                value={formData.course}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>
              <CustomSelect
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Select Year"
                icon={Calendar}
                options={[
                  { value: "1", label: "1st Year" },
                  { value: "2", label: "2nd Year" },
                  { value: "3", label: "3rd Year" },
                  { value: "4", label: "4th Year" }
                ]}
              />
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              {isLoading ? 'Adding Coordinator...' : 'Add Coordinator'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ManageCoordinators = () => {
    // ... (The rest of the ManageCoordinators component remains the same)
  const [coordinators, setCoordinators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCoordinators = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'program_coordinator');

      if (error) throw error;
      setCoordinators(data || []);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
      toast.error('Failed to fetch coordinators.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoordinators();
  }, [fetchCoordinators]);

  const handleDeleteCoordinator = async (coordinatorId) => {
    if (!window.confirm('Are you sure you want to delete this coordinator?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', coordinatorId);

      if (error) throw error;

      toast.success('Coordinator deleted successfully!');
      fetchCoordinators();
    } catch (error) {
      console.error('Error deleting coordinator:', error);
      toast.error('Failed to delete coordinator.');
    }
  };

  const filteredCoordinators = coordinators.filter(coordinator =>
    coordinator.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Manage Coordinators
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">
              Add and manage program coordinators
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <UserPlus className="h-5 w-5" />
            Add Coordinator
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="glass-card p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search coordinators by name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Coordinators Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading coordinators...</span>
            </div>
          </div>
        ) : filteredCoordinators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="h-16 w-16 text-gray-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              {searchTerm ? 'No Coordinators Found' : 'No Coordinators Yet'}
            </h3>
            <p className="text-gray-500 dark:text-slate-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Get started by adding your first program coordinator'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <UserPlus className="h-5 w-5" />
                Add First Coordinator
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Course</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Year</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Created</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoordinators.map((coordinator) => (
                  <tr key={coordinator.id} className="border-b border-gray-100 dark:border-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {coordinator.full_name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">{coordinator.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-slate-300">{coordinator.email}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm rounded-lg">
                        <GraduationCap className="h-4 w-4" />
                        {coordinator.course || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm rounded-lg">
                        <Calendar className="h-4 w-4" />
                        {coordinator.year ? `${coordinator.year}${coordinator.year === 1 ? 'st' : coordinator.year === 2 ? 'nd' : coordinator.year === 3 ? 'rd' : 'th'} Year` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-slate-400">
                      {coordinator.created_at ? new Date(coordinator.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDeleteCoordinator(coordinator.id)}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Coordinator"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddCoordinatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCoordinatorAdded={fetchCoordinators}
      />
    </div>
  );
};

export default ManageCoordinators;

// File Path: ManageFaculty.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Building, Trash2, X, Mail, User, Search, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient.js';
import { useAuthStore } from '../../store/AuthStore';

const AddFacultyModal = ({ isOpen, onClose, onFacultyAdded }) => {
    // Add this to EVERY page component (AdminReportsPage, ManageHods, etc.)

const [setDarkMode] = useState(() => 
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
    subjects: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { collegeId } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (!collegeId) {
        return toast.error("Could not identify your college. Please refresh and try again.");
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'faculty',
            department: formData.department,
            subjects: formData.subjects.split(',').map(s => s.trim()),
            college_id: collegeId,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Faculty member added! They must verify their email.');
      onFacultyAdded();
      setFormData({
        fullName: '', email: '', department: '', subjects: '', password: '', confirmPassword: ''
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md mx-4 snake-border-modal">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Add Faculty Member
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
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
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                name="subjects"
                placeholder="Subjects (comma-separated)"
                value={formData.subjects}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

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
              {isLoading ? 'Adding Faculty...' : 'Add Faculty'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ManageFaculty = () => {
    // ... (The rest of the ManageFaculty component remains the same as your provided file)
    const [facultyList, setFacultyList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  
    const fetchFacultyList = useCallback(async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'faculty');
  
        if (error) throw error;
        setFacultyList(data || []);
      } catch (error) {
        console.error('Error fetching faculty list:', error);
        toast.error('Failed to fetch faculty members.');
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchFacultyList();
    }, [fetchFacultyList]);
  
    const handleDeleteFaculty = async (facultyId) => {
      if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
  
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', facultyId);
  
        if (error) throw error;
        toast.success('Faculty member deleted successfully!');
        fetchFacultyList();
      } catch (error) {
        console.error('Error deleting faculty:', error);
        toast.error('Failed to delete faculty member.');
      }
    };
  
    const filteredFaculty = facultyList.filter(faculty =>
      faculty.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Manage Faculty
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">Add and manage faculty members</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <UserPlus className="h-5 w-5" />
              Add Faculty
            </button>
          </div>
        </div>
  
        {/* Search */}
        <div className="glass-card p-4 rounded-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search faculty by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
            />
          </div>
        </div>
  
        {/* Faculty Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                <span>Loading faculty members...</span>
              </div>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-16 w-16 text-gray-400 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
                {searchTerm ? 'No Faculty Found' : 'No Faculty Members Yet'}
              </h3>
              <p className="text-gray-500 dark:text-slate-500 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first faculty member'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <UserPlus className="h-5 w-5" />
                  Add First Faculty
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
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Department</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Created</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((faculty) => (
                    <tr key={faculty.id} className="border-b border-gray-100 dark:border-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {faculty.full_name?.charAt(0).toUpperCase() || 'F'}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">{faculty.full_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 dark:text-slate-300">{faculty.email}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm rounded-lg">
                          <Building className="h-4 w-4" />
                          {faculty.department || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-slate-400">
                        {faculty.created_at ? new Date(faculty.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteFaculty(faculty.id)}
                          className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Faculty"
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
  
        <AddFacultyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFacultyAdded={fetchFacultyList}
        />
      </div>
    );
};
  
export default ManageFaculty;

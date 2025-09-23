// src/components/Admin/ManageHods.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Building, Trash2, Camera, X, Mail, User, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient.js';
import { supabase } from '../../supabaseClient';

const AddHodModal = ({ isOpen, onClose, onHodAdded }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      department: formData.department,
      role: 'hod',
    };

    try {
      await apiClient.post('/api/accounts/users/create/', payload);
      toast.success('HOD added successfully!');
      onHodAdded();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setFormData({ fullName: '', email: '', department: '', password: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 snake-border-modal">
        <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Add New HOD
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Department */}
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              {isLoading ? 'Adding HOD...' : 'Add HOD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ManageHods = () => {
  const [hods, setHods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHods = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'hod');

      if (error) throw error;
      setHods(data || []);
    } catch (error) {
      console.error('Error fetching HODs:', error);
      toast.error('Failed to fetch HODs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHods();
  }, [fetchHods]);

  const handleDeleteHod = async (hodId) => {
    if (!window.confirm('Are you sure you want to delete this HOD?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', hodId);

      if (error) throw error;

      toast.success('HOD deleted successfully!');
      fetchHods();
    } catch (error) {
      console.error('Error deleting HOD:', error);
      toast.error('Failed to delete HOD.');
    }
  };

  const filteredHods = hods.filter(hod =>
    hod.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hod.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hod.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Manage HODs
            </h1>
            <p className="text-slate-400 mt-1">
              Add and manage Head of Departments
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <UserPlus className="h-5 w-5" />
            Add New HOD
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="glass-card p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search HODs by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* HODs Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading HODs...</span>
            </div>
          </div>
        ) : filteredHods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {searchTerm ? 'No HODs Found' : 'No HODs Yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Get started by adding your first HOD'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <UserPlus className="h-5 w-5" />
                Add First HOD
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">Department</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">Created</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHods.map((hod) => (
                  <tr key={hod.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {hod.full_name?.charAt(0).toUpperCase() || 'H'}
                        </div>
                        <span className="text-white font-medium">{hod.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{hod.email}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-lg">
                        <Building className="h-4 w-4" />
                        {hod.department || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {hod.created_at ? new Date(hod.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDeleteHod(hod.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete HOD"
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

      {/* Add HOD Modal */}
      <AddHodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHodAdded={fetchHods}
      />
    </div>
  );
};

export default ManageHods;

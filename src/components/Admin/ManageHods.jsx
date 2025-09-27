import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import { Loader, UserPlus, Trash2, X, Mail, User, Building2, Lock, RefreshCw } from "lucide-react";

const ManageHodsPage = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [hods, setHods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const password = useRef({});
  password.current = watch("password", "");

  const fetchHods = async () => {
    setIsLoading(true);
    try {
      // Enhanced query with better error handling and debugging
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, department") // Only selecting columns that exist
        .eq("role", "hod");
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Fetched HODs:", data); // Debug log
      setHods(data || []);
    } catch (error) {
      console.error("Failed to fetch HODs:", error);
      toast.error("Failed to fetch HODs: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHods();
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Creating HOD with data:", formData); // Debug log
      
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: "hod",
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message);
      }
      if (data?.error) {
        console.error("Edge function returned error:", data.error);
        throw new Error(data.error);
      }
      
      console.log("HOD created successfully:", data); // Debug log
      toast.success(`HOD "${formData.full_name}" created successfully!`);
      reset();
      setIsModalOpen(false);
      
      // Add a small delay before refetching to ensure the data is available
      setTimeout(() => {
        fetchHods();
      }, 1000);
      
    } catch (error) {
      console.error("Create HOD error:", error);
      toast.error("Failed to create HOD: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHod = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete HOD "${name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success(`HOD "${name}" deleted successfully!`);
      fetchHods(); // Refresh the list
    } catch (error) {
      console.error("Delete HOD error:", error);
      toast.error("Failed to delete HOD: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-white" />
          <p className="text-white text-lg font-medium">Loading HODs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Head of Departments</h1>
            <p className="text-purple-200 text-lg">Add and manage department heads efficiently</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchHods}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold border border-white/20 transition-all duration-200 flex items-center space-x-2"
              title="Refresh HODs list"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New HOD</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total HODs</p>
                <p className="text-white text-3xl font-bold">{hods.length}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <User className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Departments</p>
                <p className="text-white text-3xl font-bold">{new Set(hods.map(h => h.department)).size}</p>
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
                <p className="text-white text-3xl font-bold">{hods.length}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HODs Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">Department Heads</h2>
            <p className="text-purple-200">Manage all Head of Departments</p>
          </div>
          
          {hods.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No HODs Added Yet</h3>
              <p className="text-purple-200 mb-6">Start by adding your first Head of Department</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add First HOD</span>
              </button>
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
                  {hods.map((hod, index) => (
                    <tr key={hod.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {hod.full_name?.charAt(0)?.toUpperCase() || 'H'}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{hod.full_name || 'Unknown Name'}</p>
                            <p className="text-purple-200 text-sm">Head of Department</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                          {hod.department || 'No Department'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => deleteHod(hod.id, hod.full_name)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 p-2 rounded-lg transition-colors duration-200 hover:scale-110 transform"
                          title={`Delete ${hod.full_name}`}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md transform scale-100 transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New HOD</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="text-purple-200 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("full_name", { required: "Full name is required" })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <p className="text-red-300 text-sm mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Department
                </label>
                <input
                  type="text"
                  {...register("department", { required: "Department is required" })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter department"
                />
                {errors.department && (
                  <p className="text-red-300 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 chars" }})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirm_password", { 
                    required: "Please confirm your password", 
                    validate: value => value === password.current || "Passwords do not match" 
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm password"
                />
                {errors.confirm_password && (
                  <p className="text-red-300 text-sm mt-1">{errors.confirm_password.message}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
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
                    "Create HOD"
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

export default ManageHodsPage;

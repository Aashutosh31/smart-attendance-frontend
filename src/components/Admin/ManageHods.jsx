import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { supabase, supabaseAdmin } from "../../supabaseClient";
import { toast } from "react-toastify";
import {
  Loader,
  UserPlus,
  Trash2,
  X,
  Mail,
  User,
  Building2,
  Lock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const PROGRAM_OPTIONS = [
  "B.Tech",
  "M.Tech",
  "MBA",
  "BBA",
  "BCA",
  "MCA",
  "Diploma",
  "PhD",
];

const ManageHodsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  const confirmPassword = useRef({});
  password.current = watch("password", "");
  confirmPassword.current = watch("confirm_password", "");

  const [hods, setHods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

const fetchHods = async () => {
  setIsLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    setDebugInfo({
      userId: user?.id,
      email: user?.email, 
      role: user?.app_metadata?.role || user?.user_metadata?.role
    });

    // Get current admin's college_id first
    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("college_id")
      .eq("id", user.id)
      .single();

    if (adminError || !adminData?.college_id) {
      throw new Error("Unable to fetch admin college information");
    }

    // Now fetch HODs only from the same college
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, department") 
      .eq("role", "hod")
      .eq("college_id", adminData.college_id); // Filter by same college

    if (error) throw error;
    
    setHods(data || []);
  } catch (error) {
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
      // Frontend validation for confirm password
      if (formData.password !== formData.confirm_password) {
        throw new Error("Passwords do not match");
      }

      // Get current authenticated user
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        throw new Error("No active session found. Please login.");
      }

      // Fetch admin's college_id from profiles table
      const { data: adminProfile, error: profErr } = await supabase
        .from("users")
        .select("college_id")
        .eq("id", user.id)
        .single();

      if (profErr || !adminProfile?.college_id) {
        throw new Error("Unable to resolve college for the current admin.");
      }

      // Create HOD with service role (admin) client
      const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.full_name,
          role: "hod",
          department: formData.department, // program selection
          college_id: adminProfile.college_id,
        },
      });

      if (createErr) throw createErr;

      toast.success(`HOD "${formData.full_name}" created successfully!`);
      reset();
      setIsModalOpen(false);
      fetchHods();
    } catch (err) {
      console.error("Error creating HOD:", err);
      toast.error(`Error creating HOD: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHod = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete HOD "${name}"?`)) return;
    try {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;
      toast.success(`HOD "${name}" deleted successfully!`);
      fetchHods();
    } catch (error) {
      toast.error("Failed to delete HOD: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage HODs</h1>
            <p className="text-gray-600 mt-2">
              Add and manage department heads for your college.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Add New HOD
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total HODs</p>
                <p className="text-2xl font-bold text-blue-900">{hods.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Programs</p>
                <p className="text-2xl font-bold text-green-900">
                  {new Set(hods.map((h) => h.department)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Active</p>
                <p className="text-2xl font-bold text-purple-900">{hods.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HODs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hods.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No HODs have been added yet.
                  </td>
                </tr>
              ) : (
                hods.map((hod) => (
                  <tr key={hod.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {hod.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{hod.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteHod(hod.id, hod.full_name)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add HOD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New HOD</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("full_name", { required: "Full name is required" })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                {errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,   // CORRECT - single backslash
                       message: "Invalid email address"
      }

                    })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    {...register("department", { required: "Program is required" })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a program</option>
                    {PROGRAM_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    {...register("confirm_password", {
                      required: "Confirm your password",
                      validate: (val) =>
                        val === password.current || "Passwords do not match",
                    })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Re-enter password"
                  />
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create HOD
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-gray-100 rounded-lg p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Debug Information</span>
          </div>
          <p>Email: {debugInfo.email}</p>
          <p>Role: {debugInfo.role}</p>
          <p>User ID: {debugInfo.userId}</p>
        </div>
      )}
    </div>
  );
};

export default ManageHodsPage;

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import { Loader, UserPlus, Trash2, X } from "lucide-react";

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
      // *** THE FIX IS HERE ***
      // We are no longer asking for the 'email' column because it doesn't exist in this table.
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, department") // Correctly selects only existing columns
        .eq("role", "hod");
        
      if (error) throw error;
      setHods(data || []);
    } catch (error) {
      toast.error("Failed to fetch HODs: " + error.message);
      console.error("Fetch HODs error:", error);
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
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: "hod",
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      toast.success(`HOD "${formData.full_name}" created successfully!`);
      reset();
      setIsModalOpen(false);
      fetchHods();
    } catch (error) {
      toast.error("Failed to create HOD: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-purple-500" size={48} /></div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Manage Head of Departments</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Add New HOD
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-slate-800/50 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800/50">
            <thead className="bg-gray-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Department</th>
                {/* The 'Email' column has been removed to match the data we are fetching */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800/50">
              {hods.length > 0 ? (
                hods.map((hod) => (
                  <tr key={hod.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{hod.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{hod.department}</td>
                    {/* The 'Email' data cell has also been removed */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-slate-400">
                    No HODs have been added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding a new HOD (No changes needed here) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Head of Department</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                <input type="text" {...register("full_name", { required: "Full name is required" })} className="mt-1 block w-full input-field" />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Department</label>
                <input type="text" {...register("department", { required: "Department is required" })} className="mt-1 block w-full input-field" />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }})} className="mt-1 block w-full input-field" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                <input type="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 chars" }})} className="mt-1 block w-full input-field" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Confirm Password</label>
                <input type="password" {...register("confirm_password", { required: true, validate: value => value === password.current || "Passwords do not match" })} className="mt-1 block w-full input-field" />
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-36 flex items-center justify-center">
                  {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : "Create HOD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageHodsPage;
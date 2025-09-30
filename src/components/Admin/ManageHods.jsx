// File Path: src/components/Admin/ManageHods.jsx
import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useEffect and useCallback
import { toast } from 'react-toastify';
import { supabase } from "../../supabaseClient";
import { User, Mail, KeyRound, Building2, Trash2 } from 'lucide-react'; // 2. Import Trash2 icon
import { useAuthStore } from '../../store/AuthStore'; // 3. Import AuthStore to get admin's college_id

const ManageHodsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', department: '', password: '', confirmPassword: ''
  });
  const [hods, setHods] = useState([]); // 4. State to store the list of HODs
  const [loading, setLoading] = useState(false);
  const { profile } = useAuthStore(); // Get the currently logged-in admin's profile

  // 5. Function to fetch HODs from the database
  const fetchHods = useCallback(async () => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'hod')
        .eq('college_id', profile.college_id); // Only fetch HODs from the admin's college

      if (error) throw error;
      setHods(data);
    } catch (error) {
      toast.error('Failed to fetch HODs: ' + error.message);
    }
  }, [profile]);

  // 6. useEffect to run fetchHods when the component mounts
  useEffect(() => {
    fetchHods();
  }, [fetchHods]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddHod = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    try {
      // ... (rest of the add HOD logic is the same)
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          full_name: formData.fullName,
          email: formData.email,
          department: formData.department,
          password: formData.password,
          role: 'hod',
        },
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      toast.success(`HOD ${formData.fullName} has been created successfully!`);
      setFormData({ fullName: '', email: '', department: '', password: '', confirmPassword: '' });
      fetchHods(); // 7. Refresh the list after adding a new HOD
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // (Your form fields array is unchanged)
  const fields = [
    { id: 'fullName', name: 'fullName', type: 'text', placeholder: "HOD's Full Name", icon: User },
    { id: 'email', name: 'email', type: 'email', placeholder: "Email Address", icon: Mail },
    { id: 'department', name: 'department', type: 'text', placeholder: "Department (e.g., B.Tech, MBA)", icon: Building2 },
    { id: 'password', name: 'password', type: 'password', placeholder: "Temporary Password", icon: KeyRound },
    { id: 'confirmPassword', name: 'confirmPassword', type: 'password', placeholder: "Confirm Password", icon: KeyRound }
  ];

  return (
    <div className="space-y-8">
      {/* ADD HOD FORM (Your existing UI) */}
      <div className="p-6 bg-slate-900 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-400 mb-6">Add New Head of Department</h3>
          <form onSubmit={handleAddHod} className="space-y-5">
            {fields.map(({ id, name, type, placeholder, icon: Icon }) => (
              <div key={id} className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 peer-focus:text-purple-400 transition" />
                <input
                  type={type} id={id} name={name} value={formData[name]}
                  onChange={handleChange} placeholder={placeholder} required
                  className="peer w-full pl-10 pr-4 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? 'Adding HOD...' : 'Add HOD'}
            </button>
          </form>
        </div>
      </div>

      {/* 8. NEW SECTION TO DISPLAY HODs */}
      <div className="p-6 bg-slate-900 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-purple-400 mb-4">Existing Heads of Department</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 rounded-lg">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {hods.length > 0 ? (
                hods.map((hod) => (
                  <tr key={hod.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{hod.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{hod.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{hod.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-slate-400">No HODs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageHodsPage;
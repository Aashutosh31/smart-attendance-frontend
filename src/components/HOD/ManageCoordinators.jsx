import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';
import { useAuthStore } from '../../store/AuthStore';

const ManageCoordinators = () => {
  const { session, profile } = useAuthStore();
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  // Early guards for authentication, profile, and college_id
  if (!session) {
    return <div className="text-red-600 p-8 text-center text-lg font-bold">Not authenticated. Please sign in.</div>;
  }
  if (!profile) {
    return <div className="text-gray-500 p-8 text-center text-lg font-bold">Loading profile…</div>;
  }
  if (!profile.college_id) {
    return (
      <div className="text-red-600 p-8 text-center text-lg font-bold">
        Invalid college information. Please contact an administrator or register the college properly.<br />
        <span className="text-xs text-gray-400">(college_id missing in your profile)</span>
      </div>
    );
  }

  // Fetch coordinators for current college_id
  const fetchCoordinators = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coordinators')
        .select('*')
        .eq('college_id', profile.college_id);

      if (error) throw error;
      setCoordinators(data ?? []);
    } catch (error) {
      toast.error('Failed to fetch coordinators');
      setCoordinators([]);
    } finally {
      setLoading(false);
    }
  }, [profile.college_id]);

  useEffect(() => {
    fetchCoordinators();
  }, [fetchCoordinators]);

  // Handle controlled input for form
  const handleChange = (e) =>
    setFormData((fd) => ({ ...fd, [e.target.name]: e.target.value }));

  // Add Coordinator: Auth + custom table insert
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Register as Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            department: formData.department,
            role: 'coordinator',
            college_id: profile.college_id,
            // optional: created_by: profile.id
          },
        },
      });
      if (authError || !authData?.user?.id) throw authError || new Error('Auth registration failed');

      // Step 2: Insert to the coordinators table
      const coordinatorId = authData.user.id; // Important: use Auth UUID as PK!
      const { error: insertError } = await supabase.from('coordinators').insert([
        {
          id: coordinatorId,
          full_name: formData.fullName,
          email: formData.email,
          department: formData.department,
          college_id: profile.college_id,
          created_by: profile.id,
        },
      ]);
      if (insertError) throw insertError;

      toast.success('Coordinator added! Please verify their email.');
      setFormData({ fullName: '', email: '', department: '', password: '', confirmPassword: '' });
      setShowAddForm(false);
      fetchCoordinators();
    } catch (err) {
      toast.error(err.message || 'Failed to add coordinator');
    } finally {
      setLoading(false);
    }
  };

  // Delete functionality
  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete coordinator "${fullName}"?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('coordinators').delete().eq('id', id);
      if (error) throw error;
      toast.success('Coordinator deleted.');
      fetchCoordinators();
    } catch {
      toast.error('Failed to delete coordinator');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filtered = coordinators.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Coordinators</h1>
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setShowAddForm((show) => !show)}
        >
          {showAddForm ? 'Cancel' : 'Add Coordinator'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form className="bg-white rounded-lg shadow p-6 space-y-4" onSubmit={handleAddCoordinator}>
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              name="fullName"
              required
              className="input-field"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Prof. John Doe"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <input
              name="email"
              required
              type="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              placeholder="coordinator@abc.edu"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Department</label>
            <input
              name="department"
              required
              className="input-field"
              value={formData.department}
              onChange={handleChange}
              placeholder="CSE/ME/EE etc."
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              name="password"
              required
              type="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              required
              type="password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white rounded bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding Coordinator…' : 'Add Coordinator'}
          </button>
        </form>
      )}

      {/* List/Search */}
      <input
        className="input-field w-full max-w-md mb-4"
        placeholder="Search Coordinator"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Coordinator Table */}
      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-full text-left">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2 px-4 font-semibold">Name</th>
              <th className="py-2 px-4 font-semibold">Email</th>
              <th className="py-2 px-4 font-semibold">Department</th>
              <th className="py-2 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">No coordinators found for this college.</td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="odd:bg-blue-50 even:bg-white">
                <td className="py-2 px-4">{c.full_name}</td>
                <td className="py-2 px-4">{c.email}</td>
                <td className="py-2 px-4">{c.department}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-red-600 font-bold hover:underline"
                    onClick={() => handleDelete(c.id, c.full_name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-6">Loading…</div>}
      </div>
    </div>
  );
};

export default ManageCoordinators;

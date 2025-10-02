import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";
import { useAuthStore } from "../../store/AuthStore";

const ManageCoordinators = () => {
  const { session, profile, loadingProfile } = useAuthStore();
  const [coordinators, setCoordinators] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  if (loadingProfile)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-400 dark:text-gray-300 select-none">
        Loading profile...
      </div>
    );
  if (!session)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 dark:text-red-400 select-none">
        Not authenticated. Please sign in.
      </div>
    );
  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600 dark:text-gray-400 select-none">
        Loading profile...
      </div>
    );
  if (!profile.college_id)
    return (
      <div className="flex justify-center items-center h-screen text-center text-red-600 dark:text-red-400 px-4">
        <div>
          <p className="font-semibold text-2xl mb-2">
            Invalid college information.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Please contact an administrator.<br />
            (college_id missing in your profile)
          </p>
        </div>
      </div>
    );

  const fetchCoordinators = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coordinators")
        .select("*")
        .eq("college_id", profile.college_id);

      if (error) throw error;
      setCoordinators(data ?? []);
    } catch {
      toast.error("Failed to fetch coordinators");
      setCoordinators([]);
    } finally {
      setLoading(false);
    }
  }, [profile.college_id]);

  useEffect(() => {
    fetchCoordinators();
  }, [fetchCoordinators]);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            department: formData.department,
            role: "coordinator",
            college_id: profile.college_id,
          },
        },
      });
      if (authError || !authData?.user?.id) throw authError || new Error("Signup failed");

      const { error: insertError } = await supabase.from("coordinators").insert([
        {
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          department: formData.department,
          college_id: profile.college_id,
          created_by: profile.id,
        },
      ]);
      if (insertError) throw insertError;

      toast.success("Coordinator added! Please verify their email.");
      setFormData({ fullName: "", email: "", department: "", password: "", confirmPassword: "" });
      setShowAddForm(false);
      fetchCoordinators();
    } catch (err) {
      toast.error(err.message || "Failed to add coordinator");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete "${fullName}"?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("coordinators").delete().eq("id", id);
      if (error) throw error;
      toast.success("Coordinator deleted.");
      fetchCoordinators();
    } catch {
      toast.error("Failed to delete coordinator");
    } finally {
      setLoading(false);
    }
  };

  const filtered = coordinators.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 select-none">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-wide">
          Manage Coordinators
        </h1>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-700 dark:to-indigo-600 text-white px-6 py-3 font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 dark:hover:shadow-purple-700/40 transform transition duration-300"
        >
          {showAddForm ? "Cancel" : "Add Coordinator"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddCoordinator}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-8 space-y-6 shadow-2xl"
        >
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition duration-200"
              name="fullName"
              placeholder="Prof. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition duration-200"
              name="email"
              type="email"
              placeholder="coordinator@abc.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Department</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition duration-200"
              name="department"
              placeholder="Department (e.g. CSE, ME)"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition duration-200"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition duration-200"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white font-semibold hover:shadow-2xl hover:shadow-green-500/30 dark:hover:shadow-green-700/40 hover:scale-[1.02] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Coordinator..." : "Add Coordinator"}
          </button>
        </form>
      )}

      <input
        type="search"
        placeholder="Search Coordinators..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200 shadow-md"
      />

      <div className="overflow-auto rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/70 dark:to-purple-900/70">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">
                Name
              </th>
              <th className="text-left px-6 py-4 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">
                Email
              </th>
              <th className="text-left px-6 py-4 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">
                Department
              </th>
              <th className="text-left px-6 py-4 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white/40 dark:bg-gray-900/40">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-indigo-500 dark:text-indigo-400 font-semibold text-lg"
                >
                  No Coordinators found.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{c.full_name}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{c.email}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{c.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-rose-600 dark:text-rose-400 font-semibold hover:text-rose-800 dark:hover:text-rose-300 hover:underline transition duration-200"
                    onClick={() => handleDelete(c.id, c.full_name)}
                    title="Delete Coordinator"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="p-6 text-center font-semibold text-indigo-700 dark:text-indigo-400 text-lg">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoordinators;

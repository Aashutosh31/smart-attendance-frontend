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
      <div className="flex justify-center items-center h-screen text-xl text-gray-400 select-none">
        Loading profile...
      </div>
    );
  if (!session)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 select-none">
        Not authenticated. Please sign in.
      </div>
    );
  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600 select-none">
        Loading profile...
      </div>
    );
  if (!profile.college_id)
    return (
      <div className="flex justify-center items-center h-screen text-center text-red-600 px-4">
        <div>
          <p className="font-semibold text-2xl mb-2">
            Invalid college information.
          </p>
          <p className="text-sm text-gray-400">
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
    <div className="max-w-5xl mx-auto p-8 space-y-10 select-none">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-wide">
          Manage Coordinators
        </h1>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-3 font-semibold hover:scale-105 hover:shadow-xl transform transition duration-300"
        >
          {showAddForm ? "Cancel" : "Add Coordinator"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddCoordinator}
          className="bg-white bg-opacity-40 backdrop-blur-lg border border-gray-300 rounded-xl p-6 space-y-5 shadow-lg"
        >
          <div>
            <label className="font-semibold text-gray-700">Full Name</label>
            <input
              className="input-field-custom"
              name="fullName"
              placeholder="Prof. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              className="input-field-custom"
              name="email"
              type="email"
              placeholder="coordinator@abc.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Department</label>
            <input
              className="input-field-custom"
              name="department"
              placeholder="Department (e.g. CSE, ME)"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Password</label>
            <input
              className="input-field-custom"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Confirm Password</label>
            <input
              className="input-field-custom"
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
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-xl transition disabled:opacity-50"
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
        className="input-field-custom max-w-md w-full"
      />

      <div className="overflow-auto rounded-xl shadow-lg border border-gray-300 bg-white bg-opacity-40 backdrop-blur-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">
                Name
              </th>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">
                Email
              </th>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">
                Department
              </th>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-200">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-indigo-500 font-semibold"
                >
                  No Coordinators found.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-indigo-50 transition cursor-pointer"
              >
                <td className="px-6 py-4">{c.full_name}</td>
                <td className="px-6 py-4">{c.email}</td>
                <td className="px-6 py-4">{c.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-rose-600 font-semibold hover:text-rose-800 transition"
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
          <div className="p-6 text-center font-semibold text-indigo-700">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoordinators;

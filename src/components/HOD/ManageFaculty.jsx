import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";
import { useAuthStore } from "../../store/AuthStore";

const ManageFaculty = () => {
  const { session, profile, loadingProfile } = useAuthStore();
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subjects: "",
    password: "",
    confirmPassword: "",
  });

  if (loadingProfile)
    return <div className="text-center py-20 text-xl text-gray-400 dark:text-gray-300">Loading profile...</div>;
  if (!session)
    return <div className="text-center py-20 text-red-600 dark:text-red-400 font-semibold">Not authenticated. Please login.</div>;
  if (!profile)
    return <div className="text-center py-20 text-gray-600 dark:text-gray-400">Loading profile...</div>;
  if (!profile.college_id)
    return (
      <div className="text-center py-20 text-red-600 dark:text-red-400 font-medium">
        Invalid college information. Please contact admin.
      </div>
    );

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .eq("college_id", profile.college_id);
      if (error) throw error;
      setFacultyList(data ?? []);
    } catch (error) {
      toast.error("Failed to fetch faculty data");
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  }, [profile.college_id]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));


// Modify handleAddFaculty method:
const handleAddFaculty = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    return toast.error("Passwords do not match!");
  }
  setLoading(true);
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          subjects: formData.subjects.split(",").map((s) => s.trim()),
          role: "faculty",
          college_id: profile.college_id,
          department: profile.department, // Set from HOD's department here
        },
      },
    });
    if (authError || !authData?.user?.id) throw authError || new Error("Signup failed");

    const { error: insertError } = await supabase.from("faculty").insert([
      {
        id: authData.user.id,
        full_name: formData.fullName,
        email: formData.email,
        subjects: formData.subjects.split(",").map((s) => s.trim()),
        college_id: profile.college_id,
        department: profile.department, // Set from HOD's department here also
        created_by: profile.id,
      },
    ]);
    if (insertError) throw insertError;

    toast.success("Faculty added successfully! Please verify their email.");
    setFormData({
      fullName: "",
      email: "",
      subjects: "",
      password: "",
      confirmPassword: "",
    });
    setShowAddForm(false);
    fetchFaculty();
  } catch (error) {
    toast.error(error.message || "Failed to add faculty.");
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`Are you sure to delete "${fullName}"?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("faculty").delete().eq("id", id);
      if (error) throw error;
      toast.success("Faculty deleted.");
      fetchFaculty();
    } catch {
      toast.error("Failed to delete faculty.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = facultyList.filter(
    (f) =>
      f.full_name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 select-none">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-wide">
          Manage Faculty
        </h1>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-700 dark:to-indigo-600 text-white px-6 py-3 font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 dark:hover:shadow-purple-700/40 transform transition duration-300"
        >
          {showAddForm ? "Cancel" : "Add Faculty"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddFaculty}
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
              placeholder="faculty@abc.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Subjects (comma separated)</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition duration-200"
              name="subjects"
              placeholder="e.g. Mathematics, Physics"
              value={formData.subjects}
              onChange={handleChange}
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
            {loading ? "Adding Faculty..." : "Add Faculty"}
          </button>
        </form>
      )}

      <input
        type="search"
        placeholder="Search Faculty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200 shadow-md mb-4"
      />

      <div className="overflow-auto rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/70 dark:to-purple-900/70">
            <tr>
              <th className="text-left text-indigo-700 dark:text-indigo-300 px-6 py-4 font-semibold uppercase tracking-wide text-sm">Name</th>
              <th className="text-left text-indigo-700 dark:text-indigo-300 px-6 py-4 font-semibold uppercase tracking-wide text-sm">Email</th>
              <th className="text-left text-indigo-700 dark:text-indigo-300 px-6 py-4 font-semibold uppercase tracking-wide text-sm">Department</th>
              <th className="text-left text-indigo-700 dark:text-indigo-300 px-6 py-4 font-semibold uppercase tracking-wide text-sm">Subjects</th>
              <th className="text-left text-indigo-700 dark:text-indigo-300 px-6 py-4 font-semibold uppercase tracking-wide text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white/40 dark:bg-gray-900/40">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-indigo-500 dark:text-indigo-400 font-semibold text-lg">
                  No faculty found.
                </td>
              </tr>
            )}
            {filtered.map((f) => (
              <tr key={f.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition duration-200 cursor-pointer">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{f.full_name}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{f.email}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{f.department}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{f.subjects?.join(", ")}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-red-600 dark:text-red-400 font-semibold hover:text-red-800 dark:hover:text-red-300 hover:underline transition duration-200"
                    onClick={() => handleDelete(f.id, f.full_name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="py-6 text-indigo-700 dark:text-indigo-400 font-semibold text-center text-lg">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFaculty;

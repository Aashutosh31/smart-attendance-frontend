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
    department: "",
    subjects: "",
    password: "",
    confirmPassword: "",
  });

  if (loadingProfile)
    return <div className="text-center py-20 text-xl">Loading profile...</div>;
  if (!session)
    return <div className="text-center py-20 text-red-600">Not authenticated. Please login.</div>;
  if (!profile)
    return <div className="text-center py-20 text-gray-600">Loading profile...</div>;
  if (!profile.college_id)
    return (
      <div className="text-center py-20 text-red-600">
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

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      // Sign up as supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            department: formData.department,
            subjects: formData.subjects.split(",").map((s) => s.trim()),
            role: "faculty",
            college_id: profile.college_id,
          },
        },
      });
      if (authError || !authData?.user?.id) throw authError || new Error("Signup failed");

      // Insert into faculty table
      const { error: insertError } = await supabase.from("faculty").insert([
        {
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          department: formData.department,
          subjects: formData.subjects.split(",").map((s) => s.trim()),
          college_id: profile.college_id,
          created_by: profile.id,
        },
      ]);
      if (insertError) throw insertError;

      toast.success(
        "Faculty added successfully! Please ask them to verify their email."
      );
      setFormData({
        fullName: "",
        email: "",
        department: "",
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
    <div className="max-w-5xl mx-auto p-8 space-y-10 select-none">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-wide">
          Manage Faculty
        </h1>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-3 font-semibold hover:scale-105 hover:shadow-xl transform transition duration-300"
        >
          {showAddForm ? "Cancel" : "Add Faculty"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddFaculty}
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
              placeholder="faculty@abc.edu"
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
            <label className="font-semibold text-gray-700">Subjects (comma separated)</label>
            <input
              className="input-field-custom"
              name="subjects"
              placeholder="e.g. Mathematics, Physics"
              value={formData.subjects}
              onChange={handleChange}
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
            {loading ? "Adding Faculty..." : "Add Faculty"}
          </button>
        </form>
      )}

      <input
        type="search"
        placeholder="Search Faculty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field-custom max-w-md w-full mb-4"
      />

      <div className="overflow-auto rounded-xl shadow-lg border border-gray-300 bg-white bg-opacity-40 backdrop-blur-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="text-left text-indigo-700 px-6 py-3 font-medium">Name</th>
              <th className="text-left text-indigo-700 px-6 py-3 font-medium">Email</th>
              <th className="text-left text-indigo-700 px-6 py-3 font-medium">Department</th>
              <th className="text-left text-indigo-700 px-6 py-3 font-medium">Subjects</th>
              <th className="text-left text-indigo-700 px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-200">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-indigo-500 font-semibold">
                  No faculty found.
                </td>
              </tr>
            )}
            {filtered.map((f) => (
              <tr key={f.id} className="hover:bg-indigo-50 cursor-pointer">
                <td className="px-6 py-4">{f.full_name}</td>
                <td className="px-6 py-4">{f.email}</td>
                <td className="px-6 py-4">{f.department}</td>
                <td className="px-6 py-4">{f.subjects?.join(", ")}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-red-600 font-semibold hover:text-red-800"
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
          <div className="py-6 text-indigo-700 font-semibold text-center">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFaculty;

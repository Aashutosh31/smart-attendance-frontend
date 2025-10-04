import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuthStore } from "../../store/AuthStore";
import { toast } from "react-toastify";

const AddStudentPage = () => {
  const { profile, loadingProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    enrollmentNumber: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    fetchStudents();
  }, [profile]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("college_id", profile.college_id)
        .eq("department", profile.department);
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      toast.error("Failed to fetch students");
    }
    setLoading(false);
  };

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            gender: formData.gender,
            role: "student",
            department: profile.department,
            college_id: profile.college_id,
            enrollment_number: formData.enrollmentNumber,
          },
        },
      });
      if (authError || !authData?.user?.id)
        throw authError || new Error("Signup failed");

      // Insert into students table
      const { error: insertError } = await supabase.from("students").insert([
        {
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          enrollment_number: formData.enrollmentNumber,
          gender: formData.gender,
          department: profile.department,
          college_id: profile.college_id,
          created_by: profile.id,
        },
      ]);
      if (insertError) throw insertError;

      toast.success("Student added successfully! Please verify email.");
      setFormData({
        fullName: "",
        email: "",
        enrollmentNumber: "",
        gender: "",
        password: "",
        confirmPassword: "",
      });
      fetchStudents();
    } catch (error) {
      toast.error(error.message || "Failed to add student");
    }
    setLoading(false);
  };

  if (loadingProfile) return <div>Loading profile...</div>;
  if (!profile) return <div>Please login to add students.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent my-4">
            Add Student
          </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md space-y-6"
          autoComplete="off"
        >
          <div>
            <label className="block font-semibold mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="input-field-custom"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field-custom"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="enrollmentNumber">
              Enrollment Number
            </label>
            <input
              id="enrollmentNumber"
              name="enrollmentNumber"
              type="text"
              required
              value={formData.enrollmentNumber}
              onChange={handleChange}
              className="input-field-custom"
              placeholder="ENR123456"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="input-field-custom"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field-custom"
              placeholder="Enter a password"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field-custom"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? "Adding student..." : "Add Student"}
          </button>
        </form>
      </div>

      <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent my-2">
            Students list
          </h1>
        <table className="min-w-full bg-white rounded shadow divide-y divide-gray-300">
          <thead className="bg-indigo-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">Full Name</th>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">Email</th>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">Enrollment No</th>
              <th className="text-left px-6 py-3 font-medium text-indigo-700">Gender</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-indigo-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-indigo-50 cursor-pointer"
                >
                  <td className="px-6 py-4">{student.full_name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.enrollment_number}</td>
                  <td className="px-6 py-4">{student.gender}</td>
                </tr>
              ))
            )}
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

export default AddStudentPage;

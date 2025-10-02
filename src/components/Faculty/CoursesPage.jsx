import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';

const ManageCoursesPage = () => {
  const { profile } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  // Fetch courses depending on the user's role
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      if (profile.role === 'hod') {
        // HOD sees only courses they created
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('created_by', profile.id);
        
        if (error) throw error;
        setCourses(data ?? []);
      } else if (profile.role === 'faculty') {
        // Faculty sees only courses enrolled in
        // Step 1: Get course IDs from enrollment table
        const { data: enrollments, error: enrollError } = await supabase
          .from('course_faculty_enrollments')
          .select('course_id')
          .eq('faculty_id', profile.id);

        if (enrollError) throw enrollError;

        if (!enrollments || enrollments.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch courses matching those IDs
        const courseIds = enrollments.map((e) => e.course_id);
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);

        if (coursesError) throw coursesError;
        setCourses(coursesData ?? []);
      } else {
        // Other roles see no courses
        setCourses([]);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch courses');
      setCourses([]);
    }
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    if (profile) {
      fetchCourses();
    }
  }, [fetchCourses, profile]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('courses').insert([
        {
          name: formData.name,
          code: formData.code,
          description: formData.description,
          department: profile.department,
          college_id: profile.college_id,
          created_by: profile.id,
        },
      ]);
      if (error) throw error;
      toast.success('Course added successfully!');
      setFormData({ name: '', code: '', description: '' });
      setShowAddForm(false);
      fetchCourses();
    } catch (error) {
      toast.error(error.message || 'Failed to add course');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete course');
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (!profile) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-wide">
          Manage Courses
        </h1>
        {profile.role === 'hod' && (
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-700/40 transition duration-300"
            onClick={() => setShowAddForm((s) => !s)}
          >
            {showAddForm ? 'Cancel' : 'Add Course'}
          </button>
        )}
      </div>

      {showAddForm && profile.role === 'hod' && (
        <form className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-6 rounded-2xl space-y-6 shadow-2xl" onSubmit={handleAddCourse}>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Name</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200"
              placeholder="e.g. Data Structures"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Code</label>
            <input
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200"
              placeholder="e.g. CS101"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200 resize-none"
              placeholder="Brief course description"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white font-semibold hover:shadow-2xl hover:shadow-green-500/30 dark:hover:shadow-green-700/40 hover:scale-[1.02] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Course'}
          </button>
        </form>
      )}

      <input
        type="search"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent mb-4 shadow-md transition duration-200"
      />

      <div className="overflow-auto rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg">
        <table className="min-w-full text-left divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/70 dark:to-purple-900/70">
            <tr>
              <th className="py-4 px-6 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">Name</th>
              <th className="py-4 px-6 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">Code</th>
              <th className="py-4 px-6 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">Description</th>
              {profile.role === 'hod' && (
                <th className="py-4 px-6 font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide text-sm">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white/40 dark:bg-gray-900/40">
            {filteredCourses.length === 0 && (
              <tr>
                <td
                  colSpan={profile.role === 'hod' ? 4 : 3}
                  className="py-12 text-center text-gray-500 dark:text-gray-400 font-semibold text-lg"
                >
                  No courses found.
                </td>
              </tr>
            )}
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition duration-200 cursor-pointer">
                <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">{course.name}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{course.code}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{course.description}</td>
                {profile.role === 'hod' && (
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold hover:underline transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center p-6 font-semibold text-indigo-700 dark:text-indigo-400 text-lg">Loading...</div>}
      </div>
    </div>
  );
};

export default ManageCoursesPage;

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

  if (!profile) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        {profile.role === 'hod' && (
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => setShowAddForm((s) => !s)}
          >
            {showAddForm ? 'Cancel' : 'Add Course'}
          </button>
        )}
      </div>

      {showAddForm && profile.role === 'hod' && (
        <form className="bg-white p-4 rounded shadow space-y-4" onSubmit={handleAddCourse}>
          <div>
            <label className="block font-semibold mb-1">Course Name</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="e.g. Data Structures"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Course Code</label>
            <input
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="e.g. CS101"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field w-full"
              placeholder="Brief course description"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
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
        className="input-field max-w-md mb-4"
      />

      <div className="overflow-auto rounded shadow border border-gray-300">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 font-semibold">Name</th>
              <th className="py-2 px-4 font-semibold">Code</th>
              <th className="py-2 px-4 font-semibold">Description</th>
              {profile.role === 'hod' && (
                <th className="py-2 px-4 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 && (
              <tr>
                <td
                  colSpan={profile.role === 'hod' ? 4 : 3}
                  className="py-6 text-center text-gray-500"
                >
                  No courses found.
                </td>
              </tr>
            )}
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{course.name}</td>
                <td className="py-2 px-4">{course.code}</td>
                <td className="py-2 px-4">{course.description}</td>
                {profile.role === 'hod' && (
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center p-4 font-semibold">Loading...</div>}
      </div>
    </div>
  );
};

export default ManageCoursesPage;

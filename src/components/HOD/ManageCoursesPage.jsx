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
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [enrolledFaculty, setEnrolledFaculty] = useState([]);
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
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('created_by', profile.id);
        
        if (error) throw error;
        setCourses(data ?? []);
      } else if (profile.role === 'faculty') {
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

        const courseIds = enrollments.map((e) => e.course_id);
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);

        if (coursesError) throw coursesError;
        setCourses(coursesData ?? []);
      } else {
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

  // Fetch faculty from department
  const fetchFaculty = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('department', profile.department);
      if (error) throw error;
      setFacultyList(data || []);
    } catch (error) {
      toast.error('Failed to fetch faculty');
    }
  }, [profile]);

  // Fetch enrolled faculty for selected course
  const fetchEnrolledFaculty = useCallback(async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('course_faculty_enrollments')
        .select('faculty_id')
        .eq('course_id', courseId);
      if (error) throw error;
      setEnrolledFaculty(data?.map(e => e.faculty_id) || []);
    } catch (error) {
      toast.error('Failed to fetch enrollments');
    }
  }, []);

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

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
    fetchFaculty();
    fetchEnrolledFaculty(course.id);
  };

  const handleEnrollToggle = async (facultyId) => {
    try {
      const isEnrolled = enrolledFaculty.includes(facultyId);
      
      if (isEnrolled) {
        // Unenroll
        const { error } = await supabase
          .from('course_faculty_enrollments')
          .delete()
          .eq('course_id', selectedCourse.id)
          .eq('faculty_id', facultyId);
        if (error) throw error;
        toast.success('Faculty unenrolled');
      } else {
        // Enroll
        const { error } = await supabase
          .from('course_faculty_enrollments')
          .insert([{ course_id: selectedCourse.id, faculty_id: facultyId }]);
        if (error) throw error;
        toast.success('Faculty enrolled');
      }
      
      fetchEnrolledFaculty(selectedCourse.id);
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200"
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
        className="w-full max-w-md px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent mb-4 shadow-md transition duration-200"
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
                  <td className="py-4 px-6 space-x-3">
                    <button
                      onClick={() => handleEnrollClick(course)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline transition duration-200"
                    >
                      Manage Faculty
                    </button>
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

      {/* Faculty Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Enroll Faculty - {selectedCourse?.name}
              </h2>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl transition duration-200"
              >
                &times;
              </button>
            </div>
            
            {facultyList.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No faculty available in your department.</p>
            ) : (
              <div className="space-y-3">
                {facultyList.map((faculty) => (
                  <div
                    key={faculty.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{faculty.full_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{faculty.email}</p>
                    </div>
                    <button
                      onClick={() => handleEnrollToggle(faculty.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                        enrolledFaculty.includes(faculty.id)
                          ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30'
                          : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30'
                      }`}
                    >
                      {enrolledFaculty.includes(faculty.id) ? 'Unenroll' : 'Enroll'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursesPage;

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { Book, Plus, Trash2, Loader, Users } from 'lucide-react';

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', facultyId: '' });
  
  // State for the real faculty data fetched from the backend
  const [facultyList, setFacultyList] = useState([]);
  const [isFacultyLoading, setIsFacultyLoading] = useState(true);

  const token = useAuthStore((state) => state.session?.access_token);

  // Function to fetch all existing courses
  const fetchCourses = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load courses.');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- THIS IS THE CRITICAL FIX ---
  // Fetches the list of real faculty members from the backend
  const fetchFaculty = async () => {
    if (!token) return;
    setIsFacultyLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/admin/users/role/faculty`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load faculty list.');
      const data = await response.json();
      setFacultyList(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFacultyLoading(false);
    }
  };

  // Fetch both courses and faculty when the component loads
  useEffect(() => {
    fetchCourses();
    fetchFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Handles creating a new course with the selected real faculty ID
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code || !newCourse.facultyId) {
      return toast.error('Please fill all fields, including selecting a faculty.');
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse), // Send the complete course object
      });
      if (!response.ok) throw new Error('Failed to create course.');
      toast.success('Course created successfully!');
      setNewCourse({ name: '', code: '', facultyId: '' }); // Reset form
      fetchCourses(); // Refresh the list of courses
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete course.');
        toast.success('Course deleted successfully!');
        fetchCourses(); // Refresh the list
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Manage Courses</h1>
      
      {/* Create Course Form */}
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md mb-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Add New Course</h2>
        <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <input
            type="text"
            name="name"
            value={newCourse.name}
            onChange={handleInputChange}
            placeholder="Course Name (e.g., DSA)"
            className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 border-2 border-transparent focus:border-purple-500 focus:ring-0 transition"
          />
          <input
            type="text"
            name="code"
            value={newCourse.code}
            onChange={handleInputChange}
            placeholder="Course Code (e.g., CS-301)"
            className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 border-2 border-transparent focus:border-purple-500 focus:ring-0 transition"
          />
          <select
            name="facultyId"
            value={newCourse.facultyId}
            onChange={handleInputChange}
            disabled={isFacultyLoading}
            className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 border-2 border-transparent focus:border-purple-500 focus:ring-0 transition disabled:opacity-50"
          >
            <option value="">{isFacultyLoading ? 'Loading Faculty...' : 'Assign Faculty'}</option>
            {facultyList.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          <button type="submit" className="flex items-center justify-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
            <Plus size={20} className="mr-2" /> Add Course
          </button>
        </form>
      </div>

      {/* Existing Courses List */}
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Existing Courses</h2>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {courses.length > 0 ? courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center">
                  <Book className="text-purple-500 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{course.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{course.code}</p>
                  </div>
                </div>
                <div className="flex items-center">
                   {course.faculty && <p className='text-sm text-gray-600 dark:text-slate-300 mr-4 flex items-center'><Users size={16} className='mr-2'/>{course.faculty.name}</p>}
                  <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 dark:text-slate-400 py-4">No courses have been created yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoursesPage;
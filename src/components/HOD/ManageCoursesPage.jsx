import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { Book, Plus, Trash2, Loader, Users } from 'lucide-react';
import API from '../../utils/api';

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', facultyId: '' });
  
  const [facultyList, setFacultyList] = useState([]);
  const [isFacultyLoading, setIsFacultyLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await API.get('/api/hod/courses');
      setCourses(response.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await API.get('/api/hod/faculty'); // Assuming this is available at HOD level
      const data = response.data || response || [];
      setFacultyList(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFacultyLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourses();
    fetchFaculty();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/hod/courses', newCourse);
      toast.success('Course created successfully!');
      setCourses([...courses, response.data]);
      setNewCourse({ name: '', code: '', facultyId: '' }); // Reset form
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await API.delete(`/api/hod/courses/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success('Course deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Courses</h1>
        </div>
        
        {/* Form for adding a new course */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white flex items-center">
            <Plus className="mr-3 text-purple-500"/>
            Add New Course
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Course Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCourse.name}
                onChange={handleInputChange}
                className="p-2 border rounded-md bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                placeholder="e.g., Intro to Web Dev"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="code" className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Course Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={newCourse.code}
                onChange={handleInputChange}
                className="p-2 border rounded-md bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                placeholder="e.g., CS101"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="facultyId" className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Assign Faculty</label>
              <select
                id="facultyId"
                name="facultyId"
                value={newCourse.facultyId}
                onChange={handleInputChange}
                className="p-2 border rounded-md bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                required
              >
                <option value="">{isFacultyLoading ? 'Loading...' : 'Select Faculty'}</option>
                {!isFacultyLoading && facultyList.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="md:col-start-3 bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              Create Course
            </button>
          </form>
        </div>

        {/* List of existing courses */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Existing Courses</h2>
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
            )) : (
              <p className="text-center text-gray-500 dark:text-slate-400 py-4">No courses have been created yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoursesPage;
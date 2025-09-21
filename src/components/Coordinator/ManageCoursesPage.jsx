import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { Plus, BookOpen, Users, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';

// Reusable Modal for Adding/Editing Courses
const CourseModal = ({ isOpen, onClose, onCourseHandled, token, existingCourse }) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingCourse) {
      setCourseName(existingCourse.name || '');
      setCourseCode(existingCourse.code || '');
    } else {
      setCourseName('');
      setCourseCode('');
    }
  }, [existingCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isEditing = !!existingCourse;
    const url = isEditing ? `import.meta.env.VITE_API_HOST/api/admin/courses/${existingCourse.id}` : 'import.meta.env.VITE_API_HOST/api/admin/courses';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: courseName, code: courseCode }),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} course.`);
      toast.success(`Course ${isEditing ? 'updated' : 'added'} successfully!`);
      onCourseHandled();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800   mb-6">{existingCourse ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 ">Course Name</label>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">{isLoading ? 'Saving...' : 'Save Course'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const token = useAuthStore((state) => state.token);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('import.meta.env.VITE_API_HOST/api/courses', { // Assuming a general endpoint to get all courses
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch courses.');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };
  
  const handleCourseHandled = () => {
    handleModalClose();
    fetchCourses();
  };

  return (
    <div>
      <CourseModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCourseHandled={handleCourseHandled}
        token={token}
        existingCourse={editingCourse}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800  dark:text-white">Manage Courses</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Plus size={18} />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{course.students || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => { setEditingCourse(course); setIsModalOpen(true); }} className="text-gray-400 hover:text-gray-600"><MoreHorizontal /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCoursesPage;
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useAuthStore } from '../../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    courseId: '',
  });
  const [courses, setCourses] = useState([]); // State to hold the course list
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Could not fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCourses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/coordinator/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student');
      }
      toast.success('Student added successfully!');
      setFormData({ name: '', email: '', rollNo: '', courseId: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Student</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... other form inputs ... */}
           {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          {/* Roll Number */}
          <div>
            <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input type="text" name="rollNo" id="rollNo" required value={formData.rollNo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* Course Selection (Now dynamic) */}
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Assign to Course</label>
            <select name="courseId" id="courseId" required value={formData.courseId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 disabled:bg-blue-400">
              <UserPlus size={18} />
              <span>{isLoading ? 'Adding Student...' : 'Add Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;
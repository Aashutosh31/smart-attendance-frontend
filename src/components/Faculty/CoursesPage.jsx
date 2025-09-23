import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  Clock,
  X,
  User,
  Hash,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';

const AddEditCourseModal = ({ isOpen, onClose, course = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    instructor: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        code: course.code,
        description: course.description,
        credits: course.credits,
        instructor: course.instructor
      });
    } else {
      setFormData({ name: '', code: '', description: '', credits: '', instructor: '' });
    }
  }, [course, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your existing submit logic
    toast.success(course ? 'Course updated successfully!' : 'Course added successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md mx-4 snake-border-modal">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {course ? 'Edit Course' : 'Add New Course'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Course Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Course Code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <input
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={(e) => setFormData({...formData, credits: e.target.value})}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-slate-500" />
              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none transition-all mt-6"
            >
              {course ? 'Update Course' : 'Add Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    // Your existing fetch logic
    setCourses([
      {
        id: 1,
        name: 'Advanced React Development',
        code: 'CS301',
        instructor: 'Dr. Smith',
        credits: 3,
        students: 45,
        description: 'Learn advanced React patterns and best practices'
      },
      {
        id: 2,
        name: 'Database Systems',
        code: 'CS205',
        instructor: 'Prof. Johnson',
        credits: 4,
        students: 38,
        description: 'Comprehensive database design and management'
      }
    ]);
    setLoading(false);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success('Course deleted successfully!');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading courses...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                My Courses
              </h1>
            </div>
            <p className="text-gray-600 dark:text-slate-400">
              Manage your courses and track student enrollment
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus className="h-5 w-5" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search courses by name, code, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              {searchTerm ? 'No Courses Found' : 'No Courses Yet'}
            </h3>
            <p className="text-gray-500 dark:text-slate-500 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first course'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Plus className="h-5 w-5" />
                Add First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {course.name}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                      {course.code}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-blue-500 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
                  {course.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Instructor:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Credits:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{course.credits}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Students:</span>
                    <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                      <Users className="h-3 w-3" />
                      {course.students}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddEditCourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        course={editingCourse}
      />
    </div>
  );
};

export default CoursesPage;

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { supabase } from "../../supabaseClient";
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Grid3X3,
  List,
  User,
  Code,
  BookMarked,
  Eye,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore';

const ManageCoursesPage = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    credits: '',
    semester: '',
    description: ''
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterSemester, setFilterSemester] = useState('all');
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const { profile } = useAuthStore();

  useEffect(() => {
    const handleDarkModeChange = (event) => {
      setDarkMode(event.detail.darkMode);
    };
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  const fetchCourses = useCallback(async () => {
    if (!profile?.department) return;
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('department', profile.department)
        .eq('college_id', profile.college_id);
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    }
  }, [profile]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.college_id || !profile?.department) {
      return toast.error("Could not identify your department. Please refresh and try again.");
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          course_name: formData.courseName,
          course_code: formData.courseCode,
          credits: parseInt(formData.credits),
          semester: parseInt(formData.semester),
          description: formData.description,
          department: profile.department,
          college_id: profile.college_id,
          created_by: profile.id
        });
      if (error) throw error;
      toast.success("Course added successfully!");
      setFormData({
        courseName: '',
        courseCode: '',
        credits: '',
        semester: '',
        description: ''
      });
      setShowAddForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`)) return;
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      if (error) throw error;
      toast.success('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesSearch =
        course.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = filterSemester === 'all' ||
        course.semester?.toString() === filterSemester;
      return matchesSearch && matchesSemester;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.course_name || '';
          bValue = b.course_name || '';
          break;
        case 'code':
          aValue = a.course_code || '';
          bValue = b.course_code || '';
          break;
        case 'semester':
          aValue = a.semester || 0;
          bValue = b.semester || 0;
          break;
        case 'credits':
          aValue = a.credits || 0;
          bValue = b.credits || 0;
          break;
        default:
          return 0;
      }
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const CourseCard = ({ course }) => (
    <div className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${darkMode
      ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50'
      : 'bg-white/70 hover:bg-white/90 border border-slate-200/50'
      } backdrop-blur-sm shadow-xl hover:shadow-2xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {course.course_name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {course.course_code}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
          Sem {course.semester}
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <Users className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {course.enrolled_students || 0} Students
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <BookMarked className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {course.credits} Credits
          </span>
        </div>
        {course.coordinator_name && (
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {course.coordinator_name}
            </span>
          </div>
        )}
      </div>
      {course.description && (
        <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {course.description}
        </p>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/20">
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'active'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
            <div className="flex items-center space-x-1">
              {course.status === 'active' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              <span>{course.status || 'Active'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${darkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${darkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
            title="Edit Course"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(course.id, course.course_name)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${darkMode ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300' : 'hover:bg-red-100 text-red-500 hover:text-red-700'}`}
            title="Delete Course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Manage Courses
            </h1>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Create and manage department courses
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className={`px-8 py-3 rounded-xl border transition-colors duration-200 ${darkMode
              ? 'bg-slate-800 border-slate-600 text-white'
              : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span>Add Course</span>
          </button>
        </div>
      </div>
      {/* Add Course Form */}
      {showAddForm && (
        <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-300 ${darkMode
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white/70 border-slate-200/50'
          }`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Add New Course
                </h2>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-xl transition-colors duration-200 ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Course Name *
                  </label>
                  <div className="relative">
                    <BookOpen className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., Computer Networks"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Course Code *
                  </label>
                  <div className="relative">
                    <Code className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., CS301"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Credits *
                  </label>
                  <div className="relative">
                    <BookMarked className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="number"
                      name="credits"
                      value={formData.credits}
                      onChange={handleChange}
                      required
                      min="1"
                      max="10"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., 4"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Semester *
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white'
                        : 'bg-white/50 border-slate-300 text-slate-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Brief description of the course (optional)"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/20">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block mr-2"></span>
                      <span>Adding Course...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Add Course</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Courses Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <BookOpen className={`w-12 h-12 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {searchTerm ? 'No courses found' : 'No courses added yet'}
              </h3>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first course'
                }
              </p>
              
            </div>
          ) : (
            filteredAndSortedCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      ) : (
        // List View placeholder
        <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/70 border-slate-200/50'}`}>
          {/* Table/List view implementation can go here */}
          <div className="p-8 text-center text-slate-400">List view coming soon...</div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursesPage;
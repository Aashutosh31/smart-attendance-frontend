import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Search, 
  Users, 
  Check, 
  X, 
  Clock,
  BookOpen,
  Filter,
  Download,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';

const CoordinatorAttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      fetchAttendanceData();
    }
  }, [selectedCourse, selectedDate]);

  const fetchInitialData = async () => {
    try {
      // Replace with actual API calls
      setCourses([
        { id: 1, name: 'Advanced React Development', code: 'CS-301' },
        { id: 2, name: 'Database Systems', code: 'CS-205' },
        { id: 3, name: 'Web Security', code: 'CS-401' },
      ]);
      
      setStudents([
        { id: 1, name: 'John Doe', rollNumber: 'CS2021001', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', rollNumber: 'CS2021002', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', rollNumber: 'CS2021003', email: 'mike@example.com' },
        { id: 4, name: 'Sarah Wilson', rollNumber: 'CS2021004', email: 'sarah@example.com' },
        { id: 5, name: 'David Brown', rollNumber: 'CS2021005', email: 'david@example.com' },
      ]);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      // Replace with actual API call to fetch existing attendance
      const existingAttendance = {};
      students.forEach(student => {
        existingAttendance[student.id] = Math.random() > 0.3 ? 'present' : 'absent';
      });
      setAttendance(existingAttendance);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourse || !selectedDate) {
      toast.error('Please select a course and date');
      return;
    }

    setIsSaving(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Attendance saved successfully!');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAll = (status) => {
    const updatedAttendance = {};
    filteredStudents.forEach(student => {
      updatedAttendance[student.id] = status;
    });
    setAttendance(prev => ({
      ...prev,
      ...updatedAttendance
    }));
    toast.success(`Marked all filtered students as ${status}`);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(student => attendance[student.id] === 'present').length;
    const absent = filteredStudents.filter(student => attendance[student.id] === 'absent').length;
    const notMarked = total - present - absent;
    
    return { total, present, absent, notMarked };
  };

  const stats = getAttendanceStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading attendance data...</span>
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
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Take Attendance
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          Mark student attendance for your courses
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
            />
          </div>

          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
            >
              <option className='dark:text-black' value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} className='dark:text-black' value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleMarkAll('present')}
            disabled={!selectedCourse}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Mark All Present
          </button>
          
          <button
            onClick={() => handleMarkAll('absent')}
            disabled={!selectedCourse}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Mark All Absent
          </button>

          <button
            onClick={handleSaveAttendance}
            disabled={!selectedCourse || isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Stats */}
      {selectedCourse && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">Total Students</div>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">Present</div>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">Absent</div>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.notMarked}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">Not Marked</div>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {!selectedCourse ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Select a Course
            </h3>
            <p className="text-gray-500 dark:text-slate-500">
              Please select a course and date to mark attendance
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-16 w-16 text-gray-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-500 dark:text-slate-500">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Roll Number</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 dark:border-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                          <div className="text-sm text-gray-600 dark:text-slate-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-mono">
                      {student.rollNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`p-2 rounded-lg transition-colors ${
                            attendance[student.id] === 'present'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-green-100 dark:hover:bg-green-500/20'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`p-2 rounded-lg transition-colors ${
                            attendance[student.id] === 'absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-500/20'
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorAttendancePage;

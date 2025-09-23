import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronRight, User, CheckCircle, XCircle, BarChart3, Users, GraduationCap } from 'lucide-react';

// Reusable component for a collapsible tree node
const TreeNode = ({ title, data, renderItem, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = icon;

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/20 dark:hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <span className="px-2 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full">
            {data?.length || 0}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-slate-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-slate-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-slate-800/50">
          {data && data.length > 0 ? (
            <div className="p-4 space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
                  {renderItem(item)}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-500 dark:text-slate-400">No data available</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminReportsPage = () => {
  const { collegeId } = useAuthStore();
  const [attendanceData, setAttendanceData] = useState({
    hods: [],
    faculty: [],
    students: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAttendanceReports = useCallback(async () => {
    if (!collegeId) return;

    try {
      // Fetch HODs attendance
      const hodsResponse = await fetch(`/api/attendance/hods?collegeId=${collegeId}`);
      const facultyResponse = await fetch(`/api/attendance/faculty?collegeId=${collegeId}`);
      const studentsResponse = await fetch(`/api/attendance/students?collegeId=${collegeId}`);

      const hods = hodsResponse.ok ? await hodsResponse.json() : [];
      const faculty = facultyResponse.ok ? await facultyResponse.json() : [];
      const students = studentsResponse.ok ? await studentsResponse.json() : [];

      setAttendanceData({ hods, faculty, students });
    } catch (error) {
      console.error('Error fetching attendance reports:', error);
      toast.error('Failed to fetch attendance reports');
    } finally {
      setLoading(false);
    }
  }, [collegeId]);

  useEffect(() => {
    fetchAttendanceReports();
  }, [fetchAttendanceReports]);

  const renderAttendanceItem = (person) => (
    <>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
          {person.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{person.name}</div>
          <div className="text-sm text-gray-600 dark:text-slate-400">{person.email}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {person.present ? (
          <div className="flex items-center gap-1 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Present</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Absent</span>
          </div>
        )}
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading attendance reports...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Attendance Reports
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          View attendance reports for all departments
        </p>
      </div>

      {/* Reports Content */}
      <div className="space-y-4">
        <TreeNode
          title="HODs Attendance"
          data={attendanceData.hods}
          renderItem={renderAttendanceItem}
          icon={User}
        />
        
        <TreeNode
          title="Faculty Attendance"
          data={attendanceData.faculty}
          renderItem={renderAttendanceItem}
          icon={Users}
        />
        
        <TreeNode
          title="Student Attendance"
          data={attendanceData.students}
          renderItem={renderAttendanceItem}
          icon={GraduationCap}
        />
      </div>
    </div>
  );
};

export default AdminReportsPage;

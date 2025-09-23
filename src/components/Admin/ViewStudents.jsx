import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { GraduationCap, Search, Users, Calendar } from 'lucide-react';

const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="border-b border-gray-100 dark:border-slate-800/30">
        <div className="py-4 px-6 flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/6"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { collegeId } = useAuthStore();

  const fetchStudents = useCallback(async () => {
    if (!collegeId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .eq('college_id', collegeId);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  }, [collegeId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Student Directory
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          View and manage all registered students
        </p>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-gray-700 dark:text-slate-300">
              Total Students: <span className="font-semibold text-purple-500">{students.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="glass-card p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search students by name, roll number, department, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GraduationCap className="h-16 w-16 text-gray-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              {searchTerm ? 'No Students Found' : 'No Students Registered'}
            </h3>
            <p className="text-gray-500 dark:text-slate-500">
              {searchTerm 
                ? 'Try adjusting your search criteria to find students' 
                : 'Students will appear here once they register for your college'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Name & Roll No.</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Branch & Year</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Department</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-slate-300">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 dark:border-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {student.full_name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{student.full_name}</div>
                          <div className="text-sm text-gray-600 dark:text-slate-400">{student.roll_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900 dark:text-white">
                        {student.branch || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">
                        {student.year || 'N/A'}-Year, Sem {student.semester || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg">
                        <GraduationCap className="h-4 w-4" />
                        {student.department || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(student.created_at).toLocaleDateString()}
                        </span>
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

export default ViewStudents;

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Building, 
  Filter, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  Calendar, 
  Eye, 
  FileText, 
  PieChart, 
  UserCheck, 
  Crown, 
  Star,
  Search,
  ChevronDown,
  Grid3X3,
  List,
  Sparkles,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';

// Optimized Pie Chart Component
const CustomPieChart = ({ data, title, subtitle, colors, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  const processedData = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6;
    cumulativePercentage += percentage;
    const endAngle = cumulativePercentage * 3.6;
    return { 
      ...item, 
      percentage: percentage.toFixed(1), 
      startAngle, 
      endAngle, 
      color: colors[index % colors.length] 
    };
  });

  const gradientStops = processedData.map(item => 
    `${item.color} ${item.startAngle}deg ${item.endAngle}deg`
  ).join(', ');

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              background: `conic-gradient(${gradientStops})`,
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
          />
          <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {centerLabel || total}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        {processedData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {item.label}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminReportsPage = () => {
  // Add this to EVERY page component (AdminReportsPage, ManageHods, etc.)

const [darkMode, setDarkMode] = useState(() => 
  document.documentElement.classList.contains('dark')
);

// 🔥 Universal Dark Mode Listener - Add this useEffect to every page
useEffect(() => {
  const handleDarkModeChange = (event) => {
    setDarkMode(event.detail.darkMode);
  };

  window.addEventListener('darkModeChange', handleDarkModeChange);
  
  return () => {
    window.removeEventListener('darkModeChange', handleDarkModeChange);
  };
}, []);


  const [reports, setReports] = useState({
    attendanceReports: [],
    departmentStats: [],
    facultyReports: [],
    studentReports: []
  });
  

  
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports({
        attendanceReports: [
          { id: 1, title: 'Monthly Attendance Summary', date: '2024-03-01', status: 'Generated', department: 'All', type: 'attendance' },
          { id: 2, title: 'CS Department Attendance', date: '2024-02-28', status: 'Generated', department: 'Computer Science', type: 'attendance' },
          { id: 3, title: 'Faculty Attendance Report', date: '2024-02-25', status: 'Pending', department: 'All', type: 'faculty' }
        ],
        departmentStats: [
          { dept: 'Computer Science', students: 120, attendance: 92, reports: 15 },
          { dept: 'Mechanical', students: 98, attendance: 85, reports: 12 },
          { dept: 'Electrical', students: 85, attendance: 88, reports: 10 },
          { dept: 'Civil', students: 47, attendance: 79, reports: 8 }
        ],
        facultyReports: [
          { id: 1, name: 'Dr. Smith', dept: 'Computer Science', attendance: 95, classes: 24 },
          { id: 2, name: 'Prof. Johnson', dept: 'Mechanical', attendance: 88, classes: 20 },
          { id: 3, name: 'Dr. Davis', dept: 'Electrical', attendance: 92, classes: 22 }
        ],
        studentReports: [
          { id: 1, name: 'Alice Johnson', dept: 'Computer Science', attendance: 94, semester: '6th' },
          { id: 2, name: 'Bob Smith', dept: 'Mechanical', attendance: 87, semester: '4th' },
          { id: 3, name: 'Carol Davis', dept: 'Electrical', attendance: 91, semester: '6th' }
        ]
      });
      setLoading(false);
    };

    fetchReports();
  }, [dateRange, filterBy]);

  const generateReport = (type) => {
    toast.info(`Generating ${type} report...`);
    setTimeout(() => {
      toast.success(`${type} report generated successfully!`);
    }, 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'faculty', label: 'Faculty', icon: Crown },
    { id: 'students', label: 'Students', icon: Users }
  ];

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`h-32 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Reports Dashboard
            </h1>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Generate and manage comprehensive institutional reports
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64`}
            />
          </div>

          <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => generateReport('Custom')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex overflow-x-auto space-x-2 p-1 rounded-2xl ${
        darkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
      } backdrop-blur-sm`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105'
                  : darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className={`px-4 py-2 rounded-xl border transition-colors duration-200 ${
            darkMode 
              ? 'bg-slate-800 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className={`px-4 py-2 rounded-xl border transition-colors duration-200 ${
            darkMode 
              ? 'bg-slate-800 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
        >
          <option value="all">All Departments</option>
          <option value="cs">Computer Science</option>
          <option value="me">Mechanical</option>
          <option value="ee">Electrical</option>
          <option value="ce">Civil</option>
        </select>

        <button className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
          darkMode 
            ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700' 
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        } border border-slate-200/50 dark:border-slate-600/50`}>
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-200/50'
                  } backdrop-blur-sm shadow-xl`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          45
                        </h3>
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Total Reports
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-200/50'
                  } backdrop-blur-sm shadow-xl`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          87.5%
                        </h3>
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Avg Attendance
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-200/50'
                  } backdrop-blur-sm shadow-xl`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          12
                        </h3>
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          This Month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Reports */}
                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-200/50'
                } backdrop-blur-sm shadow-xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Recent Reports
                    </h2>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reports.attendanceReports.map((report) => (
                      <div key={report.id} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                        darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50/50 hover:bg-slate-100/50'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            report.type === 'attendance' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                          }`}>
                            {report.type === 'attendance' ? 
                              <UserCheck className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} /> :
                              <Crown className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            }
                          </div>
                          <div>
                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {report.title}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {report.department} • {report.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Generated' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {report.status}
                          </span>
                          <button className={`p-2 rounded-lg transition-colors duration-200 ${
                            darkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                          }`}>
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department Distribution */}
              <div className={`p-6 rounded-2xl ${
                darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-200/50'
              } backdrop-blur-sm shadow-xl`}>
                <CustomPieChart
                  title="Students"
                  data={reports.departmentStats.map(dept => ({ 
                    label: dept.dept.split(' ')[0], 
                    value: dept.students 
                  }))}
                  colors={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']}
                  centerLabel={reports.departmentStats.reduce((sum, dept) => sum + dept.students, 0)}
                />
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {reports.departmentStats.map((dept, index) => (
                <div key={dept.dept} className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                  darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/70 border border-slate-200/50'
                } backdrop-blur-sm shadow-xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-blue-600' :
                        index === 1 ? 'from-emerald-500 to-emerald-600' :
                        index === 2 ? 'from-purple-500 to-purple-600' :
                        'from-orange-500 to-orange-600'
                      } flex items-center justify-center shadow-lg`}>
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {dept.dept}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Department
                        </p>
                      </div>
                    </div>
                    <button className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                    }`}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Students</span>
                      <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {dept.students}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Attendance</span>
                      <span className={`text-xl font-bold ${
                        dept.attendance >= 90 ? 'text-emerald-500' :
                        dept.attendance >= 80 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {dept.attendance}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Reports</span>
                      <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {dept.reports}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/20">
                    <button
                      onClick={() => generateReport(dept.dept)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-blue-600' :
                        index === 1 ? 'from-emerald-500 to-emerald-600' :
                        index === 2 ? 'from-purple-500 to-purple-600' :
                        'from-orange-500 to-orange-600'
                      } text-white shadow-lg`}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;

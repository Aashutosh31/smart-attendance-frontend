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
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';

// Optimized Pie Chart Component with reduced animations
const CustomPieChart = ({ data, title, subtitle, colors, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages and cumulative percentages
  let cumulativePercentage = 0;
  const processedData = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
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

  // Create pie slices using conic-gradient
  const gradientStops = processedData.map(item => 
    `${item.color} ${item.startAngle}deg ${item.endAngle}deg`
  ).join(', ');

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Main pie chart - simplified for better performance */}
            <div 
              className="w-48 h-48 rounded-full shadow-xl border-4 border-white/30 dark:border-slate-800/50"
              style={{
                background: `conic-gradient(${gradientStops})`
              }}
            ></div>
            
            {/* Center circle with label */}
            <div className="absolute inset-8 bg-white/95 dark:bg-slate-900/95 rounded-full flex items-center justify-center shadow-lg border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
                <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">{centerLabel}</div>
              </div>
            </div>
          </div>

          {/* Legend - optimized for performance */}
          <div className="mt-6 w-full space-y-3">
            {processedData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-white/40 dark:border-slate-700/40 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm border border-white/50"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-500 bg-gray-100/80 dark:bg-slate-800/80 px-2 py-1 rounded-full">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Statistics Card - reduced animations for better performance
const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend }) => (
  <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-md`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 mt-3">
        <TrendingUp className="h-4 w-4 text-green-500" />
        <span className="text-sm text-green-500 font-medium">+{trend}% from last month</span>
      </div>
    )}
  </div>
);

const AdminReportsPage = () => {
  const [reports, setReports] = useState({
    hodData: [],
    facultyData: [],
    totalHods: 0,
    totalFaculty: 0,
    activeHods: 0,
    activeFaculty: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month'); // week, month, year
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Optimized colors for better performance and visibility in both modes
  const hodColors = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink  
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
  ];

  const facultyColors = [
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#84CC16', // Lime
    '#E11D48', // Rose
    '#8B5CF6', // Purple
  ];

  useEffect(() => {
    fetchReportsData();
  }, [timeFilter]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // Simulate API delay without excessive animations
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - replace with actual API responses
      const mockHodData = [
        { label: 'Computer Science', value: 12, department: 'CS' },
        { label: 'Electronics', value: 8, department: 'EC' },
        { label: 'Mechanical', value: 15, department: 'ME' },
        { label: 'Civil', value: 10, department: 'CE' },
        { label: 'Information Tech', value: 7, department: 'IT' }
      ];

      const mockFacultyData = [
        { label: 'Computer Science', value: 45, department: 'CS' },
        { label: 'Electronics', value: 32, department: 'EC' },
        { label: 'Mechanical', value: 38, department: 'ME' },
        { label: 'Civil', value: 28, department: 'CE' },
        { label: 'Information Tech', value: 25, department: 'IT' },
        { label: 'Mathematics', value: 18, department: 'MA' }
      ];

      setReports({
        hodData: mockHodData,
        facultyData: mockFacultyData,
        totalHods: mockHodData.reduce((sum, item) => sum + item.value, 0),
        totalFaculty: mockFacultyData.reduce((sum, item) => sum + item.value, 0),
        activeHods: mockHodData.reduce((sum, item) => sum + item.value, 0) - 5,
        activeFaculty: mockFacultyData.reduce((sum, item) => sum + item.value, 0) - 12
      });

      setLastUpdated(new Date());
      toast.success('Reports updated successfully!');
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReports = () => {
    // Export functionality
    toast.success('Reports exported successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              {/* Simplified loading animation */}
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-700 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-600 dark:text-slate-400">
                Loading reports data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Simplified for better performance */}
      <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Reports Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-slate-400">
              Comprehensive reports for HODs and Faculty across departments
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-slate-500">
              <Calendar className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Filter - simplified styling */}
            <div className="flex bg-gray-100/80 dark:bg-slate-800/80 rounded-lg p-1 border border-gray-200/50 dark:border-slate-700/50">
              {['week', 'month', 'year'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 capitalize ${
                    timeFilter === filter
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={fetchReportsData}
              className="p-3 text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/80 dark:hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
              title="Refresh Data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleExportReports}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics - Simplified for better performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total HODs"
          value={reports.totalHods}
          subtitle="Across all departments"
          icon={Crown}
          gradient="from-purple-500 to-indigo-600"
          trend={8}
        />
        
        <StatCard
          title="Active HODs"
          value={reports.activeHods}
          subtitle={`${Math.round((reports.activeHods / reports.totalHods) * 100)}% active rate`}
          icon={UserCheck}
          gradient="from-green-500 to-emerald-600"
          trend={12}
        />
        
        <StatCard
          title="Total Faculty"
          value={reports.totalFaculty}
          subtitle="All departments combined"
          icon={Users}
          gradient="from-blue-500 to-cyan-600"
          trend={15}
        />
        
        <StatCard
          title="Active Faculty"
          value={reports.activeFaculty}
          subtitle={`${Math.round((reports.activeFaculty / reports.totalFaculty) * 100)}% active rate`}
          icon={Star}
          gradient="from-orange-500 to-red-600"
          trend={5}
        />
      </div>

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HOD Distribution */}
        <CustomPieChart
          data={reports.hodData}
          title="HOD Distribution by Department"
          subtitle={`Total: ${reports.totalHods} HODs across ${reports.hodData.length} departments`}
          colors={hodColors}
          centerLabel="HODs"
        />

        {/* Faculty Distribution */}
        <CustomPieChart
          data={reports.facultyData}
          title="Faculty Distribution by Department"
          subtitle={`Total: ${reports.totalFaculty} Faculty across ${reports.facultyData.length} departments`}
          colors={facultyColors}
          centerLabel="Faculty"
        />
      </div>

      {/* Detailed Breakdown - Optimized table */}
      <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-500" />
            Detailed Department Breakdown
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
            <Eye className="h-4 w-4" />
            Live data view
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/60 dark:border-slate-800/60">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-slate-300">Department</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-slate-300">HODs</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-slate-300">Faculty</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-slate-300">Total Staff</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-slate-300">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reports.hodData.map((hodDept, index) => {
                const facultyDept = reports.facultyData.find(f => f.department === hodDept.department);
                const totalStaff = hodDept.value + (facultyDept?.value || 0);
                const percentage = ((totalStaff / (reports.totalHods + reports.totalFaculty)) * 100).toFixed(1);

                return (
                  <tr key={hodDept.department} className="border-b border-gray-100/60 dark:border-slate-800/40 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors duration-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                          style={{ backgroundColor: hodColors[index % hodColors.length] }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">{hodDept.label}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100/80 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-lg font-semibold">
                        {hodDept.value}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
                        {facultyDept?.value || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-8 bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg font-bold">
                        {totalStaff}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200/80 dark:bg-slate-700/80 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-slate-400 min-w-[40px]">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;

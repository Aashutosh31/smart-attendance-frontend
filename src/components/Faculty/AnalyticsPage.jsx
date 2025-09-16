import React from 'react';
import { BarChart, Users, Clock, CheckCircle, XCircle, Download, Filter } from 'lucide-react';

// A reusable card component for displaying key stats
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${color}`}>{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('-600', '-100')}`}>
        {Icon && <Icon className={`w-6 h-6 ${color}`} />}
      </div>
    </div>
  </div>
);

// A simple placeholder for a chart
const ChartPlaceholder = ({ title }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <BarChart className="w-12 h-12 text-gray-300" />
        </div>
    </div>
);

const AnalyticsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800  dark:text-white">Analytics & Reports</h2>
        <div className="flex space-x-2">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
            <Filter size={18} />
            <span>Filter by Course</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Average Attendance" value="92%" icon={CheckCircle} color="text-green-600" />
        <StatCard title="Total Absences" value="78" icon={XCircle} color="text-red-600" />
        <StatCard title="Total Students" value="145" icon={Users} color="text-blue-600" />
        <StatCard title="Total Sessions" value="64" icon={Clock} color="text-yellow-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Attendance Trend (Last 30 Days)" />
        <ChartPlaceholder title="Performance by Course" />
      </div>
    </div>
  );
};

export default AnalyticsPage;
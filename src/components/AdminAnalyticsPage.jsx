import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore.jsx';
import { BarChart, Clock, Users, Download } from 'lucide-react';

// A simple placeholder for a chart
const ChartPlaceholder = ({ title, description }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <BarChart className="w-12 h-12 text-gray-300" />
        </div>
    </div>
);

const AdminAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      setIsLoading(true);
      try {
        // Backend team needs to create this endpoint for the Admin
        const response = await fetch('http://localhost:8000/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch admin analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminAnalytics();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Global Analytics</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export All Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder 
            title="Faculty Delay Report"
            description="Average arrival delay and total late days for all faculty."
        />
        <ChartPlaceholder 
            title="Student Attendance Report"
            description="Monthly and department-wise average attendance."
        />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { User, Filter, Download, CheckCircle, XCircle } from 'lucide-react';

const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
  </div>
);

const FacultyReportsPage = () => {
  const [facultyReports, setFacultyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: new Date().toISOString().split('T')[0], // Default to today
  });
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchFacultyReports = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(filters).toString();
        // --- BACKEND INTEGRATION ---
        // Backend team needs to create this endpoint for HOD reports
        const response = await fetch(`http://localhost:8000/api/hod/faculty-reports?${queryParams}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Could not fetch faculty reports.');
        const data = await response.json();
        setFacultyReports(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacultyReports();
  }, [token, filters]);
  
  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getStatus = (status) => {
    const isPresent = status === 'present';
    return (
        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isPresent ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
            {status}
        </span>
    );
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Faculty Attendance Reports</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export</span>
        </button>
      </div>

       {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border flex items-center space-x-4">
        <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="p-4"><TableSkeleton /></td></tr>
              ) : (
                facultyReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.department}</div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatus(report.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.checkInTime || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyReportsPage;
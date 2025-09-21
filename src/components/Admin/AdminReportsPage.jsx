import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronRight, User, CheckCircle, XCircle } from 'lucide-react';

// Reusable component for a collapsible tree node
const TreeNode = ({ title, data, renderItem, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = icon;

    return (
        <div className="border border-gray-200 rounded-lg mb-2">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100">
                <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-semibold text-gray-800">{title} ({data?.length || 0})</span>
                </div>
                {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white">
                    {data && data.length > 0 ? (
                        <ul className="space-y-3">{data.map(renderItem)}</ul>
                    ) : (
                        <p className="text-gray-500">No data available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const AdminReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const fetchReportData = async () => {
            setIsLoading(true);
            try {
                // --- BACKEND INTEGRATION ---
                // This single endpoint should return the entire nested data structure.
                const response = await fetch('import.meta.env.VITE_API_HOST/api/admin/reports/tree', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch report data.');
                const data = await response.json();
                setReportData(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportData();
    }, [token]);

    const renderStatus = (status) => (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status === 'present' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {status}
        </span>
    );

    if (isLoading) return <div className='dark:text-white'>Loading reports...</div>;

    return (
        <div>
           
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Attendance Reports</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <TreeNode
                    title="HODs Attendance"
                    icon={User}
                    data={reportData?.hods}
                    renderItem={(hod) => (
                        <li key={hod.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                            <span>{hod.name}</span>
                            {renderStatus(hod.status)}
                        </li>
                    )}
                />
                <TreeNode
                    title="Faculty Attendance"
                    icon={User}
                    data={reportData?.faculty}
                    renderItem={(faculty) => (
                         <li key={faculty.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                            <div>
                               <span className="font-medium">{faculty.name}</span>
                               <span className="text-sm text-gray-500 ml-2">(HOD: {faculty.hodName})</span>
                            </div>
                            {renderStatus(faculty.status)}
                        </li>
                    )}
                />
                <TreeNode
                    title="Student Attendance"
                    icon={User}
                    data={reportData?.students}
                    renderItem={(student) => (
                        <li key={student.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                           <div>
                                <span className="font-medium">{student.name}</span>
                                <span className="text-sm text-gray-500 ml-2">({student.courseName})</span>
                           </div>
                           {renderStatus(student.status)}
                        </li>
                    )}
                />
            </div>
        </div>
    );
};

export default AdminReportsPage;
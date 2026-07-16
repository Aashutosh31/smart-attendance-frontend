import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { Building, BookOpen, MapPin, Layers, Users, Plus, Trash2, Edit } from 'lucide-react';

const AcademicManagement = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [data, setData] = useState({ departments: [], semesters: [], classrooms: [], subjects: [] });
  const [loading, setLoading] = useState(true);

  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: '', code: '' });
  const [newSemester, setNewSemester] = useState({ name: '', number: '', department: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depRes, semRes, classRes, subRes] = await Promise.all([
        API.get('/api/academic/departments'),
        API.get('/api/academic/semesters'),
        API.get('/api/academic/classrooms'),
        API.get('/api/academic/subjects')
      ]);

      setData({
        departments: depRes.data || [],
        semesters: semRes.data || [],
        classrooms: classRes.data || [],
        subjects: subRes.data || []
      });
    } catch (err) {
      toast.error('Failed to load academic data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/academic/departments', newDepartment);
      toast.success('Department added');
      setNewDepartment({ name: '', code: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add department');
    }
  };

  const handleAddSemester = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/academic/semesters', newSemester);
      toast.success('Semester added');
      setNewSemester({ name: '', number: '', department: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add semester');
    }
  };

  const tabs = [
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'semesters', label: 'Semesters', icon: Layers },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'classrooms', label: 'Classrooms', icon: MapPin },
  ];

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading Academic Data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Academic Management
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Configure the core structure of your institution</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-slate-700 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="glass-card p-6 rounded-2xl">
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Manage Departments</h2>
            
            <form onSubmit={handleAddDepartment} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <input 
                placeholder="Department Name (e.g. Computer Science)" 
                required 
                value={newDepartment.name}
                onChange={e => setNewDepartment({...newDepartment, name: e.target.value})}
                className="glow-input bg-transparent rounded-lg px-4 py-2"
              />
              <input 
                placeholder="Department Code (e.g. CS)" 
                required 
                value={newDepartment.code}
                onChange={e => setNewDepartment({...newDepartment, code: e.target.value})}
                className="glow-input bg-transparent rounded-lg px-4 py-2"
              />
              <button type="submit" className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg px-4 py-2 hover:opacity-90">
                <Plus className="w-5 h-5" />
                <span>Add Department</span>
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b dark:border-slate-700">
                  <tr>
                    <th className="py-3 text-gray-600 dark:text-slate-400">Name</th>
                    <th className="py-3 text-gray-600 dark:text-slate-400">Code</th>
                    <th className="py-3 text-gray-600 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.departments.map(dep => (
                    <tr key={dep._id} className="border-b dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/20">
                      <td className="py-4 text-gray-900 dark:text-white font-medium">{dep.name}</td>
                      <td className="py-4 text-gray-500 dark:text-slate-400 font-mono">{dep.code}</td>
                      <td className="py-4 text-right">
                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.departments.length === 0 && (
                    <tr><td colSpan="3" className="py-4 text-center text-gray-500">No departments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'semesters' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Manage Semesters</h2>
            
            <form onSubmit={handleAddSemester} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <input 
                placeholder="Semester Name (e.g. Fall 2024)" 
                required 
                value={newSemester.name}
                onChange={e => setNewSemester({...newSemester, name: e.target.value})}
                className="glow-input bg-transparent rounded-lg px-4 py-2"
              />
              <input 
                type="number"
                placeholder="Number (e.g. 1)" 
                required 
                value={newSemester.number}
                onChange={e => setNewSemester({...newSemester, number: e.target.value})}
                className="glow-input bg-transparent rounded-lg px-4 py-2"
              />
              <select 
                required
                value={newSemester.department}
                onChange={e => setNewSemester({...newSemester, department: e.target.value})}
                className="glow-input bg-transparent rounded-lg px-4 py-2 dark:text-black"
              >
                <option value="" disabled>Select Department</option>
                {data.departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <button type="submit" className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg px-4 py-2 hover:opacity-90">
                <Plus className="w-5 h-5" />
                <span>Add Semester</span>
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b dark:border-slate-700">
                  <tr>
                    <th className="py-3 text-gray-600 dark:text-slate-400">Name</th>
                    <th className="py-3 text-gray-600 dark:text-slate-400">Number</th>
                    <th className="py-3 text-gray-600 dark:text-slate-400">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {data.semesters.map(sem => (
                    <tr key={sem._id} className="border-b dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/20">
                      <td className="py-4 text-gray-900 dark:text-white font-medium">{sem.name}</td>
                      <td className="py-4 text-gray-500 dark:text-slate-400">{sem.number}</td>
                      <td className="py-4 text-gray-500 dark:text-slate-400">{sem.department?.name}</td>
                    </tr>
                  ))}
                  {data.semesters.length === 0 && (
                    <tr><td colSpan="3" className="py-4 text-center text-gray-500">No semesters found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'subjects' || activeTab === 'classrooms') && (
          <div className="text-center py-12 text-gray-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management is under construction.
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicManagement;

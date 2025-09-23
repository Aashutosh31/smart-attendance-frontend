import React, { useState } from 'react';
import { 
  UserPlus, 
  User, 
  Mail, 
  Hash, 
  Building, 
  Calendar,
  BookOpen,
  Phone,
  MapPin,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddStudentPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    phone: '',
    department: '',
    branch: '',
    year: '',
    semester: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    guardianName: '',
    guardianPhone: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add API call to save student
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success('Student added successfully!');
      navigate('/coordinator/students');
    } catch (error) {
      toast.error('Failed to add student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Add New Student
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          Fill in the student information to add them to your program
        </p>
      </div>

      {/* Form */}
      <div className="glass-card p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  required
                >
                  <option className='dark:text-black' value="">Select Gender</option>
                  <option className='dark:text-black' value="male">Male</option>
                  <option className='dark:text-black' value="female">Female</option>
                  <option className='dark:text-black' value="other">Other</option>
                </select>
              </div>

              <div className="relative md:col-span-2">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="text"
                  name="branch"
                  placeholder="Branch/Specialization"
                  value={formData.branch}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  required
                >
                  <option className='dark:text-black' value="">Select Year</option>
                  <option className='dark:text-black' value="1">1st Year</option>
                  <option className='dark:text-black' value="2">2nd Year</option>
                  <option className='dark:text-black' value="3">3rd Year</option>
                  <option className='dark:text-black' value="4">4th Year</option>
                </select>
              </div>

              <div>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  required
                >
                  <option className='dark:text-black' value="">Select Semester</option>
                  <option className='dark:text-black' value="1">1st Semester</option>
                  <option className='dark:text-black' value="2">2nd Semester</option>
                  <option className='dark:text-black' value="3">3rd Semester</option>
                  <option className='dark:text-black' value="4">4th Semester</option>
                  <option className='dark:text-black' value="5">5th Semester</option>
                  <option className='dark:text-black' value="6">6th Semester</option>
                  <option className='dark:text-black' value="7">7th Semester</option>
                  <option className='dark:text-black' value="8">8th Semester</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="text"
                  name="guardianName"
                  placeholder="Guardian Name"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="tel"
                  name="guardianPhone"
                  placeholder="Guardian Phone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="h-5 w-5" />
              {isLoading ? 'Adding Student...' : 'Add Student'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;

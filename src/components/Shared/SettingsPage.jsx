import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  Save, 
  Camera, 
  Building, 
  GraduationCap,
  KeyRound,
  Edit3,
  Check,
  X,
  Phone,
  MapPin,
  BookOpen,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/AuthStore'; // Adjust path as needed
import { supabase } from '../../supabaseClient'; // Adjust path as needed

const SettingsPage = () => {
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


  const { user } = useAuthStore(); // Get current user from auth store
  

  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // User profile data state
  const [profileData, setProfileData] = useState({
    id: '',
    fullName: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    address: '',
    joinedDate: '',
    avatar: null,
    // Role-specific fields
    course: '', // for coordinators
    subjects: '', // for faculty
    year: '', // for coordinators/students
    branch: '', // for students
    semester: '', // for students
    roll_number: '', // for students
    college_name: '', // for admin
    college_address: '' // for admin
  });

  // Settings data
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    autoSave: true
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user data based on role
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Base user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        let additionalData = {};

        // Fetch additional data based on role
        switch (userData.role) {
          case 'admin':
            // Fetch college data for admin
            if (userData.college_id) {
              const { data: collegeData, error: collegeError } = await supabase
                .from('colleges')
                .select('name, address, phone')
                .eq('id', userData.college_id)
                .single();
              
              if (!collegeError && collegeData) {
                additionalData = {
                  college_name: collegeData.name,
                  college_address: collegeData.address,
                  phone: collegeData.phone
                };
              }
            }
            break;
          
          case 'hod':
          case 'faculty':
            // Faculty and HOD data is already in users table
            additionalData = {
              subjects: userData.subjects?.join(', ') || ''
            };
            break;
          
          case 'program_coordinator':
            // Coordinator data
            additionalData = {
              course: userData.course,
              year: userData.year
            };
            break;
          
          case 'student':
            // Student data
            additionalData = {
              roll_number: userData.roll_number,
              branch: userData.branch,
              year: userData.year,
              semester: userData.semester
            };
            break;
        }

        // Set the combined profile data
        setProfileData({
          id: userData.id,
          fullName: userData.full_name || '',
          email: userData.email || '',
          role: userData.role || '',
          department: userData.department || '',
          phone: userData.phone || additionalData.phone || '',
          address: userData.address || additionalData.college_address || '',
          joinedDate: userData.created_at || '',
          avatar: userData.avatar || null,
          ...additionalData
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Get role badge styling
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: 'Administrator', color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300', icon: Shield },
      hod: { label: 'Head of Department', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300', icon: Building },
      faculty: { label: 'Faculty Member', color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300', icon: BookOpen },
      program_coordinator: { label: 'Program Coordinator', color: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300', icon: GraduationCap },
      student: { label: 'Student', color: 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300', icon: User }
    };
    return roleConfig[role] || { label: 'User', color: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300', icon: User };
  };

  const handleProfileSave = async () => {
    try {
      // Update user data in database
      const updateData = {
        full_name: profileData.fullName,
        email: profileData.email,
        department: profileData.department,
        phone: profileData.phone,
        address: profileData.address
      };

      // Add role-specific fields
      if (profileData.role === 'program_coordinator') {
        updateData.course = profileData.course;
        updateData.year = parseInt(profileData.year);
      } else if (profileData.role === 'faculty' || profileData.role === 'hod') {
        updateData.subjects = profileData.subjects ? profileData.subjects.split(',').map(s => s.trim()) : [];
      } else if (profileData.role === 'student') {
        updateData.roll_number = profileData.roll_number;
        updateData.branch = profileData.branch;
        updateData.year = parseInt(profileData.year);
        updateData.semester = parseInt(profileData.semester);
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', profileData.id);

      if (error) throw error;

      // If admin, also update college data
      if (profileData.role === 'admin' && user?.college_id) {
        const { error: collegeError } = await supabase
          .from('colleges')
          .update({
            name: profileData.college_name,
            address: profileData.college_address,
            phone: profileData.phone
          })
          .eq('id', user.college_id);
        
        if (collegeError) throw collegeError;
      }

      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsEditingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const handleSettingToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success('Settings updated!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading settings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profileData.role);
  const RoleIcon = roleBadge.icon;

  // Render role-specific fields
  const renderRoleSpecificFields = () => {
    switch (profileData.role) {
      case 'admin':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">College Name</label>
              {isEditingProfile ? (
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <input
                    type="text"
                    value={profileData.college_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, college_name: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white py-3">{profileData.college_name}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">College Address</label>
              {isEditingProfile ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <input
                    type="text"
                    value={profileData.college_address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, college_address: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white py-3">{profileData.college_address}</p>
              )}
            </div>
          </>
        );
      
      case 'faculty':
      case 'hod':
        return (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Subjects</label>
            {isEditingProfile ? (
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter subjects separated by commas"
                  value={profileData.subjects}
                  onChange={(e) => setProfileData(prev => ({ ...prev, subjects: e.target.value }))}
                  className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                />
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white py-3">{profileData.subjects || 'Not specified'}</p>
            )}
          </div>
        );
      
      case 'program_coordinator':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Course/Program</label>
              {isEditingProfile ? (
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <input
                    type="text"
                    value={profileData.course}
                    onChange={(e) => setProfileData(prev => ({ ...prev, course: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white py-3">{profileData.course}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year</label>
              {isEditingProfile ? (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <select
                    value={profileData.year}
                    onChange={(e) => setProfileData(prev => ({ ...prev, year: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white py-3">
                  {profileData.year ? `${profileData.year}${profileData.year === '1' ? 'st' : profileData.year === '2' ? 'nd' : profileData.year === '3' ? 'rd' : 'th'} Year` : 'Not specified'}
                </p>
              )}
            </div>
          </>
        );
      
      case 'student':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Roll Number</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.roll_number}
                  onChange={(e) => setProfileData(prev => ({ ...prev, roll_number: e.target.value }))}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                />
              ) : (
                <p className="text-gray-900 dark:text-white py-3">{profileData.roll_number}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Branch</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.branch}
                  onChange={(e) => setProfileData(prev => ({ ...prev, branch: e.target.value }))}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                />
              ) : (
                <p className="text-gray-900 dark:text-white py-3">{profileData.branch}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year</label>
              {isEditingProfile ? (
                <select
                  value={profileData.year}
                  onChange={(e) => setProfileData(prev => ({ ...prev, year: e.target.value }))}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white py-3">
                  {profileData.year ? `${profileData.year}${profileData.year === '1' ? 'st' : profileData.year === '2' ? 'nd' : profileData.year === '3' ? 'rd' : 'th'} Year` : 'Not specified'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Semester</label>
              {isEditingProfile ? (
                <select
                  value={profileData.semester}
                  onChange={(e) => setProfileData(prev => ({ ...prev, semester: e.target.value }))}
                  className="glow-input w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>{sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white py-3">
                  {profileData.semester ? `${profileData.semester}${profileData.semester === '1' ? 'st' : profileData.semester === '2' ? 'nd' : profileData.semester === '3' ? 'rd' : 'th'} Semester` : 'Not specified'}
                </p>
              )}
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Account Settings
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <button
                onClick={() => isEditingProfile ? handleProfileSave() : setIsEditingProfile(true)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors"
              >
                {isEditingProfile ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                {isEditingProfile ? 'Save' : 'Edit'}
              </button>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    profileData.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditingProfile && (
                  <button className="absolute -bottom-1 -right-1 p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{profileData.fullName}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${roleBadge.color} mt-1`}>
                  <RoleIcon className="h-4 w-4" />
                  {roleBadge.label}
                </span>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                {isEditingProfile ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white py-3">{profileData.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
                {isEditingProfile ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white py-3">{profileData.email}</p>
                )}
              </div>

              {profileData.role !== 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Department</label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white py-3">{profileData.department}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone</label>
                {isEditingProfile ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white py-3">{profileData.phone}</p>
                )}
              </div>

              {/* Role-specific fields */}
              {renderRoleSpecificFields()}

              {profileData.role !== 'admin' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Address</label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white py-3">{profileData.address}</p>
                  )}
                </div>
              )}
            </div>

            {isEditingProfile && (
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleProfileSave}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
              <button
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>
            </div>

            {isEditingPassword && (
              <div className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-slate-500" />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="glow-input w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setIsEditingPassword(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-slate-400">Member since</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {profileData.joinedDate ? new Date(profileData.joinedDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-slate-400">Status</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5 text-purple-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                  <span className="text-gray-900 dark:text-white">Dark Mode</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    darkMode ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Other Settings */}
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-500 dark:text-slate-400" />
                    <span className="text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSettingToggle(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      value ? 'bg-purple-600' : 'bg-gray-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

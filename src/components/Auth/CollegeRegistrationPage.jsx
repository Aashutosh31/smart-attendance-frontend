import React, { useState } from "react";
import { Building2, KeyRound, Mail, User, Shield } from "lucide-react";
 import { supabase } from "../../supabaseClient"; // Assuming supabase client is configured
 import { ToastContainer } from "react-toastify";
 import 'react-toastify/dist/ReactToastify.css';

// Mock functions for demonstration since the original dependencies are not available here.
const navigate = (path) => console.log(`Navigating to ${path}`);
const toast = {
    error: (msg) => console.error(msg),
    success: (msg) => console.log(msg),
    info: (msg) => console.log(msg),
};
const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;


const CollegeRegistrationPage = () => {
     <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

  const [formData, setFormData] = useState({
    collegeName: "",
    collegeId: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate(); // Original hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin',
          }
        }
      });

      if (authError) throw authError;

      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .insert({
          name: formData.collegeName,
          college_id_text: formData.collegeId,
          created_at: new Date().toISOString(),
          created_by: authData.user.id
        })
        .select()
        .single();

      if (collegeError) throw collegeError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          college_id: collegeData.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast.success('College and admin account created successfully!');
      toast.info('Please check your email to verify your account.');
      
      navigate('/login');
      
    } catch (error) {
      console.error('Error creating admin:', error);
      
      if (error.code === '23505') {
        toast.error('College ID already exists. Please choose a different one.');
      } else {
        toast.error(error.message || 'Failed to create admin account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-element {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes aurora {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .aurora-bg {
            background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #4f4c82);
            background-size: 400% 400%;
            animation: aurora 15s ease infinite;
        }
        .glassmorphism {
            background: rgba(17, 24, 39, 0.5);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .shine-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s ease;
        }
        .shine-effect:hover::before {
            left: 100%;
        }
        .neon-text-primary {
            text-shadow: 0 0 5px rgba(192, 132, 252, 0.5), 0 0 10px rgba(192, 132, 252, 0.3);
        }
        .neon-text-secondary {
             text-shadow: 0 0 3px rgba(167, 139, 250, 0.4);
        }
        .svg-glow {
            filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.6));
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
        }
        .animated-pulse {
            animation: pulse 4s infinite ease-in-out;
        }
      `}</style>
      <div className="min-h-screen w-full aurora-bg flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl w-full glassmorphism rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

          {/* Left side - Visuals */}
          <div className="relative p-8 sm:p-12 flex flex-col justify-center items-center text-center text-gray-100 bg-black/20 order-2 lg:order-1">
             <div className="w-full max-w-sm " style={{ animation: 'fadeIn 1s ease-out forwards' }}>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white neon-text-primary select-none">
                    Smart Attendance
                </h1>
                <p className="mt-4 text-lg text-purple-200 neon-text-secondary font-light max-w-xs mx-auto">
                    Empowering colleges with the future of attendance tracking.
                </p>
             </div>
             
             {/* Animated Data Nexus SVG */}
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 md:w-80 md:h-80 mt-8 svg-glow" style={{ animation: 'fadeIn 1.2s ease-out forwards' }}>
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'rgb(124, 58, 237)', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: 'rgb(192, 132, 252)', stopOpacity: 1}} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <circle cx="100" cy="100" r="40" fill="url(#grad1)" filter="url(#glow)" className="animated-pulse" style={{animationDelay: '0.5s'}}/>
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(192, 132, 252, 0.5)" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="15s" repeatCount="indefinite"/>
                </circle>
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="0.5">
                     <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="25s" repeatCount="indefinite"/>
                </circle>
                 {/* Data points */}
                <circle cx="30" cy="100" r="5" fill="rgba(221, 214, 254, 0.8)" className="animated-pulse" />
                <circle cx="170" cy="100" r="5" fill="rgba(221, 214, 254, 0.8)" className="animated-pulse" style={{animationDelay: '1s'}}/>
                <circle cx="100" cy="30" r="5" fill="rgba(221, 214, 254, 0.8)" className="animated-pulse" style={{animationDelay: '2s'}}/>
                <circle cx="100" cy="170" r="5" fill="rgba(221, 214, 254, 0.8)" className="animated-pulse" style={{animationDelay: '3s'}}/>
            </svg>
          </div>

          {/* Right side - registration form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center order-1 lg:order-2">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex items-center justify-center form-element" style={{animationDelay: '0.1s'}}>
                 <div className="flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full w-16 h-16 shadow-lg border border-purple-400/50">
                    <Building2 className="h-8 w-8 text-white" />
                 </div>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-50 neon-text-primary form-element" style={{animationDelay: '0.2s'}}>
                Register Your College
              </h2>
              <p className="mt-2 text-center text-md text-purple-200 font-light form-element" style={{animationDelay: '0.3s'}}>
                Create an admin account to get started.
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {[
                  { id: "collegeName", icon: Building2, placeholder: "College Name", type: "text" },
                  { id: "collegeId", icon: Shield, placeholder: "Unique College ID", type: "text" },
                  { id: "fullName", icon: User, placeholder: "Admin Full Name", type: "text" },
                  { id: "email", icon: Mail, placeholder: "Admin Email", type: "email" },
                  { id: "password", icon: KeyRound, placeholder: "Password", type: "password" },
                  { id: "confirmPassword", icon: KeyRound, placeholder: "Confirm Password", type: "password" },
                ].map(({ id, icon: Icon, placeholder, type }, index) => (
                  <div key={id} className="form-element" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                    <label htmlFor={id} className="sr-only">{placeholder}</label>
                    <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-purple-300 text-purple-400/50">
                           <Icon className="h-5 w-5" />
                       </div>
                       <input
                         id={id}
                         name={id}
                         type={type}
                         required
                         value={formData[id]}
                         onChange={handleChange}
                         placeholder={placeholder}
                         className="w-full py-3 pl-12 pr-4 bg-gray-900/50 text-gray-100 rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 placeholder:text-gray-500"
                         autoComplete={id.includes('password') ? 'new-password' : 'on'}
                       />
                    </div>
                  </div>
                ))}

                <div className="form-element" style={{animationDelay: '1s'}}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shine-effect"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-purple-200 form-element" style={{animationDelay: '1.1s'}}>
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-purple-300 hover:text-purple-100 underline underline-offset-2 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollegeRegistrationPage;

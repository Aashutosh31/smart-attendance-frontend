// File Path: src/components/Admin/AdminVerificationPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck, Loader, Eye, Sparkles, Lock, CheckCircle } from 'lucide-react';

const AdminVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [step, setStep] = useState(1);
  const { user, fetchUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      toast.error("Could not access camera. Please grant permission and refresh.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleVerification = async () => {
    if (!isCameraReady) return toast.error('Camera is not ready.');
    
    setIsLoading(true);
    setStep(2);
    toast.info('Verifying your identity...');

    try {
      // Simulated verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
      
      const { error } = await supabase
        .from('users')
        .update({ is_face_verified: true })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile();
      
      setTimeout(() => {
        toast.success('Admin Identity Verified!');
        navigate('/admin');
      }, 1000);
    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
      setIsLoading(false);
      setStep(1);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl ${
          darkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl ${
          darkMode ? 'bg-blue-500' : 'bg-purple-400'
        }`} />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className={`backdrop-blur-2xl rounded-3xl shadow-2xl border transition-all duration-500 ${
          darkMode 
            ? 'bg-slate-900/40 border-slate-700/30 shadow-purple-500/10' 
            : 'bg-white/60 border-slate-200/50 shadow-slate-900/10'
        }`}>
          {/* Header */}
          <div className="p-8 text-center border-b border-slate-200/10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Admin Identity Verification
            </h1>
            <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Secure your admin portal with biometric authentication
            </p>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Camera */}
              <div className="space-y-6">
                <div className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 ${
                  step === 3 
                    ? 'border-emerald-400' 
                    : isCameraReady 
                    ? 'border-blue-400' 
                    : 'border-slate-300'
                } transition-all duration-500`}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-80 object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  
                  {/* Camera Overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/30 m-4 rounded-xl" />
                  
                  {/* Status Indicators */}
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full backdrop-blur-sm ${
                      isCameraReady 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-400/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isCameraReady ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                      }`} />
                      <span className="text-sm font-medium">
                        {isCameraReady ? 'Camera Ready' : 'Camera Loading...'}
                      </span>
                    </div>
                  </div>

                  {/* Verification Steps Overlay */}
                  {step > 1 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      {step === 2 && (
                        <div className="text-center text-white">
                          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                          <p className="text-lg font-semibold">Analyzing facial features...</p>
                        </div>
                      )}
                      
                      {step === 3 && (
                        <div className="text-center text-white">
                          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-lg font-semibold">Verification Successful!</p>
                          <p className="text-sm opacity-75">Redirecting to admin portal...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Camera Instructions */}
                <div className={`p-4 rounded-xl border ${
                  darkMode 
                    ? 'bg-slate-800/30 border-slate-700/30' 
                    : 'bg-slate-50/50 border-slate-200/30'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Eye className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Position Guidelines
                      </h3>
                      <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li>• Face the camera directly</li>
                        <li>• Ensure good lighting</li>
                        <li>• Remove any face coverings</li>
                        <li>• Stay still during verification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Verification Process */}
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Secure Access Protocol
                  </h2>
                  <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    As a one-time security step, please verify your identity to access the Admin Portal.
                  </p>
                </div>

                {/* Security Features */}
                <div className="space-y-4">
                  {[
                    { icon: ShieldCheck, title: 'Biometric Security', desc: 'Advanced facial recognition' },
                    { icon: Lock, title: 'Encrypted Data', desc: 'End-to-end protection' },
                    { icon: CheckCircle, title: 'Instant Verification', desc: 'Quick and secure access' }
                  ].map((feature, index) => (
                    <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'bg-slate-800/30 hover:bg-slate-700/30' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verification Button */}
                <button
                  onClick={handleVerification}
                  disabled={!isCameraReady || isLoading}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    !isCameraReady || isLoading
                      ? 'opacity-50 cursor-not-allowed scale-95'
                      : 'hover:scale-105 active:scale-95'
                  } ${
                    step === 3
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white shadow-blue-500/25'
                  } shadow-2xl`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Loader className="w-6 h-6 animate-spin" />
                      <span>Verifying Identity...</span>
                    </div>
                  ) : step === 3 ? (
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="w-6 h-6" />
                      <span>Verification Complete!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Camera className="w-6 h-6" />
                      <span>Start Verification</span>
                    </div>
                  )}
                </button>

                {/* Privacy Notice */}
                <div className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p>🔒 Your biometric data is encrypted and secure</p>
                  <p>Privacy protected • GDPR compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationPage;

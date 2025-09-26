// File Path: src/components/Student/StudentVerificationPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck, Loader } from 'lucide-react';

const StudentVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { setVerified } = useAuthStore();
  const navigate = useNavigate();
  const videoRef = useRef(null);

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
    toast.info('Verifying your identity for this lecture...');

    try {
      // --- SIMULATED API CALL ---
      // This is a session-based check, so we don't need to update the database.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark this browser session as verified in the state.
      setVerified(); 

      toast.success('Identity Verified!');
      navigate('/student');

    } catch (error) {
      toast.error('Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Identity Verification</h1>
        <p className="text-gray-600 dark:text-slate-300">
          To mark your attendance for the upcoming lecture, please complete face verification.
        </p>
        <div className="w-full bg-black rounded-lg overflow-hidden h-64 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <button
          onClick={handleVerification}
          disabled={isLoading || !isCameraReady}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center space-x-2"
        >
          {isLoading ? <Loader className="animate-spin" /> : <Camera size={18} />}
          <span>{isLoading ? 'Verifying...' : 'Verify for Lecture'}</span>
        </button>
      </div>
    </div>
  );
};

export default StudentVerificationPage;


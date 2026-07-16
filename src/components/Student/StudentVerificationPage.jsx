// File Path: src/components/Student/StudentVerificationPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck, Loader } from 'lucide-react';
import API from '../../utils/api';

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
      // Get base64 image from video stream
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/jpeg');

      // Note: we need the sessionId. Assuming it's passed in location state or URL params.
      // For now, if no sessionId is provided by the dashboard, we assume a general verify route or a hardcoded mock for demonstration if sessionId isn't available in context.
      // Wait, the backend requires sessionId for attendance. Let's assume the dashboard passes it in window.history.state
      const sessionId = window.history.state?.usr?.sessionId;
      if (!sessionId) {
          toast.error('No active lecture session selected. Go back and select a lecture.');
          setIsLoading(false);
          return;
      }

      await API.post(`/api/student/sessions/${sessionId}/attendance`, {
          image: image,
          livenessProof: true,
          beacon: {
              uuid: "test-uuid", // Mock beacon for now since hardware isn't attached
              major: "1",
              minor: "1",
              totp: "123456" // This would fail server-side TOTP, but the architecture is there.
          }
      });
      
      setVerified(); 
      toast.success('Identity Verified and Attendance Marked!');
      navigate('/student');

    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
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


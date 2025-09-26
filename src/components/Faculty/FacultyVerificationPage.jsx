// File Path: src/components/Faculty/FacultyVerificationPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck, Loader } from 'lucide-react';

const FacultyVerificationPage = () => {
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
      toast.error("Could not access camera. Please check permissions and refresh.");
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
    toast.info('Verifying your identity for this session...');

    try {
      // --- SIMULATED API CALL ---
      // This is session-based, so we don't update the database.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mark this browser session as verified in the state.
      setVerified();

      toast.success('Identity Verified!');
      navigate('/faculty');

    } catch (error) {
      toast.error('Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Faculty Identity Verification</h1>
        <p className="text-gray-600">
          For security, please look at the camera to verify your identity for this session.
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
          <span>{isLoading ? 'Verifying...' : 'Verify My Identity'}</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyVerificationPage;

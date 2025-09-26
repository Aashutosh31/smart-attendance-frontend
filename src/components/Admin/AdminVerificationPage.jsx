// File Path: src/components/Admin/AdminVerificationPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck, Loader } from 'lucide-react';

const AdminVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { user, fetchUserProfile } = useAuthStore();
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
    toast.info('Verifying your identity...');

    try {
      // --- SIMULATED API CALL ---
      // In the future, you'll replace this with a fetch call to your backend facial recognition API.
      // For now, we simulate a successful verification after 1.5 seconds.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update the user's profile in Supabase to permanently mark them as verified.
      const { error } = await supabase
        .from('users')
        .update({ is_face_verified: true })
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh the user's profile in the state to get the new `is_face_verified` value.
      await fetchUserProfile(); 

      toast.success('Admin Identity Verified!');
      navigate('/admin');

    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Identity Verification</h1>
        <p className="text-gray-600 dark:text-slate-300">
          As a one-time security step, please verify your identity to access the Admin Portal.
        </p>
        <div className="w-full bg-black rounded-lg overflow-hidden h-64 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <button
          onClick={handleVerification}
          disabled={isLoading || !isCameraReady}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center space-x-2"
        >
          {isLoading ? <Loader className="animate-spin" /> : <Camera size={18} />}
          <span>{isLoading ? 'Verifying...' : 'Complete Verification'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminVerificationPage;


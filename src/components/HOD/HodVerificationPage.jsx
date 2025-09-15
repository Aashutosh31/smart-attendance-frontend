import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck, Loader } from 'lucide-react';

const HodVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { setVerified, token } = useAuthStore();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Wrap startCamera in useCallback
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access the camera. Please check permissions.");
    }
  }, []); // Empty dependency array as it doesn't depend on any props or state

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]); // Add startCamera to the dependency array

  // ... rest of the component remains the same
  const handleVerification = async () => {
    if (!isCameraReady) {
      toast.error('Camera is not ready.');
      return;
    }

    setIsLoading(true);
    toast.info('Verifying your identity...');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://localhost:8000/api/hod/verify-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed. Please try again.');
      }

      toast.success('HOD Identity Verified!');
      setVerified();
      navigate('/hod');

    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">HOD Identity Verification</h1>
        <p className="text-gray-600">
          For security and attendance, please verify your identity to access the HOD Portal.
        </p>
        
        <div className="w-full bg-black rounded-lg overflow-hidden h-64 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        <button
          onClick={handleVerification}
          disabled={isLoading || !isCameraReady}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center space-x-2"
        >
          {isLoading ? <Loader className="animate-spin" /> : <Camera size={18} />}
          <span>{isLoading ? 'Verifying...' : 'Verify My Identity'}</span>
        </button>
      </div>
    </div>
  );
};

export default HodVerificationPage;
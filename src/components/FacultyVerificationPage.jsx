import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { Camera, ShieldCheck } from 'lucide-react';

const FacultyVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const { setVerified, token } = useAuthStore();
  const navigate = useNavigate();

  // Start the camera when the page loads
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast.error("Could not access the camera. Please check permissions.");
      }
    };
    startCamera();
    
    // Cleanup function to stop the camera when leaving the page
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleVerification = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://localhost:8000/api/faculty/verify-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send the auth token
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (!response.ok || !data.verified) {
        throw new Error(data.message || 'Facial verification failed.');
      }
      
      toast.success('Identity Verified!');
      setVerified(); // Update the global state
      navigate('/'); // Redirect to the main dashboard

    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
        <p className="text-gray-600">
          For security, please verify your identity using your camera before proceeding to the dashboard.
        </p>
        <div className="w-full bg-black rounded-lg overflow-hidden aspect-video">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        </div>
        <button
          onClick={handleVerification}
          disabled={isLoading}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Camera size={18} />
          <span>{isLoading ? 'Verifying...' : 'Verify My Identity'}</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyVerificationPage;
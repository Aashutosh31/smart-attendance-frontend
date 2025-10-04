// src/components/Auth/FaceEnrollmentPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';

const FaceEnrollmentPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { session, updateFaceEnrollmentStatus } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera. Please allow camera permissions.');
      }
    };
    startVideo();
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !session?.access_token) {
      setError('Camera or session not available.');
      return;
    }

    setIsProcessing(true);
    setError('');

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/auth/enroll-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Enrollment failed');
      
      alert('Face enrolled successfully!');
      updateFaceEnrollmentStatus(true);
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h1>Face Enrollment</h1>
      <p>Position your face in the center and click Capture.</p>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '480px', height: '360px', border: '1px solid #ccc' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={handleCapture} disabled={isProcessing} style={{ padding: '10px 20px', fontSize: '1rem', marginTop: '1rem' }}>
        {isProcessing ? 'Processing...' : 'Capture and Enroll'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}
    </div>
  );
};

export default FaceEnrollmentPage;
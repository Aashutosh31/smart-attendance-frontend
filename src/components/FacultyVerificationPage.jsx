import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { Fingerprint, ShieldCheck } from 'lucide-react'; // Changed icon

const FacultyVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setVerified, token } = useAuthStore();
  const navigate = useNavigate();

  // This function will launch the Electron bridge app
  const handleVerification = () => {
    if (!token) {
      toast.error('You are not logged in!');
      return;
    }

    setIsLoading(true);
    toast.info('Please follow the instructions in the scanner application.');

    // --- KEY CHANGE ---
    // Launch the Electron app using a custom URL protocol.
    // This passes the auth token directly to the bridge app.
    window.location.href = `attendtrack://scan?token=${token}`;
  };

  // This effect will listen for the result from the Electron app.
  useEffect(() => {
    const handleScanResult = (event) => {
      // This is a placeholder for a more advanced implementation using websockets or local server
      // For now, we will assume success after launching.
      // In a real-world scenario, the Electron app would communicate back to this web app.
      // A simple way is to have the Electron app redirect the browser back to a success page.
      // For example: http://localhost:3000/verification-success
      
      // For this example, we'll simulate a successful verification after a delay.
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Identity Verified!');
        setVerified();
        navigate('/');
      }, 5000); // Simulate a 5-second verification process
    };

    // We can't directly listen for the Electron app's result without more complex setup.
    // The redirect approach mentioned above is the most common solution.
    // For now, this demonstrates the launching process.

  }, [setVerified, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
        <p className="text-gray-600">
          For security, please verify your identity using the fingerprint scanner. Click the button below to start the process.
        </p>
        
        {/* The video element is removed */}
        <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center h-48">
            <Fingerprint className="w-24 h-24 text-gray-400" />
        </div>

        <button
          onClick={handleVerification}
          disabled={isLoading}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Fingerprint size={18} />
          <span>{isLoading ? 'Waiting for scanner...' : 'Verify with Fingerprint Scanner'}</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyVerificationPage;
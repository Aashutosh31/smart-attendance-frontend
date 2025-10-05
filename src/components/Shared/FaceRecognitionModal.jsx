// src/components/Shared/FaceRecognitionModal.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

const FaceRecognitionModal = ({
    isOpen,
    onClose,
    onSuccess,
    title
}) => {
    const videoRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        // eslint-disable-next-line
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access the camera. Please check permissions.");
            onClose();
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleCapture = async () => {
        setIsProcessing(true);
        // Simulate recognition
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">{title}</h2>
                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto rounded-md"
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    {isProcessing ? (
                        <button
                            disabled
                            className="flex items-center justify-center w-full px-4 py-2 bg-purple-400 text-white rounded-md"
                        >
                            <Loader className="animate-spin mr-2" /> Processing...
                        </button>
                    ) : (
                        <button
                            onClick={handleCapture}
                            className="flex items-center justify-center w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                        >
                            <Camera className="mr-2" /> Verify My Identity
                        </button>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-2xl font-bold"
                    style={{ lineHeight: 1 }}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default FaceRecognitionModal;
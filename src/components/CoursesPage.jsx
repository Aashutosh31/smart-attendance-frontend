import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { toast } from 'react-toastify';
import { Camera, BarChart3, Users, Clock, AlertTriangle, Save, CheckCircle } from 'lucide-react';

// Helper Components
const LoadingSpinner = () => ( <div className="text-center p-10"><p className="text-gray-500">Loading Your Courses...</p></div> );
const ErrorDisplay = ({ message }) => ( <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg shadow-md"><AlertTriangle className="mx-auto h-12 w-12 text-red-400" /><h3 className="mt-2 text-xl font-semibold">An Error Occurred</h3><p className="mt-1">{message}</p></div> );
const EmptyState = () => ( <div className="text-center p-10 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold text-gray-800">No Courses Assigned</h3><p className="text-gray-500 mt-2">Please contact your Program Coordinator to be assigned to a course.</p></div> );


const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [recognizedStudents, setRecognizedStudents] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // --- KEY CHANGE: Fetch only courses for this specific faculty member ---
      // Backend needs to provide this endpoint.
      const response = await fetch('http://localhost:8000/api/faculty/me/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Could not connect to the server. Please try again later.');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const sendFrameToBackend = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 3) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
        const response = await fetch(`http://localhost:8000/api/faculty/courses/${selectedCourse.id}/recognize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ image: imageData }),
        });

        if (response.ok) {
            const recognizedStudent = await response.json();
            if (recognizedStudent && recognizedStudent.id) {
                setRecognizedStudents(prev => {
                    if (!prev.some(s => s.id === recognizedStudent.id)) {
                        toast.success(`${recognizedStudent.name} marked present!`);
                        return [...prev, recognizedStudent];
                    }
                    return prev;
                });
            }
        }
    } catch (err) {
        console.error("Error sending frame to backend:", err);
    }
  }, [token, selectedCourse]);

  const startSession = (course) => {
    setSelectedCourse(course);
    setIsSessionActive(true);
    setRecognizedStudents([]);
    toast.info(`Starting attendance session for ${course.name}.`);
  };

  const endSession = useCallback(async () => {
    if (recognizedStudents.length === 0) {
        setIsSessionActive(false);
        setSelectedCourse(null);
        toast.warn("Session ended. No students were marked present.");
        return;
    }

    try {
        const studentIds = recognizedStudents.map(s => s.id);
        const response = await fetch(`http://localhost:8000/api/faculty/courses/${selectedCourse.id}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ studentIds }),
        });
        if (!response.ok) throw new Error('Failed to save attendance.');
        toast.success('Attendance session saved successfully!');
    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsSessionActive(false);
        setSelectedCourse(null);
    }
  }, [recognizedStudents, selectedCourse, token]);


  useEffect(() => {
    let stream = null;
    let recognitionInterval = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        recognitionInterval = setInterval(sendFrameToBackend, 5000);
      } catch (err) {
        toast.error(err.message || "Could not access camera. Please check permissions.");
        setIsSessionActive(false);
      }
    };

    const stopCamera = () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      clearInterval(recognitionInterval);
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (isSessionActive) startCamera();
    return () => stopCamera();
  }, [isSessionActive, sendFrameToBackend]);


  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (courses.length === 0) return <EmptyState />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
              <p className="text-gray-500 mb-4">{course.code}</p>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span><Users size={16} className="inline mr-1" /> {course.students || 0} Students</span>
                <span><Clock size={16} className="inline mr-1" /> {course.sessions || 0} Sessions</span>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => startSession(course)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Camera size={18} />
                <span>Start Attendance Session</span>
              </button>
              <button onClick={() => navigate('/analytics')} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <BarChart3 size={18} />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCourseList = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
        {/* "Add Course" button is now removed from the faculty view */}
      </div>
      {renderContent()}
    </div>
  );

  const renderLiveSession = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{selectedCourse.name}</h2>
          <p className="text-gray-500">Live Attendance Session</p>
        </div>
        <button onClick={endSession} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Save size={18} />
          <span>End & Save Session</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow bg-black rounded-lg overflow-hidden shadow-lg">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Present Students ({recognizedStudents.length})</h3>
          <ul className="space-y-3 h-96 overflow-y-auto">
            {recognizedStudents.map(student => (
              <li key={student.id} className="flex items-center text-green-700">
                <CheckCircle size={20} className="mr-3" />
                <span className="font-medium">{student.name}</span>
              </li>
            ))}
            {recognizedStudents.length === 0 && (
              <li className="text-gray-500 text-center pt-10">Searching for students...</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {isSessionActive ? renderLiveSession() : renderCourseList()}
    </div>
  );
};

export default CoursesPage;
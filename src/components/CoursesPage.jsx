import React, { useState, useEffect, useRef,useCallback,  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, BarChart3, Users, Clock, Square, CheckCircle, Plus, AlertTriangle } from 'lucide-react';

// --- Add Course Modal Component ---
const CourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName, code: courseCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add course');
      }
      onCourseAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              id="courseName" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Web Development"
            />
          </div>
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              id="courseCode" type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., CS301"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Helper Components ---
const LoadingSpinner = () => ( <div className="text-center p-10"><p className="text-gray-500">Loading Courses...</p></div> );
const ErrorDisplay = ({ message }) => ( <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg shadow-md"><AlertTriangle className="mx-auto h-12 w-12 text-red-400" /><h3 className="mt-2 text-xl font-semibold">An Error Occurred</h3><p className="mt-1">{message}</p></div> );
const EmptyState = () => ( <div className="text-center p-10 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold text-gray-800">No Courses Found</h3><p className="text-gray-500 mt-2">Click "Add Course" to create your first one.</p></div> );

// --- Main Courses Page Component ---
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/courses');
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
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseAdded = () => {
    setIsModalOpen(false);
    fetchCourses();
  };
  
  const sendFrameToBackend = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 3) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    console.log("Sending frame to backend for recognition...");
    setTimeout(() => {
      const mockRecognizedStudent = { id: Date.now(), name: `Student ${recognizedStudents.length + 1}` };
      if (!recognizedStudents.some(s => s.name === mockRecognizedStudent.name)) {
        setRecognizedStudents(prev => [...prev, mockRecognizedStudent]);
      }
      console.log("Backend recognized:", mockRecognizedStudent.name);
    }, 2000);
  }, [recognizedStudents]);

  const startSession = (course) => {
    setSelectedCourse(course);
    setIsSessionActive(true);
    setRecognizedStudents([]);
  };

  const endSession = useCallback(() => {
    setIsSessionActive(false);
    setSelectedCourse(null);
  }, []);

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
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please check permissions.");
        endSession();
      }
    };
    const stopCamera = () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      clearInterval(recognitionInterval);
      if (videoRef.current) videoRef.current.srcObject = null;
    };
    if (isSessionActive) {
      startCamera();
    }
    return () => stopCamera();
  }, [isSessionActive, sendFrameToBackend, endSession]);


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
                <span><Users size={16} className="inline mr-1" /> {course.students} Students</span>
                <span><Clock size={16} className="inline mr-1" /> {course.sessions} Sessions</span>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => startSession(course)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Camera size={18} />
                <span>Start Facial Recognition</span>
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
      <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCourseAdded={handleCourseAdded} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Plus size={18} />
          <span>Add Course</span>
        </button>
      </div>
      {renderContent()}
    </div>
  );

  const renderLiveSession = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{selectedCourse.name}</h2>
          <p className="text-gray-500">Live Facial Recognition Session</p>
        </div>
        <button onClick={endSession} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Square size={18} />
          <span>End Session</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow bg-black rounded-lg overflow-hidden shadow-lg">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Recognized Students ({recognizedStudents.length})</h3>
          <ul className="space-y-3 h-96 overflow-y-auto">
            {recognizedStudents.map(student => (
              <li key={student.id} className="flex items-center text-green-700">
                <CheckCircle size={20} className="mr-3" />
                <span className="font-medium">{student.name}</span>
              </li>
            ))}
            {recognizedStudents.length === 0 && (
              <li className="text-gray-500 text-center pt-10">Waiting for recognition...</li>
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
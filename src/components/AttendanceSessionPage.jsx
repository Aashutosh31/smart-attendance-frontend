import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { Fingerprint, CheckCircle, XCircle, Users, DoorOpen, Save } from 'lucide-react';
import { toast } from 'react-toastify';

// --- IMPORTANT: This code runs in Node.js, so we need to handle it carefully ---
// In a real project, this WebSocket server logic would be in a separate Node.js file
// and run alongside your React development server. For this example, we'll simulate it.
// To run this properly, you would need to set up a small Express server with `ws`.

const AttendanceSessionPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  const [presentStudents, setPresentStudents] = useState([]);
  const [lastScan, setLastScan] = useState({ status: null, message: '' });
  const [lectureNumber, setLectureNumber] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // This effect simulates the WebSocket server and launches the Electron app
  useEffect(() => {
    // In a real app: Start your WebSocket server here.
    console.log("WebSocket Server would start now on ws://localhost:8080");

    // Launch the Electron bridge app
    window.location.href = `attendtrack://scan?token=${token}&courseId=${courseId}`;

    // This simulates receiving messages from the WebSocket
    const interval = setInterval(() => {
        // This is a MOCK of a student being scanned successfully
        const mockStudentData = {
            studentId: `student_${Date.now()}`,
            studentName: `Mock Student ${presentStudents.length + 1}`,
        };
        
        // Add student only if they are not already in the list
        setPresentStudents(prev => {
            if (!prev.some(s => s.studentId === mockStudentData.studentId)) {
                return [...prev, mockStudentData];
            }
            return prev;
        });
        setLastScan({ status: 'success', message: `${mockStudentData.studentName} marked present!` });

    }, 5000); // Simulate a student scanning every 5 seconds

    return () => {
      // In a real app: Close the WebSocket server here.
      console.log("WebSocket Server would close now.");
      clearInterval(interval);
    };
  }, [courseId, token]);

  const handleEndSession = async () => {
    setIsSaving(true);
    try {
      const studentIds = presentStudents.map(s => s.studentId);
      
      const response = await fetch(`http://localhost:8000/api/faculty/courses/${courseId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ studentIds, lectureNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the attendance records.');
      }
      toast.success(`Attendance for Lecture ${lectureNumber} saved successfully!`);
      navigate('/courses');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800">Live Attendance Session</h2>
      <p className="text-gray-500 mb-6">Scanner is now active. Students can begin scanning.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Status and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <Fingerprint className="w-24 h-24 text-green-500 animate-pulse" />
            <h3 className="text-xl font-semibold mt-4">Scanner Active</h3>
            <p className="text-gray-600 mt-2 text-center">
              The system is now continuously listening for fingerprints.
            </p>
            <div className="mt-4 w-full text-center p-3 rounded-md min-h-[50px]">
              {lastScan.status === 'success' && <p className="text-green-600 font-semibold">{lastScan.message}</p>}
              {lastScan.status === 'error' && <p className="text-red-600 font-semibold">{lastScan.message}</p>}
            </div>
        </div>

        {/* Right side: List of present students */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Present Students ({presentStudents.length})</h3>
            <div className="flex items-center space-x-2">
              <label htmlFor="lecture" className="text-sm font-medium">Lecture #</label>
              <input 
                type="number"
                id="lecture"
                value={lectureNumber}
                onChange={(e) => setLectureNumber(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>
          <ul className="space-y-3 h-96 overflow-y-auto">
            {presentStudents.map(student => (
              <li key={student.studentId} className="flex items-center text-green-700">
                <CheckCircle size={20} className="mr-3" />
                <span className="font-medium">{student.studentName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleEndSession} 
          disabled={isSaving}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 text-lg disabled:bg-red-400"
        >
            <Save size={20} />
            <span>{isSaving ? 'Saving...' : 'End & Save Session'}</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceSessionPage;
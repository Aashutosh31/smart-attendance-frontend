// src/components/Faculty/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import FaceRecognitionModal from '../Shared/FaceRecognitionModal';
import { Book, Users, Clock } from 'lucide-react';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = useAuthStore((state) => state.session.access_token);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/faculty/me/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
                toast.error("Could not fetch your courses.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [token]);

    const handleStartSessionClick = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleRecognitionSuccess = async () => {
        if (!selectedCourse) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/faculty/courses/${selectedCourse._id}/start-session`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success(`Session for ${selectedCourse.name} started!`);
            } else {
                toast.error("Failed to start the session.");
            }
        } catch (error) {
            console.error("Error starting session:", error);
            toast.error("An error occurred while starting the session.");
        }
    };


    if (isLoading) {
        return <div>Loading courses...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="glass-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <Book className="text-purple-500 mr-3" />
                            <h2 className="text-xl font-semibold dark:text-white">{course.name}</h2>
                        </div>
                        <p className="text-gray-600 dark:text-slate-400 mb-4">Code: {course.code}</p>
                        <div className="flex items-center text-gray-600 dark:text-slate-400 mb-6">
                            <Users className="mr-2" />
                            <span>{course.students.length} students enrolled</span>
                        </div>
                        <button
                            onClick={() => handleStartSessionClick(course)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                            <Clock className="mr-2" />
                            Start Attendance Session
                        </button>
                    </div>
                ))}
            </div>
             <FaceRecognitionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleRecognitionSuccess}
                title="Faculty Verification"
            />
        </div>
    );
};

export default CoursesPage;
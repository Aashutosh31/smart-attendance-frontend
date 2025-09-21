import React, { useState } from 'react';
import apiClient from '../../api/apiClient';

const ManageFaculty = () => {
    const [facultyList, setFacultyList] = useState([]);
    const [newFaculty, setNewFaculty] = useState({
        fullName: '',
        email: '',
        password: '',
        department: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFaculty({ ...newFaculty, [name]: value });
    };

    const handleRegisterFaculty = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Map frontend state to backend serializer fields
        const payload = {
            email: newFaculty.email,
            password: newFaculty.password,
            full_name: newFaculty.fullName, // Corrected key
            department: newFaculty.department,
            role: 'faculty', // Hardcode the role for this form
        };

        try {
            // apiClient now automatically adds the auth token
            const response = await apiClient.post('/accounts/create-user/', payload);

            setFacultyList([...facultyList, response.data.user_profile]); // Assuming backend returns nested object
            setNewFaculty({ fullName: '', email: '', password: '', department: '' }); // Clear form
            alert('Faculty registered successfully!');

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
            console.error('Failed to register faculty:', error.response || error);
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Faculty</h1>
            
            <div className="mb-8 p-4 border rounded shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Add New Faculty</h2>
                <form onSubmit={handleRegisterFaculty}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={newFaculty.fullName}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newFaculty.email}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newFaculty.password}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={newFaculty.department}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Registering...' : 'Register Faculty'}
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">Existing Faculty</h2>
                {/* You can map over facultyList here to display them */}
                <div className="space-y-2">
                    {facultyList.length > 0 ? (
                        facultyList.map((faculty, index) => (
                            <div key={index} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                                <span>{faculty.full_name} ({faculty.department})</span>
                                <span>{faculty.email}</span>
                            </div>
                        ))
                    ) : (
                        <p>No faculty members added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageFaculty;
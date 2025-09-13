import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
    <div className="text-center p-20">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded-md">Go to Homepage</Link>
    </div>
);

export default UnauthorizedPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`/users/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
            setUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                const response = await fetch(`/users/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete user');
                // Redirect to home or login page after deletion
                window.location.href = '/';
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!user) return <div className="text-center">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.href = `/users/${id}/edit`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                <p className="mt-1 text-gray-900">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <p className="mt-1 text-gray-900">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Face Recognition</h3>
                        <div className="mt-4">
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    try {
                                        const response = await fetch(`/users/${id}/face`, {
                                            method: 'POST',
                                            body: formData,
                                        });
                                        if (!response.ok) throw new Error('Failed to upload face');
                                        alert('Face uploaded successfully');
                                    } catch (err) {
                                        setError(err.message);
                                    }
                                }}
                                className="space-y-4"
                            >
                                <input
                                    type="file"
                                    name="face"
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Upload Face
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 
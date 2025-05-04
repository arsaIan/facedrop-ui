import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../../api/events';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await eventsAPI.getById(id);
                setEvent(data);
                // Check if current user is subscribed
                setIsSubscribed(data.Subscribers?.some(sub => sub.ID === localStorage.getItem('userId')));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            if (isSubscribed) {
                await eventsAPI.unsubscribe(id);
            } else {
                await eventsAPI.subscribe(id);
            }
            setIsSubscribed(!isSubscribed);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        setIsLoading(true);
        try {
            await eventsAPI.delete(id);
            navigate('/events');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                        <div className="flex space-x-4">
                            <Link
                                to={`/events/${id}/photos`}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                View Photos
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete Event
                            </button>
                        </div>
                    </div>
                    {event.description && (
                        <p className="mt-2 text-gray-600">{event.description}</p>
                    )}
                    {event.endDate && (
                        <p className="mt-2 text-sm text-gray-500">
                            End Date: {new Date(event.endDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                    {/* Photo Upload Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Event Photo</h3>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('photo', file);
                                        setSelectedFile(formData);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                            {selectedFile && (
                                <button
                                    onClick={async () => {
                                        try {
                                            setIsUploading(true);
                                            await eventsAPI.uploadPhoto(id, selectedFile);
                                            setUploadSuccess(true);
                                            setSelectedFile(null);
                                        } catch (err) {
                                            setError(err.message);
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                    disabled={isUploading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            )}
                        </div>
                        {uploadSuccess && (
                            <div className="mt-2 text-sm text-green-600">
                                Photo uploaded successfully!
                            </div>
                        )}
                    </div>

                    {/* Push to Ready Queue Button */}
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    setIsLoading(true);
                                    await eventsAPI.pushToReadyQueue(id);
                                } catch (err) {
                                    setError(err.message);
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Push to Ready Queue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail; 
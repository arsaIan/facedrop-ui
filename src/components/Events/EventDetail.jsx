import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../../api/events';
import QRModal from './QRModal';

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
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await eventsAPI.getById(id);
                setEvent(data);
                setIsSubscribed(data.Subscribers?.some(sub => sub.ID === localStorage.getItem('userId')));
                // Set the share URL
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
        <div className="bg-white shadow rounded-lg overflow-hidden m-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowQR(true)}
                                className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                                title="Show QR Code"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v4m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </button>
                            <Link
                                to={`/events/${id}/photos`}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                title="View Photos"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </Link>
                            <Link
                                to={`/events/${id}/subscribers`}
                                className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
                                title="View Subscribers"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                                title="Delete Event"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
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

                {/* QR Modal */}
                <QRModal
                    isOpen={showQR}
                    onClose={() => setShowQR(false)}
                    eventId={id}
                    qrCodeUrl={event.qr_code}
                />
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
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                                    title={isUploading ? 'Uploading...' : 'Upload Photo'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
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
                            {isLoading ? 'Processing...' : 'Send to Subscribers'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail; 
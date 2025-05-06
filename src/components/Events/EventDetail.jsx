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
    const [queueStatus, setQueueStatus] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [previewsPerPage, setPreviewsPerPage] = useState(6);

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

    // Calculate number of previews based on screen width
    useEffect(() => {
        const updatePreviewsPerPage = () => {
            const width = window.innerWidth;
            if (width < 640) { // sm
                setPreviewsPerPage(2);
            } else if (width < 1024) { // lg
                setPreviewsPerPage(4);
            } else {
                setPreviewsPerPage(6);
            }
        };

        updatePreviewsPerPage();
        window.addEventListener('resize', updatePreviewsPerPage);
        return () => window.removeEventListener('resize', updatePreviewsPerPage);
    }, []);

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

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFiles = (files) => {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            const formData = new FormData();
            imageFiles.forEach(file => {
                formData.append('photo', file);
            });
            setSelectedFiles(imageFiles);
            setSelectedFile(formData);
            
            // Create preview URLs for all images
            const urls = imageFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
            setCurrentPage(0);
        }
    };

    const handleFileSelect = (files) => {
        processFiles(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const items = e.dataTransfer.items;
        const files = [];

        const processEntry = async (entry) => {
            if (entry.isFile) {
                const file = await new Promise(resolve => entry.file(resolve));
                files.push(file);
            } else if (entry.isDirectory) {
                const reader = entry.createReader();
                const entries = await new Promise(resolve => {
                    reader.readEntries(resolve);
                });
                for (const subEntry of entries) {
                    await processEntry(subEntry);
                }
            }
        };

        const processItems = async () => {
            for (const item of items) {
                const entry = item.webkitGetAsEntry();
                if (entry) {
                    await processEntry(entry);
                }
            }
            processFiles(files);
        };

        processItems();
    };

    // Cleanup preview URLs when component unmounts or when files are cleared
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const totalPages = Math.ceil(previewUrls.length / previewsPerPage);
    const currentPreviews = previewUrls.slice(
        currentPage * previewsPerPage,
        (currentPage + 1) * previewsPerPage
    );

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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Event Photos</h3>
                        <div 
                            className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <div className="text-gray-600">
                                    <p>Drag and drop photos or folders here, or</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                        className="hidden"
                                        id="file-upload"
                                        multiple
                                        webkitdirectory
                                        directory
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                        Browse Files
                                    </label>
                                </div>
                            </div>
                        </div>
                        {selectedFile && (
                            <div className="mt-4 space-y-4">
                                {previewUrls.length > 0 && (
                                    <div className="mt-4 border border-gray-200 rounded-md p-3 bg-gray-50">
                                        <div className="flex items-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs font-medium text-gray-500">Images</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 -m-[1px]">
                                                {currentPreviews.map((url, index) => (
                                                    <div key={url} className="relative w-10 h-10 rounded-sm overflow-hidden border border-gray-200 shadow-sm -m-[1px]">
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {totalPages > 1 && (
                                                <div className="flex justify-center items-center space-x-1">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                                        disabled={currentPage === 0}
                                                        className="px-1.5 py-0.5 rounded-sm border border-gray-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        ←
                                                    </button>
                                                    <span className="text-xs text-gray-600">
                                                        {currentPage + 1}/{totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                                        disabled={currentPage === totalPages - 1}
                                                        className="px-1.5 py-0.5 rounded-sm border border-gray-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        →
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-end space-x-4">
                                    <span className="text-sm text-gray-500">
                                        {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''} selected
                                    </span>
                                    <button
                                        onClick={async () => {
                                            try {
                                                setIsUploading(true);
                                                await eventsAPI.uploadPhoto(id, selectedFile);
                                                setUploadSuccess(true);
                                                setSelectedFile(null);
                                                setSelectedFiles([]);
                                                setPreviewUrls([]);
                                            } catch (err) {
                                                setError(err.message);
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        }}
                                        disabled={isUploading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </div>
                                        ) : 'Upload Photos'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setSelectedFiles([]);
                                            previewUrls.forEach(url => URL.revokeObjectURL(url));
                                            setPreviewUrls([]);
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {uploadSuccess && (
                            <div className="mt-2 text-sm text-green-600">
                                Photos uploaded successfully!
                            </div>
                        )}
                    </div>

                    {/* Push to Ready Queue Button */}
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    setIsLoading(true);
                                    setQueueStatus(null);
                                    await eventsAPI.pushToReadyQueue(id);
                                    setQueueStatus('success');
                                } catch (err) {
                                    setError(err.message);
                                    setQueueStatus('error');
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : 'Send to Subscribers'}
                        </button>
                        {queueStatus === 'success' && (
                            <div className="mt-2 text-sm text-green-600">
                                Files sent to subscribers. 
                            </div>
                        )}
                        {queueStatus === 'error' && (
                            <div className="mt-2 text-sm text-red-600">
                                Failed to push event to subscribers. Please try again.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail; 
import React from 'react';
import { Link } from 'react-router-dom';

const EventQR = ({ eventId, qrCodeUrl }) => {
    // Convert base64 to proper image source
    console.log(qrCodeUrl);
    const qrImageSource = `data:image/png;base64,${qrCodeUrl}`;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = qrImageSource;
        link.download = `event-qr-${eventId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Event QR Code',
                    text: 'Scan this QR code to subscribe to the event',
                    url: qrImageSource
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(qrImageSource);
            alert('QR code link copied to clipboard!');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Event Created Successfully!
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Scan this QR code to subscribe to the event
                            </p>
                            
                            <div className="flex justify-center mb-8">
                                <img
                                    src={qrImageSource}
                                    alt="Event QR Code"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>

                            <div className="flex justify-center space-x-4 mb-8">
                                <button
                                    onClick={handleShare}
                                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                                    title="Share QR Code"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                                    title="Download QR Code"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <Link
                                    to="/events"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Back to Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventQR; 
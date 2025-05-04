import React from 'react';
import { Link } from 'react-router-dom';

const EventQR = ({ eventId, qrCodeUrl }) => {
    // Convert base64 to proper image source
    const qrImageSource = `data:image/png;base64,${qrCodeUrl}`;

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

                            <div className="space-y-4">
                                <Link
                                    to="/events"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
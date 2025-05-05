import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI } from '../../api/events';

const EventSubscribers = () => {
    const { id } = useParams();
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const event = await eventsAPI.getById(id);
                setSubscribers(event.subscribers || []);
                console.log("subs", event.subscribers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, [id]);

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Subscribers</h2>
                    
                    {!subscribers || subscribers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No subscribers yet.</p>
                            <p className="text-gray-400 text-sm mt-2">Share the event link or QR code to get subscribers.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subscribed At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {subscribers.map((subscriber) => (
                                        <tr key={subscriber.ID}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {subscriber.name || 'Anonymous'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {subscriber.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(subscriber.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventSubscribers; 
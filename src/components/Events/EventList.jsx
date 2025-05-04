import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/events');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                <Link
                    to="/events/create"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex justify-between items-center">
                                <Link
                                    to={`/events/${event.id}`}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`/events/${event.id}/subscribe`, {
                                                method: 'POST',
                                            });
                                            if (!response.ok) throw new Error('Failed to subscribe');
                                            alert('Subscribed successfully');
                                        } catch (err) {
                                            setError(err.message);
                                        }
                                    }}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList; 
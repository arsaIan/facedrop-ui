import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [myPhotos, setMyPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        fetchPhotos();
        fetchMyPhotos();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`/events/${id}`);
            if (!response.ok) throw new Error('Failed to fetch event');
            const data = await response.json();
            setEvent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`/events/${id}/photos`);
            if (!response.ok) throw new Error('Failed to fetch photos');
            const data = await response.json();
            setPhotos(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchMyPhotos = async () => {
        try {
            const response = await fetch(`/events/${id}/my-photos`);
            if (!response.ok) throw new Error('Failed to fetch my photos');
            const data = await response.json();
            setMyPhotos(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`/events/${id}/subscribe`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to subscribe');
            setIsSubscribed(true);
            alert('Subscribed successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`/events/${id}/subscribe`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to unsubscribe');
            setIsSubscribed(false);
            alert('Unsubscribed successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`/events/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete event');
                navigate('/events');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddPhoto = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await fetch(`/events/${id}/photos`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to add photo');
            fetchPhotos();
            e.target.reset();
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePushToReady = async () => {
        try {
            const response = await fetch(`/events/${id}/ready`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to push to ready queue');
            alert('Event pushed to ready queue');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!event) return <div className="text-center">Event not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate(`/events/${id}/edit`)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Edit Event
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete Event
                        </button>
                    </div>
                </div>

                <p className="text-gray-600 mb-6">{event.description}</p>

                <div className="flex space-x-4 mb-6">
                    {isSubscribed ? (
                        <button
                            onClick={handleUnsubscribe}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Unsubscribe
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Subscribe
                        </button>
                    )}
                    <button
                        onClick={handlePushToReady}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                        Push to Ready Queue
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Add Photo</h3>
                    <form onSubmit={handleAddPhoto} className="space-y-4">
                        <input
                            type="file"
                            name="photo"
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
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Upload Photo
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Event Photos</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo.url}
                                    alt={`Event photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">My Photos</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {myPhotos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo.url}
                                    alt={`My photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail; 
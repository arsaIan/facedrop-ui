import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../api/events';
import { useAuth } from '../../context/AuthContext';

const Subscribe = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

    const eventId = searchParams.get('event');

    useEffect(() => {
        // Wait for authentication check to complete
        if (authLoading) {
            return;
        }

        // Only redirect to register if user is not authenticated
        if (!isAuthenticated && eventId) {
            localStorage.setItem('pendingSubscription', eventId);
            navigate('/register');
            return;
        }

        // If user is authenticated, proceed with fetching event
        if (isAuthenticated && eventId) {
            const fetchEvent = async () => {
                try {
                    const data = await eventsAPI.getById(eventId);
                    setEvent(data);
                    // Check if user is already subscribed
                    const isSubscribed = data.Subscribers?.some(sub => sub.ID === localStorage.getItem('userId'));
                    if (isSubscribed) {
                        setSubscriptionSuccess(true);
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchEvent();
        } else {
            setLoading(false);
            if (!eventId) {
                setError('No event ID provided');
            }
        }
    }, [eventId, isAuthenticated, authLoading, navigate]);

    const handleSubscribe = async () => {
        if (!eventId) return;

        setIsSubscribing(true);
        try {
            await eventsAPI.subscribe(eventId);
            setSubscriptionSuccess(true);
            // Clear any pending subscription
            localStorage.removeItem('pendingSubscription');
        } catch (err) {
            // Handle the error response format from the backend
            const errorMessage = err.error || err.message || 'Failed to subscribe to event';
            setError(errorMessage);
            // If user is already subscribed, show success state
            if (errorMessage === 'User already subscribed to event') {
                setSubscriptionSuccess(true);
            }
        } finally {
            setIsSubscribing(false);
        }
    };

    // Show loading spinner while auth is being checked or event is being fetched
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
                        <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {subscriptionSuccess ? (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Subscribed!</h2>
                            <p className="text-gray-600 mb-4">You are now subscribed to {event.title}</p>
                            <button
                                onClick={() => navigate(`/events/${eventId}`)}
                                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                View Event Details
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                            {event.description && (
                                <p className="text-gray-600 mb-4">{event.description}</p>
                            )}
                            <button
                                onClick={handleSubscribe}
                                disabled={isSubscribing}
                                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubscribing ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subscribing...
                                    </div>
                                ) : 'Subscribe to Event'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subscribe; 
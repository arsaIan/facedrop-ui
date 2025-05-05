import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EventList from './components/Events/EventList';
import EventDetail from './components/Events/EventDetail';
import EventPhotos from './components/Events/EventPhotos';
import CreateEvent from './components/Events/CreateEvent';
import EventSubscribers from './components/Events/EventSubscribers';
import LandingPage from './components/Landing/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/home" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/home" element={<LandingPage />} />
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/events/create"
                            element={
                                <PrivateRoute>
                                    <CreateEvent />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events/:id/photos"
                            element={
                                <PrivateRoute>
                                    <EventPhotos />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events/:id/subscribers"
                            element={
                                <PrivateRoute>
                                    <EventSubscribers />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events/:id"
                            element={
                                <PrivateRoute>
                                    <EventDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events"
                            element={
                                <PrivateRoute>
                                    <EventList />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App; 
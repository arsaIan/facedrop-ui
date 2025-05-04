import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Events from './components/Events/Events';
import EventDetails from './components/Events/EventDetails';
import EventPhotos from './components/Events/EventPhotos';
import CreateEvent from './components/Events/CreateEvent';
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
                            path="/events"
                            element={
                                <PrivateRoute>
                                    <Events />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events/create"
                            element={
                                <PrivateRoute>
                                    <CreateEvent />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events/:id"
                            element={
                                <PrivateRoute>
                                    <EventDetails />
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
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App; 
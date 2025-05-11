import { API_URL } from '../assets/constants';

export const usersAPI = {
    getProfile: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return response.json();
    },

    updateProfile: async (userData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        return response.json();
    },

    uploadFace: async (faceData) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('face', faceData);

        const response = await fetch(`${API_URL}/users/face`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload face');
        }

        return response.json();
    },

    getFace: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/face`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch face');
        }

        return response.json();
    },

    getSubscribedEvents: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/events`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch subscribed events');
        }

        return response.json();
    }
}; 
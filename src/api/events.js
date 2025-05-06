const API_URL = 'http://localhost:8080';

export const eventsAPI = {
    getAll: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        return response.json();
    },

    getById: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch event');
        }

        return response.json();
    },

    create: async (eventData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create event');
        }

        return response.json();
    },

    update: async (id, eventData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update event');
        }

        return response.json();
    },

    delete: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete event');
        }
    },

    subscribe: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe to event');
        }

        return response.json();
    },

    unsubscribe: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}/unsubscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to unsubscribe from event');
        }
    },

    uploadPhoto: async (id, formData) => {
        const token = localStorage.getItem('token');
        // const formData = new FormData();
        // formData.append('photo', photoData);

        const response = await fetch(`${API_URL}/events/${id}/photos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload photo');
        }

        return response.json();
    },

    getEventPhotos: async (id, page = 1, limit = 12) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}/photos?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch event photos');
        }

        return response.json();
    },

    pushToReadyQueue: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}/ready`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to push to ready queue');
        }
    },

    getSubscribers: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${id}/subscribers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch subscribers');
        }

        return response.json();
    }
}; 
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class EventService {
    async getAllEvents() {
        try {
            const response = await axios.get(`${API_URL}/events`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getEventById(id) {
        try {
            const response = await axios.get(`${API_URL}/events/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getEventMenus(eventId) {
        try {
            const response = await axios.get(`${API_URL}/menus/event/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getEventOpportunities(eventId) {
        try {
            const response = await axios.get(`${API_URL}/opportunities/event/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async createEvent(eventData) {
        try {
            const response = await axios.post(`${API_URL}/events`, eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new EventService();
const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

async function apiCall(endpoint, options = {}) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Auth APIs for Login/Signup
export const authAPI = {
  signUp: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: userData,
  }),
  
  signIn: (credentials) => apiCall('/auth/signin', {
    method: 'POST',
    body: credentials,
  }),
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
};

// Booking APIs 
export const bookingAPI = {
  createBooking: (bookingData) => apiCall('/bookings', {
    method: 'POST',
    body: bookingData,
  }),
  
  getUserBookings: () => apiCall('/bookings/my-bookings'),
  
  getBooking: (bookingId) => apiCall(`/bookings/${bookingId}`),
  
  updateBooking: (bookingId, updates) => apiCall(`/bookings/${bookingId}`, {
    method: 'PUT',
    body: updates,
  }),
  
  deleteBooking: (bookingId) => apiCall(`/bookings/${bookingId}`, {
    method: 'DELETE',
  }),
};

// User APIs
export const userAPI = {
  getCurrentUser: () => apiCall('/users/me'),
  
  updateUserProfile: (profileData) => apiCall('/users/profile', {
    method: 'PUT',
    body: profileData,
  }),
};

// Venue APIs
export const venueAPI = {
  getVenues: () => apiCall('/venues'),
  getVenue: (venueId) => apiCall(`/venues/${venueId}`),
  getVenuesByBuilding: (building) => apiCall(`/venues/building/${building}`),
};

//More to come?? 

export default apiCall;
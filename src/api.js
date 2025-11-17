const API_BASE_URL = 'http://localhost:8080/api';

async function apiCall(endpoint, options = {}) {
  try {
    const config = {
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    console.log('🔵 MAKING API CALL:', `${API_BASE_URL}${endpoint}`);
    console.log('🔵 REQUEST BODY:', options.body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log('🔵 RESPONSE STATUS:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.log('🔵 ERROR RESPONSE TEXT:', errorText);
        errorMessage = errorText || errorMessage;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
        }
      } catch (e) {
        console.log('🔵 ERROR READING RESPONSE:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('🟢 SUCCESS RESPONSE:', data);
    return data;

  } catch (error) {
    console.error('🔴 API CALL FAILED:', error);
    throw new Error(error.message || 'Network error');
  }
}

// Test connection first
export const testAPI = {
  testConnection: () => apiCall('/test'),
};

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

export default apiCall;
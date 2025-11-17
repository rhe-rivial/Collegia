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
      } catch (e) {
        console.log('🔵 ERROR READING RESPONSE:', e);
      }
      throw new Error(errorMessage);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('🟢 SUCCESS RESPONSE:', data);
      return data;
    } else {
      console.log('🟢 SUCCESS RESPONSE: No content');
      return null;
    }

  } catch (error) {
    console.error('🔴 API CALL FAILED:', error);
    throw new Error(error.message || 'Network error');
  }
}

//Booking APIs - temp
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
  getUserById: (id) => apiCall(`/users/${id}`),
  
  updateUser: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: userData,
  }),
  
  getUserByEmail: (email) => apiCall(`/users/email/${email}`),
};

// Auth APIs 
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
  }
  
};

export default apiCall;
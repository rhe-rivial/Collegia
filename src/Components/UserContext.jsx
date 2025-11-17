import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("collegia_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        
        // Transform the signup data into profile data
        const profileData = {
          name: userData.fullName || "User",
          about: userData.about || `${userData.userType} at ${userData.course || userData.company || userData.department || 'University'}`,
          location: userData.location || "Cebu City, Philippines",
          work: userData.work || `${userData.userType} - ${userData.course || userData.company || userData.department || 'University'}`,
          joined: new Date().getFullYear().toString(),
          bookings: []
        };
        
        setUser(profileData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  const login = (userData) => {
    const profileData = {
      name: userData.fullName || "User",
      about: userData.about || `${userData.userType} at ${userData.course || userData.company || userData.department || 'University'}`,
      location: userData.location || "Cebu City, Philippines",
      work: userData.work || `${userData.userType} - ${userData.course || userData.company || userData.department || 'University'}`,
      joined: new Date().getFullYear().toString(),
      bookings: []
    };
    setUser(profileData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      updateUser,
      login,
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
}
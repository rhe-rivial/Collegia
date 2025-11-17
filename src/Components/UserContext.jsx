import React, { createContext, useState, useEffect } from 'react';
import { userAPI, authAPI } from '../api';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("currentUser");
      
      if (token && savedUser) {
        try {
          // Parse the saved user to get the ID
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Fetch fresh user data from backend using the user ID
          if (userData.userId) {
            try {
              const freshUserData = await userAPI.getUserById(userData.userId);
              setUser(freshUserData);
              localStorage.setItem("currentUser", JSON.stringify(freshUserData));
            } catch (error) {
              console.warn("Could not fetch fresh user data, using cached:", error);
            }
          }
        } catch (error) {
          console.error("Error loading user:", error);
          authAPI.logout();
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const updateUser = async (newData) => {
    try {
      if (!user || !user.userId) {
        throw new Error("No user ID available");
      }
      
      const updatePayload = {
        about: newData.about,
        location: newData.location,
        work: newData.work,
        firstName: user.firstName, 
        lastName: user.lastName,  
        email: user.email,         
        userType: user.userType   
      };
      
      const updatedUser = await userAPI.updateUser(user.userId, updatePayload);
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const login = (userData) => {
    if (!userData.userId) {
      console.error('Login failed: User data missing userId');
      return;
    }
    
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("userId", userData.userId.toString());
    localStorage.setItem("authToken", "user-authenticated");
  };

  const logout = () => {
    setUser(null);
    authAPI.logout();
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
import React, { createContext, useState, useEffect } from 'react';
import { userAPI, authAPI } from './api';

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
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Optionally fetch fresh user data from backend
          try {
            const freshUserData = await userAPI.getCurrentUser();
            setUser(freshUserData);
            localStorage.setItem("currentUser", JSON.stringify(freshUserData));
          } catch (error) {
            console.warn("Could not fetch fresh user data, using cached:", error);
          }
        } catch (error) {
          console.error("Error loading user:", error);
          // Clear invalid data
          authAPI.logout();
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const updateUser = async (newData) => {
    try {
      const updatedUser = await userAPI.updateUserProfile(newData);
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
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
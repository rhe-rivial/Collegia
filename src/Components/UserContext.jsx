import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI, authAPI } from '../api';

export const UserContext = createContext();

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("currentUser");
      
      console.log('🟡 UserContext - Initializing user:', {
        token: token ? 'exists' : 'null',
        savedUser: savedUser ? 'exists' : 'null'
      });
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('🟡 UserContext - Parsed user data:', userData);
          setUser(userData);
          
          // Fetch user data from backend using the user ID
          if (userData.userId) {
            try {
              const freshUserData = await userAPI.getUserById(userData.userId);
              console.log('🟢 UserContext - Fresh user data:', freshUserData);
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
      } else {
        console.log('🔴 UserContext - No user data found, setting user to null');
        setUser(null); 
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    
    window.dispatchEvent(new Event('loginStatusChange'));
    console.log('🔴 UserContext - User logged out');
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
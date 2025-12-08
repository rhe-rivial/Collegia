import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI, authAPI } from "../api.js";

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
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);

          // Fetch fresh backend data
          if (userData.userId) {
            try {
              const freshUser = await userAPI.getUserById(userData.userId);

              const completeUser = {
                userId: freshUser.userId,
                firstName: freshUser.firstName,
                lastName: freshUser.lastName,
                email: freshUser.email,
                userType: freshUser.userType,
                about: freshUser.about,
                location: freshUser.location,
                work: freshUser.work,
                name: freshUser.name || `${freshUser.firstName} ${freshUser.lastName}`
              };

              setUser(completeUser);
              localStorage.setItem("currentUser", JSON.stringify(completeUser));

            } catch (err) {
              setUser(userData);
            }
          } else {
            setUser(userData);
          }
        } catch (error) {
          authAPI.logout();
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const updateUser = async (newData) => {
    if (!user || !user.userId) throw new Error("No user ID available");

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

    const completeUpdated = {
      ...updatedUser,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
    };

    setUser(completeUpdated);
    localStorage.setItem("currentUser", JSON.stringify(completeUpdated));
    return completeUpdated;
  };

  const login = (userData) => {
    const completeUser = {
      userId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userType: userData.userType,
      about: userData.about,
      location: userData.location,
      work: userData.work,
      name: userData.name || `${userData.firstName} ${userData.lastName}`
    };

    setUser(completeUser);
    localStorage.setItem("currentUser", JSON.stringify(completeUser));
    localStorage.setItem("userId", userData.userId.toString());
    localStorage.setItem("authToken", "user-authenticated");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event('loginStatusChange'));
  };

  const isCustodian = user && 
    (user.userType === 'CUSTODIAN' || user.userType === 'Custodian');

  // 👉 ADD THIS
  const isAdmin = user && (user.userType === 'Admin');

  return (
    <UserContext.Provider value={{
      user,
      setUser,      // 👉 REQUIRED FOR ProtectedAdminRoute
      isLoading,
      updateUser,
      login,
      logout,
      isCustodian,
      isAdmin       // 👉 OPTIONAL but useful
    }}>
      {children}
    </UserContext.Provider>
  );
}

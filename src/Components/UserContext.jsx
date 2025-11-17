import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = JSON.parse(localStorage.getItem("collegia_user"));
      if (savedUser) {
        setUser({
          name: savedUser.fullName || "User",
          joined: savedUser.joined || new Date().getFullYear().toString(),
          about: savedUser.about || "Add something about yourself...",
          location: savedUser.location || "Not specified",
          work: savedUser.work || "Not specified",
          email: savedUser.email,
          userType: savedUser.userType,
          course: savedUser.course,
          organization: savedUser.organization,
          company: savedUser.company,
          department: savedUser.department,
        });
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const updateUser = (newUserData) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...newUserData };
      
      const savedUser = JSON.parse(localStorage.getItem("collegia_user")) || {};
      const updatedSavedUser = { ...savedUser, ...newUserData };
      localStorage.setItem("collegia_user", JSON.stringify(updatedSavedUser));
      
      return updatedUser;
    });
  };

  const login = (userData) => {
    const userObj = {
      name: userData.fullName || "User",
      joined: userData.joined || new Date().getFullYear().toString(),
      about: userData.about || "Add something about yourself...",
      location: userData.location || "Not specified",
      work: userData.work || "Not specified",
      email: userData.email,
      userType: userData.userType,
      course: userData.course,
      organization: userData.organization,
      company: userData.company,
      department: userData.department,
    };
    setUser(userObj);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("collegia_user");
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser, 
      login, 
      logout,
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
}
import { createContext, useState } from "react";

// Data for testing purposes

export const UserContext = createContext();

export function UserProvider({ children }) {

  const [user, setUser] = useState({
    name: "John Doe",
    about: "Lorem ipsum dolor sit amet...",
    location: "Cebu City, Philippines",
    work: "Software Developer",
    joined: 2021,
    bookings: []
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

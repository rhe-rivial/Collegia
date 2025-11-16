import React from "react";
import ProfileDetails from "./ProfileDetails";
import ExtendProfile from "./ExtendProfile";
import BookingHistory from "./BookingHistory";
import "../styles/AccountLayout.css";

export default function AccountPage() {

  // TEMP USER DATA
  const user = {
    name: "John Doe",
    joined: "2021",
    about: "Lorem ipsum dolor sit amet...",
    location: "Cebu City, Philippines",
    work: "Software Developer",
    bookings: [
      { id: 1, venue: "NGE 101", date: "Jan 10, 2025", time: "1PM - 3PM" },
      { id: 2, venue: "SAL Hall", date: "Jan 12, 2025", time: "9AM - 12NN" }
    ]
  };

  return (
    <div className="account-layout">

      <div className="account-columns">
        <ProfileDetails user={user} />

        <ExtendProfile user={user} isEditing={false} />

        <BookingHistory bookings={user.bookings} />
      </div>

    </div>
  );
}

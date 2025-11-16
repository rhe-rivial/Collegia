import React from "react";
import ProfileDetails from "./ProfileDetails";
import ExtendProfile from "./ExtendProfile";
import "../styles/AccountLayout.css";

export default function EditAccountPage() {

  const user = {
    name: "John Doe",
    joined: "2021",
    about: "Lorem ipsum dolor sit amet...",
    location: "Cebu City, Philippines",
    work: "Software Developer",
  };

  return (
    <div className="account-layout">

      <div className="account-columns editing">
        <ProfileDetails user={user} />

        <ExtendProfile user={user} isEditing={true} />
      </div>

    </div>
  );
}

import ProfileDetails from "./ProfileDetails";
import ExtendProfile from "./ExtendProfile";
import "../styles/AccountLayout.css";

export default function EditAccountPage() {
  return (
    <div className="account-layout">
      <div className="account-columns editing">
        <ProfileDetails />
        <ExtendProfile isEditing={true} />
      </div>
    </div>
  );
}
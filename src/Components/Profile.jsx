import SignIn from "./SignIn";
import SignOut from "./SignOut";
import ColorPicker from "./ColorPicker";
import CategoriesManager from "./CategoriesManager";
import SettingsPanel from "./SettingsPanel";
import PropTypes from "prop-types";

const Profile = ({ user }) => {
  return (
    <>
      {user && user.email ? (
        <>
          <div>
            <h2 className="mb-5 text-center text-3xl font-bold">Profile</h2>
            <p className="text-center">
              Signed in as <strong>{user.email}</strong>
            </p>

            <SignOut />
          </div>

          <div className="flex flex-col gap-12 lg:flex-row xl:gap-24">
            <SettingsPanel heading="Customize Task Colors">
              <ColorPicker user={user} />
            </SettingsPanel>
            <SettingsPanel heading="Manage Categories">
              <CategoriesManager />
            </SettingsPanel>
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;

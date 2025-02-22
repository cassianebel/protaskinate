import SignIn from "./SignIn";
import SignOut from "./SignOut";

const Profile = ({ user }) => {
  return (
    <>
      {user && user.email ? (
        <>
          <h2 className="mb-5 text-center text-2xl kaushan-script-regular">
            Profile
          </h2>
          <p className="text-center">
            Signed in as <strong>{user.email}</strong>
          </p>
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Profile;

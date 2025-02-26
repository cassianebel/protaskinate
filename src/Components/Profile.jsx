import SignIn from "./SignIn";
import SignOut from "./SignOut";
import ColorPicker from "./ColorPicker";

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

          <div>
            <h3 className="text-center text-2xl font-bold">
              Customize Your Colors!
            </h3>
            <div>
              <ColorPicker user={user} />
            </div>
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Profile;

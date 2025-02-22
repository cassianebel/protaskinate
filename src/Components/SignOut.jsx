import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function SignOut() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="min-w-80 mx-auto p-5">
      <Button text="Sign Out" style="primary" action={handleSignOut} />
    </div>
  );
}

export default SignOut;

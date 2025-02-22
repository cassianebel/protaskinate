import { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUserInDatabase } from "../firestore";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Button from "./Button";
import Error from "./Error";

function GoogleSignIn() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      const authUser = result.user;
      // Create or update user in Firestore
      await createUserInDatabase({ email: authUser.email, uid: authUser.uid });
      navigate("/");
    } catch (error) {
      console.error(error.message);
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/user-cancelled"
      ) {
        setError("Sign in with Google was cancelled.");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error. Please try again.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <>
      {error && <Error errorText={error} />}
      <Button
        text="Sign in with Google"
        action={handleGoogleSignIn}
        style="secondary"
        icon={<FcGoogle />}
      />
    </>
  );
}

export default GoogleSignIn;

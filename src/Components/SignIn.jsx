import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserInDatabase } from "../firestore";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "./SignInGoogle";
import Button from "./Button";
import Error from "./Error";
import Input from "./Input";
import Link from "./Link";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const results = await signInWithEmailAndPassword(auth, email, password);
      const authUser = results.user;
      // Create or update user in Firestore
      await createUserInDatabase({ email: authUser.email, uid: authUser.uid });
      navigate("/");
    } catch (error) {
      console.log(error.code);
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        setError("Invalid Credentials");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-w-80 max-w-sm mx-auto p-5">
      <h3 className="mb-5 text-center text-2xl kaushan-script-regular">
        Sign In
      </h3>
      {error && <Error errorText={error} />}
      <form onSubmit={handleSignIn}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          changeHandler={(e) => setEmail(e.target.value)}
          required={true}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          changeHandler={(e) => setPassword(e.target.value)}
          required={true}
        />
        <Button text="Sign In" type="submit" style="primary" />
      </form>
      <p className="my-2 text-center text-lg kaushan-script-regular">- OR -</p>
      <GoogleSignIn />
      <p className="mt-5">
        No Account? <Link text="Sign Up" link="/signup" style="inline" />
      </p>
    </div>
  );
}

export default SignIn;

import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "./SignInGoogle";
import Button from "./Button";
import Error from "./Error";
import Input from "./Input";
import Link from "./Link";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/decks");
    } catch (error) {
      console.log(error.code);
      console.error(error);
      if (error.code === "auth/missing-password") {
        setError("Please enter a password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak - must be at least 6 characters.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-w-80 max-w-sm mx-auto p-5">
      <h2 className="mb-5 text-center text-2xl kaushan-script-regular">
        Sign Up
      </h2>
      {error && <Error errorText={error} />}
      <form onSubmit={handleSignUp}>
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
        <Button text="Sign Up" type="submit" style="primary" />
      </form>
      <p className="my-2 text-center text-lg kaushan-script-regular">- OR -</p>
      <GoogleSignIn />
      <p className="mt-5">
        Have an Account? <Link text="Sign In" link="/signin" style="inline" />
      </p>
    </div>
  );
}

export default SignUp;

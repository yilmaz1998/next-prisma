import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Link from "next/link";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      await fetch("/api/users/createUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 h-screen flex flex-col justify-center text-center items-center">
    <div className="bg-white w-full max-w-md bg-white shadow-lg rounded-xl p-12">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col max-w-full">
      <div className="form-floating mb-3">
          <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username" />
          <label>Email</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <label>Password</label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
      <div className='mt-6 text-center'>
        <Link href="/login" className="text-blue-600">Back to Login Page</Link>
      </div> 
    </div>
    </div>
  );
};

export default Signup;

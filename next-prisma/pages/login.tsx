import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import "@/app/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { SlActionRedo } from "react-icons/sl";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
      <div className="flex">
        <h1 className="text-white">Welcome to To-Do App</h1>
        <SlActionRedo className="text-white text-3xl ml-2"/>
      </div>
      <p className="text-white mb-4">Keep calm and stay organized.</p>
      <div className="bg-white w-full max-w-md bg-white shadow-lg rounded-xl p-12">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col max-w-full">
      <div className="form-floating mb-3">
          <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username" />
          <label>Email</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <label>Password</label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit"className="btn btn-primary">
          Login
        </button>
      </form>
      <div className='text-center'>
        <p className="mt-4 text-gray-600">Don't have an account?</p>
        <Link href="/signup" className="text-blue-600">Sign Up</Link>
      </div> 
    </div>
  </div>
  );
};

export default Login;

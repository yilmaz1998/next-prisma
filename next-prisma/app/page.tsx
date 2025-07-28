'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="p-6">
      <p className="text-2xl">Welcome, {user.email}</p>
      <button
        onClick={handleLogout}
        className="btn btn-danger"
      >
        Logout
      </button>
    </div>
  );
}

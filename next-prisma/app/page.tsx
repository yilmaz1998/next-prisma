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
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [type, setType] = useState("HOME")

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    const todoData = {
      title,
      type,
      dueDate: dueDate ? new Date(dueDate) : null,
    };
  
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create todo");
      }
  
      setTitle("")
      setDueDate("")
      setType("HOME")
      router.refresh()
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div>
      <header className="flex bg-blue-200 justify-between py-2 px-4">
        <p className="text-2xl">Welcome, {user.email}</p>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </header>
      <div>
        <h1 className="text-center mt-4">Add a To-Do</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-full mt-4">
        <div className="form-floating w-1/2 mx-auto">
          <textarea
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Title</label>

          <input
            type="datetime-local"
            name="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-control mt-2"
            required
          />

          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select mt-2"
          >
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="FUN">Fun</option>
            <option value="HEALTH">Health</option>
          </select>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Add Todo
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

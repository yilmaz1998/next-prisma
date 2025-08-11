'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import Todos from "@/components/Todos";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null)
  const [todos, setTodos] = useState<Todo[]>([]);

  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [type, setType] = useState("HOME")

  type Todo = {
    id: string;
    title: string;
    type: string;
    completed: boolean;
    dueDate: string | null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);

        try {
          const token = await currentUser.getIdToken();
          const res = await fetch("/api/todos", {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
          });
          if (res.ok) {
            const data = await res.json();
            setTodos(data);
          }
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
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

      const newTodo = await response.json();
      setTodos((prev) => [newTodo, ...prev]);
  
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
      <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2">
      <h1 className="text-center mt-4">Add a To-Do</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-full mt-4">
        <div className="form-floating w-4/5 mx-auto">
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
      <div className="w-full lg:w-1/2">
      <div className="bg-white p-4">
        <Todos user={user} todos={todos} setTodos={setTodos} />
      </div>
    </div>
      </div>
    </div>
  );
}

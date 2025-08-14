import { User } from "firebase/auth";
import { IoHome } from "react-icons/io5";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { FaLaughWink } from "react-icons/fa";
import { IoBriefcaseSharp } from "react-icons/io5";
import { IconType } from "react-icons";
import { FaClipboardList } from "react-icons/fa";

type Todo = {
  id: string;
  title: string;
  type: string;
  completed: boolean;
  dueDate: string | null;
};

type Props = {
  user: User;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const getIcon = (type: string): IconType => {
  switch (type) {
    case 'HOME':
      return IoHome;
    case 'WORK':
      return IoBriefcaseSharp;
    case 'FUN':
      return FaLaughWink;
    case 'HEALTH':
      return FaHeartCircleCheck;
    default:
      return IoHome;
  }
}

const Todos = ({ user, todos, setTodos }: Props) => {

  const handleComplete = async (todo: Todo) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (response.ok) {
        setTodos(prev =>
          prev.map(t => (t.id === todo.id ? { ...t, completed: !t.completed } : t)))
      }
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return;
  
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setTodos(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const incompleteTodos = todos.filter(todo => !todo.completed).length;

  if (todos.length === 0)
    return <p className="px-4 py-2 mt-2">No todos found.</p>;

  return (
    <div>
  {todos.length === 0 ? (
    <p className="text-gray-500">No todos found.</p>
  ) : (
    <div>
      <h1 className="text-center mb-4 mt-4 flex justify-center items-center space-x-2">
      <span>My Todos</span>
      <span className="flex items-center font-bold">
      <FaClipboardList className="mr-1" />
      ({incompleteTodos})
      </span>
      </h1>
      {todos.map((todo) => {
        const Icon = getIcon(todo.type);
        return (
          <div
          key={todo.id}
          className={`p-4 mt-2 border rounded-md ${
            todo.completed ? 'bg-gray-100' : 'bg-red-100'
          }`}
        >
          <p className="font-medium text-gray-800 break-words">
           <Icon className="mb-2 text-2xl" />
           <span className="text-red-500">Task:</span> {todo.title}
          </p>
          <p className="text-sm text-gray-500">
            Status: {todo.completed ? 'Completed' : 'Not completed'}
          </p>
            {todo.dueDate && (
                <p className="text-sm text-gray-500">
                Due Date: {new Date(todo.dueDate).toLocaleString()}
                </p>
            )}
          <div className="mt-2 d-flex">
          <button
            onClick={() => handleComplete(todo)}
            className={`btn ${
            todo.completed ? 'btn-secondary' : 'btn-success'
          } me-1`}
          >
          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        </div>
        )
        })}
    </div>
  )}
</div>

  );
};

export default Todos;

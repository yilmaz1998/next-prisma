import { User } from "firebase/auth";

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

  if (todos.length === 0)
    return <p className="px-4 py-2 mt-2">No todos found.</p>;

  return (
    <div>
  {todos.length === 0 ? (
    <p className="text-gray-500">No todos found.</p>
  ) : (
    <div>
        <h1 className='text-center mb-4'>My Todos</h1>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`p-4 mt-2 border rounded-md ${
            todo.completed ? 'bg-gray-100' : 'bg-red-50'
          }`}
        >
          <p className="font-medium text-gray-800">
            Task: <span className="text-blue-600">{todo.title}</span>
          </p>
          <p className="text-sm text-gray-500">
            Status: {todo.completed ? 'Completed' : 'Not completed'}
          </p>
            {todo.dueDate && (
                <p className="text-sm text-gray-500">
                Due Date: {new Date(todo.dueDate).toLocaleString()}
                </p>
            )}
          <div className="mt-2 space-x-2">
          <button
            onClick={() => handleComplete(todo)}
            className={`btn ${
            todo.completed ? 'btn-secondary' : 'btn-success'
          }`}
          >
          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
            <button
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Todos;

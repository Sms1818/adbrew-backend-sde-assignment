import './App.css';
import { useEffect, useState } from 'react';


export function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/todos/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch todo items!");
        }
        return response.json();
      })
      .then((data) => setTodos(data))
      .catch(() => {
        setError("Unable to fetch todo items!")
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Description is required!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create todo.");
      }

      setDescription("");

      const todoResponse = await fetch("http://localhost:8000/todos/");

      if (!todoResponse.ok) {
        throw new Error("Unable to fetch todo items.");
      }

      const data = await todoResponse.json();
      setTodos(data);
    }
    catch (error) {
      setError(error.message);
    }
    finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="App">
      <main className="todo-container">
        <header className="todo-header">
          <h1>PERSONAL TODO LIST</h1>
        </header>

        <section className="todo-section">
          <div className="section-heading">
            <h2>TASKS</h2>
            <span>{todos.length}</span>
          </div>

          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <p>Loading todos...</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo, index) => (
                <li className="todo-item" key={todo.id}>
                  <span className="todo-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="todo-description">
                    {todo.description}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="create-section">
          <p className="eyebrow">NEW TASK</p>

          <form onSubmit={handleSubmit} className="todo-form">
            <input
              id="todo"
              className="todo-input"
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="What needs to get done?"
            />

            <button
              className="todo-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;

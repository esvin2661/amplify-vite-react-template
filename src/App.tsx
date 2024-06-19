
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    // Delete the todo from the Amplify DataStore
    client.models.Todo.delete({ id })
      .then(() => {
        // Update the local state to reflect the deletion
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
        // Handle any potential errors during deletion
      });
  }

  return (
        
    <Authenticator>
      {({ signOut }) => (
    <main>
      <h1 style={{ textAlign: "center" }}>My Todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
         App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://github.com/esvin2661/amplify-vite-react-template">
          View code on this GitHub Repo.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
        
      )}
      </Authenticator>
  );
}

export default App;
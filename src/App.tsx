import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';
import { useState } from 'react';

export const App = () => {
  const todosProccessed = todosFromServer.map(todo => {
    return {
      ...todo,
      user: usersFromServer.find(user => user.id === todo.userId)!,
    };
  });

  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(todosProccessed);
  const [inputTouched, setInputTouched] = useState(false);
  const [selectTouched, setSelectTouched] = useState(false);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title) {
      setInputTouched(true);

      if (userId === 0) {
        setSelectTouched(true);
      }

      return;
    }

    if (userId === 0) {
      setSelectTouched(true);

      return;
    }

    const newTodo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title: title.trim(),
      userId,
      completed: false,
      user: usersFromServer.find(user => user.id === userId)!,
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);

    setCount(prevCount => prevCount + 1);
    setTitle('');
    setUserId(0);
  }

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/todos"
        method="POST"
        key={count}
        onSubmit={handleSubmit}
      >
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setInputTouched(false);
            }}
            placeholder='Enter title (e.g. "Do the laundry")'
          />
          {inputTouched && !title && (
            <span className="error">Title is required</span>
          )}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={e => {
              setUserId(+e.target.value);
              setSelectTouched(false);
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {selectTouched && userId === 0 && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};

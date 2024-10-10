import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null); // 選択されたタスクのインデックス
  const [memoInput, setMemoInput] = useState(""); // メモ編集用の状態

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const updatedTodos = [...todos, { text: newTodo, memo: "", isCompleted: false }];
      setTodos(updatedTodos);
      setNewTodo("");
    }
  };

  const toggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    setSelectedTodoIndex(null); // タスク削除時は選択を解除
    setMemoInput(""); // メモもクリア
  };

  const deleteAllCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.isCompleted);
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incompleteTodos = filteredTodos.filter(todo => !todo.isCompleted);
  const completedTodos = filteredTodos.filter(todo => todo.isCompleted);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleTodoClick = (index) => {
    setSelectedTodoIndex(index);
    setMemoInput(filteredTodos[index].memo); // メモを入力フィールドに表示
  };

  const handleMemoChange = (e) => {
    setMemoInput(e.target.value); // メモの変更を追跡
  };

  const saveMemo = () => {
    if (selectedTodoIndex !== null) {
      const updatedTodos = todos.map((todo, i) =>
        i === selectedTodoIndex ? { ...todo, memo: memoInput } : todo
      );
      setTodos(updatedTodos);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TODO List</h1>

        <div>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a new task"
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks"
          style={{ marginTop: "20px", padding: "10px", width: "80%", borderRadius: "30px", border: "1px solid #ccc" }}
        />

        <div className='task-box'>
          <div className='test'>
            <h2>未完了タスク</h2>
            <ul>
              {incompleteTodos.map((todo, index) => (
                <li key={index} className={todo.isCompleted ? "completed" : ""} onClick={() => handleTodoClick(index)}>
                  <p>{todo.text}</p>
                  <div style={{ display: 'flex' }}>
                    <button className="complete-btn" onClick={() => toggleComplete(index)}>
                      {todo.isCompleted ? "Undo" : "Complete"}
                    </button>
                    <button className="delete-btn" onClick={() => deleteTodo(index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='test'>
            <h2>完了済みタスク</h2>
            <ul>
              {completedTodos.map((todo, index) => (
                <li key={index} className={todo.isCompleted ? "completed" : ""} onClick={() => handleTodoClick(index)}>
                  <p>{todo.text}</p>
                  <div style={{ display: "flex" }}>
                    <button className="complete-btn" onClick={() => toggleComplete(index)}>
                      {todo.isCompleted ? "Undo" : "Complete"}
                    </button>
                    <button className="delete-btn" onClick={() => deleteTodo(index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
            {completedTodos.length > 0 && (
              <button onClick={deleteAllCompleted} style={{ marginTop: '10px' }}>
                完了済みタスクを全削除
              </button>
            )}
          </div>
        </div>

        {/* 選択されたタスクのメモを表示・編集 */}
        {selectedTodoIndex !== null && (
          <div style={{ marginTop: '20px' }}>
            <h3>タスクメモ:</h3>
            <textarea
              value={memoInput}
              onChange={handleMemoChange}
              placeholder="Edit your memo here..."
              style={{ width: '100%', height: '100px', borderRadius: '5px', padding: '10px' }}
            />
            <button onClick={saveMemo} style={{ marginTop: '10px' }}>
              メモを保存
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

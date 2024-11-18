// HTML特殊文字をエスケープする関数
const escapeHTML = (str) => {
  return str.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
    }
  });
};

// ローカルストレージからTODOリストを取得する関数
const getTodos = () => {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

// ローカルストレージにTODOリストを保存する関数
const saveTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

// TODOをリストに追加する関数
const addTodoToList = (todo) => {
  const todoList = document.getElementById(todo.completed ? 'completed-todo-list' : 'uncompleted-todo-list');

  const todoCard = document.createElement('div');
  todoCard.classList.add('todo-card');
  if (todo.completed) {
    todoCard.classList.add('todo-completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id));

  const todoText = document.createElement('span');
  todoText.classList.add('todo-text');
  todoText.contentEditable = true;  // 編集可能に設定
  todoText.innerText = todo.text;
  todoText.dataset.id = todo.id;

  // テキストが変更されたときにローカルストレージを更新
  todoText.addEventListener('blur', () => updateTodoText(todo.id, todoText.innerText));

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerText = '削除';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  todoCard.appendChild(checkbox);
  todoCard.appendChild(todoText);
  todoCard.appendChild(deleteBtn);
  todoList.appendChild(todoCard);
};

// TODOを削除する関数
const deleteTodo = (id) => {
  if (confirm('このTODOを削除してもよろしいですか？')) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.id !== id);
    saveTodos(todos);
    renderTodos();
  }
};

// TODOの完了/未完了を切り替える関数
const toggleTodoCompletion = (id) => {
  let todos = getTodos();
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    renderTodos();
  }
};

// TODOのテキストを更新する関数
const updateTodoText = (id, newText) => {
  let todos = getTodos();
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.text = newText.trim();
    saveTodos(todos);
  }
};

// TODOリストを全て再描画する関数
const renderTodos = () => {
  const uncompletedList = document.getElementById('uncompleted-todo-list');
  const completedList = document.getElementById('completed-todo-list');
  
  uncompletedList.innerHTML = '';
  completedList.innerHTML = '';

  const todos = getTodos();
  todos.forEach(todo => addTodoToList(todo));
};

// TODOを追加するフォームの送信イベント
document.getElementById('todo-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  
  if (text) {
    const todos = getTodos();
    const newTodo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
    };
    todos.push(newTodo);
    saveTodos(todos);
    input.value = '';
    renderTodos();
  }
});

// 初期化：ページ読み込み時にTODOリストを表示
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
});

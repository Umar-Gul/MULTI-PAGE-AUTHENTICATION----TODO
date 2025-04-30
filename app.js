// Register Page
if (location.pathname.includes('register.html')) {
  document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.email === email)) {
      alert('User already exists!');
      return;
    }

    users.push({ name, email, password, todos: [] });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful!');
    window.location.href = 'login.html';
  });
}

// Login Page
if (location.pathname.includes('login.html')) {
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Invalid credentials!');
      return;
    }

    localStorage.setItem('currentUserEmail', email);
    window.location.href = 'home.html';
  });
}

// Todo Page
if (location.pathname.includes('home.html')) {
  const email = localStorage.getItem('currentUserEmail');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(u => u.email === email);

  if (!currentUser) {
    alert('Please login first!');
    window.location.href = 'login.html';
  }

  document.getElementById('welcomeMsg').innerText = `Welcome, ${currentUser.name}`;
  const todoForm = document.getElementById('todoForm');
  const todoList = document.getElementById('todoList');
  const todoInput = document.getElementById('todoInput');

  function renderTodos() {
    todoList.innerHTML = '';
    currentUser.todos.forEach((todo, i) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = todo;
      const btn = document.createElement('button');
      btn.textContent = 'Delete';
      btn.className = 'btn btn-sm btn-danger';
      btn.onclick = () => {
        currentUser.todos.splice(i, 1);
        saveTodos();
        renderTodos();
      };
      li.appendChild(btn);
      todoList.appendChild(li);
    });
  }

  function saveTodos() {
    const updatedUsers = users.map(u => u.email === currentUser.email ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }

  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
      currentUser.todos.push(task);
      saveTodos();
      renderTodos();
      todoInput.value = '';
    }
  });

  window.clearTodos = () => {
    currentUser.todos = [];
    saveTodos();
    renderTodos();
  };

  window.logout = () => {
    localStorage.removeItem('currentUserEmail');
    window.location.href = 'login.html';
  };

  renderTodos();
}

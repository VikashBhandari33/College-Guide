// College Guide - Main JavaScript File

// Initialize AOS and Feather icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    AOS.init();
    
    // Initialize Feather icons
    feather.replace();
    
    // Initialize all functionality
    initializeAuthModals();
    initializeTimetable();
    initializeTodoList();
});

// Authentication Modal Functions
function initializeAuthModals() {
    // Helper functions
    function modal(id) { 
        return document.getElementById(id); 
    }
    
    function show(el) { 
        el.classList.remove('hidden'); 
    }
    
    function hide(el) { 
        el.classList.add('hidden'); 
    }
    
    // Get modal trigger buttons
    var loginBtn = document.getElementById('openLogin');
    var signupBtn = document.getElementById('openSignup');
    
    // Build modal markup once
    if (!document.getElementById('auth-modals')) {
        var div = document.createElement('div');
        div.id = 'auth-modals';
        div.innerHTML = `
        <div id="modal-backdrop" class="hidden fixed inset-0 bg-black/50 z-40"></div>
        <div id="loginModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Log In</h3>
                    <button data-close="loginModal" class="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <form id="loginForm" class="p-6 space-y-4">
                    <input class="w-full border rounded p-3 form-input" name="email" type="email" placeholder="Email" required>
                    <input class="w-full border rounded p-3 form-input" name="password" type="password" placeholder="Password" required>
                    <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Log In</button>
                    <p id="loginError" class="text-sm text-red-600"></p>
                </form>
            </div>
        </div>
        <div id="signupModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Sign Up</h3>
                    <button data-close="signupModal" class="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <form id="signupForm" class="p-6 space-y-4">
                    <input class="w-full border rounded p-3 form-input" name="name" type="text" placeholder="Full Name" required>
                    <input class="w-full border rounded p-3 form-input" name="email" type="email" placeholder="Email" required>
                    <input class="w-full border rounded p-3 form-input" name="password" type="password" placeholder="Password" required>
                    <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Create Account</button>
                    <p id="signupError" class="text-sm text-red-600"></p>
                </form>
            </div>
        </div>`;
        document.body.appendChild(div);
    }
    
    var backdrop = document.getElementById('modal-backdrop');
    
    // Event listeners for modal triggers
    loginBtn && loginBtn.addEventListener('click', function() { 
        show(backdrop); 
        show(modal('loginModal')); 
    });
    
    signupBtn && signupBtn.addEventListener('click', function() { 
        show(backdrop); 
        show(modal('signupModal')); 
    });
    
    // Event listeners for modal close buttons
    document.querySelectorAll('[data-close]')?.forEach(function(btn) {
        btn.addEventListener('click', function() { 
            hide(backdrop); 
            hide(modal(btn.getAttribute('data-close'))); 
        });
    });
    
    // API helper function
    async function api(path, method, body) {
        var res = await fetch('https://college-guide-backend.onrender.com' + path, { 
            method, 
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : '' 
            }, 
            body: body ? JSON.stringify(body) : undefined 
        });
        var data = await res.json().catch(function() { return {}; });
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    }
    
    // Login form handler
    var loginForm = document.getElementById('loginForm');
    loginForm && loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        document.getElementById('loginError').textContent = '';
        var form = new FormData(loginForm);
        try {
            var out = await api('/api/auth/login', 'POST', { 
                email: form.get('email'), 
                password: form.get('password') 
            });
            localStorage.setItem('token', out.token);
            hide(backdrop); 
            hide(modal('loginModal'));
            alert('Logged in as ' + out.user.name);
        } catch(err) { 
            document.getElementById('loginError').textContent = err.message; 
        }
    });
    
    // Signup form handler
    var signupForm = document.getElementById('signupForm');
    signupForm && signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        document.getElementById('signupError').textContent = '';
        var form = new FormData(signupForm);
        try {
            var out = await api('/api/auth/register', 'POST', { 
                name: form.get('name'), 
                email: form.get('email'), 
                password: form.get('password') 
            });
            localStorage.setItem('token', out.token);
            hide(backdrop); 
            hide(modal('signupModal'));
            alert('Welcome ' + out.user.name + '!');
        } catch(err) { 
            document.getElementById('signupError').textContent = err.message; 
        }
    });
}

// Timetable Functions
function initializeTimetable() {
    var tabs = document.querySelectorAll('.dept-tab');
    var panels = document.querySelectorAll('.dept-panel');
    
    // Time slots used in the timetable
    var timeSlots = ['09:00-09:55', '10:00-10:55', '11:00-11:55', '12:00-12:55', '01:00-02:00', '02:00-02:55', '03:00-03:55', '04:00-04:55', '05:00-05:55'];
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Color palette for different subjects
    var slotColors = {
        'L': '#ffe08a', 'F': '#ffd1dc', 'E': '#ffab40', 'H': '#ffee58', 'G': '#3b82f6',
        'I': '#ec4899', 'B': '#8b5cf6', 'U': '#9ca3af', 'Z': '#10b981', 'P': '#7c3aed', 
        'V': '#34d399', 'D': '#93c5fd', 'X': '#fbbf24'
    };
    
    // Department data - maps slot letters to subjects
    var departments = {
        ece: {
            legend: {
                'L': 'Linear Algebra & Matrix Analysis',
                'F': 'Calculus',
                'E': 'Problem Solving with C Programming',
                'H': 'Digital Electronics using Verilog',
                'G': 'Internet of Things',
                'I': 'ILC (Advance1)',
                'X': 'IT Workshop: Full Stack Prototyping with AI Support',
                'U': 'Environmental Studies',
                'Z': 'Entrepreneurship & Design Thinking',
                'B': 'ILC (Basic)',
                'P': 'ILC (Advance2)'
            },
            grid: {
                'Monday': ['', 'X', 'H', 'H', '', 'P', 'P', 'E', 'E'],
                'Tuesday': ['X', 'X', 'L', 'P', '', 'H', 'F', 'I', 'I'],
                'Wednesday': ['H', 'G', '', 'E', '', '', 'Z', 'F', 'F'],
                'Thursday': ['G', 'G', 'I', 'B', '', 'Z', 'Z', 'E', ''],
                'Friday': ['', 'U', 'U', '', '', 'B', 'B', 'L', 'L']
            }
        },
        cse: {
            legend: {
                'E': 'Linear Algebra & Matrix Analysis',
                'H': 'Calculus',
                'L': 'Problem Solving with C Programming',
                'F': 'Digital Electronics using Verilog',
                'G': 'Internet of Things',
                'I': 'ILC (Advance1)',
                'V': 'IT Workshop with AI Support',
                'D': 'Environmental Studies',
                'X': 'Entrepreneurship & Design Thinking',
                'B': 'ILC (Basic)',
                'P': 'ILC (Advance2)'
            },
            grid: {
                'Monday': ['', 'H', 'H', 'F', '', 'P', 'P', 'E', 'E'],
                'Tuesday': ['X', 'X', 'V', 'P', '', 'H', '', 'I', 'I'],
                'Wednesday': ['', 'G', 'X', 'E', '', 'V', 'V', 'F', 'F'],
                'Thursday': ['', '', 'I', 'B', '', '', 'L', 'D', 'D'],
                'Friday': ['G', 'G', 'L', 'F', '', 'B', 'B', 'L', 'L']
            }
        },
        dsai: {
            legend: {
                'E': 'Linear Algebra & Matrix Analysis',
                'D': 'Calculus',
                'L': 'Problem Solving with C Programming',
                'G': 'Digital Electronics using Verilog',
                'F': 'Internet of Things',
                'I': 'ILC (Advance1)',
                'Z': 'IT Workshop with AI Support',
                'V': 'Environmental Studies',
                'U': 'Entrepreneurship & Design Thinking',
                'B': 'ILC (Basic)',
                'P': 'ILC (Advance2)'
            },
            grid: {
                'Monday': ['G', 'U', '', '', '', 'P', 'P', 'E', 'E'],
                'Tuesday': ['', 'D', 'L', 'P', '', '', 'F', 'I', 'I'],
                'Wednesday': ['', 'G', 'Z', 'E', '', 'V', 'V', 'F', 'F'],
                'Thursday': ['G', 'G', 'I', 'B', '', 'Z', 'Z', 'D', 'D'],
                'Friday': ['U', 'U', 'L', '', '', 'B', 'B', 'L', 'L']
            }
        }
    };
    
    // Build timetable table for a department
    function buildTable(deptKey, mountEl, legendEl) {
        var data = departments[deptKey];
        if (!data) return;
        
        var table = document.createElement('table');
        table.className = 'w-full text-sm';
        
        // Create table header
        var thead = document.createElement('thead');
        thead.className = 'bg-indigo-100';
        var headRow = document.createElement('tr');
        var thTime = document.createElement('th'); 
        thTime.className = 'p-3 text-left'; 
        thTime.textContent = 'Day/Time'; 
        headRow.appendChild(thTime);
        
        timeSlots.forEach(function (t) { 
            var th = document.createElement('th'); 
            th.className = 'p-3 text-left whitespace-nowrap'; 
            th.textContent = t; 
            headRow.appendChild(th); 
        });
        thead.appendChild(headRow);
        table.appendChild(thead);
        
        // Create table body
        var tbody = document.createElement('tbody');
        days.forEach(function(day) {
            var row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            var tdDay = document.createElement('td'); 
            tdDay.className = 'p-3 font-semibold'; 
            tdDay.textContent = day; 
            row.appendChild(tdDay);
            
            var slots = data.grid[day] || [];
            for (var i = 0; i < timeSlots.length; i++) {
                var code = slots[i] || '';
                var td = document.createElement('td');
                td.className = 'p-2 text-center';
                
                if (code && code !== 'X') {
                    td.textContent = code;
                    td.style.backgroundColor = slotColors[code] || '#e5e7eb';
                    td.className += ' rounded text-gray-900 font-medium';
                } else if (code === 'X') {
                    td.textContent = 'X';
                    td.style.backgroundColor = slotColors['X'] || '#fde68a';
                    td.className += ' rounded text-gray-900 font-medium';
                } else {
                    td.textContent = '';
                }
                row.appendChild(td);
            }
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        // Render table
        mountEl.innerHTML = '';
        var wrapper = document.createElement('div');
        wrapper.className = 'bg-white rounded-lg overflow-x-auto border table-responsive';
        wrapper.appendChild(table);
        mountEl.appendChild(wrapper);
        
        // Build legend
        if (legendEl) {
            legendEl.innerHTML = '';
            var legendTitle = document.createElement('h3'); 
            legendTitle.className = 'text-sm font-semibold text-gray-700 mb-2'; 
            legendTitle.textContent = 'Slot Legend';
            legendEl.appendChild(legendTitle);
            
            var list = document.createElement('div'); 
            list.className = 'grid sm:grid-cols-2 md:grid-cols-3 gap-2';
            
            Object.keys(data.legend).forEach(function(code) {
                var item = document.createElement('div'); 
                item.className = 'flex items-center gap-2';
                var swatch = document.createElement('span'); 
                swatch.className = 'inline-block w-4 h-4 rounded'; 
                swatch.style.backgroundColor = slotColors[code] || '#e5e7eb';
                var label = document.createElement('span'); 
                label.className = 'text-xs text-gray-700'; 
                label.textContent = code + ' - ' + data.legend[code];
                item.appendChild(swatch); 
                item.appendChild(label); 
                list.appendChild(item);
            });
            legendEl.appendChild(list);
        }
    }
    
    // Activate a specific department tab
    function activate(targetId) {
        // Hide all panels
        panels.forEach(function (p) { 
            p.classList.add('hidden'); 
        });
        
        // Reset all tabs
        tabs.forEach(function (t) {
            t.classList.remove('bg-indigo-600', 'text-white', 'shadow', 'hover:bg-indigo-700');
            t.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
        });
        
        // Show target panel
        var target = document.querySelector(targetId);
        if (target) { 
            target.classList.remove('hidden'); 
        }
        
        // Activate target tab
        var activeTab = Array.prototype.find.call(tabs, function (t) { 
            return t.getAttribute('data-target') === targetId; 
        });
        if (activeTab) {
            activeTab.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            activeTab.classList.add('bg-indigo-600', 'text-white', 'shadow', 'hover:bg-indigo-700');
        }
        
        // Build table for current panel
        var mount = target.querySelector('.timetable-mount');
        var legend = target.querySelector('.legend-mount');
        if (mount) {
            var key = targetId.includes('ece') ? 'ece' : targetId.includes('cse') ? 'cse' : 'dsai';
            buildTable(key, mount, legend);
        }
    }
    
    // Add event listeners to tabs
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () { 
            activate(tab.getAttribute('data-target')); 
        });
    });
    
    // Activate first tab on load
    var initial = document.querySelector('.dept-tab')?.getAttribute('data-target');
    if (initial) { 
        activate(initial); 
    }
}

// Todo List Functions
function initializeTodoList() {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    
    // API helper function for todos
    async function todoApi(path, method, body) {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please log in to manage todos', 'warning');
            return null;
        }
        
        try {
            const res = await fetch('https://college-guide-frontend.onrender.com/api/todos' + path, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: body ? JSON.stringify(body) : undefined
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Request failed');
            return data;
        } catch (error) {
            console.error('Todo API error:', error);
            showNotification(error.message, 'error');
            return null;
        }
    }
    
    // Load todos from backend
    async function loadTodos() {
        const todos = await todoApi('', 'GET');
        if (todos) {
            renderTodos(todos);
        }
    }
    
    // Render todos
    function renderTodos(todos) {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = '<li class="text-center text-gray-500 py-4">No todos yet. Add one above!</li>';
            return;
        }
        
        todos.forEach((todo) => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition';
            li.innerHTML = `
                <div class="flex items-center">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} class="mr-3 todo-checkbox" data-id="${todo._id}">
                    <span class="${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}">${todo.title}</span>
                    ${todo.description ? `<span class="ml-2 text-sm text-gray-500">- ${todo.description}</span>` : ''}
                </div>
                <button class="text-red-500 hover:text-red-700 delete-todo" data-id="${todo._id}">
                    <i data-feather="trash-2" class="h-4 w-4"></i>
                </button>
            `;
            todoList.appendChild(li);
        });
        
        // Re-initialize feather icons for new elements
        feather.replace();
        
        // Add event listeners
        addEventListeners();
    }
    
    // Add event listeners for todo interactions
    function addEventListeners() {
        // Checkbox listeners
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async function() {
                const todoId = this.dataset.id;
                const completed = this.checked;
                
                const result = await todoApi(`/${todoId}`, 'PATCH', { completed });
                if (result) {
                    showNotification('Todo updated successfully', 'success');
                    loadTodos(); // Reload todos to reflect changes
                }
            });
        });
        
        // Delete button listeners
        document.querySelectorAll('.delete-todo').forEach(button => {
            button.addEventListener('click', async function() {
                const todoId = this.dataset.id;
                
                if (confirm('Are you sure you want to delete this todo?')) {
                    const result = await todoApi(`/${todoId}`, 'DELETE');
                    if (result) {
                        showNotification('Todo deleted successfully', 'success');
                        loadTodos(); // Reload todos to reflect changes
                    }
                }
            });
        });
    }
    
    // Add new todo
    async function addTodo() {
        const title = todoInput.value.trim();
        if (!title) {
            showNotification('Please enter a todo title', 'warning');
            return;
        }
        
        const result = await todoApi('', 'POST', { 
            title: title,
            description: '',
            priority: 'medium'
        });
        
        if (result) {
            todoInput.value = '';
            showNotification('Todo added successfully', 'success');
            loadTodos(); // Reload todos to show the new one
        }
    }
    
    // Event listeners
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Initial load
    loadTodos();
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Export functions for potential external use
window.CollegeGuide = {
    showNotification,
    toggleMobileMenu
};

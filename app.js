// Advanced Portfolio App - Main JS

// Simple router for hash navigation
window.addEventListener('DOMContentLoaded', renderPage);
window.addEventListener('hashchange', renderPage);

function renderPage() {
  const hash = window.location.hash || '#todo';
  switch (hash) {
    case '#todo':
      renderTodo();
      break;
    case '#weather':
      renderWeather();
      break;
    case '#converter':
      renderConverter();
      break;
    case '#portfolio':
      renderPortfolio();
      break;
    case '#calculator':
      renderCalculator();
      break;
    default:
      renderTodo();
  }
}

// --- To-Do List ---
function renderTodo() {
  document.getElementById('app').innerHTML = `
    <section class="app-section">
      <figure class="app-figure">
  <img src="https://cdn-icons-png.flaticon.com/512/3176/3176363.png" alt="To-Do List" />
      </figure>
      <div class="app-content">
        <div class="app-title">To-Do List</div>
        <div class="app-desc">Organize your tasks, mark as done, and never forget anything. Your tasks are saved in your browser.</div>
        <form id="todo-form">
          <input type="text" id="todo-input" placeholder="Add a new task..." required />
          <button type="submit">Add</button>
        </form>
        <ul id="todo-list"></ul>
      </div>
    </section>
  `;
  loadTodos();
  document.getElementById('todo-form').onsubmit = addTodo;
}

function loadTodos() {
  const list = document.getElementById('todo-list');
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  list.innerHTML = '';
  todos.forEach((todo, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox" ${todo.done ? 'checked' : ''} data-idx="${i}" /> <span class="${todo.done ? 'done' : ''}">${todo.text}</span> <button data-idx="${i}" class="delete">🗑️</button>`;
    list.appendChild(li);
  });
  list.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.onchange = toggleTodo);
  list.querySelectorAll('.delete').forEach(btn => btn.onclick = deleteTodo);
}

function addTodo(e) {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push({ text: input.value, done: false });
  localStorage.setItem('todos', JSON.stringify(todos));
  input.value = '';
  loadTodos();
}

function toggleTodo(e) {
  const idx = e.target.dataset.idx;
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos[idx].done = !todos[idx].done;
  localStorage.setItem('todos', JSON.stringify(todos));
  loadTodos();
}

function deleteTodo(e) {
  const idx = e.target.dataset.idx;
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.splice(idx, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
  loadTodos();
}

// --- Weather App ---
function renderWeather() {
  document.getElementById('app').innerHTML = `
    <section class="app-section">
      <figure class="app-figure">
  <img src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png" alt="Weather App" />
      </figure>
      <div class="app-content">
        <div class="app-title">Weather App</div>
        <div class="app-desc">Get live weather updates for any city worldwide. Powered by Open-Meteo API.</div>
        <form id="weather-form">
          <input type="text" id="city-input" placeholder="Enter city name..." required />
          <button type="submit">Get Weather</button>
        </form>
        <div id="weather-result"></div>
      </div>
    </section>
  `;
  document.getElementById('weather-form').onsubmit = fetchWeather;
}

async function fetchWeather(e) {
  e.preventDefault();
  const city = document.getElementById('city-input').value.trim();
  const result = document.getElementById('weather-result');
  result.textContent = 'Loading...';
  try {
    // Using Open-Meteo free API (no key required)
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`).then(r => r.json());
    if (!geo.results || !geo.results.length) throw new Error('City not found');
    const { latitude, longitude, name, country } = geo.results[0];
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`).then(r => r.json());
    const w = weather.current_weather;
    result.innerHTML = `<b>${name}, ${country}</b><br>🌡️ ${w.temperature}°C<br>💨 ${w.windspeed} km/h<br>⛅ ${w.weathercode}`;
  } catch (err) {
    result.textContent = 'Error: ' + err.message;
  }
}

// --- Unit Converter ---
function renderConverter() {
  document.getElementById('app').innerHTML = `
    <section class="app-section">
      <figure class="app-figure">
  <img src="https://cdn-icons-png.flaticon.com/512/2721/2721297.png" alt="Unit Converter" />
      </figure>
      <div class="app-content">
        <div class="app-title">Unit Converter</div>
        <div class="app-desc">Convert between length, weight, and currency. Fast, accurate, and up-to-date rates.</div>
        <form id="convert-form">
          <input type="number" id="convert-value" placeholder="Value" required />
          <select id="convert-type">
            <option value="length">Length (m/ft)</option>
            <option value="weight">Weight (kg/lb)</option>
            <option value="currency">Currency (USD/EUR)</option>
          </select>
          <button type="submit">Convert</button>
        </form>
        <div id="convert-result"></div>
      </div>
    </section>
  `;
  document.getElementById('convert-form').onsubmit = convertUnit;
}

async function convertUnit(e) {
  e.preventDefault();
  const value = parseFloat(document.getElementById('convert-value').value);
  const type = document.getElementById('convert-type').value;
  const result = document.getElementById('convert-result');
  if (type === 'length') {
    result.textContent = `${value} meters = ${(value * 3.28084).toFixed(2)} feet`;
  } else if (type === 'weight') {
    result.textContent = `${value} kg = ${(value * 2.20462).toFixed(2)} lbs`;
  } else if (type === 'currency') {
    result.textContent = 'Loading...';
    try {
      // Using exchangerate.host free API
      const data = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR').then(r => r.json());
      const rate = data.rates.EUR;
      result.textContent = `${value} USD = ${(value * rate).toFixed(2)} EUR`;
    } catch {
      result.textContent = 'Currency conversion failed.';
    }
  }
}

// --- Portfolio ---
function renderPortfolio() {
  document.getElementById('app').innerHTML = `
    <section class="app-section">
      <figure class="app-figure">
  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Portfolio" />
      </figure>
      <div class="app-content">
        <div class="app-title">Personal Portfolio</div>
        <div class="app-desc">Showcase your skills, projects, and resume. Make a great first impression!</div>
        <div class="portfolio">
          <img src="https://i.pravatar.cc/120?img=3" alt="Profile" class="profile-pic" />
          <h3 style="color:#4fc3f7;">Your Name</h3>
          <p>Web Developer | JavaScript | PHP | HTML | CSS</p>
          <h4>Projects</h4>
          <ul>
            <li>To-Do List App (see above)</li>
            <li>Weather App (see above)</li>
            <li>Unit Converter (see above)</li>
            <li>Calculator (see below)</li>
          </ul>
          <h4>Resume</h4>
          <a href="#" download style="color:#fff;background:#4fc3f7;padding:0.5rem 1.2rem;border-radius:8px;text-decoration:none;font-weight:600;">Download Resume (PDF)</a>
        </div>
      </div>
    </section>
  `;
}

// --- Calculator ---
function renderCalculator() {
  document.getElementById('app').innerHTML = `
    <section class="app-section">
      <figure class="app-figure">
  <img src="https://cdn-icons-png.flaticon.com/512/992/992651.png" alt="Calculator" />
      </figure>
      <div class="app-content">
        <div class="app-title">Calculator</div>
        <div class="app-desc">A clean, interactive calculator for all your basic math needs.</div>
        <div class="calculator">
          <input type="text" id="calc-display" readonly />
          <div class="calc-buttons">
            <button>7</button><button>8</button><button>9</button><button>/</button>
            <button>4</button><button>5</button><button>6</button><button>*</button>
            <button>1</button><button>2</button><button>3</button><button>-</button>
            <button>0</button><button>.</button><button>=</button><button>+</button>
            <button id="calc-clear" style="grid-column: span 4;">C</button>
          </div>
        </div>
      </div>
    </section>
  `;
  setupCalculator();
}

function setupCalculator() {
  const display = document.getElementById('calc-display');
  let current = '';
  document.querySelectorAll('.calc-buttons button').forEach(btn => {
    btn.onclick = () => {
      const val = btn.textContent;
      if (val === 'C') {
        current = '';
        display.value = '';
      } else if (val === '=') {
        try {
          current = eval(current).toString();
          display.value = current;
        } catch {
          display.value = 'Error';
        }
      } else {
        current += val;
        display.value = current;
      }
    };
  });
}

// --- Extra Styles for Calculator & Portfolio ---
document.head.insertAdjacentHTML('beforeend', `<style>
.calculator { max-width: 320px; margin: 2rem auto; }
#calc-display { width: 100%; font-size: 1.5rem; margin-bottom: 0.5rem; padding: 0.5rem; text-align: right; border-radius: 6px; border: 1px solid #b3e5fc; background: #f4f6f8; }
.calc-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.calc-buttons button { font-size: 1.2rem; padding: 1rem; border: none; background: #e0e0e0; border-radius: 6px; cursor: pointer; transition: background 0.2s, color 0.2s; }
.calc-buttons button:hover { background: #4fc3f7; color: #fff; }
.portfolio { text-align: center; }
.profile-pic { border-radius: 50%; width: 120px; height: 120px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(79,195,247,0.13); }
</style>`);

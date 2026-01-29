const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const filters = document.querySelector(".filters");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function renderTasks() {
  list.innerHTML = "";

  const visible = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    });

  visible.forEach(({ task, index }) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button data-action="toggle" data-index="${index}">✓</button>
        <button data-action="delete" data-index="${index}">✕</button>
      </div>
    `;

    list.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  tasks.push({ text: value, completed: false });
  input.value = "";
  renderTasks();
});

list.addEventListener("click", e => {
  const { action, index } = e.target.dataset;

  if (action === "toggle") tasks[index].completed = !tasks[index].completed;
  if (action === "delete") tasks.splice(index, 1);

  renderTasks();
});

filters.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    currentFilter = e.target.dataset.filter;
    renderTasks();
  }
});

renderTasks();

// Initialize elements and event listeners
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const themeToggleButton = document.getElementById("theme-toggle");
const filterAllButton = document.getElementById("filter-all");
const filterCompletedButton = document.getElementById("filter-completed");
const filterPendingButton = document.getElementById("filter-pending");
const progressBar = document.getElementById("progress-bar");

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage

// Function to render the task list with animations
function renderTasks(filter = "all") {
  // Clear the task list first
  taskList.innerHTML = "";

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // Show all tasks
  });

  // Render each task with animation
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleTaskCompleted(${index})">&#10004;</button>
        <button class="delete-btn" onclick="deleteTask(${index})">&#10006;</button>
      </div>
    `;

    // Add animation class after rendering
    setTimeout(() => {
      taskItem.classList.add("task-appear");
    }, 50);

    taskList.appendChild(taskItem);
  });

  updateProgressBar(filteredTasks.length);
}

// Function to add a new task with animation
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = {
      text: taskText,
      completed: false
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks to localStorage
    taskInput.value = ""; // Clear the input field

    renderTasks(); // Re-render tasks after adding
  }
}

// Event listener for the "Add Task" button
addTaskButton.addEventListener("click", addTask);

// Event listener to add task when pressing Enter
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Function to mark a task as completed with animation
function toggleTaskCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update tasks in localStorage
  renderTasks(); // Re-render tasks
}

// Function to delete a task with animation
function deleteTask(index) {
  const taskItem = taskList.children[index];
  taskItem.classList.add("task-delete"); // Add animation for delete

  setTimeout(() => {
    tasks.splice(index, 1); // Remove task from array
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Update tasks in localStorage
    renderTasks(); // Re-render tasks
  }, 300); // Wait for animation to finish before removing
}

// Function to update the progress bar
function updateProgressBar(taskCount) {
  const completedCount = tasks.filter(task => task.completed).length;
  const progress = (completedCount / taskCount) * 100;
  progressBar.style.width = `${progress}%`;
}

// Function to toggle dark mode
themeToggleButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
});

// Filter tasks based on completion status
filterAllButton.addEventListener("click", () => {
  renderTasks("all");  // Call renderTasks with "all" filter
});

filterCompletedButton.addEventListener("click", () => {
  renderTasks("completed");  // Call renderTasks with "completed" filter
});

filterPendingButton.addEventListener("click", () => {
  renderTasks("pending");  // Call renderTasks with "pending" filter
});

// Initial rendering
renderTasks();

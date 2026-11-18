
let defaultTasks = [
  { id: 1, title: "Broken street light", category: "Electricity", location: "Mirpur 10, Dhaka", priority: "High", deadline: "2026-11-01", status: "Assigned", note: "" },
  { id: 2, title: "Pothole on main road", category: "Roads", location: "Dhanmondi 27", priority: "High", deadline: "2026-11-10", status: "Accepted", note: "" },
  { id: 3, title: "Water pipe leakage", category: "Water", location: "Uttara Sector 4", priority: "Medium", deadline: "2026-11-12", status: "In Progress", note: "Pipe part ordered" },
  { id: 4, title: "Overflowing drain", category: "Drainage", location: "Mohammadpur", priority: "Low", deadline: "2026-11-20", status: "Assigned", note: "" },
  { id: 5, title: "Garbage not collected", category: "Waste", location: "Banani Road 11", priority: "Medium", deadline: "2026-10-25", status: "Completed", note: "Cleaned and verified" }
];


function getTasks() {
  let saved = localStorage.getItem("tasks");
  if (saved) { return JSON.parse(saved); }
  return defaultTasks;
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function getTaskId() {
  let query = window.location.search;      
  return Number(query.split("=")[1]);
}

function findTask(id) {
  let tasks = getTasks();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) { return tasks[i]; }
  }
  return null;
}


function isOverdue(task) {
  let today = new Date();
  let deadline = new Date(task.deadline);
  let finished = (task.status == "Completed" || task.status == "Submitted");
  return deadline < today && !finished;
}


function makeRows(list) {
  let html = "";
  for (let i = 0; i < list.length; i++) {
    let t = list[i];
    let late = "";
    if (isOverdue(t)) { late = " <span class='red'>(Overdue)</span>"; }
    html += "<tr>";
    html += "<td>" + t.id + "</td>";
    html += "<td>" + t.title + "</td>";
    html += "<td>" + t.location + "</td>";
    html += "<td>" + t.priority + "</td>";
    html += "<td>" + t.deadline + late + "</td>";
    html += "<td>" + t.status + "</td>";
    html += "<td><a class='btn' href='task-details.html?id=" + t.id + "'>View</a></td>";
    html += "</tr>";
  }
  if (list.length == 0) { html = "<tr><td colspan='7'>No tasks found.</td></tr>"; }
  return html;
}


function loadDashboard() {
  let tasks = getTasks();
  let assigned = 0, progress = 0, done = 0, overdue = 0;
  let active = [];
  for (let i = 0; i < tasks.length; i++) {
    let s = tasks[i].status;
    if (s == "Assigned" || s == "Accepted") { assigned++; }
    if (s == "In Progress") { progress++; }
    if (s == "Completed" || s == "Submitted") { done++; }
    if (isOverdue(tasks[i])) { overdue++; }
    if (s != "Completed" && s != "Submitted") { active.push(tasks[i]); }
  }
  document.getElementById("countAssigned").innerHTML = assigned;
  document.getElementById("countProgress").innerHTML = progress;
  document.getElementById("countDone").innerHTML = done;
  document.getElementById("countOverdue").innerHTML = overdue;
  document.getElementById("recentRows").innerHTML = makeRows(active);
}


function loadAssignedTasks() {
  let filter = document.getElementById("statusFilter").value;
  let tasks = getTasks();
  let list = [];
  for (let i = 0; i < tasks.length; i++) {
    let s = tasks[i].status;
    if (s == "Completed" || s == "Submitted") { continue; }
    if (filter == "All" || filter == s) { list.push(tasks[i]); }
  }
  document.getElementById("taskRows").innerHTML = makeRows(list);
}

function loadTaskDetails() {
  let task = findTask(getTaskId());
  if (task == null) {
    document.getElementById("details").innerHTML = "Task not found.";
    return;
  }
  let html = "<p><b>Task ID:</b> " + task.id + "</p>";
  html += "<p><b>Title:</b> " + task.title + "</p>";
  html += "<p><b>Category:</b> " + task.category + "</p>";
  html += "<p><b>Location:</b> " + task.location + "</p>";
  html += "<p><b>Priority:</b> " + task.priority + "</p>";
  html += "<p><b>Deadline:</b> " + task.deadline + "</p>";
  html += "<p><b>Status:</b> " + task.status + "</p>";
  html += "<p><b>Note:</b> " + (task.note || "None") + "</p>";
  document.getElementById("details").innerHTML = html;
  document.getElementById("updateLink").href = "update-task.html?id=" + task.id;
}


function changeStatus(newStatus) {
  let id = getTaskId();
  let tasks = getTasks();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) { tasks[i].status = newStatus; }
  }
  saveTasks(tasks);
  alert("Task status changed to: " + newStatus);
  loadTaskDetails();
}


function showPreview(inputId, imgId) {
  let file = document.getElementById(inputId).files[0];
  if (file) { document.getElementById(imgId).src = URL.createObjectURL(file); }
}

function loadUpdatePage() {
  let task = findTask(getTaskId());
  if (task != null) {
    document.getElementById("taskTitle").innerHTML = task.title + " (" + task.location + ")";
  }
}

function saveUpdate() {
  let id = getTaskId();
  let progress = document.getElementById("progress").value;
  let note = document.getElementById("note").value;
  let delay = document.getElementById("delay").value;

  if (note == "") { alert("Please write a progress note."); return; }
  if (progress == "Delayed" && delay == "") { alert("Please write the reason for delay."); return; }

  let tasks = getTasks();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks[i].status = progress;
      tasks[i].note = note + (delay != "" ? " | Delay: " + delay : "");
    }
  }
  saveTasks(tasks);
  document.getElementById("message").innerHTML = "Update saved successfully!";
}

function submitCompletion() {
  let after = document.getElementById("afterPhoto").value;
  if (after == "") { alert("Please upload an after photo before submitting."); return; }
  let id = getTaskId();
  let tasks = getTasks();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) { tasks[i].status = "Submitted"; }
  }
  saveTasks(tasks);
  document.getElementById("message").innerHTML = "Work submitted to the officer for verification.";
}


function loadHistory() {
  let tasks = getTasks();
  let list = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status == "Completed" || tasks[i].status == "Submitted") { list.push(tasks[i]); }
  }
  document.getElementById("historyRows").innerHTML = makeRows(list);
}

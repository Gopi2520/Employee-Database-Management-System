// ===== BASE API URL =====
const API_BASE = "https://edbm-apllication.onrender.com";

// ===== ESCAPE FUNCTION =====
function esc(str) {
  return str
    ? String(str).replace(
        /[&<>"']/g,
        (s) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[s],
      )
    : "";
}

/////////////////////////////////////////////////////////
// ===== LOGIN =====
/////////////////////////////////////////////////////////

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    showLoginLoader();

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        window.location.href = data.redirect;
      } else {
        alert("Invalid credentials");
        hideLoginLoader();
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server not reachable");
      hideLoginLoader();
    }
  });
}
/////////////////////////////////////////////////////////
// ===== RENDER EMPLOYEE TABLE =====
/////////////////////////////////////////////////////////

function renderEmployeeList(container, employees, title, emptyMessage) {
  if (!employees || employees.length === 0) {
    container.innerHTML = `<p>${emptyMessage}</p>`;
    return;
  }

  let html = `
    <h2>${title}</h2>
    <table border="1">
    <thead>
    <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Contact</th>
    <th>Email</th>
    <th>Age</th>
    <th>Sex</th>
    <th>Degree</th>
    <th>Role</th>
    <th>Salary</th>
    <th>Created</th>
    <th>Photo</th>
    </tr>
    </thead>
    <tbody>
    `;

  employees.forEach((emp) => {
    let photo = "—";

    if (emp.img) {
      if (emp.img.startsWith("data:")) {
        photo = `<img src="${emp.img}" width="80">`;
      } else {
        photo = `<img src="data:image/png;base64,${emp.img}" width="80">`;
      }
    }

    const created = emp.createdAt
      ? new Date(emp.createdAt).toLocaleString()
      : "—";

    html += `
        <tr>
        <td>${esc(emp.id)}</td>
        <td>${esc(emp.fname)} ${esc(emp.lname)}</td>
        <td>${esc(emp.contact)}</td>
        <td>${esc(emp.mail)}</td>
        <td>${esc(emp.age)}</td>
        <td>${esc(emp.sex)}</td>
        <td>${esc(emp.degree)}</td>
        <td>${esc(emp.role)}</td>
        <td>${esc(emp.salary)}</td>
        <td>${esc(created)}</td>
        <td>${photo}</td>
        </tr>
        `;
  });

  html += "</tbody></table>";

  container.innerHTML = html;
}

/////////////////////////////////////////////////////////
// ===== VIEW ALL EMPLOYEES =====
/////////////////////////////////////////////////////////
const viewAllBtn = document.getElementById("viewAllBtn");

if (viewAllBtn) {
  viewAllBtn.addEventListener("click", async () => {
    const container = document.getElementById("employeeDetails");

    showLoader();

    try {
      const response = await fetch(`${API_BASE}/viewAllEmployees`);
      const employees = await response.json();

      renderEmployeeList(
        container,
        employees,
        "All Employees",
        "No employees found",
      );
    } catch (err) {
      container.innerHTML = `<p style="color:red">${err.message}</p>`;
    } finally {
      hideLoader();
    }
  });
}
/////////////////////////////////////////////////////////
// ===== SEARCH EMPLOYEE =====
/////////////////////////////////////////////////////////

const viewBtn = document.getElementById("viewBtn");
if (viewBtn) {
  viewBtn.addEventListener("click", async () => {
    const name = document.getElementById("empname").value.trim();
    const container = document.getElementById("employeeDetails");

    if (!name) {
      container.innerHTML = `<p style="color:red">Enter name</p>`;
      return;
    }

    showLoader();

    try {
      const response = await fetch(
        `${API_BASE}/viewEmployeesByName?empname=${name}`,
      );

      const employees = await response.json();

      renderEmployeeList(
        container,
        employees,
        "Matching Employees",
        "No employee found",
      );
    } catch (err) {
      container.innerHTML = `<p style="color:red">${err.message}</p>`;
    } finally {
      hideLoader();
    }
  });
}
/////////////////////////////////////////////////////////
// ===== LOAD EMPLOYEE FOR UPDATE =====
/////////////////////////////////////////////////////////

const loadBtn = document.getElementById("loadBtn");

if (loadBtn) {
  loadBtn.addEventListener("click", async () => {
    const empId = document.getElementById("empId").value.trim();
    const container = document.getElementById("UPemployeeDetails");

    if (!empId) {
      container.innerHTML = `<p style="color:red">Enter employee ID</p>`;
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/getEmployeeById/${empId}`);

      const emp = await response.json();

      container.innerHTML = `
            <form id="updateForm">

            <input type="text" name="fname" value="${emp.fname}">
            <input type="text" name="lname" value="${emp.lname}">
            <input type="text" name="contact" value="${emp.contact}">
            <input type="email" name="mail" value="${emp.mail}">
            <input type="number" name="age" value="${emp.age}">
            <input type="text" name="sex" value="${emp.sex}">
            <input type="text" name="degree" value="${emp.degree}">
            <input type="text" name="role" value="${emp.role}">
            <input type="number" name="salary" value="${emp.salary}">
            <input type="file" name="img">

            <button type="submit">Update</button>

            </form>
            `;

      document
        .getElementById("updateForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const formData = new FormData(e.target);

          const update = await fetch(`${API_BASE}/updateEmployee/${empId}`, {
            method: "PUT",
            body: formData,
          });

          const msg = await update.text();

          container.innerHTML += `<p style="color:green">${msg}</p>`;
        });
    } catch (err) {
      container.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  });
}

/////////////////////////////////////////////////////////
// ===== DELETE EMPLOYEE =====
/////////////////////////////////////////////////////////

const delBtn = document.getElementById("delBtn");

if (delBtn) {
  delBtn.addEventListener("click", async () => {
    const empId = document.getElementById("empId").value.trim();

    const result = document.getElementById("deleteResult");

    if (!empId) {
      result.innerHTML = `<p style="color:red">Enter employee ID</p>`;
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/deleteEmployee/${empId}`, {
        method: "DELETE",
      });

      const msg = await response.text();

      result.innerHTML = `<p style="color:green">${msg}</p>`;
    } catch (err) {
      result.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  });
}

/////////////////////////////////////////////////////////
// ===== LOGOUT =====
/////////////////////////////////////////////////////////

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
////////////////page Loading indicator ///////////
function showLoader() {
  document.getElementById("loader").style.display = "block";
  disableButtons();
  startLoadingMessages();
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  enableButtons();
  stopLoadingMessages();
}
///updated loading page

let loadingInterval;

const messages = [
  "Loading data...",
  "Fetching employees...",
  "Downloading images may take some time...",
  "Almost there...",
  "Preparing your data...",
];

function startLoadingMessages() {
  let index = 0;

  document.getElementById("loadingText").innerText = messages[index];

  loadingInterval = setInterval(() => {
    index = (index + 1) % messages.length;
    document.getElementById("loadingText").innerText = messages[index];
  }, 4000);
}

function stopLoadingMessages() {
  clearInterval(loadingInterval);
}
///anabling and disabling buttons while the page is loading
function disableButtons() {
  document.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
}

function enableButtons() {
  document.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
}
////for login page loading indicators
let loginInterval;

const loginMessages = [
  "Logging in...",
  "Verifying credentials...",
  "Connecting to server...",
  "Almost there...",
];

function startLoginMessages() {
  let index = 0;

  document.getElementById("loginLoadingText").innerText = loginMessages[index];

  loginInterval = setInterval(() => {
    index = (index + 1) % loginMessages.length;
    document.getElementById("loginLoadingText").innerText =
      loginMessages[index];
  }, 2000);
}

function stopLoginMessages() {
  clearInterval(loginInterval);
}

function showLoginLoader() {
  const loader = document.getElementById("loginLoader");
  if (!loader) return;

  loader.style.display = "flex";
  disableLoginForm();
  startLoginMessages();
}

function hideLoginLoader() {
  const loader = document.getElementById("loginLoader");
  if (!loader) return;

  loader.style.display = "none";
  enableLoginForm();
  stopLoginMessages();
}
function disableLoginForm() {
  document
    .querySelectorAll("#loginForm input, #loginForm button")
    .forEach((el) => (el.disabled = true));
}

function enableLoginForm() {
  document
    .querySelectorAll("#loginForm input, #loginForm button")
    .forEach((el) => (el.disabled = false));
}

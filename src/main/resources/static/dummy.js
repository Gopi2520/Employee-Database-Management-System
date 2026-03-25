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

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.redirect;
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
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

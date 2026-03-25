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
window.onload = function () {
  // Check if the user is logged in
  if (!sessionStorage.getItem("loggedIn")) {
    // If not logged in, redirect to login page
    window.location.replace("index.html");
  }
};
/////////////////////////////////////////////////////////
// ===== RENDER EMPLOYEE TABLE =====
/////////////////////////////////////////////////////////

function renderEmployeeList(container, employees, title, emptyMessage) {
  if (!container) return;
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
document.addEventListener("DOMContentLoaded", function () {
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
});
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
// ===== LOAD EMPLOYEE FOR DATE =====
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

  <label>First Name</label>
  <input type="text" name="fname" value="${emp.fname}">

  <label>Last Name</label>
  <input type="text" name="lname" value="${emp.lname}">

  <label>Contact</label>
  <input type="text" name="contact" value="${emp.contact}">

  <label>Email</label>
  <input type="email" name="mail" value="${emp.mail}">

  <label>Age</label>
  <input type="number" name="age" value="${emp.age}">

  <label>Sex</label>
  <input type="text" name="sex" value="${emp.sex}">

  <label>Degree</label>
  <input type="text" name="degree" value="${emp.degree}">

  <label>Role</label>
  <input type="text" name="role" value="${emp.role}">

  <label>Salary</label>
  <input type="number" name="salary" value="${emp.salary}">

  <label>Image</label>
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
          document.getElementById("updateForm").style.display = "none";
          container.innerHTML = `
  <p style="color:green">Employee updated successfully ✅</p><br><br><button onclick="window.location.href='home.html'">Home</button>
`;
        });
    } catch (err) {
      container.innerHTML = `<p style="color:red">${err.message}</p><br><button onclick="window.location.href='home.html'">Home</button>`;
    }
  });
}

/////////////////////////////////////////////////////////
// ===== DELETE EMPLOYEE =====
/////////////////////////////////////////////////////////

const delBtn = document.getElementById("delBtn");

if (delBtn) {
  delBtn.addEventListener("click", async () => {
    const empId = document.getElementById("empId").value;
    const resultDiv = document.getElementById("deleteResult");

    if (!empId) {
      resultDiv.innerHTML = "<p style='color:red'>Enter Employee ID</p>";
      return;
    }

    showLoader();

    try {
      const response = await fetch(`${API_BASE}/deleteEmployee/${empId}`, {
        method: "DELETE",
      });
      const data = await response.text();

      resultDiv.innerHTML = `<h2 style="font-weight: bolder;color:black">${data}<br><button onclick="window.location.href='home.html'">Home</button>
`;
    } catch (error) {
      resultDiv.innerHTML = `<p style="color:red">Error deleting employee<br><button onclick="window.location.href='home.html'">Home</button>
`;
    } finally {
      hideLoader();
    }
  });
}
///////////////Logout//////////////////////
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    sessionStorage.clear();
    window.location.replace("index.html");
  });
}
////////////////page Loading indicator ///////////
function showLoader() {
  const loader = document.getElementById("loader");

  if (loader) {
    loader.style.display = "flex";
  }

  if (typeof disableButtons === "function") {
    disableButtons();
  }

  if (typeof startLoadingMessages === "function") {
    startLoadingMessages();
  }
}

function hideLoader() {
  const loader = document.getElementById("loader");

  if (loader) {
    loader.style.display = "none";
  }

  if (typeof enableButtons === "function") {
    enableButtons();
  }

  if (typeof stopLoadingMessages === "function") {
    stopLoadingMessages();
  }
}
///updated loading page
const messages = [
  "Loading data...",
  "Fetching employees...",
  "Downloading images may take some time...",
  "Almost there...",
  "Preparing your data...",
];
let loadingInterval;
function startLoadingMessages() {
  const textEl = document.getElementById("loadingText");

  if (!textEl) return;

  let index = 0;
  textEl.innerText = messages[index];

  loadingInterval = setInterval(() => {
    index = (index + 1) % messages.length;
    textEl.innerText = messages[index];
  }, 4000);
}

function stopLoadingMessages() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
  }
} ///enabling and disabling buttons while the page is loading
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

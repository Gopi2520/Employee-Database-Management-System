// ===== LOGIN HANDLER =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const loginUrl = window.location.origin + "/login";
            console.log("Attempting login POST to:", loginUrl);

            const response = await fetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = window.location.origin + data.redirect;
            } else {
                alert("Invalid credentials. Please try again.");
                if (data.redirect) {
                    window.location.href = window.location.origin + data.redirect;
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
}
// ===== RENDER EMPLOYEE LIST =====
function renderEmployeeList(container, employees, title, emptyMessage) {
    if (!employees || employees.length === 0) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    let html = `<h2>${title}</h2>
    <table>
    <thead>
        <tr>
        <th>ID</th><th>Name</th><th>Contact</th><th>Email</th>
        <th>Age</th><th>Sex</th><th>Degree</th><th>Role</th>
        <th>Salary</th><th>Created</th><th>Photo</th>
        </tr>
    </thead>
    <tbody>`;

    employees.forEach(emp => {
        // Handle photo
        let photoHtml = '—';
        if (emp.img) {
            if (/^data:\w+\/[\w+.-]+;base64,/.test(emp.img)) {
                photoHtml = `<img src="${emp.img}" style="max-width:80px;"/>`;
            } else if (/^https?:\/\//i.test(emp.img) || /\.(jpe?g|png|gif|bmp|webp)$/i.test(emp.img)) {
                photoHtml = `<img src="${emp.img}" style="max-width:80px;"/>`;
            } else {
                photoHtml = `<img src="data:image/png;base64,${emp.img}" style="max-width:80px;"/>`;
            }
        }

        // Format created time if present
        let createdTime = emp.createdAt ? new Date(emp.createdAt).toLocaleString() : '—';

        html += `<tr>
    <td>${esc(emp.id)}</td>
    <td>${esc(emp.fname || '')} ${esc(emp.lname || '')}</td>
    <td>${esc(emp.contact)}</td>
    <td>${esc(emp.mail)}</td>
    <td>${esc(emp.age)}</td>
    <td>${esc(emp.sex)}</td>
    <td>${esc(emp.degree)}</td>
    <td>${esc(emp.role)}</td>
    <td>${esc(emp.salary)}</td>
    <td>${esc(createdTime)}</td>
    <td>${photoHtml}</td>
    </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// ===== VIEW OR FETCH EMPLOYEE =====
// Escape helper to prevent HTML injection
function esc(str) {
    return str ? String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[s])) : "";
}

const viewBtn = document.getElementById('viewBtn');
if (viewBtn) {
    viewBtn.addEventListener('click', async () => {
        const detailsDiv = document.getElementById('employeeDetails');
        if (!detailsDiv) return;
        const empIdElem = document.getElementById('empId');
        if (!empIdElem) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Please enter an employee ID.</p>`;
            return;
        }
        const id = empIdElem.value.trim();
        if (!id) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Employee ID cannot be empty.</p>`;
            return;
        }

        try {
            const response = await fetch(`/getEmployeeById/${encodeURIComponent(id)}`);
            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const emp = await response.json();

            detailsDiv.innerHTML = `
                <h2>Update Employee</h2>
                <form id="updateForm">
                    <input type="hidden" id="empId" value="${emp.id}">
                    <label>First Name:</label><input type="text" id="fname" value="${esc(emp.fname)}" required><br>
                    <label>Last Name:</label><input type="text" id="lname" value="${esc(emp.lname || '')}"><br>
                    <label>Contact:</label><input type="text" id="contact" value="${esc(emp.contact)}"><br>
                    <label>Email:</label><input type="email" id="mail" value="${esc(emp.mail)}"><br>
                    <label>Age:</label><input type="number" id="age" value="${esc(emp.age)}"><br>
                    <label>Sex:</label><input type="text" id="sex" value="${esc(emp.sex)}"><br>
                    <label>Degree:</label><input type="text" id="degree" value="${esc(emp.degree)}"><br>
                    <label>Role:</label><input type="text" id="role" value="${esc(emp.role)}"><br>
                    <label>Salary:</label><input type="number" id="salary" value="${esc(emp.salary)}"><br>
                    <label>Photo:</label><input type="file" id="img" accept="image/*"><br>
                    <button type="submit">Save Changes</button>
                </form>
            `;

            const updateForm = document.getElementById('updateForm');
            updateForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id2 = document.getElementById('empId').value;

                const fileInput = document.getElementById('img');
                const file = fileInput.files[0];

                let body;
                let headers;

                if (file) {
                    body = new FormData();
                    body.append("fname", document.getElementById('fname').value);
                    body.append("lname", document.getElementById('lname').value);
                    body.append("contact", document.getElementById('contact').value);
                    body.append("mail", document.getElementById('mail').value);
                    body.append("age", document.getElementById('age').value);
                    body.append("sex", document.getElementById('sex').value);
                    body.append("degree", document.getElementById('degree').value);
                    body.append("role", document.getElementById('role').value);
                    body.append("salary", document.getElementById('salary').value);
                    body.append("img", file);
                    headers = {};
                } else {
                    body = JSON.stringify({
                        id: id2,
                        fname: document.getElementById('fname').value,
                        lname: document.getElementById('lname').value,
                        contact: document.getElementById('contact').value,
                        mail: document.getElementById('mail').value,
                        age: document.getElementById('age').value,
                        sex: document.getElementById('sex').value,
                        degree: document.getElementById('degree').value,
                        role: document.getElementById('role').value,
                        salary: document.getElementById('salary').value
                    });
                    headers = { "Content-Type": "application/json" };
                }

                const updateResponse = await fetch(`/updateEmployee/${id2}`, {
                    method: "PUT",
                    headers,
                    body
                });

                const message = await updateResponse.text();
                if (updateResponse.ok) {
                    window.location.href = "success.html";
                } else {
                    detailsDiv.innerHTML = `<p style="color:red;">❌ ${message}</p>`;
                }
            });

        } catch (err) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Error: ${esc(err.message)}</p>`;
        }
    });
}
// fall back to name-search
const empName = document.getElementById('empname').value;
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        const detailsDiv = document.getElementById('employeeDetails');
        const empNameElem = document.getElementById('empname');
        if (!empNameElem) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Please enter an employee name.</p>`;
            return;
        }
        const empName = empNameElem.value.trim();
        if (!empName) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Employee name cannot be empty.</p>`;
            return;
        }

        try {
            const response = await fetch(`/viewEmployeesByName?empname=${encodeURIComponent(empName)}`);
            if (!response.ok) throw new Error('Server error: ' + response.status);
            const employees = await response.json();
            renderEmployeeList(detailsDiv, employees, 'Matching Employees', `No employees found with name "${empName}".`);
        } catch (err) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Error fetching employees: ${esc(err.message)}</p>`;
        }
    });
}

// ===== VIEW ALL EMPLOYEES =====
const viewAllBtn = document.getElementById('viewAllBtn');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', async () => {
        const detailsDiv = document.getElementById('employeeDetails');
        try {
            const response = await fetch('/viewAllEmployees');
            if (!response.ok) throw new Error('Server error: ' + response.status);
            const employees = await response.json();
            renderEmployeeList(detailsDiv, employees, 'All Employees', 'No employees found.');
        } catch (err) {
            detailsDiv.innerHTML = `<p style="color:red;">Error fetching employees: ${err.message}</p>`;
        }
    });
}

// ===== DELETE EMPLOYEE BY ID =====
const delBtn = document.getElementById("delBtn");
if (delBtn) {
    delBtn.addEventListener("click", async () => {
        const deleteResult = document.getElementById("deleteResult");
        const empIdElem = document.getElementById("empId");
        const empIdRaw = empIdElem && empIdElem.value.trim();

        if (!empIdRaw) {
            deleteResult.innerHTML = `<p style="color:red;">Please enter an employee ID to delete.</p>`;
            return;
        }

        try {
            const response = await fetch(`/deleteEmployee/${encodeURIComponent(empIdRaw)}`, {
                method: "DELETE"
            });
            const message = await response.text();

            if (response.ok) {
                deleteResult.innerHTML = `<p style="color:green;">✅ ${message}</p>`;
            } else {
                deleteResult.innerHTML = `<p style="color:red;">❌ ${message}</p>`;
            }
        } catch (error) {
            deleteResult.innerHTML = `<p style="color:red;">Error deleting employee: ${error.message}</p>`;
        }
    });
}
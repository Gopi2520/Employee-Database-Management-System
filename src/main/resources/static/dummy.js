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

        const empNameElem = document.getElementById('empname');
        if (!empNameElem) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Please enter an employee name.</p>`;
            return;
        }

        let name = empNameElem.value.trim();
        if (!name) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Employee name cannot be empty.</p>`;
            return;
        }

        try {
            // Normalize to lowercase for case-insensitive search
            name = name.toLowerCase();

            const response = await fetch(`/viewEmployeesByName?empname=${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const employees = await response.json();

            if (!employees || employees.length === 0) {
                detailsDiv.innerHTML = `<p style="color:red;">❌ No employees found with that name.</p>`;
                return;
            }

            // Render the list of employees (reuse your existing function)
            renderEmployeeList(employees);

        } catch (err) {
            detailsDiv.innerHTML = `<p style="color:red;">❌ Error: ${esc(err.message)}</p>`;
        }
    });
}
// fall back to name-search
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
document.getElementById("loadBtn").addEventListener("click", async () => {
    const empId = document.getElementById("empId").value.trim();
    const container = document.getElementById("UPemployeeDetails");
    if (!empId) {
        container.innerHTML = `<p style="color:red;">❌ Please enter an employee ID.</p>`;
        return;
    }
    try {
        const response = await fetch(`/getEmployeeById/${encodeURIComponent(empId)}`);
        if (response.ok) {
            const emp = await response.json();
            // Inject the update form dynamically
            container.innerHTML = `
                <form id="employeeForm">
                    <label>First Name:</label>
                    <input type="text" id="fname" name="fname" value="${emp.fname || ''}" required><br><br>

                    <label>Last Name:</label>
                    <input type="text" id="lname" name="lname" value="${emp.lname || ''}" required><br><br>

                    <label>Contact:</label>
                    <input type="text" id="contact" name="contact" value="${emp.contact || ''}" required><br><br>

                    <label>Email:</label>
                    <input type="email" id="mail" name="mail" value="${emp.mail || ''}" required><br><br>

                    <label>Age:</label>
                    <input type="number" id="age" name="age" value="${emp.age || ''}" required><br><br>

                    <label>Sex:</label>
                    <input type="text" id="sex" name="sex" value="${emp.sex || ''}" required><br><br>

                    <label>Degree:</label>
                    <input type="text" id="degree" name="degree" value="${emp.degree || ''}" required><br><br>

                    <label>Role:</label>
                    <input type="text" id="role" name="role" value="${emp.role || ''}" required><br><br>

                    <label>Salary:</label>
                    <input type="number" id="salary" name="salary" step="0.01" value="${emp.salary || ''}" required><br><br>

                    <label>Image:</label>
                    <input type="file" id="img" name="img" accept="image/*"><br>
                    ${emp.imgBase64 ? `<img src="data:image/png;base64,${emp.imgBase64}" style="max-width:150px;" alt="Current Image">` : ''}
                    <br><br>

                    <button type="button" id="updateBtn">UPDATE EMPLOYEE</button>
                    <button type="reset">RESET</button>
                </form>
            `;

            // Attach update handler
            document.getElementById("updateBtn").addEventListener("click", async () => {
                const formData = new FormData(document.getElementById("employeeForm"));
                try {
                    const updateResponse = await fetch(`/updateEmployee/${encodeURIComponent(empId)}`, {
                        method: "PUT",
                        body: formData
                    });
                    const message = await updateResponse.text();
                    container.innerHTML += updateResponse.ok
                        ? `<p style="color:green;">✅ ${message}</p>`
                        : `<p style="color:red;">${message}</p>`;
                } catch (error) {
                    container.innerHTML += `<p style="color:red;">Error updating employee: ${error.message}</p>`;
                }
            });

        } else {
            container.innerHTML = `<p style="color:red;">❌ Employee not found.</p>`;
        }
    } catch (error) {
        container.innerHTML = `<p style="color:red;">Error fetching employee: ${error.message}</p>`;
    }
});
// ===== DELETE EMPLOYEE BY ID =====

const delBtn = document.getElementById("delBtn");
if (delBtn) {
    delBtn.addEventListener("click", async () => {
        const deleteResult = document.getElementById("deleteResult");
        const empIdElem = document.getElementById("empId");
        const empIdRaw = empIdElem && empIdElem.value.trim();
        console.log("Attempting to delete employee with ID:", empIdRaw);
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
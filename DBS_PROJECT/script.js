document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('current-section-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('data-section');
            if (sectionId) {
                e.preventDefault();
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(sectionId).classList.add('active');

                // Update title
                sectionTitle.textContent = link.querySelector('span').textContent;

                // Load data for section
                loadSectionData(sectionId);
            }
        });
    });

    // Initialize dashboard
    loadDashboardStats();

    // Form submission handling
    const empForm = document.getElementById('employee-form');
    if (empForm) {
        empForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('emp-name').value,
                department: document.getElementById('emp-dept').value,
                designation: document.getElementById('emp-desig').value,
                contact: document.getElementById('emp-contact').value
            };

            const success = await saveEmployee(data);
            if (success) {
                empForm.reset();
                closeModal('employee-modal');
                loadSectionData('employees');
                loadDashboardStats();
            }
        });
    }
});

// Load data based on section
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'employees':
            loadEmployees();
            break;
        case 'attendance':
            loadAttendance();
            break;
        case 'leaves':
            loadLeaves();
            break;
    }
}

// API Functions
async function loadDashboardStats() {
    try {
        const [empRes, attRes, leaveRes] = await Promise.all([
            fetch('api/employees'),
            fetch('api/attendance'),
            fetch('api/leaves')
        ]);

        const employees = await empRes.json();
        const attendance = await attRes.json();
        const leaves = await leaveRes.json();

        document.getElementById('count-employees').textContent = employees.length;
        document.getElementById('count-attendance').textContent = attendance.length; // Simplified for demo
        document.getElementById('count-leaves').textContent = leaves.filter(l => l.status === 'Pending').length;

        // Update recent activity (simplified)
        const recentList = document.getElementById('recent-list');
        recentList.innerHTML = employees.slice(0, 5).map(emp => `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
                <div class="avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${emp.name.charAt(0)}</div>
                <div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${emp.name} joined the company</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${emp.dateOfJoining}</div>
                </div>
            </div>
        `).join('') || '<p style="color: var(--text-muted); font-size: 0.875rem;">No recent activity</p>';

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadEmployees() {
    const tableBody = document.querySelector('#employee-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Loading employees...</td></tr>';

    try {
        const response = await fetch('api/employees');
        const employees = await response.json();

        tableBody.innerHTML = employees.map(emp => `
            <tr>
                <td>#${emp.empId}</td>
                <td style="font-weight: 600;">${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.designation}</td>
                <td>${emp.contactDetails}</td>
                <td>${emp.dateOfJoining}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-danger" style="padding: 0.4rem;" onclick="deleteEmployee(${emp.empId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--danger);">Failed to load employees</td></tr>';
    }
}

async function saveEmployee(data) {
    try {
        const response = await fetch('api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert('Employee saved successfully!');
            return true;
        } else {
            alert('Error: ' + result.message);
            return false;
        }
    } catch (error) {
        alert('Network error while saving employee');
        return false;
    }
}

async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`api/employees?id=${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                loadEmployees();
                loadDashboardStats();
            } else {
                alert('Error deleting employee: ' + result.message);
            }
        } catch (error) {
            alert('Network error while deleting employee');
        }
    }
}

async function loadAttendance() {
    const tableBody = document.querySelector('#attendance-table tbody');
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading attendance...</td></tr>';

    try {
        const response = await fetch('api/attendance');
        const list = await response.json();

        tableBody.innerHTML = list.map(item => `
            <tr>
                <td>#${item.attendanceId}</td>
                <td>#${item.empId}</td>
                <td>${item.date}</td>
                <td>${item.checkInTime}</td>
                <td>${item.checkOutTime || '--:--'}</td>
                <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Failed to load attendance</td></tr>';
    }
}

async function loadLeaves() {
    const tableBody = document.querySelector('#leaves-table tbody');
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Loading leaves...</td></tr>';

    try {
        const response = await fetch('api/leaves');
        const list = await response.json();

        tableBody.innerHTML = list.map(item => `
            <tr>
                <td>#${item.leaveId}</td>
                <td>#${item.empId}</td>
                <td>${item.leaveType}</td>
                <td>${item.startDate}</td>
                <td>${item.endDate}</td>
                <td title="${item.reason}">${item.reason.substring(0, 15)}...</td>
                <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    ${item.status === 'Pending' ? `
                        <button class="btn btn-primary" style="padding: 0.4rem 0.6rem;" onclick="processLeave(${item.leaveId}, 'Approved')">Approve</button>
                    ` : '--'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--danger);">Failed to load leaves</td></tr>';
    }
}

async function processLeave(id, status) {
    try {
        const response = await fetch('api/leaves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
        const result = await response.json();
        if (result.success) {
            loadLeaves();
            loadDashboardStats();
        }
    } catch (error) {
        alert('Error processing leave');
    }
}

async function loadReport(type) {
    const output = document.getElementById('report-output');
    output.innerHTML = '<p style="text-align: center; padding: 2rem;">Generating report...</p>';

    try {
        const response = await fetch(`api/reports?type=${type}`);
        const data = await response.json();

        output.innerHTML = `
            <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 8px;">
                <h4 style="margin-bottom: 1rem; color: var(--accent-color);">Report Result (${type})</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                    ${data.map(line => `<li style="padding: 0.5rem; border-bottom: 1px solid var(--border-color); font-size: 0.875rem;">${line}</li>`).join('')}
                </ul>
            </div>
        `;
    } catch (error) {
        output.innerHTML = '<p style="color: var(--danger);">Failed to generate report</p>';
    }
}

// UI Helpers
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// web/script.js

// --- Section Navigation ---
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Refresh data when switching
    if (sectionId === 'employees') loadEmployees();
    if (sectionId === 'attendance') loadAttendance();
    if (sectionId === 'leaves') loadLeaves();
}

// --- API Helpers ---
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Post error:', error);
        return { success: false };
    }
}

// --- Data Loading ---
async function loadEmployees() {
    const list = document.getElementById('employeeList');
    list.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    const data = await fetchData('/api/employees');
    
    list.innerHTML = '';
    data.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.empId}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.designation}</td>
            <td>
                <button class="action-btn" onclick="openUpdateModal(${emp.empId})">Update</button>
                <button class="action-btn delete-btn" onclick="deleteEmployee(${emp.empId})">Delete</button>
            </td>
        `;
        list.appendChild(tr);
    });
}

async function loadAttendance() {
    const list = document.getElementById('attendanceList');
    const data = await fetchData('/api/attendance');
    list.innerHTML = '';
    data.forEach(att => {
        list.innerHTML += `
            <tr>
                <td>${att.date}</td>
                <td>${att.empId}</td>
                <td>${att.checkInTime}</td>
                <td style="color: #1DB954;">${att.status}</td>
            </tr>
        `;
    });
}

async function loadLeaves() {
    const list = document.getElementById('leaveList');
    const data = await fetchData('/api/leaves');
    list.innerHTML = '';
    data.forEach(l => {
        list.innerHTML += `
            <tr>
                <td>${l.leaveId}</td>
                <td>${l.empId}</td>
                <td>${l.leaveType}</td>
                <td>${l.startDate} to ${l.endDate}</td>
                <td>${l.status}</td>
                <td>
                    <button class="action-btn" onclick="processLeave(${l.leaveId}, 'Approved')">Approve</button>
                    <button class="action-btn delete-btn" onclick="processLeave(${l.leaveId}, 'Rejected')">Reject</button>
                </td>
            </tr>
        `;
    });
}

// --- Actions ---
document.getElementById('addEmployeeForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const result = await postData('/api/employees', data);
    if (result.success) {
        alert('Employee Added Successfully (Stored Procedure Called)');
        closeModal('addEmployeeModal');
        loadEmployees();
    }
};

async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete employee ' + id + '?')) {
        const response = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) loadEmployees();
    }
}

async function processLeave(id, status) {
    const result = await postData('/api/leaves/process', { id, status });
    if (result.success) {
        alert('Leave Processed (Procedure Success & Trigger Logged)');
        loadLeaves();
    }
}

// --- Reports ---
async function runReport(type) {
    const out = document.getElementById('reportOutput');
    const pre = document.getElementById('reportData');
    const title = document.getElementById('reportTitle');
    
    out.style.display = 'block';
    pre.innerText = 'Running SQL Query...';
    
    const data = await fetchData(`/api/reports?type=${type}`);
    title.innerText = `Report: ${type.toUpperCase()} Query Result`;
    pre.innerText = data.join('\n');
}

// --- Modal Handling ---
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// --- Search ---
function searchTable(tableId, inputId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const table = document.getElementById(tableId);
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        let text = tr[i].innerText;
        tr[i].style.display = text.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
}

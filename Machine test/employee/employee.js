// createing unique id for the requsts
const uuid = () => '_' + Math.random().toString(36).substr(2, 9);

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'employee') {
  window.location.href = '../Login/login.html';
}

// Logout logic
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = '../Login/login.html';
});

const requestForm = document.getElementById('requestForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveBtn = document.getElementById('saveBtn');

// To call all the request from the lS
function getRequests() {
  return JSON.parse(localStorage.getItem('travelRequests')) || [];
}

function setRequests(arr) {
  localStorage.setItem('travelRequests', JSON.stringify(arr));
}

function clearForm() {
  requestForm.reset();
  document.getElementById('requestId').value = '';
  cancelEditBtn.classList.add('d-none');
  saveBtn.textContent = 'Submit';
}
// this function handles all the request based on the status of the request
function renderRequests() {
  const all = getRequests().filter(r => r.user === currentUser.username);
  const containers = {
    pending: document.getElementById('pendingTab'),
    approved: document.getElementById('approvedTab'),
    rejected: document.getElementById('rejectedTab'),
    hold: document.getElementById('holdTab')
  };
  Object.values(containers).forEach(c => (c.innerHTML = ''));
  all.forEach(r => {
    const card = document.createElement('div');
    card.className = `card mb-2 border-${r.priority === 'critical' ? 'danger' : 'secondary'}`;
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="card-title mb-1">${r.destination} 
              <span class="badge bg-${r.priority === 'critical' ? 'danger' : 'secondary'} text-capitalize">${r.priority}</span>
            </h6>
            <small class="text-muted">${r.fromDate} to ${r.toDate} (${r.noOfDays} days)</small>
            <p class="mb-1">${r.reason}</p>
            <small>Emp: ${r.empId} - ${r.empName} | Project: ${r.project}</small><br>
            <small>Mode: ${r.mode} | Cause: ${r.cause}</small><br>
            <small>Requested on ${new Date(r.createdAt).toLocaleString()}</small>
          </div>
          ${['pending', 'hold'].includes(r.status) ? `<button class="btn btn-sm btn-outline-primary" data-edit="${r.id}">Edit</button>` : ''}
        </div>
      </div>`;
    containers[r.status].appendChild(card);
  });

  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-edit');
      const req = all.find(x => x.id === id);
      if (req) populateForm(req);
    });
  });
}
// function to input all the details for edit 
function populateForm(r) {
  document.getElementById('requestId').value = r.id;
  document.getElementById('empId').value = r.empId;
  document.getElementById('empName').value = r.empName;
  document.getElementById('project').value = r.project;
  document.getElementById('cause').value = r.cause;
  document.getElementById('destination').value = r.destination;
  document.getElementById('fromDate').value = r.fromDate;
  document.getElementById('toDate').value = r.toDate;
  document.getElementById('noOfDays').value = r.noOfDays;
  document.getElementById('mode').value = r.mode;
  document.getElementById('reason').value = r.reason;
  document.getElementById('priority').value = r.priority;
  cancelEditBtn.classList.remove('d-none');
  saveBtn.textContent = 'Update';
}

cancelEditBtn.addEventListener('click', clearForm);

// function to calculate days based on the from and to dates
function calcDays() {
  const from = document.getElementById('fromDate').value;
  const to = document.getElementById('toDate').value;
  if (from && to) {
    const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;
    document.getElementById('noOfDays').value = diff > 0 ? diff : 0;
  }
}
document.getElementById('fromDate').addEventListener('change', calcDays);
document.getElementById('toDate').addEventListener('change', calcDays);


requestForm.addEventListener('submit', e => {
  e.preventDefault();
  calcDays();
  const reqObj = {
    id: document.getElementById('requestId').value || uuid(),
    user: currentUser.username,
    empId: document.getElementById('empId').value,
    empName: document.getElementById('empName').value,
    project: document.getElementById('project').value,
    cause: document.getElementById('cause').value,
    destination: document.getElementById('destination').value,
    fromDate: document.getElementById('fromDate').value,
    toDate: document.getElementById('toDate').value,
    noOfDays: document.getElementById('noOfDays').value,
    mode: document.getElementById('mode').value,
    reason: document.getElementById('reason').value,
    priority: document.getElementById('priority').value,
    status: 'pending',
    createdAt: Date.now()
  };
  const list = getRequests();
  const existingIndex = list.findIndex(x => x.id === reqObj.id);
  if (existingIndex >= 0) {
    reqObj.status = list[existingIndex].status;
    reqObj.createdAt = list[existingIndex].createdAt;
    list[existingIndex] = reqObj;
  } else {
    list.push(reqObj);
  }
  setRequests(list);
  clearForm();
  renderRequests();
});

// Initial render
renderRequests();

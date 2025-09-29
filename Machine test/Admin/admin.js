const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'admin') {
  window.location.href = '../Login/login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = '../Login/login.html';
});

function getRequests() {
  return JSON.parse(localStorage.getItem('travelRequests')) || [];
}

function setRequests(arr) {
  localStorage.setItem('travelRequests', JSON.stringify(arr));
}

function renderRequests() {
  const list = getRequests();
  const criticalDiv = document.getElementById('criticalTab');
  const normalDiv = document.getElementById('normalTab');
  criticalDiv.innerHTML = '';
  normalDiv.innerHTML = '';

  list.forEach(r => {
    const wrapper = r.priority === 'critical' ? criticalDiv : normalDiv;
    const card = document.createElement('div');
    card.className = `card mb-2 border-${r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'danger' : r.status === 'hold' ? 'warning' : 'secondary'}`;
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="card-title mb-1">${r.destination} 
              - <small>ID: ${r.user} | Name: ${r.empName || 'N/A'}</small>
            </h6>
            <small class="text-muted">${r.fromDate} to ${r.toDate}</small>
            <p class="mb-1">${r.reason}</p>
            <span class="badge bg-${r.priority === 'critical' ? 'danger' : 'secondary'} text-capitalize">${r.priority}</span>
            <span class="badge bg-info text-capitalize">${r.status}</span>
          </div>
          <div>
            <button class="btn btn-sm btn-success me-1" data-action="approve" data-id="${r.id}">✔</button>
            <button class="btn btn-sm btn-danger me-1" data-action="reject" data-id="${r.id}">✖</button>
            <button class="btn btn-sm btn-warning" data-action="hold" data-id="${r.id}">Pause</button>
          </div>
        </div>
      </div>`;
    wrapper.appendChild(card);
  });

  // Attach actions
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      updateStatus(id, action);
    });
  });
}

// function to update all the status of the requests
function updateStatus(id, action) {
  const list = getRequests();
  const idx = list.findIndex(r => r.id === id);
  if (idx >= 0) {
    if (action === 'approve') list[idx].status = 'approved';
    else if (action === 'reject') list[idx].status = 'rejected';
    else list[idx].status = 'hold';
    setRequests(list);
    renderRequests();
  }
}

renderRequests();

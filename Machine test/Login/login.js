// ADDING USER 
const demoUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'emp01', password: 'emp01@123', role: 'employee' },
  { username: 'emp02', password: 'emp02@123', role: 'employee' },
  { username: 'emp03', password: 'emp03@123', role: 'employee' },
  { username: 'emp04', password: 'emp04@123', role: 'employee' },
  { username: 'emp05', password: 'emp05@123', role: 'employee' },
  { username: 'emp06', password: 'emp06@123', role: 'employee' },
  { username: 'emp07', password: 'emp07@123', role: 'employee' },
  { username: 'emp08', password: 'emp08@123', role: 'employee' },
  { username: 'emp09', password: 'emp09@123', role: 'employee' },
  { username: 'emp10', password: 'emp10@123', role: 'employee' }
];

// here the username and the password are being added into the local storage
let users = JSON.parse(localStorage.getItem('users')) || [];
if (users.length === 0) {
  localStorage.setItem('users', JSON.stringify(demoUsers));
  users = demoUsers;
}

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const matched = users.find(u => u.username === username && u.password === password);

  if (matched) {
// Here since only one admin is here the user is sent to the admin page if the user name is admin or else it goes to the employee page
    localStorage.setItem('currentUser', JSON.stringify(matched));
    if (matched.role === 'admin') {
      window.location.href = '../admin/admin.html';   
    } else {
      window.location.href = '../employee/employee.html';
    }
  } else {
    errorMsg.classList.remove('d-none');
  }
});

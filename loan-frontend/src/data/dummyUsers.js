// Simple in-memory dummy users for local development/testing
// Passwords are plain-text for dev only — never do this in production
const dummyUsers = [
  {
    id: 'stu-1',
    role: 'student',
    name: 'Test Student',
    email: 'student@example.com',
    password: 'student123',
    aadhar: '1234-5678-9012',
  },
  {
    id: 'dist-1',
    role: 'distributor',
    name: 'Test Distributor',
    email: 'distributor@example.com',
    password: 'distrib123',
    bankname: 'Demo Bank',
  },
];

export default dummyUsers;

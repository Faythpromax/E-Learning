import api from './api';

export async function registerUser({ name, email, password, role }) {
  return api.post('/register', { name, email, password, role });
}

export async function loginUser({ email, password }) {
  return api.post('/login', { email, password });
}

export function saveAuthSession({ token, user }) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

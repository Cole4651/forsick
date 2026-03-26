import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');

  function update(field) {
    return e => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await api.post('/api/auth/register', form);
    const data = await res.json();
    if (res.ok) {
      login(data.user, data.token);
    } else {
      setError(data.error || 'Registration failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">Forsick</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <h2 className="text-xl font-semibold text-center dark:text-gray-100">Create Account</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          placeholder="Full Name" value={form.name} onChange={update('name')}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          placeholder="Username" value={form.username} onChange={update('username')}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="email" placeholder="Email" value={form.email} onChange={update('email')}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="password" placeholder="Password" value={form.password} onChange={update('password')}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required minLength={6}
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
          Sign Up
        </button>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}

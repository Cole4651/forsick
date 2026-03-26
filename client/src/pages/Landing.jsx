import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Forsick</span>
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-lg"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            Log In
          </Link>
          <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          Connect with the<br />
          <span className="text-indigo-600 dark:text-indigo-400">people who matter</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-10">
          Share your thoughts, follow your friends, and stay in the loop. Forsick is the social platform built for real connections.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition">
            Get Started
          </Link>
          <Link to="/login" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Log In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share Posts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Post what's on your mind with text and images</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Follow Friends</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Build your network and see what your friends are up to</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-Time</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Likes, comments, and posts update instantly</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800">
        Forsick &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

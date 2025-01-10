import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import './Header.css';

export default function Navbar() {
  const { authUser, checkAuth, logout } = useAuthStore();
  const [myid, setMyid] = useState();

  useEffect(() => {
    checkAuth(); // Ensure the user's auth status is checked on component mount
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      setMyid(authUser._id);
    }
  }, [authUser]);

  const handleLogout = async () => {
    await logout(); // Log the user out
  };

  const avatar = myid ? (
    <Link to={`/profile/${myid}`}>
      <img
        src={authUser?.profilePhoto || '/avatar.png'}
        alt="Profile Avatar"
        className="rounded-full h-16 w-16 ml-20"
      />
    </Link>
  ) : (
    <Link>
      <img
        src="/avatar.png"
        alt="Default Avatar"
        className="rounded-full h-16 w-16 ml-20"
      />
    </Link>
  );

  return (
    <nav className="absolute z-10 top-0 left-0 right-0 bg-gradient-to-r from-purple-800 via-black to-purple-800 text-white py-4 px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-6">
          <Link to="/">
            <img
              src="/newlogo2.png"
              alt="Logo"
              className="h-16 w-auto inline-block hover:scale-110 transition-transform"
            />
          </Link>
          <ul className="hidden md:flex space-x-8 text-lg font-semibold">
            <li className="hover:text-yellow-300">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-yellow-300">
              <Link to="/chat">Chat</Link>
            </li>
            <li className="hover:text-yellow-300">
              <Link to="/trends">Trends</Link>
            </li>
            <li className="hover:text-yellow-300">
              <Link to="/collaboration">Collaboration</Link>
            </li>
          </ul>
        </div>

        {/* Authentication and Actions */}
        <div className="space-x-6 flex items-center">
          {authUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline-block px-5 py-2 border border-white text-white rounded-full hover:bg-white hover:text-purple-600 transition-all"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button
                type="button"
                className="hidden md:inline-block px-5 py-2 border border-white text-white rounded-full hover:bg-white hover:text-purple-600 transition-all"
              >
                Login/SignUp
              </button>
            </Link>
          )}
          <Link to="/post/upload">
            <button
              type="button"
              className="hidden md:inline-block px-5 py-2 border border-white text-white rounded-full hover:bg-white hover:text-purple-600 transition-all"
            >
              Upload
            </button>
          </Link>
          {avatar}

          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

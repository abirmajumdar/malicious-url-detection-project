import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = localStorage.getItem('User');

  const handleLogout = () => {
    localStorage.removeItem('User');
    navigate('/');
  };

  const handleGuestMode = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left - Title */}
          <div
            className="flex-shrink-0 text-blue-900 text-2xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            Phishing URL Detection
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-blue-900 focus:outline-none"
            >
              {/* Simple Hamburger Icon */}
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-blue-900 hover:text-blue-600 text-lg">
                  Predict Url
                </Link>
                <Link to="/maindashboard" className="text-blue-900 hover:text-blue-600 text-lg">
                  Dashboard
                </Link>
                <Link to="/mysearch" className="text-blue-900 hover:text-blue-600 text-lg">
                  My Searches
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-blue-900 hover:text-blue-600 text-lg">
                  Predict Url
                </Link>
                <Link to="/maindashboard" className="text-blue-900 hover:text-blue-600 text-lg">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-lg"
                >
                  Login
                </button>

              </>
            )}
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-2">
            {user ? (
              <><Link
                to="/dashboard"
                className="text-blue-900 hover:text-blue-600 text-lg block"
                onClick={() => setMenuOpen(false)}
              >
                Predict Url
              </Link>
                <Link
                  to="/maindashboard"
                  className="text-blue-900 hover:text-blue-600 text-lg block"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/mysearch"
                  className="text-blue-900 hover:text-blue-600 text-lg block"
                  onClick={() => setMenuOpen(false)}
                >
                  My Searches
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-blue-900 hover:text-blue-600 text-lg block"
                  onClick={() => setMenuOpen(false)}
                >
                  Predict Url
                </Link>
                <Link
                  to="/maindashboard"
                  className="text-blue-900 hover:text-blue-600 text-lg block"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

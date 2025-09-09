import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 px-6 md:px-12 py-4 bg-gradient-to-r from-gray-950 to-gray-800 text-white flex justify-between items-center shadow-lg z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-extrabold text-cyan-400 tracking-wide"
      >
        ColdMailX
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8 text-lg">
        <a
          href="#features"
          className="hover:text-cyan-300 transition-colors duration-300"
        >
          Features
        </a>
        <a
          href="#templates"
          className="hover:text-cyan-300 transition-colors duration-300"
        >
          Templates
        </a>
        <a
          href="#campaigns"
          className="hover:text-cyan-300 transition-colors duration-300"
        >
          Campaigns
        </a>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link
          to="/signin"
          className="text-white hover:text-cyan-300 transition-colors duration-300 text-lg"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl focus:outline-none"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 flex flex-col items-center py-4 space-y-4 md:hidden shadow-lg">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-lg hover:text-cyan-300 transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#templates"
            onClick={() => setIsOpen(false)}
            className="text-lg hover:text-cyan-300 transition-colors duration-300"
          >
            Templates
          </a>
          <a
            href="#campaigns"
            onClick={() => setIsOpen(false)}
            className="text-lg hover:text-cyan-300 transition-colors duration-300"
          >
            Campaigns
          </a>
          <Link
            to="/signin"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-cyan-300 transition-colors duration-300 text-lg"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { School } from "lucide-react";
import { FaFacebook, FaTwitter, FaGithub, FaYoutube, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 dark:bg-black/30 border-t border-gray-300 dark:border-gray-700 py-10 px-4 sm:px-8 lg:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800 dark:text-gray-200">
        
        {/* Brand/Logo */}
        <div>
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <School size={28} className="text-indigo-600 dark:text-indigo-400" />
          <h1 className="font-bold text-xl tracking-wide text-gray-900 dark:text-white">
            E-Learning
          </h1>
        </div>
     <p className="text-sm mt-2">
            Learn in-demand skills from top instructors. Upskill and reskill with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/admin/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/course/search?query" className="hover:underline">Courses</Link></li>
            <li><Link to="/profile" className="hover:underline">Profile</Link></li>
            <li><Link to="/my-learning" className="hover:underline">My Learning</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <Link to="https://facebook.com" target="_blank" aria-label="Facebook">
              <FaFacebook className="w-6 h-6 text-blue-600 hover:text-blue-800 transition-all duration-300" />
            </Link>
            <Link to="https://twitter.com" target="_blank" aria-label="Twitter">
              <FaTwitter className="w-6 h-6 text-sky-500 hover:text-sky-700 transition-all duration-300" />
            </Link>
            <Link to="https://github.com" target="_blank" aria-label="GitHub">
              <FaGithub className="w-6 h-6 text-gray-800 hover:text-gray-900 transition-all duration-300" />
            </Link>
            <Link to="https://youtube.com" target="_blank" aria-label="YouTube">
              <FaYoutube className="w-6 h-6 text-red-600 hover:text-red-800 transition-all duration-300" />
            </Link>
            <Link to="/contact" aria-label="Mail">
              <FaEnvelope className="w-6 h-6 text-green-600 hover:text-green-800 transition-all duration-300" />
            </Link>
          </div>
          <p className="text-sm mt-3">support@elearning.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 text-xs text-gray-600 dark:text-gray-400">
        &copy; {year} E-Learning. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

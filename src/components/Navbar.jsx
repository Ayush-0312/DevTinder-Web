import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(clearRequests());

      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  const linkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive ? "bg-white shadow text-black" : "text-gray-600 hover:text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 flex justify-center py-5 px-3">
      <div className="flex items-center justify-between w-full max-w-4xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-full px-5 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight text-pink-600">
          DevTinder
        </Link>

        {user && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/feed" className={linkStyle}>
                Discover
              </NavLink>

              <NavLink to="/connections" className={linkStyle}>
                Connections
              </NavLink>

              <NavLink to="/requests" className={linkStyle}>
                Requests
              </NavLink>

              <NavLink to="/profile" className={linkStyle}>
                Profile
              </NavLink>
            </nav>

            {/* Desktop Avatar + Logout */}
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
              <img
                src={user?.photos[0] || DEFAULT_PHOTO}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />

              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-black"
              >
                Logout
              </button>
            </div>

            {/* Avatar */}
            <div className="relative md:hidden">
              <details>
                <summary className="list-none cursor-pointer flex items-center p-1 rounded-full hover:bg-gray-100">
                  <img
                    src={user?.photoUrl}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                </summary>

                <div
                  className="absolute right-0 mt-3 w-36 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  onClick={(e) => {
                    e.currentTarget.closest("details").removeAttribute("open");
                  }}
                >
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
                  >
                    Discover
                  </Link>

                  <Link
                    to="/connections"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
                  >
                    Connections
                  </Link>

                  <Link
                    to="/requests"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
                  >
                    Requests
                  </Link>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-black"
                  >
                    Logout
                  </button>
                </div>
              </details>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

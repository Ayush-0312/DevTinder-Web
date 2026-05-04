import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BASE_URL, DEFAULT_PHOTO, LOGO } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";
import { useCallback, useState } from "react";
import { LuSun } from "react-icons/lu";
import { PiMoon } from "react-icons/pi";

const Navbar = () => {
  const photo = useSelector((store) => store.user?.photos?.[0]);
  const isLoggedIn = useSelector((store) => !!store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const toggleTheme = () => {
    const newTheme = !isDark;

    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(clearRequests());

      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }, [dispatch, navigate]);

  const linkStyle = useCallback(
    ({ isActive }) =>
      `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive
          ? "bg-white shadow text-black dark:bg-white/10 dark:text-gray-50"
          : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-gray-50"
      }`,
    [],
  );

  return (
    <header className="sticky top-0 z-50 flex justify-center py-5 px-3">
      <div className="flex items-center justify-between w-full max-w-4xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-black/20 shadow-lg dark:shadow-black/10 transition-colors duration-300 rounded-full px-5 py-3">
        <Link
          to="/"
          className="text-lg font-bold flex items-center gap-1 tracking-tight text-pink-600 group"
        >
          <img
            src={LOGO}
            alt="logo"
            loading="lazy"
            decoding="async"
            className="w-5 h-5 rounded-full group-hover:animate-pulse"
          />
          DevTinder
        </Link>

        {isLoggedIn && (
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
        )}

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}>
            {isDark ? (
              <LuSun className="text-gray-400 hover:text-gray-200" />
            ) : (
              <PiMoon className="text-gray-700 hover:text-gray-900" />
            )}
          </button>

          {/* Desktop Avatar + Logout */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-600/50">
            {isLoggedIn && (
              <>
                <img
                  src={photo || DEFAULT_PHOTO}
                  alt="avatar"
                  loading="lazy"
                  decoding="async"
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600/50"
                />
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                >
                  Logout
                </button>{" "}
              </>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="relative md:hidden">
          {isLoggedIn && (
            <>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <img
                  src={photo || DEFAULT_PHOTO}
                  alt="avatar"
                  loading="lazy"
                  decoding="async"
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600/50"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-36 bg-white dark:bg-gray-950/90 border border-gray-200 dark:border-gray-600/50 rounded-xl shadow-lg overflow-hidden">
                  <Link
                    to="/feed"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                  >
                    Discover
                  </Link>

                  <Link
                    to="/connections"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                  >
                    Connections
                  </Link>

                  <Link
                    to="/requests"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                  >
                    Requests
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

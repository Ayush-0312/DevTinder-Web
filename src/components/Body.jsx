import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const publicRoutes = ["/", "/login"];

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = useSelector((store) => store.user);

  useEffect(() => {
    if (userData || publicRoutes.includes(location.pathname)) return;

    let cancelled = false;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });

        if (!cancelled) {
          dispatch(addUser(res.data));
        }
      } catch (err) {
        if (
          !cancelled &&
          err.response?.status === 401 &&
          !publicRoutes.includes(location.pathname)
        ) {
          navigate("/login", { replace: true });
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [dispatch, location.pathname, navigate, userData]);

  useEffect(() => {
    if (userData && location.pathname === "/login") {
      navigate("/feed", { replace: true });
    }
  }, [userData, location.pathname, navigate]);

  return (
    <div className="app-bg min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto sm:px-5 px-0 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;

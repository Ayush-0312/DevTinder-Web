/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);

  const publicRoutes = ["/", "/login"];

  const fetchUser = async () => {
    if (userData) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userData && location.pathname === "/login") {
      navigate("/feed");
    }
  }, [userData, location.pathname]);

  if (loading) return null;

  return (
    <div className="app-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto sm:px-5 px-0 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;

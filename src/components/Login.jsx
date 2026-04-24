/* eslint-disable no-unused-vars */
import axios from "axios";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "motion/react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true },
      );

      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [emailId, password, dispatch, navigate]);

  const handleSignUp = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data || {}));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, emailId, password, dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <motion.div
        layout
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-black/50 p-5 md:p-8 transition-colors duration-300"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-pink-600">
            DevTinder
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {isLoginForm ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-gray-600 dark:text-gray-400">
          <AnimatePresence initial={false}>
            {!isLoginForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-3 overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 form-input"
                />

                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 form-input"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="Email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="form-input"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        {/* Button */}
        <button
          disabled={loading}
          onClick={isLoginForm ? handleLogin : handleSignUp}
          className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-700 dark:to-rose-700 text-gray-50 font-medium py-2.5 rounded-lg hover:animate-pulse transition-all duration-300"
        >
          {loading
            ? "Please wait..."
            : isLoginForm
              ? "Login"
              : "Create Account"}
        </button>

        {/* Toggle */}
        <p
          className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center cursor-pointer hover:text-black dark:hover:text-gray-300"
          onClick={() => setIsLoginForm((prev) => !prev)}
        >
          {isLoginForm
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

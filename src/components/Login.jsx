import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      //console.log(res?.data);
      dispatch(addUser(res?.data?.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <input
                  type="text"
                  value={firstName}
                  placeholder="First Name"
                  className="input my-2"
                  onChange={(e) => setFirstName(e?.target?.value)}
                />
                <input
                  type="text"
                  value={lastName}
                  placeholder="Last Name"
                  className="input my-2"
                  onChange={(e) => setLastName(e?.target?.value)}
                />
              </>
            )}
            <input
              type="text"
              value={emailId}
              placeholder="Email ID"
              className="input my-2"
              onChange={(e) => setEmailId(e?.target?.value)}
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="input my-2"
              onChange={(e) => setPassword(e?.target?.value)}
            />
          </div>
          <p className="text-red-500">{error}</p>
          <p
            className="cursor-pointer mb-2"
            onClick={() => setIsLoginForm(!isLoginForm)}
          >
            {isLoginForm
              ? "New User? Sign Up here"
              : "Already have an account? Login here"}
          </p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7777/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Login</h2>
          <div>
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
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

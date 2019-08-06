import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

export default function Login() {
  // Login states
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const checkToken = () => {
    if (localStorage.getItem("token").length > 0) {
      return true;
    }
    return false;
  };

  // Errors
  const [errorMsg, setErrorMsg] = useState("");

  // Form handlers
  const handleLoginUser = event => {
    setLoginUser(event.target.value);
  };
  const handleLoginPass = event => {
    setLoginPass(event.target.value);
  };

  // Handle Login
  const postLogin = async () => {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      credentials: "include",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: loginUser,
        password: loginPass
      })
    });
    const content = await response.json();
    console.log(content);
    if (!content.success) {
      setErrorMsg("Wrong username or password");
    } else {
      localStorage.setItem("token", content.token);
      setLoggedIn(true);
      console.log("Login successful");
    }
  };

  if (loggedIn) {
    return <Redirect to="/portal" />;
  } else {
    return (
      <div className="main">
        <p className="sign" style={{ textAlign: "center" }}>
          Login
          <Link to="/">Register</Link>
        </p>
        <form class="form1">
          <input
            className="un "
            type="text"
            placeholder="username"
            value={loginUser}
            onChange={e => handleLoginUser(e)}
          />
          <input
            className="un"
            type="password"
            placeholder="password"
            value={loginPass}
            onChange={e => handleLoginPass(e)}
          />
          <button
            className="submit"
            onClick={() =>
              postLogin().catch(e => {
                setErrorMsg("Login request failed, please try again.");
              })
            }
          >
            Login
          </button>
          <br />
          <p className="forgot" style={{ textAlign: "center" }}>
            Don't have an account?
            <Link to="/">
              <strong>
                <i> Register</i>
              </strong>
            </Link>
          </p>
        </form>
      </div>
    );
  }
}

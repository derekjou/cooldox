import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  // Registration states
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Errors
  const [errorMsg, setErrorMsg] = useState("");

  // Form handlers
  const handleRegUser = event => {
    setRegUser(event.target.value);
  };
  const handleRegPass = event => {
    setRegPass(event.target.value);
  };
  const handleRepeatPass = event => {
    setRepeatPass(event.target.value);
  };

  // Handle Registration
  const submitRegister = e => {
    e.preventDefault();
    if (regUser.length === 0) {
      setErrorMsg("Please enter a valid username");
    } else if (regPass.length < 4) {
      setErrorMsg("Please input a password of at least length 4");
    } else if (regPass !== repeatPass) {
      setErrorMsg("The passwords do not match");
    } else {
      postRegister().catch(event => {
        setErrorMsg("Failed to create user, please try again.");
        console.log(event);
      });
    }
  };

  const postRegister = async () => {
    const response = await fetch("https://cooldox-backend.herokuapp.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: regUser,
        password: regPass
      })
    });
    const content = await response.json();
    if (!content.success) {
      setErrorMsg("Sorry, this user already exists");
    } else {
      setIsRegister(true);
    }
  };

  if (isRegister) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <Navbar />
      <div className="main">
        <p className="sign" style={{ textAlign: "center" }}>
          Register
        </p>
        <p style={{ textAlign: "center", color: "red" }}>{errorMsg}</p>
        <form className="form1">
          <input
            className="un "
            type="text"
            placeholder="username"
            value={regUser}
            onChange={e => handleRegUser(e)}
          />
          <input
            type="password"
            className="un"
            placeholder="password"
            value={regPass}
            onChange={e => handleRegPass(e)}
          />
          <input
            type="password"
            className="un"
            placeholder="verify password"
            value={repeatPass}
            onChange={e => handleRepeatPass(e)}
          />
          <br />
          <button onClick={e => submitRegister(e)} className="submit">
            Submit
          </button>
          <p className="forgot" style={{ textAlign: "center" }}>
            Already have an account?
            <Link to="/login">
              <strong>
                <i> Login</i>
              </strong>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

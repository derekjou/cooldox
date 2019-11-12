import React, { useState } from "react";
import { Redirect } from "react-router-dom";

export default function Navbar() {
  const [errorMsg, setErrorMsg] = useState("");
  const [logoutPress, setLogoutPress] = useState(false);
  // Handle Logout
  const logout = async () => {
    const response = await fetch("http://cooldox-backend.herokuapp.com/logout", {
      method: "GET"
    });
    const content = await response.json();
    console.log(content);
    if (!content.success) {
      setErrorMsg("Logout unsuccessful");
    } else {
      localStorage.clear();
      setLogoutPress(true);
    }
  };

  if (logoutPress) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light" id="register-navbar">
        <div className="navbar-child filler">

        </div>
        <div className="navbar-child logo">
          <a
            href="/"
            className="navbar-brand header-logo navbar-child titleName"
          >
            CoolDo<span className="coolX">X</span>
          </a>
        </div>
        <div className="logout-wrapper navbar-child">
          {localStorage.getItem("token")?<button
            onClick={() =>
              logout().catch(e => {
                setErrorMsg("Logout request failed, please try again.");
              })
            }
            className="submit"
          >
            Logout
          </button>:
        null}
        </div>
      </nav>
    </div>
  );
}

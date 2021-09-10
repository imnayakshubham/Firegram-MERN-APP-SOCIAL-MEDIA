import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "../components/Navbar.css";

function Navbar() {
  const history = useHistory();

  const { state, dispatch } = useContext(UserContext);
  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    dispatch({ type: "LOGOUT" });
    history.push("/signin");
  };
  const renderList = () => {
    if (state) {
      return [
        <div>
          <button className="logoutbtn" onClick={logouthandler}>
            Log out
          </button>
        </div>,
      ];
    } else {
      return [
        <div className="links">
          <div className="registerlink">
            <Link to="/register">Sign Up</Link>
          </div>
          <div className="signinlink">
            <Link to="/signin">Login</Link>
          </div>
        </div>,
      ];
    }
  };
  return (
    <div className="header">
      <div className="header__left">
        <Link to={state ? "/" : "/signin"} className="logo">
          <h5>🔥🔥🔥</h5>
        </Link>
      </div>
      <div className="header__right">{renderList()}</div>
    </div>
  );
}

export default Navbar;

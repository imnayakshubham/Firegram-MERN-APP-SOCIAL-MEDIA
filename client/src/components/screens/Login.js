import React, { useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useHistory } from "react-router-dom";
import "../../App.css";
import M from "materialize-css";

function Login() {
  const { state, dispatch } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [email, setemail] = useState("");
  const history = useHistory();

  const loginhandler = async () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: "Enter Valid Email ",
        classes: "#d50000  red accent-4",
      });
    }
    try {
      fetch("/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            localStorage.setItem("userInfo", JSON.stringify(data));

            dispatch({ type: "USER", payload: data });
            M.toast({
              html: "Signedin success",
              classes: "#43a047 green darken-1",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      M.toast({ html: error, classes: "#d50000 red accent-4" });
    }
  };
  return (
    <div className="logincard">
      <div className="mycard">
        <div className="card auth_card">
          <h2>Login </h2>
          <input
            type="email"
            placeholder="Enter Email here"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            required
          />
          <input
            type="password"
            placeholder="Enter Password here"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button
            className="btn waves-effect waves-light"
            onClick={loginhandler}
          >
            Login
          </button>
          <div class="linkto">
            <p>Don't have an account?</p>
            <Link to="/register">
              <span>Signup</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

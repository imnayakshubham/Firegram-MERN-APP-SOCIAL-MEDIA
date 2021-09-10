import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../App.css";
import M from "materialize-css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setemail] = useState("");
  const history = useHistory();
  const [profileimage, setprofileimage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      fieldsdata();
    }
  }, [url]);
  const uploadPic = () => {
    const data = new FormData();
    data.append("file", profileimage);
    data.append("upload_preset", "firegram");
    data.append("cloud_name", "nayak-shubham");
    fetch("https://api.cloudinary.com/v1_1/nayak-shubham/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fieldsdata = () => {
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
    if (confirmPassword === password) {
      fetch("/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          profilepic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#d50000 red accent-4" });
          } else {
            M.toast({
              html: data.message,
              classes: "#00c853  green accent-4",
            });
            history.push("/signin");
          }
        })
        .catch((error) => {
          M.toast({
            html: error,
            classes: "#d50000  red accent-4",
          });
          console.log(error);
        });
    } else {
      M.toast({
        html: "Password Does not Match",
        classes: "#d50000  red accent-4",
      });
    }
  };
  const usersignupdata = () => {
    if (profileimage) {
      uploadPic();
    } else {
      fieldsdata();
    }
  };

  return (
    <div className="cardcontainer">
      <div className="mycard">
        <div className="card auth_card">
          <h2>Signup Here </h2>
          <input
            type="text"
            placeholder="Enter Username here"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password here"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
          <div className="file-field input-field">
            <div className="btn">
              <span>Upload Profile Picture</span>
              <input
                type="file"
                onChange={(e) => {
                  setprofileimage(e.target.files[0]);
                }}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <center>
            <button className="signupbtn" onClick={usersignupdata}>
              Signup ↔
            </button>
            <div class="linkto">
              <p>Don't have an account?</p>
              <Link to="/signin">
                <span>Login</span>
              </Link>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}

export default Signup;

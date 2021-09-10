import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

function Profile() {
  const [myposts, setmyposts] = useState([]);

  const { state, dispatch } = useContext(UserContext);
  const [profileimage, setprofileimage] = useState("");
  const [url, setUrl] = useState(undefined);

  const token = JSON.parse(localStorage.getItem("userInfo")).token;
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((results) => {
        setmyposts(results.myposts);
      });
  }, []);
  useEffect(() => {
    if (profileimage) {
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
          console.log(data);
          setUrl(data.secure_url);
          localStorage.setItem(
            "UserInfo".JSON.stringify({ ...state, profilepic: data.secure_url })
          );
          dispatch({ type: "UPDATEPROFILEPIC", payload: data.secure_url });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [profileimage]);
  const updateProfilePic = (file) => {
    setprofileimage(file);
  };
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "18px 0px",
          }}
        >
          <div>
            <img
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "80px",
                objectFit: "cover",
              }}
              src={state.profilepic}
              alt={state.username}
            />
          </div>
          <div>
            <h4>{state ? state.username : "loading"}</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h5>{myposts.length} posts</h5>
            </div>
          </div>
        </div>

        <div
          className="file-field input-field"
          style={{ marginLeft: "4.75rem" }}
        >
          <div className="btn #64b5f6 blue darken-1">
            <span>Update Profile Pic</span>
            <input
              type="file"
              onChange={(e) => updateProfilePic(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              style={{ border: "none" }}
            />
          </div>
        </div>
      </div>
      <div className="gallery">
        {myposts.map((item, id) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.pic}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Profile;

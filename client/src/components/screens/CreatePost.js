import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function CreatePost() {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [url, seturl] = useState("");
  const history = useHistory();
  const [curUser, setcurUser] = useState(null);
  useEffect(() => {
    setcurUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "firegram");
    data.append("cloud_name", "nayak-shubham");
    fetch("https://api.cloudinary.com/v1_1/nayak-shubham/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        seturl(data.secure_url);
      })
      .catch((error) => {
        console.log("error--->", error.message);
      });

    fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + curUser.token,
      },
      body: JSON.stringify({
        title,
        body,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d50000 red accent-4" });
        } else {
          M.toast({
            html: "Post Created",
            classes: "#00c853  green accent-4",
          });
          history.push("/");
        }
      })
      .catch((error) => {
        M.toast({
          html: error,
          classes: "#d50000  red accent-4",
        });
        console.log(error);
      });
  };
  return (
    <>
      {curUser ? (
        <div
          className="card input-filled"
          style={{
            margin: "2rem auto",
            maxWidth: "45rem",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="Title Here"
            value={title}
            className="input-filled"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Body Here"
            value={body}
            className="input-filled"
            required
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <div className="file-field input-field">
            <div className="btn">
              <span>Upload File</span>
              <input
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={() => postDetails()}
          >
            Post
          </button>
        </div>
      ) : (
        <h1>PLEASE LOGIN TO POST</h1>
      )}
    </>
  );
}

export default CreatePost;

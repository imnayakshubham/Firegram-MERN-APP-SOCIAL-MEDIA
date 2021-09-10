import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import CreatePost from "./CreatePost";

function Home() {
  const history = useHistory();
  const [token, settoken] = useState();
  const { state, dispatch } = useContext(UserContext);
  const [postData, setpostData] = useState([]);
  const [currentuser, setcurrentuser] = useState(null);
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo"));
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    settoken(token);
    setcurrentuser(currentUser);
    if (token === "null") {
      history.push("/signin");
    }
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setpostData(data.posts);
      })
      .catch((error) => console.log(error));
  }, [postData]);

  const likepost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        postId: id,
      }),
    }).then((result) => {
      const newData = postData.map((item) => {
        if (item._id === result._id) {
          return result;
        } else {
          return item;
        }
      });
      setpostData(newData);
    });
  };
  const dislikepost = (id) => {
    fetch("http://localhost:5000/dislike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = postData.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setpostData(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postid) => {
    fetch(`http://localhost:5000/deletepost/${postid}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result from delete", result);
        const newdata = postData.filter((item) => {
          return item.id !== result._id;
        });
        setpostData(newdata);
      });
    console.log("delete post form frontend", postid);
  };
  // console.log(postData);
  const makecomments = (text, postId) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = postData.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setpostData(newData);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <CreatePost />
      {postData
        .map((item, id) => (
          <div className="home" key={item._id}>
            <div className="card home-card">
              <span className="deletecontainer">
                <h5 className="username">
                  <strong>{item.postedBy.username}</strong>
                </h5>
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </span>
              <div className="card-image ">
                <img src={item.pic} />
              </div>
              <div className="card-content">
                <div className="likescontainer">
                  {item.likes.includes(state._id) ? (
                    <div>
                      <i
                        style={{ Color: "red" }}
                        className="material-icons"
                        onClick={() => dislikepost(item._id)}
                      >
                        favorite
                      </i>
                    </div>
                  ) : (
                    <div>
                      <i
                        className="material-icons"
                        onClick={() => likepost(item._id)}
                      >
                        favorite
                      </i>
                    </div>
                  )}
                </div>
                <span>{item.likes.length} likes </span>

                <h6>{item.title}</h6>

                <p>{item.body}</p>
                <hr></hr>

                {item.comments.map((record) => (
                  <h6 key={record._id}>
                    <span className="commentusername">
                      {record.postedBy.username}
                    </span>
                    {record.text}
                  </h6>
                ))}
                {currentuser ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makecomments(e.target[0].value, item._id);
                    }}
                  >
                    <input type="text" placeholder="Add a comment" />
                  </form>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))
        .reverse()}
    </>
  );
}

export default Home;

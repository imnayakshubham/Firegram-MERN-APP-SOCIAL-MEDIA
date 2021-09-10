const Post = require("../modals/postSchema.js");

const createPost = async (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  const post = await new Post({
    title,
    body,
    pic,
    postedBy: req.user,
  });
  try {
    await post.save();
    res.status(202).json({ message: "post saved successfully" });
  } catch (error) {
    res.status(402).json({ error: error + "Please Try again" });
  }
};
const viewPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("postedBy", "_id username");
    res
      .status(202)
      .json({ message: "all post viewed successfully", posts: posts });
  } catch (error) {
    console.log("error occurred", error);

    res.status(402).json({ error: error });
  }
};

const myPost = async (req, res) => {
  try {
    const myposts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id username"
    );
    res.status(202).json({ message: "my post  ", myposts: myposts });
  } catch (error) {
    res.status(402).json({ error: error });
  }
};

const like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true, //to get new record);
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      // console.log(result);
      res.json(result);
    }
  });
};
const dislike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true, //to get new record);
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

const makecomment = (req, res) => {
  const comments = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  // console.log(comments);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comments },
    },
    {
      new: true, //to get new record);
    }
  )
    .populate("comments.postedBy", "_id username")
    .populate("postedBy", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        // console.log(result);
        res.json(result);
      }
    });
};

const deletepost = (req, res) => {
  // console.log("delete post form backend");
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((error, post) => {
      if (error || !post) {
        return res.status(422).json({ error: error });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => console.log(err));
      }
    });
};
module.exports = {
  createPost,
  viewPost,
  myPost,
  like,
  dislike,
  makecomment,
  deletepost,
};

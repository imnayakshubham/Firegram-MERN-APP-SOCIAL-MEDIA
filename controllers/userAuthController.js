const User = require("../modals/UserSchema.js");
const generateToken = require("../utils/generateToken.js");

// const protected = (req, res) => {
//   res.send("protected route  here");
// };

const register = async (req, res) => {
  const { username, email, password, profilepic } = req.body;
  const usernameistaken = await User.findOne({ username });
  const emailexists = await User.findOne({ email });
  if (!username || !email || !password) {
    return res.status(404).json({ error: "Please Fill all the details" });
  }

  if (usernameistaken) {
    return res.status(400).json({ error: "username is already taken" });
  } else if (emailexists) {
    return res.status(400).json({ error: "email already exists!" });
  } else {
    res
      .status(200)
      .json({ message: "Registration Successfully.Welcome Fam!!" });
  }
  try {
    const user = await new User({
      username,
      email,
      password,
      profilepic: profilepic,
    });
    await user.save();
  } catch (error) {
    res.status(404).json({ error });
  }
};

const login = async (req, res) => {
  // console.log("login running");
  const { email, password, profilepic } = req.body;
  const user = await User.findOne({ email });
  //   console.log(await user.matchPassword(password));
  try {
    if (!email || !password) {
      return res.status(404).json({ error: "Please Fill all the details" });
    }
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        profilepic: user.profilepic,
      });
      res.status(200).json({ message: "User found" });
    } else {
      res.status(422).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    // console.log(error);
    res.status(404).json({ error: "Something went Wrong" });
  }
};
module.exports = { register, login };

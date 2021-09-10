const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./dbconfig/db.js");
const userAuthRoute = require("./routes/userAuthRoute.js");
const userRoute = require("./routes/userRoute.js");
const postRoute = require("./routes/postRoute.js");

// const PORT = ;

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

// const mycustommiddleware = (req, res, next) => {
//   console.log("i am a middleware...");
//   next();
// };
// app.use(mycustommiddleware);

// app.get("/about", mycustommiddleware, (req, res) => {
//   console.log("hello /about");
//   return res.send("hello about");
// });

app.use("/", userAuthRoute);
app.use("/", postRoute);
app.use("/", userRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(process.env.PORT || 5000, () => console.log("hello SERVER"));

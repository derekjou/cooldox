const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const FacebookStrategy = require("passport-facebook");
const TwitterStrategy = require("passport-twitter");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const socket = require("socket.io");
const routes = require("./routes/index");
const auth = require("./routes/auth");
const User = require("./models/User");

let app = express();
const server = require("http").Server(app);
const io = socket(server);

io.on("connection", socket => {
  // here you can start emitting events to the client
  let docId;
  socket.on("docId", id => {
    docId = id;
    console.log("Joined room with docId:", docId);
    socket.join(docId);
  });

  socket.on("change_doc", data => {
    io.to(docId).emit("update_doc", data);
  });

  socket.on("leave", () => {
    console.log("leave room with id:", docId)
    socket.leave(docId)
  })
});

// staticd
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongoDB stuff
const REQUIRED_ENVS = ["MONGODB_URI"];
REQUIRED_ENVS.forEach(function(el) {
  if (!process.env[el]) throw new Error("Missing required env var " + el);
});
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("open", () => console.log(`Connected to MongoDB!`));
mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});

app.get("/", (req, res) => {
  res.send("hello");
});

// passport stuff
app.use(
  session({
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    // name: "Doggos",
    // proxy: true,
    resave: true,
    saveUninitialized: true
  })
);

// function to turn password into hashed password
function hashPassword(password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

// Passport Serialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// Passport Deserialize
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Initialize Passport
passport.use(
  new LocalStrategy(function(username, password, done) {
    const hashedPassword = hashPassword(password);
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        console.log("Incorrect Email");
        done(err);
      } else if (user && user.password === hashedPassword) {
        console.log("User found!");
        done(null, user);
      } else {
        console.log("Incorrect Password");
        done(null, false);
      }
    });
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(auth(passport, hashPassword));
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

server.listen(4000, function() {
  console.log("server is running on port 4000");
});

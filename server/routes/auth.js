const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function(passport, hash) {

  router.post("/register", (req, res) => {
    const newUser = new User({
      username: req.body.username,
      password: hash(req.body.password)
    });
    newUser.save(function(err, result) {
      if (err) {
        res.json({ success: false, error: "Unable to save the user" });
      } else {
        res.json({ success: true, error: "" });
      }
    });
  });

  router.post("/login",
    passport.authenticate("local", {
      successRedirect: "/login/success",
      failureRedirect: "/login/failure"
    })
  );

  router.get("/login/failure", function(req, res) {
    res.status(401).json({
      success: false,
      error: "Incorrect username or password."
    });
  });

  router.get("/login/success", function(req, res) {
    const { username, _id } = req.user;
    const token = jwt.sign({id: _id, username},process.env.SECRET)
    res.json({
      success: true,
      user: { username, _id },
      token,
    });
  });


  // GET Logout page
  router.get("/logout", function(req, res) {
    req.logout();
    res.json({
      success: true,
      error: ""
    });
  });

  router.use((req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Not authorized"
      });
      return;
    }
    next();
  });

  return router;
};

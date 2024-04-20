const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// Define the route for user signup
router.post("/signup", (req, res, next) => {
  // Check if the email already exists
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        // If email exists, return a 409 Conflict status
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        // Hash the password before saving it to the database
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            // If error occurred during hashing, return a 500 Internal Server Error status
            return res.status(500).json({
              error: err
            });
          } else {
            // Create a new user with hashed password
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            // Save the user to the database
            user
              .save()
              .then(result => {
                // If user is successfully saved, return a 201 Created status
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                // If error occurred during saving user, return a 500 Internal Server Error status
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch(err => {
      // Catch any unexpected errors and return a 500 Internal Server Error status
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Define the route for deleting a user by ID
router.delete("/:userId", (req, res, next) => {
  // Find and remove the user from the database by ID
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      // If user is successfully deleted, return a 200 OK status
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      // If error occurred during deletion, return a 500 Internal Server Error status
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

const express = require("express");

const port = 7007;

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

const user = require("./user");

const jwt = require("jsonwebtoken");
mongoose.connect(
  "mongodb://localhost/KYC",
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("KYC is Connected to db");
  }
);

app.use(express.json({ extended: false }));

exports.register = (req, res, next) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((User) => {
      if (User.length >= 1) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        if (req.body.last.charAt(0) == "A") {
          const User = new user({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            first: req.body.first,
            last: req.body.last,
            password: req.body.password,
          });
          User.save()
            .then((result) => {
              console.log(req.body.last.charAt(0));
              console.log(result);
              res.json(User);
              return res.status(201).json({
                message: "Welcome to the Lineysha World",
                url: "http://localhost:8000/user/login",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: err });
            });
        } else {
          return res.status(500).json({
            message: "Sorry you cannot register",
          });
        }
      }
    });
};
exports.listAll = (req, res, next) => {
  user
    .find()
    .select("_id first last")
    .exec()
    .then((User) => {
      const response = {
        count: User.length,
        Users: User.map((use) => {
          return {
            name: use.first + " " + use.last,
            _id: use._id,

            request: {
              type: "GET",
              url: "http://localhost:8000/user/" + use._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.login = (req, res, next) => {
  console.log(req.body.email);
  user
    .find({ email: req.body.email })
    .exec()
    .then((User) => {
      console.log(User);
      if (User.length < 1) {
        return res.status(401).json({
          message: "Login Failed",
        });
      }
      if (User[0].password !== req.body.password) {
        return res.status(401).json({
          message: "Login Failed",
        });
      } else {
        const token = jwt.sign(
          {
            email: User[0].email,
            id: User[0]._id,
          },
          "Lineysha",
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          message: "Login Successfull",
          token: token,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.available = (req, res, next) => {
  user
    .find({ _id: req.params.id })
    .exec()
    .then((User) => {
      if (User.length >= 1) {
        user
          .updateOne({ _id: User[0]._id }, { $push: { date: req.body.date } })
          .exec()
          .then((result) => {
            res.status(200).json({
              message: "Date Updated",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      } else {
        return res.status(404).json({
          message: "User not found",
        });
      }
    });
};

exports.findOne = (req, res, next) => {
  user
    .find({ _id: req.params.id })
    .exec()
    .then((User) => {
      if (!User) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const response = {
        count: User.length,
        Users: User.map((use) => {
          return {
            name: use.first + " " + use.last,
            _id: use._id,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

app.listen(port, () => {
  console.log("KYC server up");
});

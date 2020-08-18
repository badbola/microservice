const express = require("express");

const port = 5555;

const app = express();

const axios = require("axios");

const event = require("./event");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { response } = require("express");

mongoose.connect(
  "mongodb://localhost/Event",
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("Calendar is Connected to db");
  }
);

exports.createEvent = (req, res) => {
  event
    .find({ name: req.body.name })
    .exec()
    .then((Event) => {
      if (Event.length >= 1) {
        return res.status(409).json({
          message: "Event name already exists",
        });
      } else {
        axios
          .get("http://localhost:8000/user/" + req.body.joinee)
          .then((response) => {
            if (response.status == 200) {
              const decoded = jwt.verify(req.headers.authorization, "Lineysha");
              const Event = new event({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                creator: decoded.id,
                joinee: req.body.joinee,
                date: req.body.date,
              });
              Event.save()
                .then((result) => {
                  console.log(result);
                  res.json(Event);
                  return res.status(201).json({
                    message: "Event Created",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
      }
    });
};

app.listen(port, () => {
  console.log("Calendar server up");
});

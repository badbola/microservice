const express = require("express");

const port = 4545;

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb://localhost/KYC",
//   { useUnifiedTopology: true, useNewUrlParser: true },
//   () => {
//     console.log("Connected Identity to db");
//   }
// );

// app.get("/", (req, res) => {
//   res.end("This is the Identity end point");
// });

app.use(express.json({ extended: false }));

app.listen(port, () => {
  console.log("Identity Serever is up");
});

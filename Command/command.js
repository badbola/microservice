const express = require("express");

const port = 8000;

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const kyc = require("../KYC/kyc");

const identity = require("../Identity/identity");

const calendar = require("../Calendar/calendar");

const auth_check = require("../Identity/middleware/authCheck");

// mongoose.connect(
//   "mongodb://localhost/KYC",
//   { useUnifiedTopology: true, useNewUrlParser: true },
//   () => {
//     console.log("Connected Identity to db");
//   }
// );

app.get("/", (req, res) => {
  res.end("This is the Command end point");
});

app.use(express.json({ extended: false }));

app.post("/user/register", kyc.register);
app.post("/user/login", kyc.login);
app.get("/user/list", kyc.listAll);
app.post("/user/date/:id", auth_check, kyc.available);
app.get("/user/:id", kyc.findOne);
app.post("/create", auth_check, calendar.createEvent);

app.listen(port, () => {
  console.log("Command Server is up");
});

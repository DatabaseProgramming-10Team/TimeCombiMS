const express = require("express");
const app = express();
const startTemplate = require("./lib/startTemplate");
const account_router = require("./routes/account_router");
const date_router = require("./routes/date_router");
const date_calculator_router = require("./routes/date_calculator_router");
const friends_router = require("./routes/friends_router");
const port = 80;
const bodyParser = require("body-parser");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use(
  session({
    secret: "account info",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.get("/", function (request, response) {
  if (request.session.email == null) {
    let html = startTemplate.loginHTML();
    response.send(html);
  } else {
    response.redirect(`/date`);
  }
});

app.use("/account", account_router);

app.use("/date", date_router);
app.use("/date_calculator", date_calculator_router);
app.use("/friends", friends_router);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`start ${port}!`);
});

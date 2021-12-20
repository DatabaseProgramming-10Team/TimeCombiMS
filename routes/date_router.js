const express = require("express");
const router = express.Router();
const template = require("../lib/template");
var url = require("url");
const db = require("../lib/db");

var session = require("express-session");
var FileStore = require("session-file-store")(session);
router.use(
  session({
    secret: "account info",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

router.get("/", function (request, response) {
  let email = request.session.email;
  console.log(email);
  let date = new Date();
  let checkDate =
    date.getFullYear() + "" + (date.getMonth() + 1) + date.getDate();
  db.query(
    `SELECT * FROM userTBL WHERE email = '${email}'`,
    function (error, users) {
      let html = template.menu(
        "내 일정",
        template.date(template.datelist()),
        users[0].name
      );
      response.send(html);
    }
  );
});

router.get("/:checkDate", function (request, response) {
  var checkDate = request.params.checkDate;
  var list = [];
  db.query(
    `select * from eventtbl WHERE start_date=?`,
    [checkDate],
    function (error, dates) {
      let html = template.menu(
        "내 일정",
        template.date(template.datelist(checkDate, dates)),
        "홍길동"
      );
      response.send(html);
    }
  );
});

router.get("/:checkDate/schedulelist", function (request, response) {
  var checkDate = request.params.checkDate;
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var list = [];
  db.query(
    `select * from eventtbl WHERE start_date=?`,
    [checkDate],
    function (error, dates) {
      let html = template.datelist(checkDate, dates);
      response.send(html);
    }
  );
});

router.post("/create_process", function (request, response) {
  var ev = request.body;
  console.log(ev);
  var start_time = "";
  var last_time = "";
  var isRepeat = 0;
  var repeat = "";

  if ("종일" in ev) {
    start_time = "00:00";
    last_time = "24:00";
  } else {
    start_time = ev.start_time;
    last_time = ev.last_time;
  }

  if ("월" in ev) repeat += "0,";
  if ("화" in ev) repeat += "1,";
  if ("수" in ev) repeat += "2,";
  if ("목" in ev) repeat += "3,";
  if ("금" in ev) repeat += "4,";
  if ("토" in ev) repeat += "5,";
  if ("일" in ev) repeat += "6,";
  repeat = repeat.slice(0, -1);

  if (repeat.length != 0) {
    isRepeat = 1;
  }

  db.query(
    `INSERT INTO eventTBL(user_email, event_name, start_date, end_date, start_time, end_time, isRepeat, color) VALUES(?, ?, ? ,? ,?, ?, ?, ?)`,
    [
      "minyoung@gmail.com",
      ev.title,
      ev.start_date,
      ev.last_date,
      start_time,
      last_time,
      isRepeat,
      ev.color,
    ],
    function (error1, result) {
      if (error1) {
        throw error1;
      }
      if (isRepeat == 1) {
        db.query("SELECT LAST_INSERT_ID()", function (error2, result) {
          if (error2) {
            throw error2;
          }

          db.query(
            `INSERT INTO repeatEventTBL(event_no, re_day) VALUES( ?, ?)`,
            [result[0]["LAST_INSERT_ID()"], repeat],
            function (error, result) {
              if (error) {
                throw error;
              }
            }
          );
        });
      }
      response.writeHead(302, { Location: `/date` });
      response.end();
    }
  );
});

router.post("/delete_process", function (request, response) {
  db.query(
    `DELETE FROM repeatEventTBL WHERE event_no=?`,
    [parseInt(request.body.id)],
    function (error, result) {
      if (error) {
        throw error;
      }

      db.query(
        `DELETE FROM eventTBL WHERE event_no=?`,
        [parseInt(request.body.id)],
        function (error, result) {
          if (error) {
            throw error;
          }
        }
      );

      response.writeHead(302, { Location: `/date` });
      response.end();
    }
  );
});

module.exports = router;

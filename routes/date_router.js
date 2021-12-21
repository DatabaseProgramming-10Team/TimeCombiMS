const express = require("express");
const router = express.Router();
const template = require("../lib/template");
var url = require("url");
const db = require("../lib/db");

/*var session = require("express-session");
var FileStore = require("session-file-store")(session);
router.use(
  session({
    secret: "account info",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
*/

router.get("/", function (request, response) {
  let email = request.session.email;
  let date = new Date();
  let checkDate =
    date.getFullYear() + "" + (date.getMonth() + 1) + date.getDate();
  db.query(
    `SELECT * FROM userTBL WHERE email = '${email}'`,
    function (error, users) {
      let html = template.menu(
        "내 일정",
        template.date(template.datelist(checkDate)),
        users[0].name
      );
      response.send(html);
    }
  );
});

router.get("/:checkDate", function (request, response) {
  var checkDate = request.params.checkDate;
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var list = [];
  db.query(
    `select * from eventTBL`,
    //[checkDate],
    function (error, dates) {
      //홍길동
      db.query(
        `SELECT * FROM userTBL WHERE email = '${request.session.email}'`,
        function (error, user) {
          if (error) {
            console.log(error);
            throw error;
          }

          let html = template.menu(
            "내 일정",
            template.date(template.datelist(dates)),
            user[0].name
          );
          console.log("데이터1");
          console.log(dates);
          response.send(html);
        }
      );
    }
  );
});
router.get("/:checkDate/schedulelist", function (request, response) {
  var checkDate = request.params.checkDate;
  var list = [];
  db.query(
    `SELECT e.event_no, e.event_name, e.start_date, e.end_date, e.start_time, e.end_time, e.isRepeat, e.color, r.re_day FROM eventTBL as e LEFT JOIN repeatEventTBL as r ON e.event_no = r.event_no WHERE (start_date <= '${checkDate}' and end_date >= '${checkDate}') and user_email = '${request.session.email}';`,
    function (error, dates) {
      for (let i = 0; i < dates.length; i++) {
        if (dates[i].isRepeat == 1) {
          let checkDay = new Date(
            checkDate.slice(0, 4),
            parseInt(checkDate.slice(4, 6)) - 1,
            checkDate.slice(6, 8)
          ).getDay();
          let s = dates[i].re_day.split(",");
          for (let j = 0; j < s.length; j++) {
            if (s[j] * 1 == checkDay) {
              list.push(dates[i]);
            }
          }
        } else {
          list.push(dates[i]);
        }
      }
      let html = template.datelist(list);
      response.send(html);
    }
  );
});

// router.get("/", function (request, response) {
//   let email = request.session.email;
//   console.log(email);
//   let date = new Date();
//   let checkDate =
//     date.getFullYear() + "" + (date.getMonth() + 1) + date.getDate();
//   db.query(
//     `SELECT * FROM userTBL WHERE email = '${email}'`,
//     function (error, users) {
//       let html = template.menu(
//         "내 일정",
//         template.date(template.datelist()),
//         users[0].name
//       );
//       response.send(html);
//     }
//   );
// });

// router.get("/:checkDate", function (request, response) {
//   var checkDate = request.params.checkDate;
//   var list = [];
//   db.query(
//     `select * from eventtbl WHERE start_date=?`,
//     [checkDate],
//     function (error, dates) {
//       let html = template.menu(
//         "내 일정",
//         template.date(template.datelist(checkDate, dates)),
//         "홍길동"
//       );
//       response.send(html);
//     }
//   );
// });

// router.get("/:checkDate/schedulelist", function (request, response) {
//   var checkDate = request.params.checkDate;
//   var _url = request.url;
//   var queryData = url.parse(_url, true).query;
//   var pathname = url.parse(_url, true).pathname;
//   var list = [];
//   db.query(
//     `select * from eventtbl WHERE start_date=?`,
//     [checkDate],
//     function (error, dates) {
//       let html = template.datelist(checkDate, dates);
//       response.send(html);
//     }
//   );
// });

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

  if ("월" in ev) repeat += "1,";
  if ("화" in ev) repeat += "2,";
  if ("수" in ev) repeat += "3,";
  if ("목" in ev) repeat += "4,";
  if ("금" in ev) repeat += "5,";
  if ("토" in ev) repeat += "6,";
  if ("일" in ev) repeat += "0,";
  repeat = repeat.slice(0, -1);

  if (repeat.length != 0) {
    isRepeat = 1;
  }

  db.query(
    `INSERT INTO eventTBL(user_email, event_name, start_date, end_date, start_time, end_time, isRepeat, color) VALUES(?, ?, ? ,? ,?, ?, ?, ?)`,
    [
      request.session.email,
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

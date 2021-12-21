var express = require("express");
var router = express.Router();
var template = require("../lib/template");
var startTemplate = require("../lib/startTemplate");
var mypageTemplate = require("../lib/mypageTemplate");
var qs = require("querystring");
var url = require("url");
const db = require("../lib/db");

router.get("/join", function (request, response) {
  let html = startTemplate.joinHTML();
  response.send(html);
});

router.post("/join_process", function (request, response) {
  let post = request.body;
  let email = post.email;
  let name = post.name;
  let pwd = post.pw;
  let phone = post.phone;

  db.query(
    `INSERT INTO userTBL VALUES ('${email}', '${name}', '${pwd}', '${phone}')`,
    function (error, newUser) {
      if (error) {
        console.log(error);
        throw error;
      }
      let alert = `
        <script>
            alert('회원가입 성공')
            location.href="/"
        </script>
        `;
      response.send(alert);
    }
  );
});

router.post("/login_process", function (request, response) {
  let post = request.body;
  let email = post.email;
  let pwd = post.pw;

  db.query(
    `SELECT * FROM userTBL WHERE email = '${email}' AND pwd = '${pwd}'`,
    function (error, checkUser) {
      if (error) {
        console.log(error);
        throw error;
      }
      if (checkUser[0] != undefined) {
        request.session.email = email;
        request.session.pwd = pwd;
        console.log(
          `email : ${request.session.email}, pwd : ${request.session.pwd}`
        );
        response.redirect(`/date`);
      } else {
        let alert = `
            <script>
                alert('로그인 실패')
                location.href="/"
            </script>
            `;
        response.send(alert);
      }
    }
  );
});

router.get("/logout", function (request, response) {
  request.session.email = null;
  request.session.pwd = null;
  response.redirect(`/`);
});

router.get("/mypage", function (request, response) {
  let email = request.session.email;

  db.query(
    `SELECT * FROM userTBL WHERE email = '${email}'`,
    function (error, user) {
      if (error) {
        console.log(error);
        throw error;
      }

      let html = template.menu(
        "마이페이지",
        mypageTemplate.mypageHTML(user[0]),
        user[0].name
      );

      response.send(html);
    }
  );
});

router.post("/mypageUpdate", function (request, response) {
  let post = request.body;
  let name = post.name;
  let email = post.email;
  let pwd = post.pw;
  let phone = post.phone;

  db.query(
    `UPDATE userTBL 
        SET email = '${email}', name = '${name}', pwd = '${pwd}', phone = '${phone}'
        WHERE email = '${email}'
    `,
    function (error) {
      if (error) {
        console.log(error);
        let alert = `
            <script>
                alert('회원정보 수정 실패')
                location.href="/mypage"
            </script>
            `;
        response.send(alert);
        throw error;
      }
      let alert = `
        <script>
            alert('회원정보 수정 완료')
            location.href="/account/mypage"
        </script>
        `;
      response.send(alert);
    }
  );
});

module.exports = router;

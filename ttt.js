// const offset = new Date().getTimezoneOffset() * 60000;
// let tempDate = new Date(Date.now() - offset);

// let checkDate = "20211218";
// console.log(
//   new Date(
//     checkDate.slice(0, 4),
//     parseInt(checkDate.slice(4, 6)) - 1,
//     checkDate.slice(6, 8)
//   ).getDay()
// );

// console.log("2,3,5,".slice(0, -1).split(","));

// let a = "0",
//   b = "30",
//   c = "12",
//   d = "0";

// let ch = function (n) {
//   return n.length == 1 ? "0" + n : n + "";
// };
// let start_time = ch(ev.start_hour) + ":" + ch(ev.start_minute);
// let last_time = ch(ev.last_hour) + ":" + ch(ev.last_minute);
// console.log(start_time, last_time);

let date = new Date();
let checkDate =
  date.getFullYear() + "" + (date.getMonth() + 1) + date.getDate();

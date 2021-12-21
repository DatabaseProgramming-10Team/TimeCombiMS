const offset = new Date().getTimezoneOffset() * 60000;
let date = new Date();
let tempDate = new Date(Date.now() - offset);
let dateDivs = document.querySelectorAll(".date");
const whatDay = function (day) {
  if (day == 0) return "일";
  else if (day == 1) return "월";
  else if (day == 2) return "화";
  else if (day == 3) return "수";
  else if (day == 4) return "목";
  else if (day == 5) return "금";
  else if (day == 6) return "토";
};

const setDateTime = function (tempDate) {
  //일정 추가 - 날짜 설정
  document.getElementById("start_date").value = tempDate
    .toISOString()
    .substring(0, 10);
  document.getElementById("last_date").value = tempDate
    .toISOString()
    .substring(0, 10);

  //일정 추가 - 시간 설정
  let time = new Date(Date.now() - offset).toISOString().substring(11, 13);
  document.getElementById("start_time").value = time + ":00";
  document.getElementById("last_time").value =
    parseInt(time) + 1 > 9
      ? parseInt(time) + 1 + ":00"
      : "0" + (parseInt(time) + 1) + ":00";
};

var listUpdate = function (value) {
  //선택한 날짜에 따라 일정 변경
  let linkDate = value.toISOString().substring(0, 10).split("-").join("");
  history.pushState(null, null, `/date/${linkDate}`);
  const ajax = new XMLHttpRequest();
  ajax.open("GET", `/date/${linkDate}/schedulelist`, false);
  ajax.send();
  document.querySelector(".schedules").innerHTML = ajax.response;
};
listUpdate(tempDate);

const calendar = function () {
  //년, 월 계산
  const year = date.getFullYear() + "";
  const month = date.getMonth();
  const monthtxt = function () {
    if (month == 0) return "January";
    else if (month == 1) return "February";
    else if (month == 2) return "March";
    else if (month == 3) return "April";
    else if (month == 4) return "May";
    else if (month == 5) return "June";
    else if (month == 6) return "July";
    else if (month == 7) return "August";
    else if (month == 8) return "September";
    else if (month == 9) return "October";
    else if (month == 10) return "November";
    else if (month == 11) return "December";
  };

  //년, 월 출력
  document.querySelector(
    ".year"
  ).textContent = `${year[0]} ${year[1]} ${year[2]} ${year[3]}`;
  document.querySelector(".month").textContent =
    month < 9 ? `0${month + 1}` : month + 1;
  document.querySelector(".monthtxt").textContent = `${monthtxt()}`;

  //달력에 표시되는 다른 달의 날짜 계산
  let prevDate = new Date(year, month, 0).getDate();
  let prevDay = new Date(year, month, 0).getDay();
  let thisDate = new Date(year, month + 1, 0).getDate();
  let thisDay = new Date(year, month + 1, 0).getDay();

  let prevDates = [];
  let thisDates = [...Array(thisDate + 1).keys()].slice(1);
  let nextDates = [];

  if (prevDay !== 6) {
    for (let i = 0; i < prevDay + 1; i++) {
      prevDates.unshift(prevDate - i);
    }
  }

  for (let i = 1; i < 7 - thisDay; i++) {
    nextDates.push(i);
  }

  //날짜 출력
  let dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(thisDate);
  dates.forEach((date, i) => {
    let condition;
    if (i < firstDateIndex) condition = "other prev";
    else if (i >= lastDateIndex + 1) condition = "other next";
    else condition = "this";
    dates[i] = `<div class="date"><p class="${condition}">${date}</p></div>`;
  });

  document.querySelector(".dates").innerHTML = dates.join("");

  const today = new Date();
  if (month === today.getMonth() && year == today.getFullYear()) {
    for (let d of document.querySelectorAll(".this")) {
      if (+d.innerText === today.getDate()) {
        d.parentNode.id = "clickDate";
        listUpdate(tempDate);
        document.querySelector(
          ".today"
        ).innerHTML = `${today.getDate()}일 (${whatDay(today.getDay())})`;
        break;
      }
    }
  } else {
    document.querySelectorAll(".this")[0].parentNode.id = "clickDate";
    let tempDate = new Date(Date.UTC(year, month, 1));
    listUpdate(tempDate);
    document.querySelector(".today").innerHTML = `1일 (${whatDay(
      tempDate.getDay()
    )})`;
  }
  dateDivs = document.querySelectorAll(".date");
  let clickDate = document.getElementById("clickDate");

  dateDivs.forEach((el) =>
    el.addEventListener("click", (event) => {
      if (clickDate != event.currentTarget) {
        event.currentTarget.id = "clickDate";
        clickDate.id = "";
        clickDate = event.currentTarget;
        if (event.currentTarget.childNodes[0].className == "other prev") {
          tempDate = new Date(
            Date.UTC(
              year,
              month - 1,
              event.currentTarget.childNodes[0].innerHTML
            )
          );
        } else if (
          event.currentTarget.childNodes[0].className == "other next"
        ) {
          tempDate = new Date(
            Date.UTC(
              year,
              month + 1,
              event.currentTarget.childNodes[0].innerHTML
            )
          );
        } else {
          tempDate = new Date(
            Date.UTC(year, month, event.currentTarget.childNodes[0].innerHTML)
          );
        }
        listUpdate(tempDate);
        document.querySelector(
          ".today"
        ).innerHTML = `${tempDate.getDate()}일 (${whatDay(tempDate.getDay())})`;
        setDateTime(tempDate);
      }
    })
  );
};

//이전 달 이동
const prevMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  calendar();
  date.setDate(date.getDate() + 1);
  setDateTime(date);
};

//다음 달 이동
const nextMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  calendar();
  date.setDate(date.getDate() + 1);
  setDateTime(date);
};

//달력 생성
calendar();
setDateTime(tempDate);

//일정 추가 - 팝업창 실행 및 종료
let background_blackEl = document.querySelector(".background_black");
let popup_add_dateEl = document.querySelector(".popup_add_date");
background_blackEl.addEventListener("click", function () {
  popup_add_dateEl.style.display = "none";
  background_blackEl.style.display = "none";
  document.querySelector(".main_menu").checked = false;
});

document.querySelector(".cancel").addEventListener("click", function () {
  popup_add_dateEl.style.display = "none";
  background_blackEl.style.display = "none";
});

document.querySelector(".plus_btn").addEventListener("click", function () {
  popup_add_dateEl.style.display = "flex";
  background_blackEl.style.display = "block";
});

//일정 추가 - 종일 버튼 체크 시 비활성화/활성화
let check = document.querySelector(".allday");
let timeEl = document.querySelectorAll(
  ".popup_add_date .time input[type='time']"
);
check.addEventListener("click", (e) => {
  const checked = e.target.checked;
  if (checked) {
    timeEl.forEach((element) => {
      element.disabled = true;
      element.value = "00:00";
    });
  } else {
    timeEl.forEach((element) => {
      element.disabled = false;
    });
  }
});

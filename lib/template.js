module.exports = {
  menu: function (
    heading,
    container,
    userName = "",
    userImage = "default_profile.png"
  ) {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/public/css/reset.css">
  <link rel="stylesheet" href="/public/css/menu.css">
  <link rel="stylesheet" href="/public/css/main.css">
  <link rel="stylesheet" href="/public/css/calendar.css">
  <link rel="stylesheet" href="/public/css/calculator.css">
  <link rel="stylesheet" href="/public/css/friends.css">
  <link rel="stylesheet" href="/public/css/mypage.css">
  <title>${heading} : 타임 콤비</title>
</head>
<body>
  <input type="checkbox" id="menu" class="main_menu">
  <label for="menu">
    <span></span>
    <span></span>
    <span></span>
  </label>
  <div class="background_black"></div>

  <header id="header">
    <div class="logo">
      <img src="/public/images/timecombi_logo.png" alt="타임콤비 로고">
      <h1>타임콤비</h1>
    </div>
    <div class="profile">
      <img src="/public/userImages/${userImage}" alt="${userImage}">
      <div class="name">
        <span class="user_name">${userName}</span>
        <a href="/account/logout" class="logout"></a>
      </div>
    </div>
    <div class="header_menu">
      <ul>
        <li>
          <a href="/date">내 일정</a>
        </li>
        <li>
          <a href="/date_calculator">일정 계산기</a>
        </li>
        <li>
          <a href="/friends">친구</a>
        </li>
        <li>
          <a href="/account/mypage">마이 페이지</a>
        </li>
      </ul>
    </div>
    <div class="copyright">
      <p>ⓒTimeCombi</p>
    </div>
  </header>
  <section>
    <div class="mobile_header">
      <div class="logo">
        <img src="/public/images/timecombi_logo.png" alt="타임콤비 로고">
        <h1>타임콤비</h1>
      </div>
    </div>
    <div class="content">
      <div class="heading">
        ${heading}
      </div>
      <div class="container">
        ${container}
      </div>
    </div>
  </section>
  <script src="/public/js/main.js"></script>
</body>
</html>
    `;
  },
  date: function (datelist = "") {
    return `
    <div class="calendar">
    <div class="title">
      <button class="cal_Lbtn" onclick="prevMonth()">&lt;</button>
      <div class="ym">
        <div class="year"></div>
        <div class="month"></div>
        <div class="monthtxt"></div>
      </div>
      <button class="cal_Rbtn" onclick="nextMonth()">&gt;</button>
    </div>
    <div class="main">
      <div class="days">
        <div class="day">S</div>
        <div class="day">M</div>
        <div class="day">T</div>
        <div class="day">W</div>
        <div class="day">T</div>
        <div class="day">F</div>
        <div class="day">S</div>
      </div>
      <div class="dates">
        
      </div>
    </div>
  </div>
  <div class="diary">
    <span class="today"></span>
    <button class="plus_btn"></button>
    <div class="schedules">
      ${datelist}
    </div>
  </div>

  <div class="popup_add_date">
    <h4>일정</h4>
    <form class="add_date" action="create_process" method="post">
      <fieldset class="name">
        <div class="color_box">
          <input type="radio" id="color1" name="color" value="color1" checked>
          <label for="color1" class="color1" ></label>
          <input type="radio" id="color2" name="color" value="color2">
          <label for="color2" class="color2" ></label>
          <input type="radio" id="color3" name="color" value="color3">
          <label for="color3" class="color3" ></label>
          <input type="radio" id="color4" name="color" value="color4">
          <label for="color4" class="color4" ></label>
        </div>
        <input type="text" name="title" id="title" placeholder="일정 이름 입력">
      </fieldset>
      <fieldset class="diary_date">
        <input type="date" name="start_date" id="start_date"> ~
        <input type="date" name="last_date" id="last_date">
      </fieldset>
      <fieldset class="time">
        <input type="checkbox" id="allday" name="종일" class="allday">
        <label for="allday">종일</label>
        <input type="time" name="start_time" id="start_time"> ~
        <input type="time" name="last_time" id="last_time">
      </fieldset>
      <fieldset class="day">
        <input type="checkbox" id="mon" name="월">
        <label for="mon">월</label>
        <input type="checkbox" id="tue" name="화">
        <label for="tue">화</label>
        <input type="checkbox" id="wed" name="수">
        <label for="wed">수</label>
        <input type="checkbox" id="thu" name="목">
        <label for="thu">목</label>
        <input type="checkbox" id="fri" name="금">
        <label for="fri">금</label>
        <input type="checkbox" id="sat" name="토">
        <label for="sat">토</label>
        <input type="checkbox" id="sun" name="일">
        <label for="sun">일</label>
      </fieldset>
      <fieldset class="add_date_btn">
        <button type="submit">확인</button>
        <button type="button" class="cancel">취소</button>
      </fieldset>
    </form>
    
  </div>
  <div class="popup_add_date update">
    <h4>일정 수정</h4>
    <form class="add_date" action="update_process" method="post">
      <fieldset class="name">
        <div class="color_box">
          <input type="radio" id="color1" name="color" value="color1" checked>
          <label for="color1" class="color1" ></label>
          <input type="radio" id="color2" name="color" value="color2">
          <label for="color2" class="color2" ></label>
          <input type="radio" id="color3" name="color" value="color3">
          <label for="color3" class="color3" ></label>
          <input type="radio" id="color4" name="color" value="color4">
          <label for="color4" class="color4" ></label>
        </div>
        <input type="text" name="" id="" placeholder="일정 이름 입력">
      </fieldset>
      <fieldset class="diary_date">
        <input type="date" name="start_date" id="start_date"> ~
        <input type="date" name="last_date" id="last_date">
      </fieldset>
      <fieldset class="time">
        <input type="checkbox" id="allday" name="종일" class="allday">
        <label for="allday">종일</label>
        <input type="time" name="start_time" id="start_time"> ~
        <input type="time" name="last_time" id="last_time">
      </fieldset>
      <fieldset class="day">
        <input type="checkbox" id="mon" name="월">
        <label for="mon">월</label>
        <input type="checkbox" id="tue" name="화">
        <label for="tue">화</label>
        <input type="checkbox" id="wed" name="수">
        <label for="wed">수</label>
        <input type="checkbox" id="thu" name="목">
        <label for="thu">목</label>
        <input type="checkbox" id="fri" name="금">
        <label for="fri">금</label>
        <input type="checkbox" id="sat" name="토">
        <label for="sat">토</label>
        <input type="checkbox" id="sun" name="일">
        <label for="sun">일</label>
      </fieldset>
      <fieldset class="add_date_btn">
        <button type="submit">확인</button>
        <button type="button" class="cancel_update">취소</button>
      </fieldset>
    </form>
    
  </div>
  <script src="/public/js/calendar.js"></script>
    `;
  },
  datelist: function (dates = []) {
    let list = '<ul class="schedules_list">';
    console.log(
      "시작날짜 : " + dates[i].start_time + ", " + typeof dates[i].start_time
    );
    for (let i = 0; i < dates.length; i++) {
      list += `
        <li>
          <div class="schedule">
            <div class="schedule_color ${dates[i].color}"></div>
            <p class="schedule_time">${dates[i].start_time} ~ ${dates[i].end_time}</p>
            <p class="schedule_info">${dates[i].event_name}</p>
            <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
               <input type="hidden" name="id" value="${dates[i].event_no}">
               <input type="submit" value="" class="schedule_delete">
             </form>
          </div>
          <div class="schedule_underline"></div>
        </li>
      `;
    }
    return list + "</ul>";
  },
};

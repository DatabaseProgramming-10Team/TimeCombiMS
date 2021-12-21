module.exports = {
  calculator: function (friendlist) {
    return `
    <form class="combi_calculator" action="/date_calculator/calculator_process" method="post">
    <fieldset>
      <span class="title">친구 선택</span>
      <div class="friend_list">
        ${friendlist}
      </div>
    </fieldset>
    <fieldset class="choice">
      <div class="title">
        <span>모임 년/월</span>
      </div>
      <div class="organize">
        <input type="month" name="combi_month" id="combi_month" required>
      </div>
    </fieldset>
    <fieldset class="choice">
      <div class="title">
        <span>모임 시간</span>
      </div>
      <div class="organize">
        <div class="start"><input type="number" min="0" max="23" value="0" name="start_hour">시
          <input type="number" min="0" max="30" step="30" value="0" name="start_minute">분</div> ~
        <div class="last">
          <input type="number" min="0" max="23" value="0" name="last_hour">시
        <input type="number" min="0" max="30" step="30" value="0" name="last_minute">분
        </div>
      </div>
    </fieldset>
    <fieldset class="calculator_btn">
      <button type="submit">계산하기</button>
    </fieldset>
  </form>
    `;
  },
  friendlist: function (groups, friends) {
    let list = '<ul class="groups">';
    for (let i = 0; i < groups.length; i++) {
      list += `
      <li>
        <input type="checkbox" name="group" value="${groups[i].g_id}">
        <img src="/public/userImages/default_profile.png" name="group" alt="profile">
        <p>${groups[i].g_name} (${groups[i].cnt})</p>
      </li>
      `;
    }
    list += '</ul> <ul class="friends">';
    for (let i = 0; i < friends.length; i++) {
      list += `
      <li>
        <input type="checkbox" name="friend" value="${friends[i].friend2}">
        <img src="/public/userImages/${friends[i].profile}" alt="${friends[i].profile}">
        <p>${friends[i].name}</p>
      </li>
      `;
    }
    return list + "</ul>";
  },
  result: function (ym, resdate) {
    return `
    <div class="calendar">
    <div class="title">
      
      <div class="ym">
        ${ym}
      </div>
      
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
      <div class="dates">${resdate}</div>
    </div>
  </div>
  <div class="retry">
    <a href="/date_calculator" class="retry_btn">다시하기</a>
  </div>

  `;
  },
  ym: function (dd) {
    let year = dd.slice(0, 4);
    let month = dd.slice(5, 7);
    const monthtxt = function (month) {
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

    return `<div class="year">${
      year[0] + " " + year[1] + " " + year[2] + " " + year[3]
    }</div>
    <div class="month">${month < 10 ? "0" + month : month * 1}</div>
    <div class="monthtxt">${monthtxt(month * 1 - 1)}</div>`;
  },
  resdate: function (dd, yn) {
    let year = dd.slice(0, 4);
    let month = dd.slice(5, 7);

    let prevDate = new Date(year, month - 1, 0).getDate();
    let prevDay = new Date(year, month - 1, 0).getDay();
    let thisDate = new Date(year, month, 0).getDate();
    let thisDay = new Date(year, month, 0).getDay();

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
    let dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(thisDate);
    dates.forEach((date, i) => {
      let condition;
      let rr = "";
      if (i < firstDateIndex) condition = "other prev";
      else if (i >= lastDateIndex + 1) condition = "other next";
      else condition = "this";
      if (condition === "this") {
        if (yn[date - 1] == 1) rr = `<div class="res">⭕</div>`;
        else if (yn[date - 1] == 0) rr = `<div class="res">❌</div>`;
      } else {
        rr = "";
      }
      dates[
        i
      ] = `<div class="date"><p class="${condition}">${date}</p>${rr}</div>`;
    });
    console.log(dates);
    return dates.join("");
  },
};

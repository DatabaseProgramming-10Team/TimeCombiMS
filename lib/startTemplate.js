module.exports = {
  loginHTML: function () {
    return `
        <!DOCTYPE html>
        <html lang="kor">
        <head>
            <title>타임콤비</title>
            <link rel="stylesheet" href="../public/css/login.css">
        </head>
        <body>
                <form method="post"  class="form" action="/account/login_process">        
                    <input type="text" class="email" name="email" placeholder="이메일"><br><br>
                    <input type="password" class="email" name="pw" placeholder="비밀번호"><br><br><br>  
                    <div class="btn">
                        <button class="button" type="submit"><strong>로그인</strong></button>                
                    </div>
                    <a href="/account/join">회원가입</a>      
                </form>
        </body>
        </html>
        `;
  },
  joinHTML: function () {
    return `
      <!DOCTYPE html>
      <html lang="kor">
      <head>
          <title>타임콤비 회원가입</title>
          <link rel="stylesheet" href="../public/css/join.css">
      </head>
      <script>
          function check_pw(){
          var p1 = document.getElementById('pw').value;
          var p2 = document.getElementById('pwCheck').value;
          if(p1.length < 6) {
                  alert('입력한 글자가 6글자 이상이어야 합니다.');
                  p1.focus();
                  return false;
              }
              
              if( p1 != p2 ) {
                  document.getElementById('check').innerHTML="<font color=red>비밀번호가 불일치합니다.</font>"
                  return false;
              } else{
                  document.getElementById('check').innerHTML="<font color=#65a2ff>비밀번호가 일치합니다.</font>"
                  return true;
              }
      }
      </script>
      <body>
          <div class="box">
          <form name="joinform" method="post" action="/account/join_process">   
              <div class="logo">
                  <p><img src="../public/images/timecombi_logo_blue.png"><strong> 회원 가입</strong></p>
              </div>
                  <table>
                  <tr>
                      <th class="name">이름</th>
                      <td><input type="text" placeholder="이름" name="name" class="pwchk"></td>
                  </tr>
                  <tr>
                      <th class="name">이메일</th>
                      <td><input class="pwchk" type="text" name="email" placeholder="이메일"></td>
                  </tr>
                  <tr>
                      <th class="name">비밀번호</th>
                      <td><input class="pwchk" type="password" id="pw" name="pw" onchange="check_pw()" placeholder="비밀번호"></td>
                  </tr>
                  <tr>
                      <th class="name ">비밀번호 확인</th>
                      <td><input class="pwchk" type="password" id="pwCheck" onchange="check_pw()" placeholder="비밀번호 확인"></td>
                      </tr>
                      <tr>
                          <th></th>
                          <th id="check" class="chk">비밀번호가 불일치합니다.</th>
                      </tr>
                      <tr>
                          <th class="name">연락처</th>
                          <td> <input class="pwchk" type="text" name="phone" placeholder="연락처"></td>
                      </tr>
                  </table>
                  <br>
                  <div class="btn">
                      <input class="button"  value= "가입하기" type="submit">   
                  </div>
          </form>
      </div>
      </body>
      </html>
      `;
  },
};

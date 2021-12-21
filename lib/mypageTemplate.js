module.exports = {
  mypageHTML: function (userInfo) {
    return `
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
    
    <div class="box">
        <div class="profile">
            <img src="/public/images/profile.png" alt="프로필 사진">
        </div>
        <form name="mypageform" method="post" action="/account/mypageUpdate">
                <table>
                <tr>
                    <th class="name">이름</th>  
                    <td><input type="text" value="${userInfo.name}" name="name" class="pwchk"></td>
                </tr>
                <tr>
                    <th class="name">이메일</th>
                    <td><input class="pwchk" type="text" name="email" value="${userInfo.email}"></td>
                </tr>
                <tr>
                    <th class="name">비밀번호</th>
                    <td><input class="pwchk" type="password" id="pw" name="pw" onchange="check_pw()" placholder="비밀번호"></td>
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
                        <td> <input class="pwchk" type="text" name="phone" value="${userInfo.phone}"></td>
                    </tr>
                </table>
                <br>
                <div class="btn">
                    <input class="button" value= "수정하기" type="submit">
                </div>
        </form>
    </div>
  `;
  },
};

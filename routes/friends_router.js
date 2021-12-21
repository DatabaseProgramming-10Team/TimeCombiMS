var express = require("express");
var router = express.Router();
var template = require("../lib/template");
var friendsTemplate = require('../lib/friendsTemplate'); 
const db = require("../lib/db");
//var mysql = require("mysql");
var qs = require('querystring'); 
var url = require("url");

/*
const db = mysql.createConnection({
    host: 'localhost', 
    user : 'djeun', 
    password: 'password', 
    database: 'timecombiDB'
});

db.connect();
*/

router.get("/", function (request, response) {
    let email = request.session.email; 
    let name;
    let groupList = ''; 
    let friendsList = ''; 
    
    db.query(`SELECT u.name, f.friend2 FROM userTBL AS u JOIN friendTBL AS f ON f.friend2 = u.email 
    WHERE f.friend1 = '${email}'`, function(error, friend){
        if(error){
            console.log(error); 
            throw error;
        }
        for(let i = 0; i < friend.length; i++) {
            friendsList += friendsTemplate.friendsList(friend[i].friend2, friend[i].name);
        }

        db.query(`SELECT * FROM groupTBL WHERE g_owner = '${email}'`, function(error, group){
            if(error){
                console.log(error); 
                throw error;
            }
            for(let i = 0; i < group.length; i++) groupList += friendsTemplate.groupList(group[i].g_id, group[i].g_name);
        
            db.query(`SELECT * FROM userTBL WHERE email = '${email}'`, function(error, user){
                if(error){
                    console.log(error); 
                    throw error;
                }
                let html = friendsTemplate.menu(
                    "친구", 
                    friendsTemplate.friendsMain(groupList, friendsList), 
                    user[0].name                
                ); 
                response.send(html); 
            })
        })
    })
});

router.post("/findFriends", function(request, response){
    let email = request.session.email;
    let f_email = request.body.email;
    let friendsList = ''; 

    db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
        db.query(`SELECT * FROM userTBL WHERE email='${f_email}'`, function(error, f){
            for(let i = 0; i < user.length; i++){
                friendsList += friendsTemplate.friendsList(f_email, f[i].name);
            }
            let html = friendsTemplate.menu(
                "친구", 
                friendsTemplate.addFriend(friendsList), 
                user[0].name
            );     
            response.send(html); 
        });
    });         
});

router.get("/addFriends", function(request, response){
    let email = request.session.email; 

    db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
        let html = friendsTemplate.menu(
            "친구", 
            friendsTemplate.addFriend(''), 
            user[0].name
        ); 
        response.send(html); 
    });
})

router.post("/reqFriends", function(request, response){
    let reqSender = request.session.email;
    let reqReceiver = request.body;

    db.query(`INSERT INTO addFriendTBL VALUES('${reqSender}', '${reqReceiver.friend}')`, function(error, ){
        if(error){
            console.log(error); 
            let alert = `
            <script>
                alert('친구신청 실패!'); 
                location.href="/friends"
            </script>
            `; 
            response.send(alert); 
        }else{
            let alert = `
            <script>
                alert('친구신청 성공'); 
                location.href="/friends"
            </script>
            `; 
            response.send(alert); 
        }
    })   
})
router.get("/addGroup", function(request, response){
    let email = request.session.email;
    //let f_email = request.body.email;
    let friendsList = ''; 

    db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
        db.query(`SELECT u.name, f.friend2 FROM userTBL AS u JOIN friendTBL AS f ON f.friend2 = u.email 
        WHERE f.friend1 = '${email}'`, function(error, friend){
            if(error){
                console.log(error); 
                throw error;
            }
            for(let i = 0; i < friend.length; i++) {
                friendsList += friendsTemplate.friendsList(friend[i].friend2, friend[i].name);
            }
            let html = friendsTemplate.menu(
                "그룹 추가", 
                friendsTemplate.addGroup(friendsList), 
                user[0].name                
            ); 
            response.send(html); 
        })
    })    
})

router.post("/addGroup_process", function(request, response){
    let g_owner = request.session.email;
    let g_member = request.body.friend;
    let g_name = request.body.name;

    if(g_member == undefined){
        let alert = `
        <script>
            alert('선택된 항목이 없습니다!'); 
            location.href="/friends"
        </script>
        `; 
        response.send(alert); 
    }else if(Array.isArray(g_member)){
        db.query(`INSERT INTO groupTBL(g_owner, g_name) VALUES('${g_owner}', '${g_name}')`, function(error1, ){
            if(error1){
                console.log(error1); 
                throw error1;
            }
            db.query(`SELECT LAST_INSERT_ID()`, function(error2, result){
                if(error2){
                    console.log(error2); 
                    throw error2;
                }
                for(let i = 0; i < g_member.length; i++){
                    db.query(`INSERT INTO memberTBL(m_id, m_email) VALUES(?, ?)`, [result[0]["LAST_INSERT_ID()"], g_member[i]], function(error3, ){
                        if(error3){
                            console.log(error3); 
                            throw error3;
                        }
                    })
                }
            })
        })
    }else{
        db.query(`INSERT INTO groupTBL(g_owner, g_name) VALUES('${g_owner}', '${g_name}')`, function(error1, ){
            if(error1){
                console.log(error1); 
                throw error1;
            }
            db.query(`SELECT LAST_INSERT_ID()`, function(error2, result){
                if(error2){
                    console.log(error2); 
                    throw error2;
                }
                db.query(`INSERT INTO memberTBL(m_id, m_email) VALUES(?, ?)`, [result[0]["LAST_INSERT_ID()"], g_member], function(error3, ){
                    if(error3){
                        console.log(error3); 
                        throw error3;
                    }
                })
            })
        })
    }    
    let alert = `
    <script>
        alert('그룹추가 성공'); 
        location.href="/friends"
    </script>
    `; 
    response.send(alert); 
})


router.post('/delSelected', function(request, response){
    let email = request.session.email;
    let g_id = request.body.group;
    let f_email = request.body.friend;

    if(g_id == undefined && f_email == undefined){
        let alert = `
        <script>
            alert('선택된 항목이 없습니다!'); 
            location.href="/friends"
        </script>
        `
        response.send(alert); 
    }else{
        if(Array.isArray(g_id)){
            for(let i = 0; i < g_id.length; i++){
                db.query(`DELETE FROM memberTBL WHERE m_id=${g_id[i]}`, function(error, ){
                    if(error){
                        console.log(error); 
                        throw error;
                    }
                    db.query(`DELETE FROM groupTBL WHERE g_id = ${g_id[i]}`, function(error, ){
                        if(error){
                            console.log(error); 
                            throw error;
                        }
                    })
                })
            }
        }else if(g_id != undefined){
            db.query(`DELETE FROM memberTBL WHERE m_id = ${g_id}`, function(error, ){
                if(error){
                    console.log(error); 
                    throw error;
                }
                db.query(`DELETE FROM groupTBL WHERE g_id = ${g_id}`, function(error, ){
                if(error){
                        console.log(error); 
                        throw error;
                    }
                })
            })
        }

        if(Array.isArray(f_email)){
            for(let i = 0; i < f_email.length; i++){
                db.query(`DELETE FROM memberTBL WHERE m_email='${f_email[i]}'`, function(error, ){
                    if(error) {
                        console.log(error); 
                        throw error;
                    };

                    db.query(`DELETE FROM friendTBL WHERE (friend1 = '${email}' AND friend2 = '${f_email[i]}') OR
                    (friend1 = '${f_email[i]}' AND friend2 = '${email}')`, function(error, result){
                        if(error) {
                            console.log(error); 
                            throw error;
                        }
                    })
                })            
            }        
        }else if(f_email != undefined){
            db.query(`DELETE FROM memberTBL WHERE m_email='${f_email}'`, function(error, ){
                if(error) {
                    console.log(error); 
                    throw error;
                };

                db.query(`DELETE FROM friendTBL WHERE (friend1 = '${email}' AND friend2 = '${f_email}') OR
                (friend1 = '${f_email}' AND friend2 = '${email}')`, function(error, result){
                    if(error) {
                        console.log(error); 
                        throw error;
                    }
                })
            })
        }
        let alert = `
        <script>
            alert('선택삭제 성공'); 
            location.href="/friends"
        </script>
        `;
        response.send(alert); 
    }   
});

//보낸 친구요청 조회
router.get("/sentReq", function(request, response){
    let email = request.session.email;
    let sentReqList = ''; 

    db.query(`SELECT af.user1, af.user2, u.name from addFriendTBL AS af JOIN userTBL As u ON u.email=af.user2
    WHERE af.user1='${email}'`, function(error, sentReq){
        for(let i = 0; i < sentReq.length; i++){
            sentReqList += friendsTemplate.friendsList(sentReq[i].user2, sentReq[i].name);
        }
        db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
            let html = friendsTemplate.menu(
                "보낸 친구요청", 
                friendsTemplate.sentReq(sentReqList), 
                user[0].name    
            ); 
            response.send(html); 
        })  
    })
})

//받은 친구요청 조회 
router.get("/receivedReq", function(request, response){
    let email = request.session.email;
    let receivedReqList = ''; 
    
    db.query(`SELECT af.user1, af.user2, u.name from addFriendTBL AS af JOIN userTBL As u ON u.email=af.user1
    WHERE af.user2='${email}'`, function(error, receivedReq){
        for(let i = 0; i < receivedReq.length; i++){
            receivedReqList += friendsTemplate.friendsList(receivedReq[i].user1, receivedReq[i].name);
        }
        db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
            let html = friendsTemplate.menu(
                "받은 친구요청", 
                friendsTemplate.receivedReq(receivedReqList), 
                user[0].name    
            ); 
            response.send(html); 
        })  
    })
    
})

//보낸 친구요청 취소
router.post("/cancelReq", function(request, response){
    let email = request.session.email;
    let f_email = request.body.friend;

    if(Array.isArray(f_email)){
        for(let i = 0; i < f_email.length; i++){
            db.query(`DELETE FROM addFriendTBL WHERE user1='${email}' AND user2='${f_email[i]}'`, function(error, ){
                if(error) {
                    console.log(error)
                    throw error;
                }
            })
        }
        let alert = `
        <script>
            alert('친구요청 취소 완료'); 
            location.href="/friends/sentReq"
        </script>
        `;
        response.send(alert);    
    }else {
        db.query(`DELETE FROM addFriendTBL WHERE user1='${email}' AND user2='${f_email}'`, function(error, ){
            if(error){
                console.log(error); 
                throw error;
            }
            let alert = `
            <script>
                alert('친구요청 취소 완료'); 
                location.href="/friends/sentReq"
            </script>
            `;
            response.send(alert);  
        })
    }     
});

//받은 친구요청 승인(승인버튼1개만 있을때)
router.post("/confirmReq", function(request, response){
    let email = request.session.email;
    let f_email = request.body.friend;

    if(Array.isArray(f_email)){
        for(let i = 0; i < f_email.length; i++){
            db.query(`INSERT INTO friendTBL(friend1, friend2) VALUES('${f_email[i]}', '${email}')`, function(error, ){
                if(error){
                    console.log(error); 
                    throw error;
                }
                db.query(`INSERT INTO friendTBL(friend1, friend2) VALUES('${email}', '${f_email[i]}')`, function(error, ){
                    if(error){
                        console.log(error); 
                        throw error;
                    }
                    db.query(`DELETE FROM addFriendTBL WHERE user1='${f_email[i]}' AND user2='${email}'`, function(error, ){
                        if(error) {
                            console.log(error); 
                            throw error;
                        }

                    });
                });
            });
        }
        let alert = `
        <script>
            alert('친구요청 승인 완료'); 
            location.href="/friends/receivedReq"
        </script>
        `;
        response.send(alert); 
    }else{
        db.query(`INSERT INTO friendTBL(friend1, friend2) VALUES('${f_email}', '${email}')`, function(error, ){
            if(error){
                console.log(error); 
                throw error;
            }
            db.query(`INSERT INTO friendTBL(friend1, friend2) VALUES('${email}', '${f_email}')`, function(error, ){
                if(error){
                    console.log(error); 
                    throw error;
                }
                db.query(`DELETE FROM addFriendTBL WHERE user1='${f_email}' AND user2='${email}'`, function(error, ){
                    if(error) {
                        console.log(error); 
                        throw error;
                    }
                    let alert = `
                    <script>
                        alert('친구요청 승인 완료'); 
                        location.href="/friends/receivedReq"
                    </script>
                    `;
                    response.send(alert); 
                });
            });
        });
    }   
})

//받은 친구요청 처리(승인, 거절버튼 모두 있을때)
/*router.post("/req_process", function(request, response){
    let email = request.session.email;
    let f_email = request.body.friend;
    let process = request.body.process;

    if(process == '승인'){
        db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
            if(error) throw error;
            for(let i = 0; i < f_email.length; i++){
                db.query(`SELECT * FROM addFriendTBL WHERE user1='${f_email}' AND user2='${email}'`, function(error, result){
                    if(error) throw error;
    
                    db.query(`INSERT INTO friendTBL VALUES('${f_email}', '${email}'), ('${email}', '${f_email}')`, function(error, ){
                        if(error) throw error;
    
                        db.query(`DELETE * FROM addFriendTBL WHERE user1='${f_email}' AND user2='${email}'`, function(error, ){
                            if(error) throw error;
                        })
                    })
                })
            }        
            let alert = `
            <script>
                alert('친구요청 승인 완료'); 
                location.href="/friends/receivedReq"
            </script>
            `;
            response.send(alert);   
        })
    }
    else if(process = '거절'){
        db.query(`SELECT * FROM userTBL WHERE email='${email}'`, function(error, user){
            if(error) throw error;
            for(let i = 0; i < f_email.length; i++){
                db.query(`DELETE FROM addFriendTBL WHERE user1='${f_email[i]}' AND user2='${email}'`, function(error, ){
                    if(error) throw error;
                })
            }
            let alert = `
            <script>
                alert('친구요청 거절 완료'); 
                location.href="/friends/sentReq"
            </script>
            `;
            response.send(alert);
        })    
    }
})
*/

module.exports = router;

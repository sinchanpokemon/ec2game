const path=require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const server = require('socket.io')(http, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

app.use(express.static(path.join(__dirname,'client/build')))
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

var deleteMe = function(arr, me) {
    var i = arr.length;
    while (i--)
        if (arr[i].userid === me) arr.splice(i, 1);

    console.log(arr);
}

const avail = [];
const bussy = [];

var calculate = (score) => {

    if (score.userscore == score.opponentscore) {
        return 0;
    } else if (score.userscore > score.opponentscore) {
        return 1;
    } else {
        return -1;
    }
}





server.on('connection', function(socket) {
    var random = [];
    var opponent = '';
    var room = '';
    var win = false;
    var user = "";
    var result = [];
    var searchflag = "";
    var round = 0;
    // var shuffleflag = 0;
    var scorelog = [];
    var score = {
        userscore: "",
        opponentscore: "",
    }
    var userscore = [];
    var opponentscore = [];



    var tie = false;

    console.log("connected !");
    socket.on("toconnect", function(data) {
        avail.push(socket.id);
    })



    socket.on("send", function(data) {
        avail.map(id => {
            if (socket.id !== id.userid && id.userid !== "") {
                console.log("okkokoo")
                console.log(id);
                socket.broadcast.to(id.userid).emit("hello", "Hello");
            }
        });
    })


    socket.on("connectTo", function(data) {
        var flag = 1;
        searchflag = data;
        userid = socket.id;
        if (avail.length !== 0) {
            avail.map(id => {
                if (socket.id !== id && id !== "" && id.searchflag) {
                    avail.push({
                        "userid": userid,
                        "searchflag": searchflag
                    });

                    console.log(avail);
                }
            });
        } else {

            avail.push({
                "userid": userid,
                "searchflag": searchflag
            });

            console.log(avail);
        }

        while (flag != 0) {
            console.log("Actual Processing !");
            if (avail.length !== 0) {
                avail.map(id => {
                    if (socket.id !== id.userid && id.userid !== "" && id.searchflag === searchflag) {
                        random.push(id)
                    }
                })
            }

            console.log("Random Array");
            console.log(random);

            if (random.length > 0) {
                var rand = random[Math.floor(Math.random() * random.length)];
                opponent = rand;
                deleteMe(avail, rand.userid);
                bussy.push(rand);
                deleteMe(avail, socket.id);
                bussy.push({
                    "userid": userid,
                    "searchflag": searchflag
                });
                room = opponent.userid + "room";
                console.log(opponent);

                socket.join(room, () => {
                    console.log("! First Room" + room);
                })

                socket.broadcast.to(opponent.userid).emit("confirm", { "room": room, "opponent": userid, "searchflag": searchflag });
                deleteMe(random, opponent.userid);
            }
            flag = 0;
        }
        flag = 1;
    });


    function timer(socket, room) {
        socket.on("stopinterval", function(data) {
            console.log("interval 1")
            clearInterval(x);
        })

        var t = 0;
        var x = setInterval(function() {
            socket.emit("currenttime", { "time": t });
            socket.broadcast.to(room).emit("currenttime", { "time": t });

            if (t == 30) {
                clearInterval(x);
                socket.emit("userscore", "score");
                // socket.broadcast.to(room).emit("userscore", "score");
            }
            t = t + 1;
        }, 1000);
    }




    socket.on("joinconfirm", function(data) {
        room = data.room;
        opponent = data.opponent
        socket.join(room, () => {
            console.log("Confirmation Successful !");
        });
        server.in(room).emit('start', round);
    });

    socket.on("leave", function(data) {
        server.in(room).emit('leave opponent', 'leave');
    })


    socket.on("leave opponent", function(data) {
        socket.emit("stop_timer", "stop");
        socket.leave(room);
        deleteMe(bussy, socket.id);
        opponent = "";
        room = '';
        console.log("Available----------------");
        console.log(avail);
        console.log("Bussy-----------------------");
        console.log(bussy);
        console.log("Random------------------------");
        console.log(random);
    });


    socket.on("timerstart", function(data) {
        if (room !== "") {
            shuffleflag = 0;
            timer(socket, room);
        }
    });

    socket.on("message", (data) => {
        socket.broadcast.to(room).emit("message", data);
    });

    socket.on('victory', function(data) {
        socket.emit("result", "win");
    });


    socket.on("show", function(data) {
        console.log("---- Available ----");
        console.log(avail);
        console.log("---- Bussy ----");
        console.log(bussy);
        console.log("---- Random ----");
        console.log(random);
        console.log("-----------------------------------------------------------------------");
        console.log(server.sockets.adapter.rooms);
    });

    // socket.on("toss", (data) => {
    //     console.log("okkooko");
    //     const rand = Math.floor(Math.random() * 10);
    //     console.log(rand)
    //     if (rand >= 0 && rand <= 5) {
    //         console.log('head');
    //         socket.broadcast.to(`${opponent}`).emit("toss", "H");
    //         socket.broadcast.to(`${opponent}`).emit("block", "W");
    //         socket.emit("toss", "H");
    //         socket.emit("block", "C");
    //     } else {
    //         console.log('tails');
    //         socket.broadcast.to(`${opponent}`).emit("toss", "T");
    //         socket.broadcast.to(`${opponent}`).emit("block", "C");
    //         socket.emit("toss", "T");
    //         socket.emit("block", "W");
    //     }
    // });

    // testing Hello message
    socket.on("hello", function(data) {
        console.log(data);
        socket.emit("hello", "hello");
    })

    // scoring plan

    socket.on("opponent score", function(data) {
        score.opponentscore = data;
        // console.log("userscore" + score.userscore);
        if (score.userscore != "") {


            scorelog.push((score.userscore, score.opponentscore));
            userscore.push(score.userscore);
            opponentscore.push(score.opponentscore);
            console.log("Early");
            // console.log("opponent score 1")
            var score_result = calculate(score);
            if (score_result == 0) {
                result.push("T");
                socket.emit("result", "T");

            } else if (score_result == 1) {
                result.push("W");
                socket.emit("result", "W");
            } else {
                result.push("L");
                socket.emit("result", "L");
            }

            round = round + 1;
            shuffleflag = shuffleflag + 1;

            // console.log("shuffle flag" + shuffleflag)

            // // socket.emit("result", "P");


            // console.log("early round-----------------------")
            if (round < 2) {
                console.log("complete");
                if (shuffleflag == 2) {

                    socket.emit("scorelog", score);
                    socket.broadcast.to(room).emit("opponent scorelog", "scorelog");
                    console.log(scorelog);
                    score.opponentscore = "";
                    score.userscore = "";

                    setTimeout(() => {
                        server.in(room).emit("start", round);
                    }, 3000);

                    // console.log("round" + round)
                }
            } else {
                socket.emit("finish", { userscore, opponentscore });
                console.log("---------------------------------------------------------------------------")
            }
        } else {
            console.log("late")
                // socket.broadcast.to(room).emit("shuffleflag", "shuffle");
            socket.emit("latescore", "latescore")
        }

    })

    socket.on("userscore", function(data) {
        console.log("------------------------------------------------- Round" + round + "----------------------------------------")
        console.log("userscore 1")
            // console.log("score" + data);

        score.userscore = data;
        socket.broadcast.to(room).emit("opponent score", data);
    })

    socket.on("latescore", function(data) {
        score.userscore = data;
        // console.log(score.opponentscore);
        if (score.opponentscore != "" || score.opponentscore == 0) {
            userscore.push(score.userscore);
            opponentscore.push(score.opponentscore);
            // console.log("opponent score 1")
            var score_result = calculate(score);
            if (score_result == 0) {
                result.push("T");
                socket.emit("result", "T");
            } else if (score_result == 1) {
                result.push("W");
                socket.emit("result", "W");
            } else {
                result.push("L");
                socket.emit("result", "L");
            }
            shuffleflag = shuffleflag + 1;

            round = round + 1;
            // console.log("shuffle flag" + shuffleflag)


            // console.log("round " + round);
            console.log("late round -------------------")
                // console.log("round" + round);
            if (round < 2) {
                if (shuffleflag == 2) {

                    socket.emit("scorelog", score);
                    socket.broadcast.to(room).emit("opponent scorelog", "scorelog");
                    console.log(scorelog);

                    setTimeout(() => {
                        server.in(room).emit("start", round);
                    }, 3000);

                }
            } else {

                socket.emit("finish", { userscore, opponentscore });
            }
        } else {
            // console.log("opponent score" + " " + score.opponentscore);
        }
    })

    // socket.on("collision", function(data) {
    //     if (data == round) {
    //         console.log("Round matched");
    //         if (shuffleflag == 1) {
    //             server.in(room).emit("start", "time");
    //         }
    //     } else {
    //         round = round + 1;
    //         if (shuffleflag == 1) {
    //             server.in(room).emit("start", "time");
    //         }
    //     }
    // });

    // scoring plan end

    socket.on("win", function(data) {
        server.in(room).emit("stopinterval", "emit");
        result.push("W");
        console.log(result)
        round = round + 1;
        socket.emit("result", "W")
        socket.broadcast.to(room).emit("lost", "lost");
    })

    socket.on("lost", function(data) {
        result.push("L");
        socket.emit("result", "L")
        round = round + 1;
        console.log(round);
        console.log(result)
        if (round < 2) {

            server.in(room).emit("round", round);
            setTimeout(() => {
                server.in(room).emit("start", round);
            }, 3000);
        } else {

            server.in(room).emit("finish", scorelog);
        }
    })

    socket.on("shuffleflag", function(data) {
        // console.log("shuffle flag incremented")
        shuffleflag = shuffleflag + 1;
    });

    socket.on("scorelog", function(data) {
        socket.emit("scorelog", score);
    })

})


http.listen(5000, () => {
    console.log(`Server running on 5000`);
});
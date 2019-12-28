const socket = io.connect();
var flag = "";


$(document).ready(function() {
    // $("#submit").on('click', (e) => {
    //     e.preventDefault();
    //     const data = $("#input").val();
    //     socket.emit("message", data);
    // })

    // socket.on("message", function(data) {
    //     console.log("Reciever" + data)
    //     $("#chatblock").append(data);
    // });

    // socket.on("hello", function(data) {
    //     console.log("Reciever" + data)
    //     $("#chatblock").append(data);
    // });

    $("#send").on("click", function() {
        socket.emit("send", "data");
    });

    $("#toconnect").on("click", function() {
        socket.emit("toconnect", "data");
    });

    $("#connect").on("click", () => {
        console.log("Connected To Server !");
        $("#choice").show();

    })

    $("#start").on("click", () => {
        socket.emit("show", "show");
    });

    socket.on("showOpponent", function(data) {
        socket.emit("showOpponent", "show");
    });
    socket.on("confirm", function(data) {
            console.log("Confirmation Details" + data);
            socket.emit("joinconfirm", data);
        })
        // socket.on("timeout", function(data) {
        //     $("#timingBox").hide();
        //     $("#puzzle_game").hide();
        //     $("#toss").show();
        // })

    // leave player  from connected room
    $("#leave").on('click', function() {
        var result = confirm("Do You want To leave !");
        if (result === true) {
            socket.emit("leave", 'leave');
        }
    })

    socket.on("leave opponent", function(data) {
        socket.emit('leave opponent', 'leave');
    })

    //----leave room end 

    // --- start timmer
    socket.on("start", function(data) {
        socket.emit("timerstart", "start");
        reset(data);
        shuffle();
    });
    // --- start timmer end


    socket.on("alive", function(data) {
        $("#alive").append(data);
    })

    socket.on("currenttime", function(time) {
        document.querySelector("#timer").innerHTML = "Time :" + time.time;
    });

    socket.on("countdown", function(data) {
        document.querySelector("#countdown").innerHTML = data;
    });

    socket.on("result", function(data) {
        console.log(data)
            // result(data)
        $("#result").append(data);
    })

    socket.on("round", async function(data) {
        await reset(data);

        var x = document.querySelectorAll(".tile1, .tile2, .tile3, .tile4, .tile5, .tile6, .tile7, .tile8");

        // var i;
        // for (i = 0; i < x.length; i++) {
        //     x[i].style.backgroundImage = "url(" + imagepath + ")";
        //     console.log(x[i]);
        // }

        // $(".tile1").css("background", "url(" + imageurl + ")")
    })

    // socket.on("lost", function(data) {
    //     socket.emit("lost", "L")
    // })
    socket.on("shuffle", function(data) {
        shuffle()
    })
    $('#toss').on('click', function() {
        socket.emit('toss', "tossed");
    })
    socket.on("toss", function(result) {
        console.log(result);
        document.querySelector("#result").innerHTML = result;
    });
    socket.on("block", function(result) {
        console.log(result);
        if (result === "C") {
            $("#toss").attr("disabled", false);
        } else if (result === "W") {
            $("#toss").attr("disabled", true);
        }
    });
    socket.on("roundchange", function(data) {
        socket.emit("roundchange", "w");
    });
    socket.on("shuffle", function() {
        shuffle();
    });
    socket.on("stop_timer", function(data) {
        socket.emit("stop_timer", "stop");
    });


    socket.on("tie", function(data) {
        socket.emit("userscore", "score");
    })

    // socket.on("score", function(data) {
    //     setTimeout(function() {
    //         socket.emit("score", "score");
    //     }, 100);

    // })

    // new 30s stratergy
    socket.on("opponent score", function(data) {
        socket.emit("opponent score", data)
    })
    socket.on("userscore", function(data) {
        const count = Tie();
        socket.emit("userscore", count);
    })

    socket.on("latescore", function(data) {
        const count = Tie();
        socket.emit("latescore", count);
    })

    socket.on("hello", function() {
        console.log("hello");
    });

    socket.on("lost", function(data) {
        socket.emit("lost", "lost");
    })
    socket.on("stopinterval", function() {
        socket.emit("stopinterval", "emit");
    });

    // socket.on("collision", function(data) {
    //     socket.emit("collision", data);
    // })

    socket.on("shuffleflag", function(data) {
        socket.emit("shuffleflag", "flag");
    });
    // 30s stratrgy end


    socket.on("finish", function(data) {
        console.log(data);

        setTimeout(function() {
            $('#timingBox').hide();
            $('#choice').hide();
            $('#puzzle_game').hide();
            $('#controlpanel').hide();
            socket.emit("leave", "leave");
        }, 1000);

    })

    socket.on("scorelog", function(data) {
        console.log(data);
    })

    socket.on("opponent scorelog", function(data) {
        socket.emit("scorelog", "score");
    })

});


function changecolor(color) {
    console.log("okokoo");
    const colorchnage = document.querySelector(".overlay");
    colorchnage.style.color = color;
}

function getvalue(_value) {
    if (_value != null) {
        socket.emit("connectTo", _value);
        $("#choice").hide(1000);
    }
}

function result(data) {

    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        $("#result").append(data);
    }
}

function Tie() {
    var A = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]

    count = 9;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var x = document.querySelector(`#cell${i+1}${j+1}`).getAttribute("class");
            if (`tile${A[i][j]}` != x) {
                count--;
            }
        }
    }
    return count;
}

function swapTiles(cell1, cell2) {
    var temp = document.getElementById(cell1).className;
    document.getElementById(cell1).className = document.getElementById(cell2).className;
    document.getElementById(cell2).className = temp;

}

function shuffle() {
    //Use nested loops to access each cell of the 3x3 grid
    for (var row = 1; row <= 3; row++) { //For each row of the 3x3 grid
        for (var column = 1; column <= 3; column++) { //For each column in this row
            var row2 = Math.floor(Math.random() * 3 + 1); //Pick a random row from 1 to 3
            var column2 = Math.floor(Math.random() * 3 + 1); //Pick a random column from 1 to 3
            swapTiles("cell" + row + column, "cell" + row2 + column2); //Swap the look & feel of both cells
        }
    }
}

function checkvictory() {
    var A = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var x = document.querySelector(`#cell${i+1}${j+1}`).getAttribute("class");
            if (`tile${A[i][j]}` != x) {
                return;
            }
        }
    }
    socket.emit("win", "win");
}



function clickTile(row, column) {
    var cell = document.getElementById("cell" + row + column);
    var tile = cell.className;
    var moves = 0;
    if (tile != "tile9") {
        //Checking if white tile on the right
        if (column < 3) {
            if (document.getElementById("cell" + row + (column + 1)).className == "tile9") {
                swapTiles("cell" + row + column, "cell" + row + (column + 1));
                moves = moves + 1;
                checkvictory()
                return;
            }
        }
        //Checking if white tile on the left
        if (column > 1) {
            if (document.getElementById("cell" + row + (column - 1)).className == "tile9") {
                swapTiles("cell" + row + column, "cell" + row + (column - 1));
                moves = moves + 1
                checkvictory();
                return;
            }
        }
        //Checking if white tile is above
        if (row > 1) {
            if (document.getElementById("cell" + (row - 1) + column).className == "tile9") {
                swapTiles("cell" + row + column, "cell" + (row - 1) + column);
                moves = moves + 1
                checkvictory();
                return;
            }
        }
        //Checking if white tile is below
        if (row < 3) {
            if (document.getElementById("cell" + (row + 1) + column).className == "tile9") {
                swapTiles("cell" + row + column, "cell" + (row + 1) + column);
                moves = moves + 1
                checkvictory();
                return;
            }
        }

    }
}

function reset(data) {
    var imageurl = Array("img/flower.png", "img/evernote.png");
    var style = null;
    var tile = "";
    style = document.createElement('style');
    style.type = 'text/css';
    for (var i = 1; i < 9; i++) {
        tile = '.tile' + i + '{  display: table-cell; width: 120px; height: 120px; border: 1px solid white; background-image: url(' + imageurl[data] + '); cursor: pointer; }';
        style.append(tile);
    }
    tile = '.tile9{  display: table-cell; width: 120px; height: 120px; border: 1px solid white;  cursor: pointer; }'
    style.append(tile);

    document.getElementsByTagName('head')[0].appendChild(style);


    var k = 0;
    var output = "";
    var tile = "";
    for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
            k++;
            output = "#cell" + i + j;
            tile = ".tile" + k;
            document.querySelector(output).className = "tile" + k
        }
    }
}
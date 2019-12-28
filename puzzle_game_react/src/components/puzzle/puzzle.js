import React,{ Component } from 'react';
import SocketContext from "./socket_context"
import GamePanelSocket from "./game_panel";
import ResultSocket from "./resultboard";
import Timmer from "./timmer";
import CellSocket from "./cell";
import Foodselectsocket from "./foodselect";
import Color from "./colors";
import "./style.css";

const table = {
    display:"table"
}
const table_row = {
    display:"table-row",
}


var row1 = [1,2,3]
var row2 = [4,5,6]
var row3 = [7,8,9]

function Tie() {
    var A = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]

   var count = 9;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var x = document.querySelector(`#cell${i+1}${j+1}`).getAttribute("class");
            if (`tile${A[i][j]}` !== x) {
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



function reset(data) {
    var imageurl = ["img/flower.png", "img/evernote.png"];
    var style = null;
    var tiles = "";
    style = document.createElement('style');
    style.type = 'text/css';
    for (var i = 1; i < 9; i++) {
        tiles = '.tile' + i + '{  display: table-cell; width: 120px; height: 120px; border: 1px solid white; background-image: url(' + imageurl[data] + '); cursor: pointer; }';
        style.append(tiles);
    }
    tiles = '.tile9{  display: table-cell; width: 120px; height: 120px; border: 1px solid white;  cursor: pointer; }'
    style.append(tiles);

    document.getElementsByTagName('head')[0].appendChild(style);


    var k = 0;
    var output = "";
    var tile = "";
    for ( i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
            k++;
            output = "#cell" + i + j;
            tile = ".tile" + k;
            document.querySelector(output).className = "tile" + k
        }
    }
}
class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unmount:true
        }
        this.clickTile = this.clickTile.bind(this)
    }

    componentDidMount(){
        const {socket} = this.props;
        socket.on("confirm", function(data) {
            console.log("Confirmation Details" + data);
            socket.emit("joinconfirm", data);
        })

        socket.on("start", function(data) {
            reset(data);
            socket.emit("timerstart", "start");
            shuffle();
        });

        socket.on("shuffle", function(data) {
            shuffle()
        })

        socket.on("roundchange", function(data) {
            socket.emit("roundchange", "win");
        });



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

        socket.on("finish", (data)=>{
                console.log(data)
                const {history} = this.props;
                // this.setState({unmount:false})
            
                setTimeout(function(){
                        socket.emit("leave", "leave");
                    history.push("/result")
                },1000);
           
               
        })
    }

    clickTile(e,row,column) {
        var tile = e.target.className;
        
        console.log("Tile"+tile)
        if (tile !== "tile9") {
            //Checking if white tile on the right
            if (column < 3) {
                if (document.getElementById("cell" + row + (column + 1)).className === "tile9") {
                    console.log(document.getElementById("cell" + row + (column + 1)).className)
                    swapTiles("cell" + row + column, "cell" + row + (column + 1));
                    return;
                }
            }
            //Checking if white tile on the left
            if (column > 1) {
                if (document.getElementById("cell" + row + (column - 1)).className === "tile9") {
                    swapTiles("cell" + row + column, "cell" + row + (column - 1));
                    return;
                }
            }
            //Checking if white tile is above
            if (row > 1) {
                if (document.getElementById("cell" + (row - 1) + column).className === "tile9") {
                    swapTiles("cell" + row + column, "cell" + (row - 1) + column);
                    return;
                }
            }
            //Checking if white tile is below
            if (row < 3) {
                if (document.getElementById("cell" + (row + 1) + column).className ===  "tile9") {
                        swapTiles("cell" + row + column, "cell" + (row + 1) + column);
                        return;
                }
            }
        }
    }

    row1 = row1.map((i,k=1)=> <CellSocket i={i} j={1} k={++k} clickTile={this.clickTile}/>)
    row2 = row2.map((i,k=1)=><CellSocket i={i} j={2}  k={++k} clickTile={this.clickTile}/>)
    row3 = row3.map((i,k=1)=><CellSocket i={i} j={3}  k={++k} clickTile={this.clickTile}/>)

    render(){ 
        console.log(this.props)
        return (  
            <>
                <div class="container" style={{display:this.state.unmount?'':"none"}}>
                <Timmer />
                <ResultSocket />
                <div id="table"  style={table}>
                    <div id="row1" style={table_row}>
                   {
                      this.row1
                   } 
                   </div>
                   <div id="row2" style={table_row}>
                   {
                      this.row2
                   } 
                   </div>
                   <div id="row3" style={table_row}>
                   {
                      this.row3
                   } 
                   </div>
                </div>
                <GamePanelSocket />

                <Color />
                <Foodselectsocket />
                </div>
            </>
        );
    }
}

const PuzzleSocket = props =>{
    return(
    <SocketContext.Consumer>
    {(socket)=><Puzzle {...props} socket={socket} />}
    </SocketContext.Consumer>
    )
}
 
export default PuzzleSocket;
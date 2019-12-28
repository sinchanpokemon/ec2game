import React, { Component } from 'react';
import "./style.css"
import SocketContext from "./socket_context"

function checkvictory(socket) {
    var A = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var x = document.querySelector(`#cell${i+1}${j+1}`).getAttribute("class");
            if (`tile${A[i][j]}` !== x) {
                return;
            }
        }
    }
    socket.emit("win", "win");

}



class Cell extends Component {
    constructor(props){
    super(props)
    this.checkTile = this.checkTile.bind(this);
    }
    checkTile(e,j,k)
    {   const  {socket} = this.props
        this.props.clickTile(e,j,k)
        if(checkvictory(socket) === 1)
        {
           socket.emit("win","win");
        }
    }

    render() { 
        const  {i,j,k} = this.props;
        const id = "cell"+j+k;
        const classstring ="tile"+i
        return (
        <>
            <div id={id} className={classstring} style={{color:"blue"}} onClick={(e)=>this.checkTile(e,j,k)}></div>
        </>
        );
    }
}

const CellSocket = props=>{
    return(
        <SocketContext.Consumer>
        {(socket)=><Cell {...props} socket={socket} />}
        </SocketContext.Consumer>
        )
}
export default CellSocket;
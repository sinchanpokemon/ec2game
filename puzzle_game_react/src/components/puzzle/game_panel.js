import React, { Component } from 'react';
import SocketContext from "./socket_context";

class GamePanel extends Component {
    constructor(props) {
        super(props);
         this.connect = this.connect.bind(this);
    }

   connect(){
    const {socket} =this.props;
    socket.emit("leave", 'conne');
   }

    render() { 
        return (  
            <>
                <div class="container">
                    <button onClick={this.connect}>Connect</button>
                </div>
            </>
        );
    }
}


const GamePanelSocket = props =>{
    return(
    <SocketContext.Consumer>
    {(socket)=><GamePanel {...props} socket={socket} />}
    </SocketContext.Consumer>
    )
}
export default GamePanelSocket;
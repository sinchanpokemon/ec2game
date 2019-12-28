import React, { Component } from 'react';
import SocketContext from "./socket_context";

class ResultBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: ""
        }
    }
    
    componentDidMount()
    {    const {socket} = this.props
   
        socket.on("result", data => {
            this.setState({result:data});
        })
    }
    
    render() {
        return (
            <>
            <div class="container">
        <p>Result:{this.state.result}</p>
            </div>
            </>
        );
    }
}

const ResultSocket = props =>{
    return(
    <SocketContext.Consumer>
    {(socket)=><ResultBoard {...props} socket={socket} />}
    </SocketContext.Consumer>
    )
}

export default ResultSocket;
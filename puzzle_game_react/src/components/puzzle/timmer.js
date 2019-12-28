import React, { Component } from "react"
import SocketContext from "./socket_context";

class Timmer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            round: 0,
            time: 0
        }
    }
    componentDidMount() {
        const { socket } = this.props;
        socket.on("currenttime", data => {
            const { time } = data;
            this.setState({
                time: time
            })
        });

        socket.on("round",data=>{
            console.log(data)
            this.setState({
                round:data
            })

            
        })
    }

    render() {
        return ( 
            <>
            <div class="container">
            <p> Level: { this.state.round }</p> 
            <p> Time: { this.state.time }</p>
            </div>
         </>
        );
    }
}


const TimmerSocket = props =>{
        return( <SocketContext.Consumer> 
            { (socket) => < Timmer {...props } socket = { socket }/> }
            </SocketContext.Consumer>
            )
 }
 export default TimmerSocket;
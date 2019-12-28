import React, { Component } from 'react';
import SocketContext from "./socket_context";
import "./style.css"
class Foodselect extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hide:true
         }
         this.getvalue = this.getvalue.bind(this);
         this.show = this.show.bind(this);
    }
    getvalue(food)
    {   const {socket} = this.props;
         socket.open();
        this.setState({hide:false})
        socket.emit("connectTo", food);
    }

    show()
    {
        this.setState(prevState=>({
            hide:!prevState.hide
        }))
    }
    
    render() { 
        return (
            <>
                <div class="choice" id="choice" style={{display:this.state.hide?'':'none'}}>
                <div class="img-wrapper">
                    <img src={process.env.PUBLIC_URL + "img/banana.png"} alt="" width="100%" onClick={(e)=>this.getvalue("banana")} />
                    <h4>Price : 20$</h4>
                </div>
                <div class="img-wrapper">
                    <img src={process.env.PUBLIC_URL + "img/mango.jpg"} alt="" width="100%" onClick={(e)=>this.getvalue("mango")} />
                    <h4>Price :30$ </h4>
                </div>

                <div class="img-wrapper">
                    <img src={process.env.PUBLIC_URL +"img/orange.png"} alt="" width="100%" value="orange" onClick={(e)=>this.getvalue("orange")} />
                    <h4>Price :50$ </h4>
                </div>
            </div>

            <button onClick={this.show}>show</button>
            </>
        );
    }
}

const Foodselectsocket = props =>{
    return(
    <SocketContext.Consumer>
    {(socket)=><Foodselect {...props} socket={socket} />}
    </SocketContext.Consumer>
    )
}

export default Foodselectsocket;
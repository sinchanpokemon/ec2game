import React from 'react';
import PuzzleSocket from './components/puzzle/puzzle';
import SocketContext from "./components/puzzle/socket_context";
import io from "socket.io-client";
const socket = io("http://localhost:5000",{autoConnect:false});
function App(props) {
    return (         
        <SocketContext.Provider value={socket}>
        <PuzzleSocket {...props} />
        </SocketContext.Provider>
    );
}

export default App;
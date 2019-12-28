import React, { Component } from 'react';
import {Route,BrowserRouter as Router,Switch} from "react-router-dom";
import App from "./App";
import Final_Result from "./components/final_result/final_result"
function Game()
{
    return (
        <>
            <Router>
                <Switch>
                <Route path="/" exact component={App} />
                <Route path="/result"  exact component={Final_Result} />
                </Switch>
            </Router>
        </>
    )
}
export default Game;
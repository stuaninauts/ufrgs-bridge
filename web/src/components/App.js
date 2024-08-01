import React, { Component } from 'react';
import {render} from "react-dom";
import InitialPage from './InitialPage';

export default class App extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <InitialPage />
        )
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
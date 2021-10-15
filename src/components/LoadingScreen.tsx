import logo from "../logo24.png";
import React from "react";

function LoadingScreen() {
    return <>
        <img src={logo} className="App-logo" alt="logo" style={{imageRendering: "pixelated"}}/>
        <em style={{fontFamily: "pape"}}>Loading...</em>
    </>;
}

export default LoadingScreen
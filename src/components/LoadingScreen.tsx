import logo from "../logo24.png";
import React from "react";

function LoadingScreen(props: { text?: string }) {
    return <div style={{paddingTop: '20vh'}}>
        <div style={{textAlign: "center", paddingBottom: '3em'}}>
            <img src={logo} className="App-logo" alt="logo" style={{imageRendering: "pixelated"}}/>
        </div>
        <div style={{textAlign: "center"}}>
            <em style={{fontFamily: "pape, 'Montserrat', sans-serif"}}>{props.text ? props.text : 'Loading...'}</em>
        </div>
    </div>;
}

export default LoadingScreen
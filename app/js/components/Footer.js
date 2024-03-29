import React from "react";
import { render } from "react-dom";
//backgroundColor: "#F8F8F8",
var style = {
    backgroundColor: "#000000",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    color: "#00acee",
    padding: "10px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "40px",
    width: "100%",
    
}

var phantom = {
  display: 'block',
  padding: '10px',
  height: '40px',
  width: '100%',
}

function Footer({ children }) {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                { children }
            </div>
        </div>
    )
}

export default Footer
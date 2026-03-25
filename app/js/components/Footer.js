"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// --- Define Style Objects with TypeScript ---
// React.CSSProperties is the correct type for inline style objects in React
const style = {
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
};
const phantom = {
    display: 'block',
    padding: '10px',
    height: '40px',
    width: '100%',
};
// --- Functional Component with Type Annotation ---
// We specify that Footer is a React Functional Component (FC) and pass its props type
function Footer({ children }) {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { style: phantom }),
        react_1.default.createElement("div", { style: style, className: "footer-content" }, children)));
}
exports.default = Footer;
/*
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
*/ 

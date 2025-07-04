import React from "react";
//import { render } from "react-dom"; 
// --- Define Props Interface ---
// React.PropsWithChildren is a utility type that automatically adds the 'children' prop (type React.ReactNode)
interface FooterProps extends React.PropsWithChildren {}

// --- Define Style Objects with TypeScript ---
// React.CSSProperties is the correct type for inline style objects in React
const style: React.CSSProperties = {
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

const phantom: React.CSSProperties = {
  display: 'block',
  padding: '10px',
  height: '40px',
  width: '100%',
};

// --- Functional Component with Type Annotation ---
// We specify that Footer is a React Functional Component (FC) and pass its props type
function Footer({ children }: FooterProps): React.ReactElement {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                { children }
            </div>
        </div>
    );
}

export default Footer;

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
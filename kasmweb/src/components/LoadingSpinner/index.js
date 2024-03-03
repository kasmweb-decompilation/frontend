import React from "react";
import "./style.scss";
import Wave from "./components/Wave";

class LoadingSpinner extends React.Component {
    render() {
        return <span className="innerSpinner"><Wave/></span>;        
    }
}

export default LoadingSpinner;

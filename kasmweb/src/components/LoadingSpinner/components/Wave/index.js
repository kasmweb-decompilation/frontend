import React from "react";

export default () => {    //eslint-disable-line
    const correctionStyle = {marginLeft: "1px", marginRight: "1px"};
    return (
        <div className="sk-spinner sk-spinner-wave">
            <div className="sk-rect1" style={correctionStyle}></div>
            <div className="sk-rect2" style={correctionStyle}></div>
            <div className="sk-rect3" style={correctionStyle}></div>
            <div className="sk-rect4" style={correctionStyle}></div>
            <div className="sk-rect5" style={correctionStyle}></div>
        </div>
    );
};
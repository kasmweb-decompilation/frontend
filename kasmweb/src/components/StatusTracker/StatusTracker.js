import React, { useState, useEffect, useRef, Fragment } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Separator(props) {
    return (
        <div
            style={{
                position: "absolute",
                height: "100%",
                transform: `rotate(${props.turns}turn)`,
                left: "calc(50% - 1px)"
            }}
        >
            <div style={props.style} />
        </div>
    );
}

function RadialSeparators(props) {
    const turns = 1 / props.count;
    return _.range(props.count).map(index => (
        <Separator turns={index * turns} style={props.style} />
    ));
}


export function StatusTracker(props) {
    const { className, value, sections = 5 } = props

    const splitPerSection = 100 / sections
    const current = Math.floor(value / splitPerSection)
    const next = current + 1

    const displayValue = (value) => {
        return value * splitPerSection
    }

    return <div className={classNames('tw-absolute tw-inset-0', className)}>
        <CircularProgressbar
            className="text-color tw-absolute tw-inset-0"
            value={displayValue(current)}
            strokeWidth="1.5"
            styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: "#4582f6",
            })}
        />
        <CircularProgressbar
            className="text-color tw-absolute tw-inset-0 tw-animate-[blink_1s_ease-in-out_infinite]"
            value={displayValue(next)}
            strokeWidth="1.5"
            styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: "#4582f6",
            })}
        />
        <RadialSeparators
            count={sections}
            style={{
                background: "#0004",
                width: "2px",
                // This needs to be equal to props.strokeWidth
                height: `${1.5}%`
            }}
        />
    </div>
}
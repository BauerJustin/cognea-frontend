import React, { useState, useEffect, useRef } from 'react';
import Siriwave from 'react-siriwave';
import Mic from '../../assets/images/mic.png'

export function Microphone(props) {
    const elementRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(elementRef.current.getBoundingClientRect().width);
    }, []);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "10%" }}>
                <img
                    src={Mic}
                    alt={"Mic"}
                    style={{ width: "100%" }}
                />
            </div>
            <div style={{ width: "90%" }} ref={elementRef}>
                <Siriwave theme="ios9" color="#5b47fb" speed="0.1" amplitude={props.microphone_on ? "2.7": "0.1"} width={width} />
            </div>
        </div>
    )
}

export function MicrophoneText(props) {
    if (props.end_interview) {
        return (
            <div style={{ textAlign: "center" }}>
                <label>Interview concluded, please wait.</label>
            </div>
        )
    } else if (props.microphone_on) {
        return (
            <div style={{ textAlign: "center" }}>
                <label>Speak to respond to Cognea</label>
            </div>
        )
    } else {
        return (
            <div style={{ textAlign: "center" }}>
                <label>Wait for Cognea to respond...</label>
            </div>
        )
    }
}
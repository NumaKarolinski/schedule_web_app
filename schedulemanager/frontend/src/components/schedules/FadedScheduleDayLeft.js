import React, { Component } from "react";

import "./FadedScheduleDayLeft.css";

export default class FadedScheduleDayLeft extends Component {
    render() {
        return (
            this.props.smallerMedia ? 
                (<div id = "leftArrow" className="smallArrowLeft" onClick = { this.props.handleClick }></div>) :
                (<div id = "leftArrow" className="bigArrowLeft" onClick = { this.props.handleClick }></div>)
        );
    }
}

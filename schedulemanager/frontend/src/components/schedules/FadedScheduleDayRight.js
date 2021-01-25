import React, { Component } from "react";

import "./FadedScheduleDayRight.css";

export default class FadedScheduleDayRight extends Component {
    render() {
        return (
            this.props.smallerMedia ? 
                (<div id = "rightArrow" className="smallArrowRight" onClick = { this.props.handleClick }></div>) :
                (<div id = "rightArrow" className="bigArrowRight" onClick = { this.props.handleClick }></div>)
        );
    }
}

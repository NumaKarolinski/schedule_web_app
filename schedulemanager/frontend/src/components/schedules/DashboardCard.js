import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class DashboardCard extends Component {
  
    state = {
        hover: false,
        scheduleBool: false,
        eventBool: false,
        smallMedia: window.matchMedia("(max-width: 703px)").matches,
        smallerMedia: window.matchMedia("(max-width: 384px)").matches,
    };

    componentDidMount() {
        const wmm1 = window.matchMedia("(max-width: 703px)");
        const wmm2 = window.matchMedia("(max-width: 384px)");
        wmm1.addEventListener("change", () => this.setState({ ...this.state, smallMedia: wmm1.matches }));
        wmm2.addEventListener("change", () => this.setState({ ...this.state, smallerMedia: wmm2.matches }));
    }

    toggleHover() {
        this.setState({ ...this.state, hover: !this.state.hover });
    }

    handleClick = (e) => {
        e.preventDefault();
        if (this.props.cardType === "events") {
            this.setState({ ...this.state, eventBool: !this.state.eventBool });
        } else if (this.props.cardType === "schedules") {
            this.setState({ ...this.state, scheduleBool: !this.state.scheduleBool });
        } else {
            console.log("Handle Click of Dashboard Card Failed");
        }
    };

    render() {
        if (this.state.scheduleBool) {
            return <Redirect to="/schedules" />;
        } else if (this.state.eventBool) {
            return <Redirect to="/eventDefinitions" />;
        }

        const hoverStyle = 
        this.state.hover ? 
            { opacity: "1.0", cursor: "pointer" } :
            { opacity: "0.9", cursor: "default" };

        const cardStyle = {
            minWidth: this.state.smallerMedia ? "11.5rem" : "20rem",
            maxWidth: this.state.smallerMedia ? "11.5rem" : "20rem",
            opacity: hoverStyle.opacity,
            cursor: hoverStyle.cursor,
            MozUserSelect: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none",
        };

        const cardProperties =
        this.props.cardType === "events" ? 
            {
                header: "Events",
                title1: this.state.smallerMedia ? "View & Edit" : "View & Edit Events",
                title2: this.state.smallerMedia ? "Events" : null,

            }
          : this.props.cardType === "schedules"
          ? {
                header: "Your Schedule",
                title1: this.state.smallerMedia ? "View & Generate" : "View & Generate Schedule",
                title2: this.state.smallerMedia ? "Schedule" : null,
            }
          : {
                header: "Default Header",
                title1: this.state.smallerMedia ? "Default" : "Default Title",
                title2: this.state.smallerMedia ? "Title" : null,
            };

        const successCard = (
            <div
                id={this.props.cardType}
                className = {this.state.smallMedia ? "card text-white bg-success mt-3 mb-3" : "card text-white bg-success m-3"}
                style = {cardStyle}
                onMouseEnter = {this.toggleHover.bind(this)}
                onMouseLeave = {this.toggleHover.bind(this)}
                onClick = {this.handleClick.bind(this)}
            >
                <div className = "card-header">{cardProperties.header}</div>
                <div className = "card-body">
                    {this.state.smallerMedia ? <h5 className = "card-title">{cardProperties.title1}</h5> : <h4 className = "card-title">{cardProperties.title1}</h4>}
                    {this.state.smallerMedia ? <h5 className = "card-title">{cardProperties.title2}</h5> : <h4 className = "card-title">{cardProperties.title2}</h4>}
                </div>
            </div>
        );

        const primaryCard = (
            <div
                id = {this.props.cardType}
                className = {this.state.smallMedia ? "card text-white bg-primary mt-3 mb-3" : "card text-white bg-primary m-3"}
                style = {cardStyle}
                onMouseEnter = {this.toggleHover.bind(this)}
                onMouseLeave = {this.toggleHover.bind(this)}
                onClick = {this.handleClick.bind(this)}
            >
                <div className = "card-header">{cardProperties.header}</div>
                <div className = "card-body">
                    {this.state.smallerMedia ? <h5 className = "card-title">{cardProperties.title1}</h5> : <h4 className = "card-title">{cardProperties.title1}</h4>}
                    {this.state.smallerMedia ? <h5 className = "card-title">{cardProperties.title2}</h5> : <h4 className = "card-title">{cardProperties.title2}</h4>}
                </div>
            </div>
        );

        const defaultCard = successCard;

        const cardToUse =
        this.props.styleType === "success"
            ? successCard
            : this.props.styleType === "primary"
            ? primaryCard
            : defaultCard;

        return cardToUse;
    }
}

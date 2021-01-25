import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getSchedules, getEventDefinitions } from "../../actions/schedules";

export default class ScheduleCard extends Component {
  state = {
    hover: false,
    scheduleBool: false,
    eventBool: false,
  };

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

    const hoverStyle = this.state.hover
      ? { opacity: "1.0", cursor: "pointer" }
      : { opacity: "0.9", cursor: "default" };

    const cardStyle = {
      minWidth: "20rem",
      maxWidth: "20rem",
      opacity: hoverStyle.opacity,
      cursor: hoverStyle.cursor,
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none",
    };

    const cardProperties =
      this.props.cardType === "events"
        ? {
            header: "Events",
            title: "View & Edit Events",
          }
        : this.props.cardType === "schedules"
        ? {
            header: "Your Schedule",
            title: "View & Generate Schedule",
          }
        : {
            header: "Default Header",
            title: "Default Title",
          };

    const successCard = (
      <div
        id={this.props.cardType}
        className="card text-white bg-success m-3"
        style={cardStyle}
        onMouseEnter={this.toggleHover.bind(this)}
        onMouseLeave={this.toggleHover.bind(this)}
        onClick={this.handleClick.bind(this)}
      >
        <div className="card-header">{cardProperties.header}</div>
        <div className="card-body">
          <h4 className="card-title">{cardProperties.title}</h4>
        </div>
      </div>
    );

    const primaryCard = (
      <div
        id={this.props.cardType}
        className="card text-white bg-primary m-3"
        style={cardStyle}
        onMouseEnter={this.toggleHover.bind(this)}
        onMouseLeave={this.toggleHover.bind(this)}
        onClick={this.handleClick.bind(this)}
      >
        <div className="card-header">{cardProperties.header}</div>
        <div className="card-body">
          <h4 className="card-title">{cardProperties.title}</h4>
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

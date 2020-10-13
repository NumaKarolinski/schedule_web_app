import React, { Component } from "react";

export default class DashboardCard extends Component {
  state = {
    hover: false,
  };

  toggleHover() {
    this.setState({ hover: !this.state.hover });
  }

  handleClick = (e) => {
    /*
    this.state.cardType === "tasks"
      ? 
      : this.state.cardType === "schedules"
      ? 
      : console.log("Handle Click of Dashboard Card Failed");
    */
    /*
   e.preventDefault();
   const { name, email, message } = this.state;
   const schedule = { name, email, message };
   this.props.addSchedule(schedule);
   this.setState({
     name: "",
     email: "",
     message: "",
   });
   */
  };

  render() {
    const hoverStyle = this.state.hover
      ? { opacity: "1.0", cursor: "pointer" }
      : { opacity: "0.9", cursor: "default" };

    const cardProperties =
      this.props.cardType === "tasks"
        ? {
            header: "Tasks",
            title: "View & Edit Tasks",
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
        style={{
          minWidth: "20rem",
          maxWidth: "20rem",
          opacity: hoverStyle.opacity,
          cursor: hoverStyle.cursor,
        }}
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
        style={{
          minWidth: "20rem",
          maxWidth: "20rem",
          opacity: hoverStyle.opacity,
          cursor: hoverStyle.cursor,
        }}
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

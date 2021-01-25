import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getSchedules,
  deleteSchedule,
  addSchedule,
} from "../../actions/schedules";

import ScheduleCard from "./ScheduleCard";

import "./ScheduleHub.css";

export class ScheduleHub extends Component {
  static propTypes = {
    schedules: PropTypes.array.isRequired,
    getSchedules: PropTypes.func.isRequired,
    deleteSchedule: PropTypes.func.isRequired,
    addSchedule: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getSchedules();
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
    return (
        <div
            className="jumbotron d-flex flex-row flex-wrap justify-content-center align-items-center"
            style={{
                margin: "0px",
                minWidth: "20rem",
                padding: "4rem 2rem",
            }}
        >
            {this.props.schedules.map((schedule) => (
              <ScheduleCard schedule={schedule} />
            ))}
            <ChooseButtons onClick={ this.handleClick } />
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  schedules: state.schedules.schedules,
});

export default connect(mapStateToProps, {
  getSchedules,
  deleteSchedule,
  addSchedule,
})(ScheduleDay);
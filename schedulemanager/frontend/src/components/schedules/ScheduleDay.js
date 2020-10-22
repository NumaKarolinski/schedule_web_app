import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getSchedules,
  deleteSchedule,
  addSchedule,
  getTimeDeltas,
  deleteTimeDelta,
  addTimeDelta,
} from "../../actions/schedules";

import "./ScheduleDay.css";

export class ScheduleDay extends Component {
  static propTypes = {
    schedules: PropTypes.array.isRequired,
    getSchedules: PropTypes.func.isRequired,
    deleteSchedule: PropTypes.func.isRequired,
    addSchedule: PropTypes.func.isRequired,
    timedeltas: PropTypes.array.isRequired,
    getTimeDeltas: PropTypes.func.isRequired,
    deleteTimeDelta: PropTypes.func.isRequired,
    addTimeDelta: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getSchedules();
    this.props.getTimeDeltas();
  }

  viewScheduleDay() {
    this.props.getTimeDeltas()
  }

  render() {
    return (
        <div className="jumbotron scheduleDayDiv">
            <h1 className="display-3">Hello, world!</h1>
            <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr className="my-4"></hr>
            <p>It uses utility classNamees for typography and spacing to space content out within the larger container.</p>
            <p className="lead">
                <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
            </p>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  schedules: state.schedules.schedules,
  timedeltas: state.schedules.timedeltas,
});

export default connect(mapStateToProps, {
  getSchedules,
  deleteSchedule,
  addSchedule,
  getTimeDeltas,
  deleteTimeDelta,
  addTimeDelta,
})(ScheduleDay);
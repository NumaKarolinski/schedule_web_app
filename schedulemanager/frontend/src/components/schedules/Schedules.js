import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import FadedScheduleDayLeft from "./FadedScheduleDayLeft";
import ScheduleDay from "./ScheduleDay";
import FadedScheduleDayRight from "./FadedScheduleDayRight";

export default class Schedules extends Component {

  render() {
    return (
      <Fragment>
        <FadedScheduleDayLeft className="row1"/>
        <ScheduleDay className="row2"/>
        <FadedScheduleDayRight className="row3"/>
      </Fragment>
    );
  }
}
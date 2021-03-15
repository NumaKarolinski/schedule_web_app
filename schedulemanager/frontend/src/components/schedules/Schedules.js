import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import moment from 'moment';

import FadedScheduleDayLeft from "./FadedScheduleDayLeft";
import ScheduleDay from "./ScheduleDay";
import FadedScheduleDayRight from "./FadedScheduleDayRight";

import {
    getSchedules,
} from "../../actions/schedules";

import "./Schedules.css";

export class Schedules extends Component {

    state = {
        currentDayShift: 0,
        updated: true,
        loadingTimeDeltas: true,
        pageWidth: window.innerWidth,
        pageHeight: window.innerHeight,
    }

    static propTypes = {
        schedules: PropTypes.array.isRequired,
        getSchedules: PropTypes.func.isRequired,
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({ ...this.state, pageWidth: window.innerWidth, pageHeight: window.innerHeight }));
        this.props.getSchedules();
    }

    handleClick = (e) => {
        if (e.currentTarget.id === "leftArrow") {
            this.setState({ ...this.state, "currentDayShift": this.state.currentDayShift - 1, "updated": true, "loadingTimeDeltas": true });
        } else if (e.currentTarget.id === "rightArrow") {
            this.setState({ ...this.state, "currentDayShift": this.state.currentDayShift + 1, "updated": true, "loadingTimeDeltas": true });
        } else {
            console.log("OnClick in Schedules not handled.");
        }
    }

    handleUpdate = () => {
        this.setState({ ...this.state, "updated": false });
    }

    loadTimeDeltas = (loadingTimeDeltas) => {
        this.setState({ ...this.state, "loadingTimeDeltas": loadingTimeDeltas });
    }

    render() {
        var { currentDayShift, updated, loadingTimeDeltas, pageWidth, pageHeight } = this.state;

        const smallerMedia = pageWidth <= 360;

        const leftDay = moment().add(currentDayShift - 1 , 'day');
        const middleDay = moment().add(currentDayShift , 'day');
        const rightDay = moment().add(currentDayShift + 1 , 'day');

        return (
            <Fragment>
                <FadedScheduleDayLeft className="row1" schedules = { this.props.schedules } day = { leftDay } smallerMedia = { smallerMedia } handleClick = { this.handleClick } />
                <ScheduleDay className="row2" schedules = { this.props.schedules } day = { middleDay } updated = { updated } loadingTimeDeltas = { loadingTimeDeltas } pageWidth = { pageWidth } pageHeight = { pageHeight } handleUpdate = { this.handleUpdate } loadTimeDeltas = { this.loadTimeDeltas } />
                <FadedScheduleDayRight className="row3" schedules = { this.props.schedules } day = { rightDay } smallerMedia = { smallerMedia } handleClick = { this.handleClick } />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    schedules: state.schedules.schedules,
});

export default connect(mapStateToProps, {
    getSchedules,
})(Schedules);
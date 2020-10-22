import React, { Component, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { dayWrong, monthWrong, dateTooEarly, addEventDefinition } from "../../actions/schedules";   
import DatePicker from 'react-datepicker';
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "./AddEvent.css";

export class AddEvent extends Component {

    state = {
        name: "",
        days: [null],
        daysInWeek: [false, false, false, false, false, false, false],
        fixed: "",
        chooseDay: "",
        recurring: false,
        timeBool: false,
        durationBool: false,
        time: "",
        duration: "",
        times: [],
        durations: [],
        eoa1: false,
        eoa2: false,
        nocc: 0,
        noccless: 0,
        noccmore: 0,
        occsameday: false,
        nnn1: false,
        nnn2: false,
        nnn3: false,
        nnn4: false,
        ntime: 0,
        ntimeless: 0,
        ntimemore: 0,
    };

    static propTypes = {
        dateTooEarly: PropTypes.func.isRequired,
        addEventDefinition: PropTypes.func.isRequired,
    };

    onChange = (e, e2) => {
        console.log(e);
        console.log(e2);
        if (e2 == null && e != null) {
            if (e.target.name === "fixed"){
                if (this.state.fixed != e.target.id){
                    this.setState({ "fixed": e.target.id });
                }
                else{
                    this.setState({ "fixed": "" });
                }
            } else if (e.target.name === "chooseDay"){
                if (this.state.chooseDay != e.target.id){
                    this.setState({ "chooseDay": e.target.id });
                }
                else{
                    this.setState({ "chooseDay": "" });
                }
            } else if (e.target.value === "Mo") {
                this.setState({ "daysInWeek": [!this.state.daysInWeek[0]].concat(this.state.daysInWeek.slice(1)) })
            } else if (e.target.value === "Tu") {
                this.setState({ "daysInWeek": ([this.state.daysInWeek[0]].concat(!this.state.daysInWeek[1])).concat(this.state.daysInWeek.slice(2)) })
            } else if (e.target.value === "We") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 2).concat(!this.state.daysInWeek[2])).concat(this.state.daysInWeek.slice(3)) })
            } else if (e.target.value === "Th") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 3).concat(!this.state.daysInWeek[3])).concat(this.state.daysInWeek.slice(4)) })
            } else if (e.target.value === "Fr") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 4).concat(!this.state.daysInWeek[4])).concat(this.state.daysInWeek.slice(5)) })
            } else if (e.target.value === "Sa") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 5).concat(!this.state.daysInWeek[5])).concat(this.state.daysInWeek.slice(6)) })
            } else if (e.target.value === "Su") {
                this.setState({ "daysInWeek": this.state.daysInWeek.slice(0, 6).concat(!this.state.daysInWeek[6]) })
            } else{
                this.setState({ [e.target.name]: e.target.value });
            }
        } else if (e2 === null && e === null) {
            this.setState({ ...this.state, "days": [null]});
        } else if (e === null && e2 != null){
            this.setState({ ...this.state, "days": [null]});
        } else {
            const dateYear = e.getFullYear();
            const dateMonth = e.getMonth();
            const dateDay = e.getDate();
            const dateStr = ((dateMonth + 1) < 10) ? ("0" + (dateMonth + 1) + "/" + dateDay + "/" + dateYear) : ((dateMonth + 1) + "/" + dateDay + "/" + dateYear);
            const rightNow = new Date();
            const thisYear = rightNow.getFullYear();
            const thisMonth = rightNow.getMonth();
            const thisDay = rightNow.getDate();

            if ((dateYear < thisYear) || ((dateYear === thisYear) && (dateMonth < thisMonth)) ||
            ((dateYear === thisYear) && (dateMonth === thisMonth) && (dateDay < thisDay))) {
                this.props.dateTooEarly.bind(this)();
            } else if ((dateMonth < 0) || (dateMonth > 11)){
                this.props.monthWrong.bind(this)();
            } else if ((dateDay < 1) || (dateDay > (new Date(dateYear, dateMonth + 1, 0).getDate()))){
                this.props.dayWrong.bind(this)(new Date(dateYear, dateMonth + 1, 0).getDate());
            } else {
                this.setState({ ...this.state, "days": [dateStr] });
            }            
        }
    }

    onSubmit = (e) => {
      e.preventDefault();
      const { name, days, fixed, recurring, timeBool, durationBool, time, duration, times, durations, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore } = this.state;
      const theTimes = timeBool ? time : times;
      const theDurations = durationBool ? duration : durations;
      const eventdefinition = fixed ? { name, days, recurring, theTimes, theDurations } : { name, days, recurring, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore };
      this.props.addEventDefinition(eventdefinition);
      this.setState({
        name: "",
        days: [null],
        daysInWeek: [false, false, false, false, false, false, false],
        fixed: "",
        chooseDay: "",
        recurring: false,
        timeBool: false,
        durationBool: false,
        time: "",
        duration: "",
        times: [],
        durations: [],
        eoa1: false,
        eoa2: false,
        nocc: 0,
        noccless: 0,
        noccmore: 0,
        occsameday: false,
        nnn1: false,
        nnn2: false,
        nnn3: false,
        nnn4: false,
        ntime: 0,
        ntimeless: 0,
        ntimemore: 0,
      });
    };

    render() {

        const { name, days, daysInWeek, fixed, chooseDay, recurring, timeBool, durationBool, time, duration, times, durations, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore } = this.state;
        const minDate = new Date();
        const theDate = (days[0] === null) ? null : new Date(days[0]);

        const eventName = (
            <div key="eventName" className="form-group">
                <label>Event Name</label>
                <input
                className="form-control"
                type="text"
                name="name"
                onChange={this.onChange}
                value={name}
                />
            </div>
        );

        const chooseDaySelector = (
            <div key="chooseDaySelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Choose the Day(s) the Event could/will occur on:</label>
                <div className="btn-group btn-group-toggle">
                    <input className={chooseDay === "dayoftheweek" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="chooseDay" id="dayoftheweek" value="Day of the Week" onClick={this.onChange} autoComplete="off" />
                    <input className={chooseDay === "anyday" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="chooseDay" id="anyday" value="Specific Day" onClick={this.onChange} autoComplete="off" />
                </div>
            </div>
        );

        const aDayPicker = (
            <div key="aDayPicker" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <DatePicker className="form-control" name="day1" isClearable closeOnScroll={true} selected={theDate} onChange={this.onChange} minDate = {minDate} dateFormat="MM/dd/yyyy" />
            </div>
        );

        const aWeekdayInPicker = (day, activity) => (
            <div className={day === "Su" ? "btn-group" : "btn-group mr-2"} role="group">
                <input className={activity ? "btn btn-secondary active" : "btn btn-secondary"} type="button" name="aWeekDayPicker" value={day} onClick={this.onChange} />
            </div>
        );

        const weekdayPicker = (
            <div key="weekdayPicker" className="btn-toolbar" role="toolbar">
                {aWeekdayInPicker("Mo", daysInWeek[0])}
                {aWeekdayInPicker("Tu", daysInWeek[1])}
                {aWeekdayInPicker("We", daysInWeek[2])}
                {aWeekdayInPicker("Th", daysInWeek[3])}
                {aWeekdayInPicker("Fr", daysInWeek[4])}
                {aWeekdayInPicker("Sa", daysInWeek[5])}
                {aWeekdayInPicker("Su", daysInWeek[6])}
            </div>
        );

        const fixedSelector = (
            <div key="fixedSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Is your event at a strict time, or can it be loosely defined?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={fixed === "strict" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="fixed" id="strict" value="Strict" onClick={this.onChange} />
                    <input className={fixed === "loose" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="fixed" id="loose" value="Loose" onClick={this.onChange} />
                </div>
            </div>
        );

        const submitButton = (
            <div key="submitButton" className="form-group">
                <button type="submit" className="btn btn-primary btn-block">
                Create Event
                </button>
            </div>
        );

        console.log(theDate);
        console.log(daysInWeek);
        console.log(chooseDay);
        console.log(daysInWeek !== [false, false, false, false, false, false, false]);
        console.log(daysInWeek != [false, false, false, false, false, false, false]);

        const validName = name === "" ? false : true;
        const validChooseDay = (chooseDay === "" ? false : true) && validName;
        const validDay = (((theDate !== null && chooseDay === "anyday") || (daysInWeek !== [false, false, false, false, false, false, false] && chooseDay === "dayoftheweek"))  ? true : false) && validChooseDay;
        const validFixed = (fixed === "" ? false : true) && validDay;

        const looseOrStrictPortion = fixed === "strict" ? [] : fixed === "loose" ? [] : [];

        const insideForm = [eventName, validName ? chooseDaySelector : null, (chooseDay === "anyday") ? aDayPicker : ((chooseDay === "dayoftheweek") ? weekdayPicker : null), validDay ? fixedSelector : null, validFixed ? submitButton : null];

        return (
            <div className="card p-5">
                <form onSubmit={this.onSubmit}>
                    {insideForm.map((somethingInside) => somethingInside)}
                </form>
            </div>
        );
    }
}

export default connect(null, { dayWrong, monthWrong, dateTooEarly, addEventDefinition })(AddEvent);
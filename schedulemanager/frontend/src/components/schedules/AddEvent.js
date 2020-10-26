import React, { Component, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { dayWrong, monthWrong, dateTooEarly, repeatedEventDay, addEventDefinition } from "../../actions/schedules";   
import DatePicker from 'react-datepicker';
import { TimePicker } from 'antd';
import moment from 'moment';

import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "./antd-timepicker.css";
import "./AddEvent.css";

export class AddEvent extends Component {

    state = {
        name: "",
        days: [null],
        daysInWeek: [false, false, false, false, false, false, false],
        fixed: "",
        chooseDay: "",
        recurring: "",
        timeBool: "",
        durationBool: "",
        time: "",
        duration: "",
        times: [null],
        durations: [null],
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
        monthWrong: PropTypes.func.isRequired,
        dayWrong: PropTypes.func.isRequired,
        dateTooEarly: PropTypes.func.isRequired,
        repeatedEventDay: PropTypes.func.isRequired,
        addEventDefinition: PropTypes.func.isRequired,
    };

    onChange = (e, e2) => {
        console.log(e);
        console.log(e2);
        if (e2 == null && e != null) {
            if (e.target.name === "fixed"){
                if (this.state.fixed != e.target.id){
                    this.setState({ "fixed": e.target.id });
                } else{
                    this.setState({ "fixed": "" });
                }
            } else if (e.target.name === "chooseDay"){
                if (this.state.chooseDay != e.target.id){
                    this.setState({ "chooseDay": e.target.id });
                } else{
                    this.setState({ "chooseDay": "" });
                }
            } else if (e.target.value === "Mo") {
                this.setState({ "daysInWeek": [!this.state.daysInWeek[0]].concat(this.state.daysInWeek.slice(1)) });
            } else if (e.target.value === "Tu") {
                this.setState({ "daysInWeek": ([this.state.daysInWeek[0]].concat(!this.state.daysInWeek[1])).concat(this.state.daysInWeek.slice(2)) });
            } else if (e.target.value === "We") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 2).concat(!this.state.daysInWeek[2])).concat(this.state.daysInWeek.slice(3)) });
            } else if (e.target.value === "Th") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 3).concat(!this.state.daysInWeek[3])).concat(this.state.daysInWeek.slice(4)) });
            } else if (e.target.value === "Fr") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 4).concat(!this.state.daysInWeek[4])).concat(this.state.daysInWeek.slice(5)) });
            } else if (e.target.value === "Sa") {
                this.setState({ "daysInWeek": (this.state.daysInWeek.slice(0, 5).concat(!this.state.daysInWeek[5])).concat(this.state.daysInWeek.slice(6)) });
            } else if (e.target.value === "Su") {
                this.setState({ "daysInWeek": this.state.daysInWeek.slice(0, 6).concat(!this.state.daysInWeek[6]) });
            } else if (e.target.name === "recurring") {
                if (this.state.recurring != e.target.id) {
                    this.setState({ "recurring": e.target.id });
                } else {
                    this.setState({ "recurring": "" });
                }
            } else if (e.target.name === "timeBool") {
                if (this.state.timeBool != e.target.id.slice(0, -1)) {
                    this.setState({ "timeBool": e.target.id.slice(0, -1) });
                } else {
                    this.setState({ "timeBool": "" });
                }    
            } else if (e.target.name === "durationBool") {
                if (this.state.recurring != e.target.id.slice(0, -1)) {
                    this.setState({ "durationBool": e.target.id.slice(0, -1) });
                } else {
                    this.setState({ "durationBool": "" });
                }
            } else{
                this.setState({ [e.target.name]: e.target.value });
            }
        } else if (e2 === null && e === null) {
            this.setState({ ...this.state, "days": [null]});
        } else if (e === null && e2 != null){
            const index = parseInt(e2.target.parentNode.childNodes[0].name.slice(3));
            const theLen = parseInt(this.state.days.length);
            const newList = this.state.days.slice(0, index).concat([null]).concat(this.state.days.slice(index + 1, theLen));
            const newList2 = newList.filter(function(item, pos) {
                return newList.indexOf(item) == pos;
            });
            var nullBool = false;
            var nullPos = -1;
            newList2.map((valInList, pos) => valInList === null && pos !== newList2.length - 1 ? (nullBool = true, nullPos = pos) : null);
            const newDays = newList2.map((valInList, pos) => (!nullBool || pos < nullPos) ? valInList : (pos === newList2.length - 1 ? null : newList2[pos + 1]));
            this.setState({ ...this.state, "days": newDays });
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
                const index = parseInt(e2.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className.slice(27));
                const newList = this.state.days.slice(0, index).concat([dateStr]).concat([null]);
                const newDays = newList.filter(function(item, pos) {
                    return newList.indexOf(item) == pos;
                });
                if (newList.length !== newDays.length) {
                    this.props.repeatedEventDay.bind(this)(dateStr);
                }
                this.setState({ ...this.state, "days": newDays});
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
        recurring: "",
        timeBool: "",
        durationBool: "",
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

        const validName = name === "" ? false : true;

        const chooseDaySelector = (
            <div key="chooseDaySelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Choose the Day(s) the Event could/will occur on:</label>
                <div className="btn-group btn-group-toggle">
                    <input className={chooseDay === "dayoftheweek" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="chooseDay" id="dayoftheweek" value="Day of the Week" onClick={this.onChange} autoComplete="off" />
                    <input className={chooseDay === "anyday" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="chooseDay" id="anyday" value="Specific Day" onClick={this.onChange} autoComplete="off" />
                </div>
            </div>
        );

        const validChooseDay = (chooseDay === "" ? false : true) && validName;

        const aDayPicker = (theName, theDate) => (
            <DatePicker 
            key={theName} 
            className="form-control" 
            isClearable
            closeOnScroll={true}
            selected={theDate}
            onChange = {this.onChange}
            minDate = {minDate}
            dateFormat = "MM/dd/yyyy"
            name = {theName}
            popperClassName = {theName}
            />
        );

        const dayPicker = (
            <div key="dayPicker" className="form-group d-flex flex-row flex-wrap justify-content-center">
                {days.map((aDay, index) => aDayPicker("day" + index , (aDay === null) ? null : new Date(aDay)))}
            </div>
        );

        const aWeekdayInPicker = (day, activity) => (
            <div key={day} className={day === "Su" ? "btn-group" : "btn-group mr-2"} role="group">
                <input className={activity ? "btn btn-secondary active" : "btn btn-secondary"} type="button" name="aWeekDayPicker" value={day} onClick={this.onChange} />
            </div>
        );

        const getDayInWeek = (index) => {
            const theReturn = index === 0 ?
                ["Monday", "Mo"] :
                (index === 1 ? 
                    ["Tuesday", "Tu"] :
                    (index === 2 ?
                        ["Wednesday", "We"] :
                        (index === 3 ?
                            ["Thursday", "Th"] :
                            (index === 4 ?
                                ["Friday", "Fr"] :
                                (index === 5 ?
                                    ["Saturday", "Sa"] :
                                    (index === 6 ?
                                        ["Sunday", "Su"] :
                                        null))))));
            return theReturn;
        }

        const weekdayPicker = (
            <div key="weekdayPicker" className="btn-toolbar" role="toolbar">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => 
                aWeekdayInPicker(getDayInWeek(index)[1], daysInWeek[index]))}
            </div>
        );

        const validDay = (((JSON.stringify(days) !== JSON.stringify([null]) && chooseDay === "anyday") || (JSON.stringify(daysInWeek) !== JSON.stringify([false, false, false, false, false, false, false]) && chooseDay === "dayoftheweek"))  ? true : false) && validChooseDay;

        const recurringSelector = (
            <div key="recurringSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Does your event occur on a weekly basis?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={recurring === "yes" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="recurring" id="yes" value="Yes" onClick={this.onChange} />
                    <input className={recurring === "no" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="recurring" id="no" value="No" onClick={this.onChange} />
                </div>
            </div>
        );

        const validRecurring = (recurring === "" ? false : true) && validDay;

        const fixedSelector = (
            <div key="fixedSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Is your event at a strict time, or can it be loosely defined?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={fixed === "strict" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="fixed" id="strict" value="Strict" onClick={this.onChange} />
                    <input className={fixed === "loose" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="fixed" id="loose" value="Loose" onClick={this.onChange} />
                </div>
            </div>
        );
        
        const validFixed = (fixed === "" ? false : true) && (validRecurring || (validDay && chooseDay === "anyday"));

        const sameTimeSelector = (
            <div key="sameTimeSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Does your event occur at the same time on each day?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={timeBool === "yes" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="timeBool" id="yes2" value="Yes" onClick={this.onChange} />
                    <input className={timeBool === "no" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="timeBool" id="no2" value="No" onClick={this.onChange} />
                </div>
            </div>
        );

        const validSameTime = timeBool === "" ? false : true

        const aTimePicker = (dayVal, index) => (
            <div key={"aTimePicker" + index.toString()} className="form-group d-flex flex-row flex-wrap justify-content-center">
                {
                (((days.length > 2 && chooseDay === "anyday") || (trueCount > 1 && chooseDay ==="dayoftheweek")) && timeBool === "yes") ?
                    <label>Everyday the time is:</label> :
                    ((dayVal === true || dayVal === false) ? 
                        <label>{"On " + getDayInWeek(index)[0] + " the time is:"}</label> :
                        <label>{"On " + dayVal + " the time is:"}</label>)
                }
                <TimePicker 
                value={
                    (((days.length === 2 && chooseDay === "anyday") || (trueCount === 1 && chooseDay ==="dayoftheweek")) && timeBool === "yes") ?
                        moment(time, "HH:mm") :
                        moment(times[index], "HH:mm")
                } 
                minuteStep = {5}
                format={"HH:mm"}
                onChange = {this.onChange}
                />
            </div>
        );

        const trueCount = daysInWeek.reduce((acc, cV) => acc + (cV ? 1 : 0));

        const timePicker = (
            <div key="timePicker" className="form-group d-flex flex-row flex-wrap justify-content-center">
                { 
                chooseDay === "anyday" ?
                    ((timeBool === "yes" && days.length > 2) ?
                        aTimePicker(null, "Only") :
                        days.map((aDay, index) => aDay === null ?
                            null :
                            aTimePicker(aDay, index))
                    ) :
                    (chooseDay === "dayoftheweek" ?
                        ((timeBool === "yes" && trueCount > 1) ?
                            aTimePicker(null, "Only") :
                            daysInWeek.map((dayBool, index) => (dayBool ?
                                aTimePicker(dayBool, index) :
                                null))
                        ) :
                        null)
                }
            </div>
        );

        const validTimePicker = ((((JSON.stringify(times) !== JSON.stringify([null])) && timeBool === "no") || ((time !== "") && timeBool === "yes"))  ? true : false) && validSameTime;

        const sameDurationSelector = (
            <div key="sameDurationSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label>Does your event last the same amount of time on each day?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={durationBool === "yes" ? "btn btn-outline-warning active" : "btn btn-outline-warning"} type="button" name="durationBool" id="yes3" value="Yes" onClick={this.onChange} />
                    <input className={durationBool === "no" ? "btn btn-outline-success active" : "btn btn-outline-success"} type="button" name="durationBool" id="no3" value="No" onClick={this.onChange} />
                </div>
            </div>
        );

        const validSameDuration = (durationBool === "" ? false : true) && validTimePicker;

        const aDurationPicker = (dayVal, index) => (
            <div key={"aDurationPicker" + index.toString()} className="form-group d-flex flex-row flex-wrap justify-content-center">
                {
                (((days.length > 2 && chooseDay === "anyday") || (trueCount > 1 && chooseDay ==="dayoftheweek")) && durationBool === "yes") ?
                    <label>Everyday the duration is:</label> :
                    ((dayVal === true || dayVal === false) ? 
                        <label>{"On " + getDayInWeek(index)[0] + " the duration is:"}</label> :
                        <label>{"On " + dayVal + " the duration is:"}</label>)
                }
                <TimePicker 
                value={
                    (((days.length === 2 && chooseDay === "anyday") || (trueCount === 1 && chooseDay ==="dayoftheweek")) && durationBool === "yes") ?
                        moment(duration, "HH:mm") :
                        moment(durations[index], "HH:mm")
                } 
                minuteStep = {5}
                format={"HH:mm"}
                onChange = {this.onChange}
                />
            </div>
        );

        const durationPicker = (
            <div key="durationPicker" className="form-group d-flex flex-row flex-wrap justify-content-center">
                { 
                chooseDay === "anyday" ?
                    ((durationBool === "yes" && days.length > 2) ?
                        aDurationPicker(null, "Only") :
                        days.map((aDay, index) => aDay === null ?
                            null :
                            aDurationPicker(aDay, index))
                    ) :
                    (chooseDay === "dayoftheweek" ?
                        ((durationBool === "yes" && trueCount > 1) ?
                            aDurationPicker(null, "Only") :
                            daysInWeek.map((dayBool, index) => (dayBool ?
                                aDurationPicker(dayBool, index) :
                                null ))
                        ) :
                        null)
                }
            </div>
        );

        const validDurationPicker = ((((JSON.stringify(durations) !== JSON.stringify([null])) && durationBool === "no") || ((duration !== "") && durationBool === "yes"))  ? true : false) && validSameDuration;

        const insideStrict = [((days.length > 2 && chooseDay === "anyday") || (trueCount > 1 && chooseDay ==="dayoftheweek")) ? sameTimeSelector : null, (validSameTime || (((days.length === 2 && chooseDay === "anyday") || (trueCount === 1 && chooseDay ==="dayoftheweek")) && validFixed)) ? timePicker : null, (validTimePicker && ((days.length > 2 && chooseDay === "anyday") || (trueCount > 1 && chooseDay ==="dayoftheweek"))) ? sameDurationSelector : null, (validSameDuration || (((days.length === 2 && chooseDay === "anyday") || (trueCount === 1 && chooseDay ==="dayoftheweek")) && validTimePicker)) ? durationPicker : null]

        const looseOrStrictPortion = 
        fixed === "strict" ? 
            (
                <div key="strictPortion">
                    {insideStrict.map((somethingInside) => somethingInside)}
                </div>
            ) : 
            (fixed === "loose" ? 
                (
                    <div key="loosePortion">

                    </div>
                ) : 
                null);

        const validLooseOrStrictPortion = (validDurationPicker || false) && validFixed;

        const submitButton = (
            <div key="submitButton" className="form-group">
                <button type="submit" className="btn btn-primary btn-block">
                Create Event
                </button>
            </div>
        );

        const insideForm = [eventName, validName ? chooseDaySelector : null, !validChooseDay ? null :  ((chooseDay === "anyday") ? dayPicker : ((chooseDay === "dayoftheweek") ? weekdayPicker : null)), validDay && (chooseDay === "dayoftheweek") ? recurringSelector : null, validRecurring || (validDay && chooseDay === "anyday") ? fixedSelector : null, validFixed ? looseOrStrictPortion : null, validLooseOrStrictPortion ? submitButton : null];

        return (
            <div className="card p-5 eventContainer">
                <form onSubmit={this.onSubmit}>
                    {insideForm.map((somethingInside) => somethingInside)}
                </form>
            </div>
        );
    }
}

export default connect(null, { dayWrong, monthWrong, dateTooEarly, repeatedEventDay, addEventDefinition })(AddEvent);
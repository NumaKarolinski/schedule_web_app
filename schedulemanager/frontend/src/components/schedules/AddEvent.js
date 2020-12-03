import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import { dayWrong, monthWrong, dateTooEarly, repeatedEventDay, addEventDefinition, getEventDefinitions, addStrictEvent, addLooseEvent, addDay, getDays, addTime, getTimes, addoccurs_on_1, addoccurs_on_2 } from "../../actions/schedules";   
import { dayWrong, monthWrong, dateTooEarly, repeatedEventDay, addStrictEvent, getStrictEvents, editStrictEvent, addLooseEvent, getLooseEvents, editLooseEvent, addDay, getDays, editDay, deleteDay, addTime, getTimes, editTime, deleteTime, addoccurs_on_1, getoccurs_on_1s, deleteoccurs_on_1, addoccurs_on_2, getoccurs_on_2s, deleteoccurs_on_2 } from "../../actions/schedules";
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
        time: null,
        duration: null,
        times: [],
        timesInWeek: [null, null, null, null, null, null, null],
        durations: [],
        durationsInWeek: [null, null, null, null, null, null, null],
        currentlySelectedTimeOrDuration: null,
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
        submittedBool: false,
        inEdit: false,
        prevEventState: null,
    };

    static propTypes = {
        monthWrong: PropTypes.func.isRequired,
        dayWrong: PropTypes.func.isRequired,
        dateTooEarly: PropTypes.func.isRequired,
        repeatedEventDay: PropTypes.func.isRequired,
        //eventdefinitions: PropTypes.array.isRequired,
        //addEventDefinition: PropTypes.func.isRequired,
        //getEventDefinitions: PropTypes.func.isRequired,
        strictevents: PropTypes.array.isRequired,
        addStrictEvent: PropTypes.func.isRequired,
        getStrictEvents: PropTypes.func.isRequired,
        editStrictEvent: PropTypes.func.isRequired,
        looseevents: PropTypes.array.isRequired,
        addLooseEvent: PropTypes.func.isRequired,
        getLooseEvents: PropTypes.func.isRequired,
        editLooseEvent: PropTypes.func.isRequired,
        days: PropTypes.array.isRequired,
        addDay: PropTypes.func.isRequired,
        getDays: PropTypes.func.isRequired,
        editDay: PropTypes.func.isRequired,
        deleteDay: PropTypes.func.isRequired,
        times: PropTypes.array.isRequired,
        addTime: PropTypes.func.isRequired,
        getTimes: PropTypes.func.isRequired,
        editTime: PropTypes.func.isRequired,
        occurs_on_1s: PropTypes.array.isRequired,
        addoccurs_on_1: PropTypes.func.isRequired,
        getoccurs_on_1s: PropTypes.func.isRequired,
        deleteoccurs_on_1: PropTypes.func.isRequired,
        occurs_on_2s: PropTypes.array.isRequired,
        addoccurs_on_2: PropTypes.func.isRequired,
        getoccurs_on_2s: PropTypes.func.isRequired,
        deleteoccurs_on_2: PropTypes.func.isRequired,
    };

    componentDidMount() {
        //this is the case where we are adding a new event
        if (this.props.location.state === undefined) {
            this.props.getStrictEvents("last");
            this.props.getLooseEvents("last");
            this.props.getDays("last");
            this.props.getTimes("last");
        //this is the case where we are editing an old event
        } else {
            const { event_id, eventType, day_ids, time_ids, o_o_ids } = this.props.location.state;
            if (eventType === true) {
                this.props.getStrictEvents(event_id);
                this.props.getDays(day_ids);
                this.props.getTimes(time_ids);
                this.props.getoccurs_on_1s(o_o_ids);
            } else if (eventType === false) {
                this.props.getLooseEvents(event_id);
                this.props.getDays(day_ids);
                this.props.getTimes(time_ids);
                this.props.getoccurs_on_2s(o_o_ids);
            } else {
                console.log("Issue with the eventType value passed into edit.")
            }
            this.setState({ ...this.state, inEdit: true });
        }
    }

    onChange = (e, e2) => {
        //console.log(e);
        //console.log(e2);
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
                if (this.state.durationBool != e.target.id.slice(0, -1)) {
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
            if (e2.target != null) {
                const index = parseInt(e2.target.parentNode.childNodes[0].name.slice(3));
                const theLen = parseInt(this.state.days.length);
                const newDays = this.state.days.slice(0, index).concat(this.state.days.slice(index + 1, theLen));
                const newTimes = this.state.times.slice(0, index).concat(this.state.times.slice(index + 1, theLen - 1));
                const newDurations = this.state.durations.slice(0, index).concat(this.state.durations.slice(index + 1, theLen - 1));
                this.setState({ ...this.state, "days": newDays, "times": newTimes, "durations": newDurations });
            }
        } else if (e instanceof moment) {
            const currentlySelectedTimeOrDuration = this.state.currentlySelectedTimeOrDuration;
            if (currentlySelectedTimeOrDuration.slice(0, 7) === "tPicker") {
                if (currentlySelectedTimeOrDuration.slice(7) === "Only") {
                    this.setState({ ...this.state, "time": e2 })
                } else {
                    const index = parseInt(currentlySelectedTimeOrDuration.slice(7));
                    if (this.state.chooseDay === "anyday") {
                        const times = this.state.times;
                        this.setState({ ...this.state, "times": (times.slice(0, index).concat([e2])).concat(times.slice(index + 1)) })
                    } else if (this.state.chooseDay === "dayoftheweek") {
                        const timesInWeek = this.state.timesInWeek;
                        this.setState({ ...this.state, "timesInWeek": (timesInWeek.slice(0, index).concat([e2])).concat(timesInWeek.slice(index + 1)) })
                    }
                }
            } else if (currentlySelectedTimeOrDuration.slice(0, 7) === "dPicker") {
                if (currentlySelectedTimeOrDuration.slice(7) === "Only") {
                    this.setState({ ...this.state, "duration": e2 })
                } else {
                    const index = parseInt(currentlySelectedTimeOrDuration.slice(7));
                    if (this.state.chooseDay === "anyday") {
                        const durations = this.state.durations;
                        this.setState({ ...this.state, "durations": (durations.slice(0, index).concat([e2])).concat(durations.slice(index + 1)) })
                    } else if (this.state.chooseDay === "dayoftheweek") {
                        const durationsInWeek = this.state.durationsInWeek;
                        this.setState({ ...this.state, "durationsInWeek": (durationsInWeek.slice(0, index).concat([e2])).concat(durationsInWeek.slice(index + 1)) })
                    }
                }
            } else {
                console.log("Unimplemented on change issue with TimePicker");
            }
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
                var dateInState = false;
                for (var i = 0; i < this.state.days.length; i++){
                    if (this.state.days[i] === dateStr) {
                        dateInState = true;
                        break;
                    }
                }
                if (dateInState) {
                    this.props.repeatedEventDay.bind(this)(dateStr);
                } else {
                    const index = parseInt(e2.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className.slice(27));
                    const newArr = ((this.state.days.slice(0, index).concat([dateStr])).concat(this.state.days.slice(index + 1))).concat([null]);
                    const newDays = newArr.filter(function(item, pos) {
                        return newArr.indexOf(item) == pos;
                    });
                    const newTimes = (this.state.times.slice(0, index).concat([null])).concat(this.state.times.slice(index + 1));
                    const newDurations = (this.state.durations.slice(0, index).concat([null])).concat(this.state.durations.slice(index + 1));
                    this.setState({ ...this.state, "days": newDays, "times": newTimes, "durations": newDurations});
                }
            }            
        }
    }

    onClick = (e) => {
        if (e.target.nodeName === "INPUT") {
            this.setState({...this.state, "currentlySelectedTimeOrDuration": e.target.name});
        } else if (e.target.nodeName === "path" || e.target.nodeName === "svg") {
            const theChild = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0];
            var clearName = theChild.name;
            if (clearName == null) {
                clearName = theChild.childNodes[0].name;
            }
            const prefix = clearName.slice(0, 7);
            const suffix = clearName.slice(7);
            if (prefix === "tPicker") {
                if (suffix === "Only") {
                    this.setState({ ...this.state, "time": null })
                } else {
                    const index = parseInt(suffix);
                    if (this.state.chooseDay === "anyday") {
                        const times = this.state.times;
                        this.setState({ ...this.state, "times": (times.slice(0, index).concat([null])).concat(times.slice(index + 1)) })
                    } else if (this.state.chooseDay === "dayoftheweek") {
                        const timesInWeek = this.state.timesInWeek;
                        this.setState({ ...this.state, "timesInWeek": (timesInWeek.slice(0, index).concat([null])).concat(timesInWeek.slice(index + 1)) })
                    }
                }
            } else if (prefix === "dPicker") {
                if (suffix === "Only") {
                    this.setState({ ...this.state, "duration": null })
                } else {
                    const index = parseInt(suffix);
                    if (this.state.chooseDay === "anyday") {
                        const durations = this.state.durations;
                        this.setState({ ...this.state, "durations": (durations.slice(0, index).concat([null])).concat(durations.slice(index + 1)) })
                    } else if (this.state.chooseDay === "dayoftheweek") {
                        const durationsInWeek = this.state.durationsInWeek;
                        this.setState({ ...this.state, "durationsInWeek": (durationsInWeek.slice(0, index).concat([null])).concat(durationsInWeek.slice(index + 1)) })
                    }
                }
            } else {
                console.log("Unimplemented on change issue with TimePicker");
            }
        } else if (e.target.nodeName === "DIV") {
            const classString = e.target.className;
            const classStringArr = classString.split(" ");
            const includeBool = classStringArr.includes("ant-picker-input");
            if (includeBool) {
                this.setState({ ...this.state, "currentlySelectedTimeOrDuration": e.target.childNodes[0].name });
            } else {
                this.setState({ ...this.state, "currentlySelectedTimeOrDuration": e.target.childNodes[0].childNodes[0].name });
            }
        } else {
            console.log("Unimplemented onClick event.")
        }
    }

    onSubmit = (e) => {
        //for editing, just go where there is the this.props.add, and change it to a .patch function where each value that is submitted is compared to the old values in 'prevEventState'
        
        e.preventDefault();
        const { name, days, daysInWeek, fixed, chooseDay, recurring, timeBool, durationBool, time, duration, times, timesInWeek, durations, durationsInWeek, currentlySelectedTimeOrDuration, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore, submittedBool, inEdit, prevEventState } = this.state;
        
        const theTimes = (timeBool === "yes") ? time : (chooseDay === "anyday" ? times : timesInWeek);
        const theDurations = (durationBool === "yes") ? duration : (chooseDay === "anyday" ? durations : durationsInWeek);
        const theRecurring = (chooseDay === "dayoftheweek") ? (recurring === "yes" ? true : false) : false;

        // if true then we are adding a new event, if false then we are editing an old event
        const editBool = (this.props.location.state === undefined);

        if (fixed) {

            // this is probably not the best way to implement creating the id since if multiple people are logged into the same account,
            // and they create event definitions at the same time, there could be an issue
            // this also applies for the generation of the day_id and time_id below
            const event_id = editBool ? (this.props.strictevents.length === 0 ? 1 : this.props.strictevents[0].event_id + 1) : this.props.strictevents[0].event_id;

            const eventdefinition = { 
                event_id,
                "event_name": name,
                "priority": 0,
                "recurring": theRecurring,
                "active_for_generation": false,
            };

            //this.props.addEventDefinition(eventdefinition);

            if (editBool) {
                this.props.addStrictEvent(eventdefinition);
            } else {
                var editObject = {};
                if (name != prevEventState.name) {
                    editObject['event_name'] = name;
                }
                if (theRecurring !== this.props.strictevents[0].recurring) {
                    editObject['recurring'] = theRecurring;
                }
                if (this.props.strictevents[0].active_for_generation !== false) {
                    editObject['active_for_generation'] = false;
                }
                if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                    console.log(event_id);
                    console.log(editObject);
                    this.props.editStrictEvent(event_id, editObject);
                }
            }

            if (chooseDay === "anyday") {
                for (var i = 0; i < (days.length - 1); i++) {
                    const formatMonth = (days[i].charAt(1) === "/") ? ("0" + days[i].charAt(0)) : days[i].slice(0, 2);
                    const formatDay = (days[i].charAt(1) === "/") ?
                        (days[i].charAt(3) === "/" ? ("0" + days[i].charAt(2)) : days[i].slice(2, 4)) :
                        (days[i].charAt(4) === "/" ? ("0" + days[i].charAt(3)) : days[i].slice(3, 5));
                    const formatYear = (days[i].charAt(3) === "/") ?
                        days[i].slice(4) :
                        ((days[i].charAt(4) === "/") ?
                            days[i].slice(5) :
                            days[i].slice(6));
                    const formattedDay = formatYear + "-" + formatMonth + "-" + formatDay;
                    // could be an issue for the edit case, but it depends if, when a day is added to state, that is added at the end or in order of day_id (i think it's the former, so it should be fine)
                    const day_id = editBool ? (this.props.days.length === 0 ? i + 1 : this.props.days[0].day_id + i + 1) : (i < this.props.days.length ? this.props.days[i].day_id : this.props.days[0].day_id + i + 1);
                    const theDay = {
                        day_id, 
                        "day_date": formattedDay, 
                        "day_str": "",
                    };
                    if (editBool || (!editBool && (i >= this.props.days.length))) {
                        console.log(theDay);
                        this.props.addDay(theDay);
                    } else {
                        var editObject = {};
                        if (formattedDay !== this.props.days[i].day_date) {
                            editObject['day_date'] = formattedDay;
                        }
                        if ("" !== this.props.days[i].day_str) {
                            editObject['day_str'] = "";
                        }
                        if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                            console.log(day_id);
                            console.log(editObject);
                            this.props.editDay(day_id, editObject);
                        }
                    }
                    const dMinute = (durationBool === "yes") ? parseInt(duration.slice(-2)) : parseInt(theDurations[i].slice(-2));
                    const dHour = (durationBool === "yes") ?
                        (duration.length === 5 ? parseInt(duration.slice(0, 2)) : parseInt(duration.slice(0, 1))) :
                        (theDurations[i].length === 5 ? parseInt(theDurations[i].slice(0, 2)) : parseInt(theDurations[i].slice(0, 1)));
                    const endTime = (timeBool === "yes") ?
                        (moment(time, "HH:mm").add(dHour, 'h').add(dMinute, 'm')).format("hh:mm:ss") :
                        (moment(theTimes[i], "HH:mm").add(dHour, 'h').add(dMinute, 'm')).format("hh:mm:ss");
                    if (timeBool === "yes") {
                        const time_id = editBool ? (this.props.times.length === 0 ? i + 1 : this.props.times[0].time_id + i + 1) : (i < this.props.times.length ? this.props.times[i].time_id : this.props.times[0].time_id + i + 1);
                        const theTime = { 
                            time_id, 
                            "start": time, 
                            "end": endTime 
                        };
                        const occurs_on_1 = {
                            event_id, 
                            day_id, 
                            time_id
                        };
                        if (editBool || (!editBool && (i >= this.props.times.length))) {
                            console.log(theTime);
                            console.log(occurs_on_1);
                            this.props.addTime(theTime);
                            this.props.addoccurs_on_1(occurs_on_1);
                        } else {
                            var editObject = {};
                            if (time != this.props.times[i].start) {
                                editObject['start'] = time;
                            }
                            if (endTime != this.props.times[i].end) {
                                editObject['end'] = endTime;
                            }
                            if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                                console.log(time_id);
                                console.log(editObject);
                                this.props.editTime(time_id, editObject);
                            }
                        }

                    } else {
                        const time_id = editBool ? (this.props.times.length === 0 ? i + 1 : this.props.times[0].time_id + i + 1) : (i < this.props.times.length ? this.props.times[i].time_id : this.props.times[0].time_id + i + 1);
                        const theTime = {
                            time_id, 
                            "start": theTimes[i], 
                            "end": endTime
                        };
                        const occurs_on_1 = {
                            event_id, 
                            day_id, 
                            time_id
                        };
                        if (editBool || (!editBool && (i >= this.props.times.length))) {
                            console.log(theTime);
                            console.log(occurs_on_1);
                            this.props.addTime(theTime);
                            this.props.addoccurs_on_1(occurs_on_1);
                        } else {
                            var editObject = {};
                            if (theTimes[i] != this.props.times[i].start) {
                                editObject['start'] = theTimes[i];
                            }
                            if (endTime != this.props.times[i].end) {
                                editObject['end'] = endTime;
                            }
                            if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                                console.log(time_id);
                                console.log(editObject);
                                this.props.editTime(time_id, editObject);
                            }
                        }
                    }
                }
                console.log(days.length - 1);
                console.log(this.props.days.length);
                if (days.length - 1 < this.props.days.length) {
                    for (var i = days.length - 1; i < this.props.days.length; i++) {
                        const a_o_o_1 = this.props.occurs_on_1s[i];
                        console.log("======================================");
                        console.log(days.length - 1);
                        console.log(this.props.days.length);
                        console.log(a_o_o_1);
                        this.props.deleteTime(a_o_o_1.time);
                        this.props.deleteDay(a_o_o_1.day);
                        this.props.deleteoccurs_on_1(a_o_o_1.id);
                    }
                }
            } else {
                var editCounter = -1;
                const allDayStr = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
                for (var i = 0; i < (daysInWeek.length); i++) {
                    if (daysInWeek[i]) {
                        editCounter += 1;
                        const day_id = editBool ? (this.props.days.length === 0 ? i + 1 : this.props.days[0].day_id + i + 1) : (editCounter < this.props.days.length ? this.props.days[editCounter].day_id : this.props.days[0].day_id + i + 1);
                        const theDay = { 
                            day_id, 
                            "day_date": "9999-01-01", 
                            "day_str": allDayStr[i]
                        };
                        if (editBool || (!editBool && (editCounter >= this.props.days.length))) {
                            console.log(theDay);
                            this.props.addDay(theDay);
                        } else {
                            var editObject = {};
                            if ("9999-01-01" !== this.props.days[editCounter].day_date) {
                                editObject['day_date'] = "9999-01-01";
                            }
                            if (allDayStr[i] !== this.props.days[editCounter].day_str) {
                                editObject['day_str'] = allDayStr[i];
                            }
                            if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                                console.log(day_id);
                                console.log(editObject);
                                this.props.editDay(day_id, editObject);
                            }
                        }
                        const dMinute = (durationBool === "yes") ? parseInt(duration.slice(-2)) : parseInt(theDurations[i].slice(-2));
                        const dHour = (durationBool === "yes") ?
                            (duration.length === 5 ? parseInt(duration.slice(0, 2)) : parseInt(duration.slice(0, 1))) :
                            (theDurations[i].length === 5 ? parseInt(theDurations[i].slice(0, 2)) : parseInt(theDurations[i].slice(0, 1)));
                        const endTime = (timeBool === "yes") ?
                            (moment(time, "HH:mm").add(dHour, 'h').add(dMinute, 'm')).format("hh:mm:ss") :
                            (moment(theTimes[i], "HH:mm").add(dHour, 'h').add(dMinute, 'm')).format("hh:mm:ss");
                        if (timeBool === "yes") {
                            const time_id = editBool ? (this.props.times.length === 0 ? i + 1 : this.props.times[0].time_id + i + 1) : (editCounter < this.props.times.length ? this.props.times[editCounter].time_id : this.props.times[0].time_id + i + 1);
                            const theTime = {
                                time_id, 
                                "start": time, 
                                "end": endTime
                            };
                            const occurs_on_1 = {
                                event_id, 
                                day_id, 
                                time_id
                            };
                            if (editBool || (!editBool && (editCounter >= this.props.times.length))) {
                                console.log(theTime);
                                console.log(occurs_on_1);
                                this.props.addTime(theTime);
                                this.props.addoccurs_on_1(occurs_on_1);
                            } else {
                                var editObject = {};
                                if (time != this.props.times[editCounter].start) {
                                    editObject['start'] = time;
                                }
                                if (endTime != this.props.times[editCounter].end) {
                                    editObject['end'] = endTime;
                                }
                                if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                                    console.log(time_id);
                                    console.log(editObject);
                                    this.props.editTime(time_id, editObject);
                                }
                            }
                        } else {
                            const time_id = editBool ? (this.props.times.length === 0 ? i + 1 : this.props.times[0].time_id + i + 1) : (editCounter < this.props.times.length ? this.props.times[editCounter].time_id : this.props.times[0].time_id + i + 1);
                            const theTime = { 
                                time_id, 
                                "start": theTimes[i], 
                                "end": endTime 
                            };
                            const occurs_on_1 = {
                                event_id, 
                                day_id, 
                                time_id
                            };
                            if (editBool || (!editBool && (editCounter >= this.props.times.length))) {
                                console.log(theTime);
                                console.log(occurs_on_1);
                                this.props.addTime(theTime);
                                this.props.addoccurs_on_1(occurs_on_1);
                            } else {
                                var editObject = {};
                                if (theTimes[i] != this.props.times[editCounter].start) {
                                    editObject['start'] = theTimes[i];
                                }
                                if (endTime != this.props.times[editCounter].end) {
                                    editObject['end'] = endTime;
                                }
                                if (Object.keys(editObject).length !== 0 || editObject.constructor !== Object) {
                                    console.log(time_id);
                                    console.log(editObject);
                                    this.props.editTime(time_id, editObject);
                                }
                            }
                        }
                    }
                }
                if (editCounter < this.props.days.length - 1) {
                    for (var i = editCounter + 1; i < this.props.days.length; i++) {
                        const a_o_o_1 = this.props.occurs_on_1s[i];
                        console.log("-----------------------------------");
                        console.log(editCounter);
                        console.log(this.props.days.length - 1);
                        console.log(a_o_o_1);
                        this.props.deleteTime(a_o_o_1.time);
                        this.props.deleteDay(a_o_o_1.day);
                        this.props.deleteoccurs_on_1(a_o_o_1.id);
                    }
                }
            }

        } else {

            const event_id = this.props.looseevents === [] ? 1 : this.props.looseevents[0].event_id + 1;

            const eventdefinition = { 
                event_id,
                "event_name": name,
                "priority": 1,
                recurring,
                "active_for_generation": false,
            };

            //const looseEvent = this.props.addEventDefinition(eventdefinition);
            //this.props.addLooseEvent({?, ?, ?, ..., ?})
            //const event_id = ?;

            //const occurs_on_2 = {?, ?};
            //this.props.addoccurs_on_2(occurs_on_2);
        }

        //theDays, recurring, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore };

      this.setState({
        name: "",
        days: [null],
        daysInWeek: [false, false, false, false, false, false, false],
        fixed: "",
        chooseDay: "",
        recurring: "",
        timeBool: "",
        durationBool: "",
        time: null,
        duration: null,
        times: [],
        timesInWeek: [null, null, null, null, null, null, null],
        durations: [],
        durationsInWeek: [null, null, null, null, null, null, null],
        currentlySelectedTimeOrDuration: null,
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
        submittedBool: true,
        inEdit: false,
        prevEventState: null,
      });
    };

    render() {

        var { name, days, daysInWeek, fixed, chooseDay, recurring, timeBool, durationBool, time, duration, times, timesInWeek, durations, durationsInWeek, currentlySelectedTimeOrDuration, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore, submittedBool, inEdit, prevEventState } = this.state;
        
        //this is the case where we are editing an old event
        if (inEdit && (this.props.days.length >= 1) && (this.props.times.length >= 1) && ((this.props.strictevents.length >= 1) || (this.props.looseevents.length >= 1))) {
            const { event_id, eventType, day_ids, time_ids, o_o_ids } = this.props.location.state;
            var strictevent_valid = false;
            var looseevent_valid = false;
            var time_valid = true;
            var day_valid = true;
            if (eventType === true) {
                if (event_id === this.props.strictevents[0].event_id) {
                    strictevent_valid = true;
                }
            }
            if (eventType === false) {
                if (event_id === this.props.looseevents[0].event_id) {
                    looseevent_valid = true;
                }
            }
            const propDayIds = this.props.days.map((day) => day.day_id).sort();
            const propTimeIds = this.props.times.map((time) => time.time_id).sort();
            const sorted_day_ids = day_ids.sort();
            const sorted_time_ids = time_ids.sort();
            for (var j = 0; j < day_ids.length; j++) {
                if (propDayIds[j] != sorted_day_ids[j]) {
                    day_valid = false;
                }
            }
            for (var k = 0; k < time_ids.length; k++) {
                if (propTimeIds[k] != sorted_time_ids[k]) {
                    time_valid = false;
                }
            }
            if ((strictevent_valid || looseevent_valid) && (time_valid) && (day_valid)) {
                var all_same_dura = true && (this.props.times.length !== 1);
                var all_same_time = true && (this.props.times.length !== 1);
                var prevStartTime = this.props.times[0].start;
                var prevDuration = moment(this.props.times[0].end, "HH:mm").subtract(prevStartTime.slice(0, 2), 'h').subtract(prevStartTime.slice(3, 5), 'm').format('hh:mm')
                for (var i = 0; i < this.props.days.length; i++) {
                    if ((i != 0) && (this.props.times.length === this.props.days.length)) {
                        const startTime = this.props.times[i].start;
                        const hour = startTime.slice(0, 2);
                        const minute = startTime.slice(3, 5);
                        const duration = moment(this.props.times[i].end, "HH:mm").subtract(hour, 'h').subtract(minute, 'm').format('hh:mm');
                        all_same_dura = all_same_dura && (duration === prevDuration);
                        all_same_time = all_same_time && (startTime === prevStartTime);
                        prevStartTime = startTime;
                        prevDuration = duration;
                    }
                    const day_date = this.props.days[i].day_date;
                    if (day_date === "9999-01-01") {
                        chooseDay = "dayoftheweek";
                        const day_str = this.props.days[i].day_str;
                        if (day_str === "Mo") {
                            daysInWeek[0] = true;
                            timesInWeek[0] = prevStartTime;
                            durationsInWeek[0] = prevDuration;
                        } else if (day_str === "Tu") {
                            daysInWeek[1] = true;
                            timesInWeek[1] = prevStartTime;
                            durationsInWeek[1] = prevDuration;
                        } else if (day_str === "We") {
                            daysInWeek[2] = true;
                            timesInWeek[2] = prevStartTime;
                            durationsInWeek[2] = prevDuration;
                        } else if (day_str === "Th") {
                            daysInWeek[3] = true;
                            timesInWeek[3] = prevStartTime;
                            durationsInWeek[3] = prevDuration;
                        } else if (day_str === "Fr") {
                            daysInWeek[4] = true;
                            timesInWeek[4] = prevStartTime;
                            durationsInWeek[4] = prevDuration;
                        } else if (day_str === "Sa") {
                            daysInWeek[5] = true;
                            timesInWeek[5] = prevStartTime;
                            durationsInWeek[5] = prevDuration;
                        } else if (day_str === "Su") {
                            daysInWeek[6] = true;
                            timesInWeek[6] = prevStartTime;
                            durationsInWeek[6] = prevDuration;
                        } else {
                            console.log("Invalid day_str in AddEvent Edit Render");
                        }
                    } else {
                        chooseDay = "anyday";
                        days = days.slice(0, -1).concat([day_date.slice(5, 7) + "/" + day_date.slice(8, 10) + "/" + day_date.slice(0, 4)].concat(days.slice(-1)));
                        times = times.concat([prevStartTime]);
                        durations = durations.concat([prevDuration]);
                    }
                }
                timeBool = all_same_time ? "yes" : "no";
                durationBool = all_same_dura ? "yes" : "no";
                if (all_same_dura) {
                    duration = prevDuration;
                }
                if (all_same_time) {
                    time = prevStartTime;
                }
                if (eventType === true) {
                    name = this.props.strictevents[0].event_name;
                    fixed = "strict";
                    recurring = this.props.strictevents[0].recurring ? "yes" : "no";
                } else if (eventType === false) {
                    name = this.props.looseevents[0].event_name;
                    fixed = "loose";
                    recurring = this.props.looseevents[0].recurring ? "yes" : "no";
                } else {
                    console.log("Issue with the eventType value passed into edit.")
                }
                prevEventState = { name, days, daysInWeek, fixed, chooseDay, recurring, timeBool, durationBool, time, duration, times, timesInWeek, durations, durationsInWeek, currentlySelectedTimeOrDuration, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore, submittedBool, inEdit, prevEventState: null };
                this.setState({ name, days, daysInWeek, fixed, chooseDay, recurring, timeBool, durationBool, time, duration, times, timesInWeek, durations, durationsInWeek, currentlySelectedTimeOrDuration, eoa1, eoa2, nocc, noccless, noccmore, occsameday, nnn1, nnn2, nnn3, nnn4, ntime, ntimeless, ntimemore, submittedBool, inEdit: false, prevEventState });
            }
        }

        if (submittedBool) {
            return <Redirect to="/eventDefinitions" />;
        }
        
        const minDate = new Date();

        const eventName = (
            <div key="eventName" className="form-group">
                <label className = "noselect">Event Name</label>
                <input
                className="form-control"
                type="text"
                name="name"
                autoComplete="off"
                onChange={this.onChange}
                value={name}
                />
            </div>
        );

        const validName = name === "" ? false : true;

        const chooseDaySelector = (
            <div key="chooseDaySelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label className = "noselect">Choose the Day(s) the Event could/will occur on:</label>
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
            className="form-control noselect" 
            isClearable
            autoComplete="off"
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
            <div key={day} className={day === "Su" ? "btn-group mt-2" : "btn-group mt-2 mr-2"} role="group">
                <input className={activity ? "btn btn-secondary p-1 pr-2 pl-2 active noselect" : "btn btn-secondary p-1 pr-2 pl-2 noselect"} type="button" name="aWeekDayPicker" value={day} onClick={this.onChange} />
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
            <div key="weekdayPicker" className="btn-toolbar form-group justify-content-center" role="toolbar">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => 
                aWeekdayInPicker(getDayInWeek(index)[1], daysInWeek[index]))}
            </div>
        );

        const validDay = (((JSON.stringify(days) !== JSON.stringify([null]) && chooseDay === "anyday") || (JSON.stringify(daysInWeek) !== JSON.stringify([false, false, false, false, false, false, false]) && chooseDay === "dayoftheweek"))  ? true : false) && validChooseDay;

        const recurringSelector = (
            <div key="recurringSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label className = "noselect">Does your Event repeat weekly?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={recurring === "yes" ? "btn btn-outline-warning active noselect" : "btn btn-outline-warning noselect"} type="button" name="recurring" id="yes" value="Yes" onClick={this.onChange} />
                    <input className={recurring === "no" ? "btn btn-outline-success active noselect" : "btn btn-outline-success noselect"} type="button" name="recurring" id="no" value="No" onClick={this.onChange} />
                </div>
            </div>
        );

        const validRecurring = (recurring === "" ? false : true) && validDay;

        const fixedSelector = (
            <div key="fixedSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label className = "noselect">Is your Event Strict or Loose?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={fixed === "strict" ? "btn btn-outline-warning active noselect" : "btn btn-outline-warning noselect"} type="button" name="fixed" id="strict" value="Strict" onClick={this.onChange} />
                    <input className={fixed === "loose" ? "btn btn-outline-success active noselect" : "btn btn-outline-success noselect"} type="button" name="fixed" id="loose" value="Loose" onClick={this.onChange} />
                </div>
            </div>
        );
        
        const validFixed = (fixed === "" ? false : true) && (validRecurring || (validDay && chooseDay === "anyday"));

        const sameTimeSelector = (
            <div key="sameTimeSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label className = "noselect">Does your Event occur at the same time everyday?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={timeBool === "yes" ? "btn btn-outline-warning active noselect" : "btn btn-outline-warning noselect"} type="button" name="timeBool" id="yes2" value="Yes" onClick={this.onChange} />
                    <input className={timeBool === "no" ? "btn btn-outline-success active noselect" : "btn btn-outline-success noselect"} type="button" name="timeBool" id="no2" value="No" onClick={this.onChange} />
                </div>
            </div>
        );

        const validSameTime = timeBool === "" ? false : true

        const trueCount = daysInWeek.reduce((acc, cV) => acc + (cV ? 1 : 0));

        const aTimePicker = (dayVal, index) => (
            <div key={"aTimePicker" + index.toString()} className="form-group d-flex flex-row flex-wrap justify-content-center align-items-center">
                {
                (((days.length > 2 && chooseDay === "anyday") || (trueCount > 1 && chooseDay ==="dayoftheweek")) && timeBool === "yes") ?
                    <label className="label-p noselect">Everyday the start time is:</label> :
                    ((dayVal === true || dayVal === false) ? 
                        <label className="label-p noselect">{ getDayInWeek(index)[0] + " the start time is:"}</label> :
                        <label className="label-p noselect">{ dayVal + " the start time is:"}</label>)
                }
                <TimePicker 
                value={
                    (timeBool === "yes") ? 
                        (time === null ? "" : moment(time, "HH:mm")) :
                        ((chooseDay === "anyday") ?
                            (times[index] === null ? "" : moment(times[index], "HH:mm")) :
                            ((chooseDay === "dayoftheweek") ?
                                (timesInWeek[index] === null ? "" : moment(timesInWeek[index], "HH:mm")) :
                                ""))
                }
                autoComplete="off"
                placeholder="Select Time"
                name = {"tPicker" + index.toString()}
                minuteStep = {5}
                format={"HH:mm"}
                onChange = {this.onChange}
                onClick = {this.onClick}
                onSelect = {this.onSelect}
                />
            </div>
        );

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

        const trueFinderReducer = (acc, cV) => acc + (cV ? 1 : 0);
        
        const validTimePicker = ((
            ([...Array(times.length).keys()].every(v => (days[v] === null) || ((days[v] !== null) && (times[v] !== null))) && ((timeBool === "no") || (days[1] === null)) && chooseDay === "anyday")
        || ([...Array(7).keys()].every(v => !daysInWeek[v] || (daysInWeek[v] && (timesInWeek[v] !== null))) && ((timeBool === "no") || (daysInWeek.reduce(trueFinderReducer, 0) === 1)) && chooseDay === "dayoftheweek") 
        || ((time !== null) && (timeBool === "yes"))) ? true : false) && (validSameTime || (daysInWeek.reduce(trueFinderReducer, 0) === 1) || (days[1] === null));

        const sameDurationSelector = (
            <div key="sameDurationSelector" className="form-group d-flex flex-column flex-wrap justify-content-center">
                <label className = "noselect">Is the duration of your event the same everyday?</label>
                <div className="btn-group btn-group-toggle">
                    <input className={durationBool === "yes" ? "btn btn-outline-warning active noselect" : "btn btn-outline-warning noselect"} type="button" name="durationBool" id="yes3" value="Yes" onClick={this.onChange} />
                    <input className={durationBool === "no" ? "btn btn-outline-success active noselect" : "btn btn-outline-success noselect"} type="button" name="durationBool" id="no3" value="No" onClick={this.onChange} />
                </div>
            </div>
        );

        const validSameDuration = (durationBool === "" ? false : true) && validTimePicker;

        const aDurationPicker = (dayVal, index) => (
            <div key={"aDurationPicker" + index.toString()} className="form-group d-flex flex-row flex-wrap justify-content-center align-items-center">
                {
                (((days.length > 2 && chooseDay === "anyday") || (trueCount > 1 && chooseDay ==="dayoftheweek")) && durationBool === "yes") ?
                    <label className="label-p noselect">Everyday the duration is:</label> :
                    ((dayVal === true || dayVal === false) ? 
                        <label className="label-p noselect">{"On " + getDayInWeek(index)[0] + " the duration is:"}</label> :
                        <label className="label-p noselect">{"On " + dayVal + " the duration is:"}</label>)
                }
                <TimePicker 
                value={
                    (durationBool === "yes") ? 
                        (duration === null ? "" : moment(duration, "HH:mm")) :
                        ((chooseDay === "anyday") ?
                            (durations[index] === null ? "" : moment(durations[index], "HH:mm")) :
                            ((chooseDay === "dayoftheweek") ?
                                (durationsInWeek[index] === null ? "" : moment(durationsInWeek[index], "HH:mm")) :
                                ""))
                }
                
                autoComplete="off"
                placeholder="Select Duration"
                name = {"dPicker" + index.toString()}
                minuteStep = {5}
                format={"HH:mm"}
                onChange = {this.onChange}
                onClick = {this.onClick}
                onSelect = {this.onSelect}
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

        const validDurationPicker = ((([...Array(durations.length).keys()].every(v => (days[v] === null) || ((days[v] !== null) && (durations[v] !== null))) && ((durationBool === "no") || (days[1] === null)) && chooseDay === "anyday") 
        || ([...Array(7).keys()].every(v => !daysInWeek[v] || (daysInWeek[v] && (durationsInWeek[v] !== null))) && ((durationBool === "no") || (daysInWeek.reduce(trueFinderReducer, 0) === 1)) && chooseDay === "dayoftheweek") 
        || ((duration !== null) && (durationBool === "yes")))  ? true : false) && (validSameDuration || (daysInWeek.reduce(trueFinderReducer, 0) === 1) || (days[1] === null));

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
                <button type="submit" className="btn btn-primary btn-block noselect">
                {(this.props.location.state === undefined) ? "Create Event" : "Update Event"}
                </button>
            </div>
        );

        const insideForm = [eventName, validName ? chooseDaySelector : null, !validChooseDay ? null :  ((chooseDay === "anyday") ? dayPicker : ((chooseDay === "dayoftheweek") ? weekdayPicker : null)), validDay && (chooseDay === "dayoftheweek") ? recurringSelector : null, validRecurring || (validDay && chooseDay === "anyday") ? fixedSelector : null, validFixed ? looseOrStrictPortion : null, validLooseOrStrictPortion ? submitButton : null];

        return (
            <div className="card p-4 eventContainer overflow-auto">
                <form onSubmit={this.onSubmit}>
                    {insideForm.map((somethingInside) => somethingInside)}
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    strictevents: state.schedules.strictevents,
    looseevents: state.schedules.looseevents,
    days: state.schedules.days,
    times: state.schedules.times,
    occurs_on_1s: state.schedules.occurs_on_1s,
    occurs_on_2s: state.schedules.occurs_on_2s,
});

//export default connect(mapStateToProps, { dayWrong, monthWrong, dateTooEarly, repeatedEventDay, addEventDefinition, getEventDefinitions, addStrictEvent, addLooseEvent, addDay, getDays, addTime, getTimes, addoccurs_on_1, addoccurs_on_2 })(AddEvent);
export default connect(mapStateToProps, { dayWrong, monthWrong, dateTooEarly, repeatedEventDay, addStrictEvent, getStrictEvents, editStrictEvent, addLooseEvent, getLooseEvents, editLooseEvent, addDay, getDays, editDay, deleteDay, addTime, getTimes, editTime, deleteTime, addoccurs_on_1, getoccurs_on_1s, deleteoccurs_on_1, addoccurs_on_2, getoccurs_on_2s, deleteoccurs_on_2 })(AddEvent);

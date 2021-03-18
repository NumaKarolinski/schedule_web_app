import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    getEventDefinitions,
    editEventDefinition,
    getEventType,
    deleteStrictEvent,
    deleteLooseEvent,
    deleteDay,
    deleteTime,
    getoccurs_on_1s,
    getoccurs_on_2s,
} from "../../actions/schedules";

import "./Events.css";

function ChooseButtons(props) {
    if (props.selectedEventId !== -1) {
        return(
            <div className="d-flex flex-row flex-wrap justify-content-around">
                <button id="editEvent" onClick = {props.onClick} className="btn btn-info btn-sm noselect" style = { props.collapseTwo ? { marginLeft: "50px", marginRight: "62px" } : (props.collapseOne ? { marginLeft: "28px", marginRight: "6px" } : {}) } >{" "}Edit/View Event</button>
                <button id="addEvent" onClick = {props.onClick} style = { props.collapseTwo ? { marginLeft: "50px", marginRight: "62px", marginTop: "12px" } : (props.collapseOne ? { marginLeft: "6px", marginRight: "40px" } : { marginLeft : "27px", marginRight : "27px" }) } className="btn btn-success btn-sm noselect">{" "}Add New Event</button>
                <button id="deleteEvent" onClick = {props.onClick} className="btn btn-danger btn-sm noselect" style = { props.collapseTwo ? { marginLeft: "50px", marginRight: "62px", marginTop: "12px" } : (props.collapseOne ? { marginTop: "12px", marginRight: "12px" } : { marginRight: "12px" }) }>{" "}Delete Event</button>
            </div>
        );
    } else {
        return(
            <div className="d-flex justify-content-center">
                <button id="addEvent" style = {{ marginLeft : "7px" }} onClick = {props.onClick} className="btn btn-success btn-sm">{" "}Add New Event</button>
            </div>  
        );
    }
}

function ChooseTableHead(props) {
    const leftPadding = props.mediumMedia ? "calc(25% - 22px)" : (props.largeMedia ? "calc(25% - 62px)" : "calc(25% - 90px)");
    const rightPadding = props.mediumMedia ? "calc(25% - 22px)" : (props.largeMedia ? "calc(25% - 62px)" : "calc(25% - 90px)");
    if (props.numEvents <= 0){
        return null;
    } else{
        return (
            <thead style = {{ display: "table" }}>
                <tr style = {{ display: "table", tableLayout: "fixed", width: props.overflow ? "calc(100% - 12px)" : "100%" }}>
                    <th className = "noselect" style = {{ padding: "12px calc(25% - 20px)"}}>Name</th>
                    <th className = "noselect" style = {{ padding: "12px " + leftPadding + " 12px " + rightPadding }}>{ props.mediumMedia ? "Active" : (props.largeMedia ? "Active Generation" : "Active For Day Generation") }</th>
                </tr>
            </thead>
        );
    }
}

export class Events extends Component {
    
    state = {
        addEventBool: false,
        editEventBool: false,
        selectedEventId: -1,
        pageWidth: window.innerWidth,
        pageHeight: window.innerHeight,
    }

    static propTypes = {
        eventdefinitions: PropTypes.array.isRequired,
        getEventDefinitions: PropTypes.func.isRequired,
        editEventDefinition: PropTypes.func.isRequired,
        eventTypeBool: PropTypes.string.isRequired,
        getEventType: PropTypes.func.isRequired,
        deleteStrictEvent: PropTypes.func.isRequired,
        deleteLooseEvent: PropTypes.func.isRequired,
        deleteDay: PropTypes.func.isRequired,
        deleteTime: PropTypes.func.isRequired,
        occurs_on_1s: PropTypes.array.isRequired,
        getoccurs_on_1s: PropTypes.func.isRequired,
        occurs_on_2s: PropTypes.array.isRequired,
        getoccurs_on_2s: PropTypes.func.isRequired,
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({ ...this.state, pageWidth: window.innerWidth, pageHeight: window.innerHeight }));
        this.props.getEventDefinitions();
        this.props.getoccurs_on_1s();
        this.props.getoccurs_on_2s();
    }

    handleClick = (e) => {
        if (e.currentTarget.id === "editEvent") {
            this.setState({ ...this.state, editEventBool: !this.state.editEventBool });
        } else if (e.currentTarget.id === "addEvent") {
            this.setState({ ...this.state, addEventBool: !this.state.addEventBool });
        } else if (e.currentTarget.id === "deleteEvent") {
            this.setState({ ...this.state, selectedEventId: -1 });
            if (this.props.eventTypeBool === "true") {
                const all_deleted_occurs_on_1s = this.props.occurs_on_1s.filter((occurs_on_1) => occurs_on_1.event === this.state.selectedEventId);
                for (var i = 0; i < all_deleted_occurs_on_1s.length; i++) {

                    //Days and Times are related to O_o_1s, o_o_1s are also related to strict_events
                    //strict_events are related to eventdefinitions 
                    //it is a state tree, all the state must be deleted (state stored in memory).

                    //When Days and Times are deleted, they need to know about Occurs On 1
                    //and a Strict Event. This means they must be deleted before 
                    this.props.deleteDay(all_deleted_occurs_on_1s[i].day);
                    this.props.deleteTime(all_deleted_occurs_on_1s[i].time);
                }
                //When Strict Events are deleted, they don't need to know about anything else to be deleted. 
                //For this reason, they must be deleted last, therefore during this.props.deleteStrictEvent
                //The queryset won't be returned from get_queryset() until dependencies are deleted first.
                //Dependencies: Days, Times  --> Lock on: Days, Times 
                this.props.deleteStrictEvent(this.state.selectedEventId);
                //when 
            } else if (this.props.eventTypeBool === "false") {
                const all_deleted_occurs_on_2s = this.props.occurs_on_2s.filter((occurs_on_2) => occurs_on_2.event === this.state.selectedEventId);
                for (var i = 0; i < all_deleted_occurs_on_2s.length; i++) {
                    this.props.deleteDay(all_deleted_occurs_on_2s[i].day);
                }
                this.props.deleteLooseEvent(this.state.selectedEventId);
            } else {
                console.log("Something Went Wrong with the Deletion of an Event");
            }
        } else if (e.currentTarget.nodeName === "TR" && e.target.nodeName === "TD") {
            const targetedId = parseInt(e.currentTarget.id.slice(2));
            const passedId = this.state.selectedEventId === targetedId ? -1 : targetedId;
            this.setState({ ...this.state, selectedEventId: passedId });
            this.props.getEventType(passedId);
        } else {
            console.log("Handle Click of Events Button Failed");
        }
    }

    onChange = (e) => {
        if (e.target.id.slice(0, 12) === "customSwitch") {
            const editedEventDefinition = this.props.eventdefinitions.filter((eventdefinition) => eventdefinition.event_id == e.target.id.slice(12))[0];
            this.props.editEventDefinition(e.target.id.slice(12), {'active_for_generation': !editedEventDefinition['active_for_generation']});
        } else {
            console.log("On Change Not Implemented.");
        }
    }

    render() {

        if (this.state.addEventBool) {
            return <Redirect to = "/eventDefinitions/add" />;
        } else if (this.state.editEventBool) {
            //use selected event id to get all the occurs_on_1 / occurs_on_2 object which has all of the ids needed to be passed in
            const event_id = this.state.selectedEventId;
            if (this.props.eventTypeBool === "true") {
                const eventType = true;
                const selected_o_o_s = this.props.occurs_on_1s.filter((occurs_on_1) => occurs_on_1.event === this.state.selectedEventId);
                const o_o_ids = selected_o_o_s.map((o_o_1) => o_o_1.id);
                const day_ids = selected_o_o_s.map((o_o_1) => o_o_1.day);
                const time_ids = selected_o_o_s.map((o_o_1) => o_o_1.time);
                return <Redirect to = {{ pathname: "/eventDefinitions/edit", state: { event_id, eventType, day_ids, time_ids, o_o_ids } }} />;
            } else if (this.props.eventTypeBool === "false") {
                const eventType = false;
                const selected_o_o_s = this.props.occurs_on_2s.filter((occurs_on_2) => occurs_on_2.event === this.state.selectedEventId);
                const o_o_ids = selected_o_o_s.map((o_o_2) => o_o_2.id);
                const day_ids = selected_o_o_s.map((o_o_2) => o_o_2.day);
                const time_ids = null;
                return <Redirect to = {{ pathname: "/eventDefinitions/edit", state: { event_id, eventType, day_ids, time_ids, o_o_ids } }} />;
            } else {
                console.log("somehow event type is selected to edit, but hasn't been selected");
            }
        }

        const largeMedia = this.state.pageWidth <= 673;
        const mediumMedia = this.state.pageWidth <= 489;
        const smallMedia = this.state.pageWidth <= 372;

        const collapseOne = this.state.pageWidth <= 630;
        const collapseTwo = this.state.pageWidth <= 498;

        const avgCharWidth = 9.5;
        const maxChar = (((((this.state.pageWidth * 0.6) <= 177.4 ? 177.4 : (this.state.pageWidth * 0.6)) - 12) / 2) - 24) / avgCharWidth;
        const intMaxChar = maxChar | 0;

        const display_event_name_base_str = this.props.eventdefinitions.map((eventdefinition) => eventdefinition.event_name);

        // The event name in display_event_name_base_str can have one of many forms. We don't want there to be overflow in the schedule table
        // so it is best to shorten the string if it exceeds a certain length, but this can be tricky. We will let the string flow onto a second
        // line if possible, but not to 3 lines. If the string exceeds onto a third line, the rest will be cut out. Since the average width
        // of a character, 'avgCharWidth', is 9.5 pixels, the maximum number of characters that a single line should be is 'maxChar'. We need to
        // recreate the string so that it looks better on the line.
        // 1) Determine the number of words (separated by ' ' (space))
        // 2) During this determine the index of each of these spaces.
        // 3) Determine whether the 'maxChar' character is on a space, or in the middle of a word. 
        //    a) If it is in the middle of the first word, then shorten this word to the 'maxChar' characters (and add '...' to it).
        //       This acts as the first line. Take the 2nd, 3rd, 4th, etc words, then find that string's length, and if it is greater 
        //       than 'maxChar', then add '...' to the end of it (minus 3 chars), and this is the second line, otherwise leave it be.
        //    b) If it is on the first space, then the first word becomes the first line (leave the string alone). Take the 2nd, 3rd,
        //       4th, etc words, and do like in a).
        //    c) If it is in the middle of the 2nd, 3rd, 4th, etc words, then all words before will be part of the first line 
        //      (leave the string alone). Determine how many words stayed on the first line. If 2 words, for example, stayed on the
        //      first line then take the 3rd, 4th, etc words, and do like in a).

        var event_names_number_of_lines = [];
        var event_names_line_1 = [];
        var event_names_line_2 = [];

        for (var i = 0; i < display_event_name_base_str.length; i++){
            const ith_base_str = display_event_name_base_str[i];
            const space_split_str = ith_base_str.split(" ");
            var lengths_space_split_str = space_split_str.map((a_space_str) => a_space_str.length);
            var acc = 0;
            var cum_length_space_split_str = lengths_space_split_str.map(a_length_space_str => acc += (a_length_space_str + (acc === 0 ? 0 : 1)));
            var firstLineStr = "";
            var secondLineStr = "";
            var firstLineDone = false;
            var firstLineJustFinished = false;
            for (var j = 0; j < cum_length_space_split_str.length; j++){
                if(firstLineDone){
                    firstLineJustFinished = false;
                }
                if (!firstLineDone){
                    if ((cum_length_space_split_str[j] === intMaxChar) || ((cum_length_space_split_str[j] === (intMaxChar + 1)) && (j == 0))){
                        firstLineStr += space_split_str[j];
                        firstLineDone = true;
                        firstLineJustFinished = true;
                    } else if (cum_length_space_split_str[j] < intMaxChar) {
                        firstLineStr += (space_split_str[j] + " ");
                    } else{
                        if (j == 0){
                            firstLineStr += (space_split_str[0].slice(0, (intMaxChar - 3)) + "...");
                            space_split_str[0] = firstLineStr;
                            lengths_space_split_str[0] = intMaxChar;
                            acc = 0;
                            cum_length_space_split_str = lengths_space_split_str.map(a_length_space_str => acc += (a_length_space_str + (acc === 0 ? 0 : 1)));
                        }
                        if(firstLineStr.slice(-1) === ' '){
                            firstLineStr = firstLineStr.slice(0, -1);
                            for(var lengthIter = 0; lengthIter < cum_length_space_split_str.length; lengthIter++){
                                if(lengthIter != 0){
                                    cum_length_space_split_str[lengthIter] -= 1;
                                }
                            }
                        }
                        firstLineDone = true;
                    }
                }
                if (firstLineDone && (j != 0) && !firstLineJustFinished){
                    if ((cum_length_space_split_str[j] - firstLineStr.length) === intMaxChar){
                        secondLineStr += space_split_str[j];
                        break;
                    } else if ((cum_length_space_split_str[j] - firstLineStr.length) < intMaxChar) {
                        secondLineStr += (space_split_str[j] + " ");
                    } else {
                        secondLineStr += space_split_str[j];
                        if(secondLineStr.slice(-1) === ' '){
                            secondLineStr = secondLineStr.slice(0, -1);
                        }
                        if(secondLineStr.length > (intMaxChar - 3)) {
                            secondLineStr = secondLineStr.slice(0, (intMaxChar - 3));
                        }
                        var doneWithSpaces = false;
                        while(!doneWithSpaces){
                            if(secondLineStr.slice(-1) === ' '){
                                secondLineStr = secondLineStr.slice(0, -1);
                            } else{
                                doneWithSpaces = true;
                            }
                        }
                        secondLineStr +=  "...";
                        break;
                    }
                }
            }
            if (secondLineStr === ""){
                event_names_number_of_lines.push(1);
            } else{
                event_names_number_of_lines.push(2);
            }
            event_names_line_1.push(firstLineStr);
            event_names_line_2.push(secondLineStr);
        }

        var eventsDisplayTotalHeight = 0.0;
        const singleHeight = 47.2;
        const doubleHeight = 69.6;

        for(var tdIndex = 0; tdIndex < display_event_name_base_str.length; tdIndex++){
            eventsDisplayTotalHeight += (event_names_number_of_lines[tdIndex] === 2) ? doubleHeight : singleHeight;
        }

        const buttonHeight = collapseTwo ? 111.6 : (collapseOne ? 70.4 : 29.2);
        const eventsVerticalMarginHeight = 16;
        const headerHeight = 48.8;
        //const navBarHeight = navBarDoubles ? 112.53 : 74.4;
        const navBarHeight = 74.4;

        const extraHeight = buttonHeight + eventsVerticalMarginHeight + headerHeight + navBarHeight;

        const availableEventsHeight = (this.state.pageHeight * 0.85) - extraHeight;

        const doesEventDisplayOverflow = availableEventsHeight >= eventsDisplayTotalHeight ? false : true;

        return (
            <div className="d-flex flex-column flex-wrap events" style = {{ minWidth: "177.4px", maxWidth: "60%" }}>
                <table className="table table-striped">
                    <ChooseTableHead numEvents= { this.props.eventdefinitions.length } overflow = { doesEventDisplayOverflow } largeMedia = { largeMedia } mediumMedia = { mediumMedia } />
                    <tbody className = "overflow-auto events" style = {{ display: "block", maxHeight: availableEventsHeight + "px" }}>
                        {event_names_number_of_lines.map((__, index) =>  (
                            <tr key={this.props.eventdefinitions[index].event_name + this.props.eventdefinitions[index].event_id} id = {"tr" + this.props.eventdefinitions[index].event_id} className = "noselect" style = { this.state.selectedEventId === this.props.eventdefinitions[index].event_id ? { display: "table", tableLayout: "fixed", width: "100%", backgroundColor: "#686882" } : { display: "table", tableLayout: "fixed", width: "100%" } } onClick = { this.handleClick }>
                                <td className = "noselect" style = {{ textAlign: "center" }}>
                                    <div>{event_names_line_1[index]}</div>
                                    <div>{event_names_line_2[index]}</div>
                                </td>
                                <td style = {{ verticalAlign: "middle" }}>
                                    <div className = "custom-control custom-switch tdDiv noselect">
                                        <input type="checkbox" className = "custom-control-input" id = {"customSwitch" + this.props.eventdefinitions[index].event_id} checked = {this.props.eventdefinitions[index].active_for_generation} onChange = {this.onChange}/>
                                        <label className = "custom-control-label" htmlFor = {"customSwitch" + this.props.eventdefinitions[index].event_id}></label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ChooseButtons selectedEventId = {this.state.selectedEventId} collapseOne = { collapseOne } collapseTwo = { collapseTwo } onClick = { this.handleClick } />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    eventdefinitions: state.schedules.eventdefinitions,
    eventTypeBool: state.schedules.eventTypeBool,
    occurs_on_1s: state.schedules.occurs_on_1s,
    occurs_on_2s: state.schedules.occurs_on_2s,
});

export default connect(mapStateToProps, {
    getEventDefinitions,
    editEventDefinition,
    getEventType,
    deleteStrictEvent,
    deleteLooseEvent,
    deleteDay,
    deleteTime,
    getoccurs_on_1s,
    getoccurs_on_2s,
})(Events);

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
                <button id="editEvent" onClick = {props.onClick} style = {{ marginLeft : "1px" }} className="btn btn-info btn-sm noselect">{" "}Edit/View Event</button>
                <button id="addEvent" onClick = {props.onClick} style = {{ marginLeft : "27px", marginRight : "27px" }} className="btn btn-success btn-sm noselect">{" "}Add New Event</button>
                <button id="deleteEvent" onClick = {props.onClick} className="btn btn-danger btn-sm noselect">{" "}Delete Event</button>
            </div>
        );
    } else {
        return(
            <div className="d-flex justify-content-center">
                <button id="addEvent" style = {{ marginLeft : "20px" }} onClick = {props.onClick} className="btn btn-success btn-sm">{" "}Add New Event</button>
            </div>  
        );
    }
}

function ChooseTableHead(props) {
    if (props.numEvents <= 0){
        return null;
    } else{
        return (
            <thead style = {{ display: "table" }}>
                <tr style = {{ display: "table", tableLayout: "fixed", width: "100%" }}>
                    <th className = "noselect">Name</th>
                    <th className = "noselect">{props.smallMedia ? "Active" : "Active For Day Generation"}</th>
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
        smallMedia: window.matchMedia("(max-width: 372px)").matches,
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
        const wmm1 = window.matchMedia("(max-width: 372px)");
        wmm1.addEventListener("change", () => this.setState({ ...this.state, smallMedia: wmm1.matches }));
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

        const rowStyle = (rowId) => 
            rowId === this.state.selectedEventId ?
                { backgroundColor: "#686882" }
                : {};

        return (
            <div className="d-flex flex-column flex-wrap events" style = {{ minWidth: "177.4px", maxWidth: "60%" }}>
                <table className="table table-striped">
                    <ChooseTableHead numEvents={this.props.eventdefinitions.length} smallMedia = { this.state.smallMedia } />
                    <tbody class = "overflow-auto events" style = {{ display: "block", maxHeight: "65vh" }}>
                        {this.props.eventdefinitions.map((eventdefinition) => (
                            <tr key={eventdefinition.event_name + eventdefinition.event_id} id = {"tr" + eventdefinition.event_id} className = "noselect" style = { this.state.selectedEventId === eventdefinition.event_id ? { display: "table", tableLayout: "fixed", width: "100%", backgroundColor: "#686882" } : { display: "table", tableLayout: "fixed", width: "100%" } } onClick = { this.handleClick }>
                                <td className = "noselect">{eventdefinition.event_name}</td>
                                <td>
                                    <div className = "custom-control custom-switch tdDiv noselect">
                                        <input type="checkbox" className = "custom-control-input" id = {"customSwitch" + eventdefinition.event_id} checked = {eventdefinition.active_for_generation} onChange = {this.onChange}/>
                                        <label className = "custom-control-label" htmlFor = {"customSwitch" + eventdefinition.event_id}></label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ChooseButtons selectedEventId = {this.state.selectedEventId} onClick = { this.handleClick } />
            </div>
        );
    }
}

                /*
                <td>
                  <button
                    onClick={this.props.deleteEventDefinition.bind(
                      this,
                      eventdefinition.event_id
                    )}
                    className="btn btn-danger btn-sm"
                  >
                    {" "}
                    Delete
                  </button>
                </td>
                */

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

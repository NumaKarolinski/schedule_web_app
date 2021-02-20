import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from 'moment';

import {
    getTimeDeltas,
    deleteTimeDelta,
    addTimeDelta,
    getEventDefinitions,
} from "../../actions/schedules";

import "./ScheduleDay.css";

export class ScheduleDay extends Component {

    state = {
        smallestMedia: window.matchMedia("(max-width: 269px)").matches,
    }

    static propTypes = {
        timedeltas: PropTypes.array.isRequired,
        timeDeltasUpdated: PropTypes.bool.isRequired,
        getTimeDeltas: PropTypes.func.isRequired,
        deleteTimeDelta: PropTypes.func.isRequired,
        addTimeDelta: PropTypes.func.isRequired,
        eventdefinitions: PropTypes.array.isRequired,
        getEventDefinitions: PropTypes.func.isRequired,
    };

    componentDidUpdate() {
        if (this.props.updated) {
            if (!(this.props.schedules[0] == null)) {
                this.props.handleUpdate();
                this.props.getTimeDeltas(this.props.schedules[0].schedule_id, this.props.day.format('YYYY-MM-DD'));
                const wmm3 = window.matchMedia("(max-width: 269px)");
                wmm3.addEventListener("change", () => this.setState({ ...this.state, smallestMedia: wmm3.matches }));
            }
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        this.props.loadedTimeDeltas();
        if (e.currentTarget.id === "generateDay") {
            this.props.addTimeDelta(this.props.schedules[0].schedule_id, this.props.day.format('dddd').slice(0, 2), this.props.day.format('YYYY-MM-DD'));
        } else if (e.currentTarget.id === "deleteDay") {
            this.props.deleteTimeDelta(this.props.day.format().slice(0, 10), true);
        } else if (e.currentTarget.id === "regenerateDay") {
            this.props.deleteTimeDelta(this.props.day.format().slice(0, 10), false);
            this.props.addTimeDelta(this.props.schedules[0].schedule_id, this.props.day.format('dddd').slice(0, 2), this.props.day.format('YYYY-MM-DD'));
        } else {
            console.log("OnClick in ScheduleDay not handled.");
        }
    }

    render() {

        if (this.props.timeDeltasUpdated && this.props.timedeltas.length > 0) {
            this.props.getEventDefinitions(this.props.timedeltas.map((timedelta) => timedelta.event).filter((value, index, self) => self.indexOf(value) === index));
        }

        if (this.props.timeDeltasUpdated) {
            if (this.props.loadingTimeDeltas) {
                this.props.loadedTimeDeltas();
            } 
        }

        const smallOrBigDate = 
        this.props.smallerMedia ? (
            <div className = "d-flex flex-column justify-content-center">
                <h4 className = "noselect d-flex justify-content-center">
                    {this.props.day.format('MMMM').slice(0, 3) + ". " + this.props.day.format('Do')}
                </h4>
                <h4 className = "noselect d-flex justify-content-center">
                    {this.props.day.format('YYYY')}
                </h4>
            </div>
        ) : (
            this.props.smallMedia ? (
                <div className = "d-flex flex-column justify-content-center">
                    <h4 className = "noselect d-flex justify-content-center">
                        {this.props.day.format('dddd')}
                    </h4>
                    <h4 className = "noselect d-flex justify-content-center">
                        {this.props.day.format('MMMM Do YYYY')}
                    </h4>
                </div>
            ) : (
                <div>
                    <h4 className = "noselect d-flex justify-content-center">
                        {this.props.day.format('dddd, MMMM Do YYYY')}
                    </h4>
                </div>
            )
        );

        const tdNameStyle = this.props.smallMedia ? { padding: ".25rem" } : { padding: ".75rem" };
        const tdTimeStyle = this.state.smallestMedia ? { minWidth: "45px", paddingRight: "31.8px", paddingLeft: "0.25rem", paddingTop: "0.25rem", paddingBottom: "0.25rem" } : (this.props.smallMedia ? { padding: ".25rem" } : { padding: ".75rem" });
        const smallthStyle = this.state.smallestMedia ? { minWidth: "43px", paddingRight: "41.8px", paddingLeft: "0.25rem", paddingTop: "0.25rem", paddingBottom: "0.25rem" } : (this.props.smallMedia ? { padding: "0.25rem" } : { padding: "0.75rem" });
        const boxPleft = ((this.props.timedeltas.length > 3) && this.state.smallestMedia) || ((this.props.timedeltas.length > 5) && this.props.smallMedia && !this.state.smallestMedia) || (this.props.timedeltas.length > 3 && !this.props.smallMedia) ? { paddingLeft: "12px" } : { paddingLeft: "0px" };
        
        const sortedTimedeltas = this.props.timedeltas.sort((td_1, td_2) => moment(td_1["date_time"]).isBefore(moment(td_2["date_time"])) ? -1 : (moment(td_1["date_time"]).isAfter(moment(td_2["date_time"])) ? 1 : 0));
        var validTimeDeltaDisplay = true;
        for (var i = 0; i < sortedTimedeltas.length; i++) {
            var theVal = this.props.eventdefinitions.filter((eventdefinition) => eventdefinition["event_id"] === sortedTimedeltas[i]["event"]);
            if (theVal.length === 0) {
                validTimeDeltaDisplay = false;
            }
        }

        console.log(this.props.loadingTimeDeltas);

        const timedeltaDisplay = 
        this.props.loadingTimeDeltas ? 
            null :
            (validTimeDeltaDisplay && (sortedTimedeltas.length > 0) ? 
                (<div style = { boxPleft, { minWidth: "177.4px" } } className = "mb-2 mt-2 card">
                    <table className ="table table-striped mb-0">
                        <thead style = {{ display: "table" }} >
                            <tr style = {{ display: "table", tableLayout: "fixed", width: "100%" }} >
                                <th style = { smallthStyle } className = "noselect align-middle">Event Name</th>
                                <th style = { smallthStyle } className = "noselect align-middle">Event Time</th>
                            </tr>
                        </thead>
                        <tbody style = {{ display: "block", maxHeight: "60vh" }} className = "overflow-auto scheduleDay">
                            {sortedTimedeltas.map((timedelta) =>  (
                                <tr style = {{ display: "table", tableLayout: "fixed", width: "100%" }} key={"timedelta" + timedelta.td_id} id = {"tr" + timedelta.td_id} className = "noselect">
                                    <td style = { tdNameStyle } className = "noselect align-middle">{this.props.eventdefinitions.filter((eventdefinition) => eventdefinition["event_id"] === timedelta["event"])[0]["event_name"]}</td>
                                    <td style = { tdTimeStyle } className = "noselect align-middle">{timedelta["date_time"].slice(11, 16) + " - " + timedelta["end_time"].slice(11, 16)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : 
                (this.props.smallerMedia ? 
                    (<div className = "d-flex flex-column justify-content-center" style = {{ paddingBottom: "10px" }} >
                        <h6 className = "noselect d-flex justify-content-center">{"Nothing"}</h6>
                        <h6 className = "noselect d-flex justify-content-center">{"Scheduled"}</h6>
                    </div>) : 
                    (<div style = { this.props.smallMedia ? { paddingBottom: "22px" } : null }>
                        <h6 className = "noselect d-flex justify-content-center">{"Nothing Scheduled"}</h6>
                    </div>)
                )
            )
        ;

        const chooseButtons = 
        validTimeDeltaDisplay && (sortedTimedeltas.length > 0) ? (
            <div style = { this.props.smallerMedia ? ({ paddingBottom: "22px" }) : (this.props.smallMedia ? { paddingBottom: "10px" } : null) } className = "d-flex flex-row flex-wrap justify-content-around">
                <button id = "regenerateDay" onClick = { this.handleClick } className = {"btn btn-success btn-sm noselect" + (this.props.loadingTimeDeltas ? " invisibleButton" : "")}>Regenerate Day</button>
                <button id = "deleteDay" onClick = { this.handleClick } className = {"btn btn-danger btn-sm noselect" + (this.props.loadingTimeDeltas ? " invisibleButton" : "")}>Delete Day</button>
            </div>
        ) :
        (
            <div style = { this.props.smallerMedia ? ({ paddingBottom: "22px" }) : (this.props.smallMedia ? { paddingBottom: "10px" } : null) } className = "d-flex justify-content-center">
                <button id = "generateDay" onClick = { this.handleClick } className = {"btn btn-success btn-sm" + (this.props.loadingTimeDeltas ? " invisibleButton" : "")}>Generate Day</button>
            </div>  
        );

        return (
            <div style = { this.props.smallerMedia ? ({ minWidth: "120px" }) : (this.props.smallMedia ? { minWidth: "220.26px" } : { minWidth: "344.01px", maxWidth: "60%" }) } className = { (this.props.smallMedia ? "mr-2 ml-2 " : "mr-5 ml-5 ") + "d-flex flex-column justify-content-around h-50"}>
                {smallOrBigDate}
                {timedeltaDisplay}
                {chooseButtons}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    timedeltas: state.schedules.timedeltas,
    timeDeltasUpdated: state.schedules.timeDeltasUpdated,
    eventdefinitions: state.schedules.eventdefinitions,
});

export default connect(mapStateToProps, {
    getTimeDeltas,
    deleteTimeDelta,
    addTimeDelta,
    getEventDefinitions,
})(ScheduleDay);
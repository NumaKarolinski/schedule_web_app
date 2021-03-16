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

import Loader from "./../common/Loader";

import "./ScheduleDay.css";

export class ScheduleDay extends Component {

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
            }
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        this.props.loadTimeDeltas(true);
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

        const sortedTimedeltas = this.props.timedeltas.sort((td_1, td_2) => moment(td_1["date_time"]).isBefore(moment(td_2["date_time"])) ? -1 : (moment(td_1["date_time"]).isAfter(moment(td_2["date_time"])) ? 1 : 0));
        var validTimeDeltaDisplay = true;

        for (var i = 0; i < sortedTimedeltas.length; i++) {
            var theVal = this.props.eventdefinitions.filter((eventdefinition) => eventdefinition["event_id"] === sortedTimedeltas[i]["event"]);
            if (theVal.length === 0) {
                validTimeDeltaDisplay = false;
            }
        }

        if (!validTimeDeltaDisplay && !this.props.loadingTimeDeltas && (sortedTimedeltas.length > 0)) {
            this.props.getEventDefinitions(this.props.timedeltas.map((timedelta) => timedelta.event).filter((value, index, self) => self.indexOf(value) === index));
        }

        if (this.props.timeDeltasUpdated) {
            if (this.props.loadingTimeDeltas) {
                this.props.loadTimeDeltas(false);
            } 
        }

        const smallMedia = this.props.pageWidth <= 559.43;
        const smallerMedia = this.props.pageWidth <= 360;
        const buttonsDouble = this.props.pageWidth <= 323;
        const eventTimeDoublingMedia = this.props.pageWidth <= 318.4;
        const smallestMedia = this.props.pageWidth <= 269;
        //const navBarDoubles = this.props.pageWidth <= 181;

        const mainDivStyle = smallerMedia ? 
            (this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) || (sortedTimedeltas.length == 0) || !validTimeDeltaDisplay  ? 
                { minWidth: "179.2px", maxWidth: "calc(100% - 114px)", marginRight: "calc((100% - 279px) / 2)", marginLeft: "calc((100% - 279px) / 2)" } :
                { minWidth: "179.2px", maxWidth: "calc(100% - 114px)", marginRight: "7px", marginLeft: "7px" }
            ) :
            (smallMedia ?
                (this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) || (sortedTimedeltas.length == 0) || !validTimeDeltaDisplay ?
                    { minWidth: "220.26px", maxWidth: "calc(100% - 114px)", marginRight: "calc((100% - 320px) / 2)", marginLeft: "calc((100% - 320px) / 2)" } :
                    { minWidth: "220.26px", maxWidth: "calc(100% - 114px)", marginRight: "7px", marginLeft: "7px" }
                ) :
                (this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) || (sortedTimedeltas.length == 0) || !validTimeDeltaDisplay ?
                    { minWidth: "344.01px", maxWidth: "60%", marginRight: "calc((60% - 330px) / 2)", marginLeft: "calc((60% - 330px) / 2)" } :
                    { minWidth: "344.01px", maxWidth: "60%", marginRight: "7px", marginLeft: "7px" }
                )
            )
        ;

        const trWidthWithPadding = mainDivStyle["minWidth"] === "179.2px" ?
            ( ((this.props.pageWidth - 114) <= 179.2 ? 179.2 : (this.props.pageWidth - 114))
            ) :
            ( mainDivStyle["minWidth"] === "220.26px" ?
                ( ((this.props.pageWidth - 114) <= 220.26 ? 220.26 : (this.props.pageWidth - 114))
                ) :
                ( ((this.props.pageWidth * 0.6) <= 344.01 ? 344.01 : (this.props.pageWidth * 0.6))
                )
            ) - 12
        ;

        const tdWidth = (trWidthWithPadding / 2) - (smallMedia ? 24 : 8);

        const avgCharWidth = 9.5;
        const maxChar = tdWidth / avgCharWidth;
        const intMaxChar = maxChar | 0;

        const display_event_name_base_str = this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) ? 
            null :
            (validTimeDeltaDisplay && (sortedTimedeltas.length > 0) ? 
                sortedTimedeltas.map((timedelta) => 
                    this.props.eventdefinitions.filter((eventdefinition) => eventdefinition["event_id"] === timedelta["event"])[0]["event_name"]
                ) :
                null
            )
        ;

        const display_time_base_str = this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) ? 
            null :
            (validTimeDeltaDisplay && (sortedTimedeltas.length > 0) ? 
                sortedTimedeltas.map((timedelta) => 
                    timedelta["date_time"].slice(11, 16) + " - " + timedelta["end_time"].slice(11, 16)
                ) :
                null
            )
        ;

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

        if ((!(this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)))) && (validTimeDeltaDisplay && (sortedTimedeltas.length > 0))){
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
        }

        var timedeltaDisplayTotalHeight = 0.0;
        const singleSMHeight = 31.2;
        const singleLGHeight = 47.2;
        const doubleSMHeight = 53.6;
        const doubleLGHeight = 69.6;

        if ((!(this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)))) && (validTimeDeltaDisplay && (sortedTimedeltas.length > 0))){
            for(var tdIndex = 0; tdIndex < display_event_name_base_str.length; tdIndex++){
                const doubleLineBool = eventTimeDoublingMedia || (event_names_number_of_lines[tdIndex] === 2);
                const smHeight = doubleLineBool ? doubleSMHeight : singleSMHeight;
                const lgHeight = doubleLineBool ? doubleLGHeight : singleLGHeight;
                if(smallMedia){
                    timedeltaDisplayTotalHeight += smHeight;
                } else{
                    timedeltaDisplayTotalHeight += lgHeight;
                }
            }
        }

        const titleHeight = smallerMedia ? 46.4 : (smallMedia ? 78.8 : 44.4);
        const buttonHeight = buttonsDouble ? 96.4 : (smallMedia ? 47.2 : 37.2);
        const tddVerticalMarginHeight = 16;
        const headerHeight = smallMedia ? 32.8 : 48.8;
        //const navBarHeight = navBarDoubles ? 112.53 : 74.4;
        const navBarHeight = 74.4;

        const extraHeight = titleHeight + buttonHeight + tddVerticalMarginHeight + headerHeight + navBarHeight;

        const availableTDDHeight = (this.props.pageHeight * 0.85) - extraHeight;
        const doesTimeDeltaDisplayOverflow = availableTDDHeight >= timedeltaDisplayTotalHeight ? false : true;

        const tdNameStyle = smallMedia ? { padding: ".25rem", textAlign: "center" } : { padding: ".75rem", textAlign: "center" };
        const tdTimeStyle = smallMedia ? { padding: ".25rem", textAlign: "center" } : { padding: ".75rem", textAlign: "center" };
        const smallthStyle = smallMedia ? { padding: "0.25rem", textAlign: "center" } : { padding: "0.75rem", textAlign: "center" };
        const boxPleft = doesTimeDeltaDisplayOverflow ? { paddingLeft: "12px" } : { paddingLeft: "0px" };
        const theadRowWidth = doesTimeDeltaDisplayOverflow ? { display: "table", tableLayout: "fixed", width: "calc(100% - 12px)" } : { display: "table", tableLayout: "fixed", width: "100%" };

        const smallOrBigDate = 
        smallerMedia ? (
            <div style = { (!this.props.loadingTimeDeltas && validTimeDeltaDisplay && (sortedTimedeltas.length == 0)) || (!this.props.timeDeltasUpdated && !this.props.loadingTimeDeltas && !validTimeDeltaDisplay && (sortedTimedeltas.length > 0)) ? { marginBottom: "48px" } : { marginBottom: "12px" } }>
                <h4 className = "noselect d-flex justify-content-center">
                    {this.props.day.format('MMMM').slice(0, 3) + ". " + this.props.day.format('Do')}
                </h4>
            </div>
        ) : (
            smallMedia ? (
                <div className = "d-flex flex-column justify-content-center" style = { (!this.props.loadingTimeDeltas && validTimeDeltaDisplay && (sortedTimedeltas.length == 0)) || (!this.props.timeDeltasUpdated && !this.props.loadingTimeDeltas && !validTimeDeltaDisplay && (sortedTimedeltas.length > 0)) ? { marginBottom: "58px" } : { marginBottom: "10px" } }>
                    <h4 className = "noselect d-flex justify-content-center">
                        {this.props.day.format('dddd')}
                    </h4>
                    <h4 className = "noselect d-flex justify-content-center">
                        {this.props.day.format('MMMM Do YYYY')}
                    </h4>
                </div>
            ) : (
                <div style = { (!this.props.loadingTimeDeltas && validTimeDeltaDisplay && (sortedTimedeltas.length == 0)) || (!this.props.timeDeltasUpdated && !this.props.loadingTimeDeltas && !validTimeDeltaDisplay && (sortedTimedeltas.length > 0)) ? { marginBottom: "58px" } : { marginBottom: "10px" } }>
                    <h4 className = "noselect d-flex justify-content-center">
                        {this.props.day.format('dddd, MMMM Do YYYY')}
                    </h4>
                </div>
            )
        );

        const timedeltaDisplay = 
        this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) ? 
            <Loader bigDivStyle = { smallerMedia ? { margin: "0px auto 22px" } : (smallMedia ? { margin: "0px auto 60px" } : { margin: "0px auto 40px" }) }/> :
            (validTimeDeltaDisplay && (sortedTimedeltas.length > 0) ? 
                (<div style = { boxPleft, { minWidth: "179.2px" } } className = "mb-2 mt-2">
                    <table className ="table table-striped mb-0">
                        <thead style = {{ display: "table" }} >
                            <tr style = { theadRowWidth } >
                                <th style = { smallthStyle } className = "noselect align-middle">{ smallerMedia ? "Name" : "Event Name" }</th>
                                <th style = { smallthStyle } className = "noselect align-middle">{ smallerMedia ? "Time" : "Event Time" }</th>
                            </tr>
                        </thead>    
                        <tbody style = {{ display: "block", maxHeight: availableTDDHeight + "px" }} className = "overflow-auto scheduleDay">
                            {display_time_base_str.map((__, index) =>  (
                                <tr style = {{ display: "table", tableLayout: "fixed", width: "100%" }} key={"timedelta" + index} id = {"tr" + index} className = "noselect">
                                    <td style = { tdNameStyle } className = "noselect align-middle">
                                        <div>{event_names_line_1[index]}</div>
                                        <div>{event_names_line_2[index]}</div>
                                    </td>
                                    <td style = { tdTimeStyle } className = "noselect align-middle">{display_time_base_str[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : 
                (smallerMedia ? 
                    (<div className = "d-flex flex-column justify-content-center nothingScheduled" style = {{ paddingBottom: "10px", marginBottom: "7px" }} >
                        <h6 className = "noselect d-flex justify-content-center">{"Nothing"}</h6>
                        <h6 className = "noselect d-flex justify-content-center">{"Scheduled"}</h6>
                    </div>) : 
                    (<div style = { smallMedia ? { paddingBottom: "22px", marginBottom: "47px" } : { marginBottom: "45px" } } className = "nothingScheduled">
                        <h6 className = "noselect d-flex justify-content-center">{"Nothing Scheduled"}</h6>
                    </div>)
                )
            )
        ;

        const chooseButtons = 
        validTimeDeltaDisplay && (sortedTimedeltas.length > 0) ? (
            <div style = { smallerMedia ? ({ paddingBottom: "22px" }) : (smallMedia ? { paddingBottom: "10px" } : null) } className = "d-flex flex-row flex-wrap justify-content-around">
                <button id = "regenerateDay" onClick = { this.handleClick } className = {"btn btn-success btn-sm m-1 noselect" + (this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) ? " invisibleButton" : "")}>Regenerate Day</button>
                <button id = "deleteDay" onClick = { this.handleClick } className = {"btn btn-danger btn-sm m-1 noselect" + (this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) ? " invisibleButton" : "")}>Delete Day</button>
            </div>
        ) :
        (
            <div style = { smallerMedia ? ({ paddingBottom: "22px" }) : (smallMedia ? { paddingBottom: "10px" } : null) } className = "d-flex justify-content-center">
                <button id = "generateDay" onClick = { this.handleClick } className = {"btn btn-success btn-sm m-1" + (this.props.loadingTimeDeltas || (this.props.timeDeltasUpdated && (this.props.timedeltas.length > 0)) ? " invisibleButton" : "")}>Generate Day</button>
            </div>  
        );

        return (
            <div style = { mainDivStyle } className = "d-flex flex-column justify-content-around h-50">
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
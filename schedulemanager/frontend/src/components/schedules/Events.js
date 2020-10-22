import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getEventDefinitions,
  deleteEventDefinition,
} from "../../actions/schedules";

function ChooseButtons(props) {
  if (props.eventSelected) {
    return(
      <div className="d-flex flex-row flex-wrap justify-content-between">
        <button id="editEvent" onClick = {props.onClick} className="btn btn-info btn-sm">{" "}Edit/View Event</button>
        <button id="addEvent" onClick = {props.onClick} className="btn btn-success btn-sm">{" "}Add New Event</button>
        <button id="deleteEvent" onClick = {props.onClick} className="btn btn-danger btn-sm">{" "}Delete Event</button>
      </div>
    );
  } else {
    return(
      <div className="d-flex justify-content-center">
        <button id="addEvent" onClick = {props.onClick} className="btn btn-success btn-sm">{" "}Add New Event</button>
      </div>  
    );
  }
}

function ChooseTableHead(props) {
  if (props.numEvents <= 0){
    return null;
  } else{
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Recurring</th>
        <th>Active In Day Generation</th>
      </tr>
    </thead>
  }
}

export class Events extends Component {
  state = {
    eventSelected: false,
    numEvents: 0,
    addEventBool: false,
    editEventBool: false,
    deleteEventBool: false,
  }

  static propTypes = {
    eventdefinitions: PropTypes.array.isRequired,
    getEventDefinitions: PropTypes.func.isRequired,
    deleteEventDefinition: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getEventDefinitions();
    this.setState({ ...this.state, numEvents: this.props.eventdefinitions.length });
  }

  onClick = (e) => {
    if (e.target.id === "editEvent") {
      this.setState({ ...this.state, editEventBool: !this.state.editEventBool })
    } else if (e.target.id === "addEvent") {
      this.setState({ ...this.state, addEventBool: !this.state.addEventBool })
    } else if (e.target.id === "deleteEvent") {
      this.setState({ ...this.state, deleteEventBool: !this.state.deleteEventBool })
    } else {
      console.log("Handle Click of Events Button Failed");
    }
  }

  render() {
    if (this.state.addEventBool) {
      return <Redirect to="/eventDefinitions/add" />;
    } else if (this.state.editEventBool) {
      return <Redirect to="/eventDefinitions/edit" />;
    }

    return (
      <div className="d-flex flex-column flex-wrap">
        <table className="table table-striped">
          <ChooseTableHead numEvents={this.state.numEvents} />
          <tbody>
            {this.props.eventdefinitions.map((eventdefinition) => (
              <tr key={eventdefinition.event_name}>
                <td>{eventdefinition.event_type}</td>
                <td>{eventdefinition.recurring}</td>
                <td>{eventdefinition.active_for_generation}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ChooseButtons eventSelected={this.state.eventSelected} onClick={this.onClick} />
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
});

export default connect(mapStateToProps, {
  getEventDefinitions,
  deleteEventDefinition,
})(Events);

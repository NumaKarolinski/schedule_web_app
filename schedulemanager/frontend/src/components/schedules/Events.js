import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getEventDefinitions,
  deleteEventDefinition,
  addEventDefinition,
} from "../../actions/schedules";

export class Events extends Component {
  static propTypes = {
    eventdefinitions: PropTypes.array.isRequired,
    getEventDefinitions: PropTypes.func.isRequired,
    deleteEventDefinition: PropTypes.func.isRequired,
    addEventDefinition: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getEventDefinitions();
  }

  render() {
    return (
      <Fragment>
        <h2>Events</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID?</th>
              <th>Name?</th>
              <th>Email?</th>
              <th>Message?</th>
            </tr>
          </thead>
          <tbody>
            {this.props.eventdefinitions.map((eventdefinition) => (
              <tr key={eventdefinition.event_id}>
                <td>{schedule.event_id}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  eventdefinitions: state.schedules.eventdefinitions,
});

export default connect(mapStateToProps, {
  getEventDefinitions,
  deleteEventDefinition,
  addEventDefinition,
})(Events);

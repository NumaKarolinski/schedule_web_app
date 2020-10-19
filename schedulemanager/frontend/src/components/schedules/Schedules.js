import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getSchedules,
  deleteSchedule,
  addSchedule,
} from "../../actions/schedules";

export class Schedules extends Component {
  static propTypes = {
    schedules: PropTypes.array.isRequired,
    getSchedules: PropTypes.func.isRequired,
    deleteSchedule: PropTypes.func.isRequired,
    addSchedule: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getSchedules();
  }

  render() {
    return (
      <Fragment>
        <h2>Schedule???</h2>
        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {this.props.schedules.map((schedule) => (
              <tr key={schedule.schedule_id}>
                <td>{schedule.schedule_id}</td>
                <td>
                  <button
                    onClick={this.props.deleteSchedule.bind(
                      this,
                      schedule.schedule_id
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
  schedules: state.schedules.schedules,
});

export default connect(mapStateToProps, {
  getSchedules,
  deleteSchedule,
  addSchedule,
})(Schedules);

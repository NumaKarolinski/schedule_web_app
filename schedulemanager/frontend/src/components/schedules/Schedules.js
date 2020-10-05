import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getSchedules, deleteSchedule } from "../../actions/schedules";

export class Schedules extends Component {
  static propTypes = {
    schedules: PropTypes.array.isRequired,
    getSchedules: PropTypes.func.isRequired,
    deleteSchedule: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getSchedules();
  }

  render() {
    return (
      <Fragment>
        <h2>Schedules</h2>
        <table>
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
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.name}</td>
                <td>{schedule.email}</td>
                <td>{schedule.message}</td>
                <td>
                  <button
                    onClick={this.props.deleteSchedule.bind(this, schedule.id)}
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

export default connect(mapStateToProps, { getSchedules, deleteSchedule })(
  Schedules
);

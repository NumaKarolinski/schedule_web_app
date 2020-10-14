import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, alert, message } = this.props;

    if (error !== prevProps.error) {
      if (error.msg.name) {
        alert.error(`Name: ${error.msg.name.join()}`);
      }
      if (error.msg.email) {
        alert.error(`Email: ${error.msg.email.join()}`);
      }
      if (error.msg.message) {
        alert.error(`Message: ${error.msg.message.join()}`);
      }
      if (error.msg.non_field_errors) {
        alert.error(error.msg.non_field_errors.join());
      }
      if (error.msg.username) {
        alert.error(error.msg.username.join());
      }
      if (error.msg.password) {
        alert.error(`Password: ${error.msg.password.join()}`);
      }
    }

    if (message !== prevProps.message) {
      if (message.deleteSchedule) {
        alert.success(message.deleteSchedule);
      }
      if (message.addSchedule) {
        alert.success(message.addSchedule);
      }
      if (message.deleteview) {
        alert.success(message.deleteview);
      }
      if (message.addview) {
        alert.success(message.addview);
      }
      if (message.deleteEventDefinition) {
        alert.success(message.deleteEventDefinition);
      }
      if (message.addEventDefinition) {
        alert.success(message.addEventDefinition);
      }
      if (message.deleteTimeDelta) {
        alert.success(message.deleteTimeDelta);
      }
      if (message.addTimeDelta) {
        alert.success(message.addTimeDelta);
      }
      if (message.deleteoccurs_on_1) {
        alert.success(message.deleteoccurs_on_1);
      }
      if (message.addoccurs_on_1) {
        alert.success(message.addoccurs_on_1);
      }
      if (message.deleteoccurs_on_2) {
        alert.success(message.deleteoccurs_on_2);
      }
      if (message.addoccurs_on_2) {
        alert.success(message.addoccurs_on_2);
      }
      if (message.passwordNotMatch) {
        alert.error(message.passwordNotMatch);
      }
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));

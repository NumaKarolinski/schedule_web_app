import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Header from "./layout/Header";
import Alerts from "./layout/Alerts";

import Login from "./accounts/Login";
import Register from "./accounts/Register";

import Dashboard from "./schedules/Dashboard";
import Schedules from "./schedules/Schedules";
import Events from "./schedules/Events";
import AddEvent from "./schedules/AddEvent";

import PrivateRoute from "./common/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";

import './App.css';

const alertOptions = {
  timeout: 3000,
  position: "bottom center",
};

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <Header />
              <Alerts />
              <div
                id = "appDiv"
                className="d-flex justify-content-center align-items-center"
              >
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <PrivateRoute exact path="/schedules" component={Schedules} />
                  <PrivateRoute
                    exact
                    path="/eventDefinitions"
                    component={Events}
                  />
                  <PrivateRoute
                    exact
                    path="/eventDefinitions/add"
                    component={AddEvent}
                  />
                  <PrivateRoute
                    exact
                    path="/eventDefinitions/edit"
                    component={AddEvent}
                    event_id = {this.props.event_id}
                  />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

import React, { Fragment } from "react";

/*

import Form from "./Form";
import Schedules from "./Schedules";

export default function Dashboard() {
  return (
    <Fragment>
      <Form />
      <Schedules />
    </Fragment>
  );
}

*/

import DashboardCard from "./DashboardCard";

export default function Dashboard() {
  return (
    <div
      className="jumbotron d-flex flex-row flex-wrap justify-content-center align-items-center"
      style={{
        margin: "0px",
        minWidth: "20rem",
        padding: "4rem 2rem",
      }}
    >
      <DashboardCard cardType="events" styleType="primary" />
      <DashboardCard cardType="schedules" styleType="success" />
    </div>
  );
}

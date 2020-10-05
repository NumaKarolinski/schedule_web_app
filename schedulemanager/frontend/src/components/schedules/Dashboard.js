import React, { Fragment } from "react";

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

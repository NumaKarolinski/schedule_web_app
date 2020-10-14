import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_SCHEDULES,
  DELETE_SCHEDULE,
  ADD_SCHEDULE,
  GET_VIEWS,
  DELETE_VIEW,
  ADD_VIEW,
  GET_EVENTDEFINITIONS,
  DELETE_EVENTDEFINITION,
  ADD_EVENTDEFINITION,
  GET_TIMEDELTAS,
  DELETE_TIMEDELTA,
  ADD_TIMEDELTA,
  GET_OCCURS_ON_1S,
  DELETE_OCCURS_ON_1,
  ADD_OCCURS_ON_1,
  GET_OCCURS_ON_2S,
  DELETE_OCCURS_ON_2,
  ADD_OCCURS_ON_2,
} from "./types";

// GET SCHEDULES
export const getSchedules = () => (dispatch, getState) => {
  axios
    .get("/api/schedules/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_SCHEDULES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE SCHEDULE
export const deleteSchedule = (schedule_id) => (dispatch, getState) => {
  axios
    .delete(`/api/schedules/${schedule_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteSchedule: "Schedule Deleted" }));
      dispatch({
        type: DELETE_SCHEDULE,
        payload: schedule_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD SCHEDULE
export const addSchedule = (schedule) => (dispatch, getState) => {
  axios
    .post("/api/schedules/", schedule, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addSchedule: "Schedule Added" }));
      dispatch({
        type: ADD_SCHEDULE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET VIEWS
export const getviews = () => (dispatch, getState) => {
  axios
    .get("/api/views/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_VIEWS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE VIEW
export const deleteview = (user_id, schedule_id) => (dispatch, getState) => {
  axios
    .delete(`/api/views/${user_id}&${schedule_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteview: "view Deleted" }));
      dispatch({
        type: DELETE_VIEW,
        payload: { user_id, schedule_id },
      });
    })
    .catch((err) => console.log(err));
};

// ADD VIEW
export const addview = (view) => (dispatch, getState) => {
  axios
    .post("/api/views/", view, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addview: "view Added" }));
      dispatch({
        type: ADD_VIEW,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET EVENT DEFINITIONS
export const getEventDefinitions = () => (dispatch, getState) => {
  axios
    .get("/api/eventdefinitions/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_EVENTDEFINITIONS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE EVENT DEFINITION
export const deleteEventDefinition = (event_id) => (dispatch, getState) => {
  axios
    .delete(`/api/eventdefinitions/${event_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage({ deleteEventDefinition: "Event Definition Deleted" })
      );
      dispatch({
        type: DELETE_EVENTDEFINITION,
        payload: event_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD EVENT DEFINITION
export const addEventDefinition = (eventdefinition) => (dispatch, getState) => {
  axios
    .post("/api/eventdefinitions/", eventdefinition, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addEventDefinition: "Event Definition Added" }));
      dispatch({
        type: ADD_EVENTDEFINITION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET TIME DELTAS
export const getTimeDeltas = () => (dispatch, getState) => {
  axios
    .get("/api/timedeltas/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_TIMEDELTAS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE TIME DELTA
export const deleteTimeDelta = (td_id) => (dispatch, getState) => {
  axios
    .delete(`/api/timedeltas/${td_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteTimeDelta: "Time Delta Deleted" }));
      dispatch({
        type: DELETE_TIMEDELTA,
        payload: td_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD TIME DELTA
export const addTimeDelta = (timedelta) => (dispatch, getState) => {
  axios
    .post("/api/timedeltas/", timedelta, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addTimeDelta: "Time Delta Added" }));
      dispatch({
        type: ADD_TIMEDELTA,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET OCCURS_ON_1S
export const getoccurs_on_1s = () => (dispatch, getState) => {
  axios
    .get("/api/occurs_on_1s/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_OCCURS_ON_1S,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE OCCURS_ON_1
export const deleteoccurs_on_1 = (event_id, day_id, time_id) => (
  dispatch,
  getState
) => {
  axios
    .delete(
      `/api/occurs_on_1s/${event_id}&${day_id}&${time_id}/`,
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch(createMessage({ deleteoccurs_on_1: "occurs_on_1 Deleted" }));
      dispatch({
        type: DELETE_OCCURS_ON_1,
        payload: { event_id, day_id, time_id },
      });
    })
    .catch((err) => console.log(err));
};

// ADD OCCURS_ON_1
export const addoccurs_on_1 = (occurs_on_1) => (dispatch, getState) => {
  axios
    .post("/api/occurs_on_1s/", occurs_on_1, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addoccurs_on_1: "occurs_on_1 Added" }));
      dispatch({
        type: ADD_OCCURS_ON_1,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET OCCURS_ON_2S
export const getoccurs_on_2s = () => (dispatch, getState) => {
  axios
    .get("/api/occurs_on_2s/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_OCCURS_ON_2S,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE OCCURS_ON_2
export const deleteoccurs_on_2 = (event_id, day_id) => (dispatch, getState) => {
  axios
    .delete(`/api/occurs_on_2s/${event_id}&${day_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteoccurs_on_2: "occurs_on_2 Deleted" }));
      dispatch({
        type: DELETE_OCCURS_ON_2,
        payload: { event_id, day_id },
      });
    })
    .catch((err) => console.log(err));
};

// ADD OCCURS_ON_2
export const addoccurs_on_2 = (occurs_on_2) => (dispatch, getState) => {
  axios
    .post("/api/occurs_on_2s/", occurs_on_2, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addoccurs_on_2: "occurs_on_2 Added" }));
      dispatch({
        type: ADD_OCCURS_ON_2,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

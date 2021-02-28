import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_SCHEDULES,
  DELETE_SCHEDULE,
  ADD_SCHEDULE,
  GET_TIMEDELTAS,
  DELETE_TIMEDELTA,
  ADD_TIMEDELTA,
  LOADING_TIMEDELTAS,
  GET_VIEWS,
  DELETE_VIEW,
  ADD_VIEW,
  GET_EVENTDEFINITIONS,
  DELETE_EVENTDEFINITION,
  ADD_EVENTDEFINITION,
  EDIT_EVENTDEFINITION,
  GET_EVENTTYPE,
  GET_STRICTEVENTS,
  EDIT_STRICTEVENT,
  DELETE_STRICTEVENT,
  ADD_STRICTEVENT,
  GET_LOOSEEVENTS,
  EDIT_LOOSEEVENT,
  DELETE_LOOSEEVENT,
  ADD_LOOSEEVENT,
  GET_DAYS,
  DELETE_DAY,
  ADD_DAY,
  EDIT_DAY,
  GET_TIMES,
  DELETE_TIME,
  ADD_TIME,
  EDIT_TIME,
  GET_OCCURS_ON_1S,
  DELETE_OCCURS_ON_1,
  ADD_OCCURS_ON_1,
  GET_OCCURS_ON_2S,
  DELETE_OCCURS_ON_2,
  ADD_OCCURS_ON_2,
} from "./types";

//DATE ENTERED BY USER MUST BE LATER THAN TODAY
export const dateTooEarly = () => (dispatch) => {
  dispatch(createMessage({ dateTooEarly: "Date Must Be Past Today" }));
}

//MONTH ENTERED BY USER SHOULD BE 1-12
export const monthWrong = () => (dispatch) => {
  dispatch(createMessage({ monthWrong: "Month Should Be Between 1 And 12" }));
}

//DAY ENTERED BY USER SHOULD BE 1-finalDay
export const dayWrong = (finalDay) => (dispatch) => {
  dispatch(createMessage({ dayWrong: "Day Should Be 1-".concat(finalDay) }));
}

//DAY ENTERED HAS ALREADY BEEN ENTERED
export const repeatedEventDay = (dayStr) => (dispatch) => {
  dispatch(createMessage({ repeatedEventDay: "The Day ".concat(dayStr).concat(" Has Already Been Entered") }));
}

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

// GET TIME DELTAS
export const getTimeDeltas = (schedule_id, day_date) => (dispatch, getState) => {
  axios
    .get(`/api/timedeltas/?timedelta_filter=${schedule_id}&day_date_filter=${day_date}`, tokenConfig(getState))
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
export const deleteTimeDelta = (day_date, onlyDelete) => (dispatch, getState) => {
  axios
    .delete(`/api/timedeltas/${day_date}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteTimeDelta: "Scheduled Events Deleted" }));
      dispatch({
        type: DELETE_TIMEDELTA,
        payload: [day_date, onlyDelete],
      });
    })
    .catch((err) => console.log(err));
};

// ADD TIME DELTA
// Currently the only implementation is adding a full day of time deltas
export const addTimeDelta = (schedule_id, day_str, day_date) => (dispatch, getState) => {
  dispatch({
    type: LOADING_TIMEDELTAS,
    payload: null,
  });
  axios
    .post(`/api/timedeltas/?schedule_filter=${schedule_id}&day_str_filter=${day_str}&day_date_filter=${day_date}`, null, tokenConfig(getState))
    .then((res) => {
      if (res.status === 204) {
        dispatch(createMessage({ noTimeDeltas: "No Active Events to Add to Schedule" }));
      } else {
        dispatch(createMessage({ addTimeDelta: "Scheduled Events Added" }));
        dispatch({
          type: ADD_TIMEDELTA,
          payload: res.data,
        });
      }
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
export const getEventDefinitions = (event_id) => (dispatch, getState) => {

  const getString = typeof(event_id) === "number" ?
    `/api/eventdefinitions/${event_id}/` :
    (typeof(event_id) === "string" ?
      `/api/eventdefinitions?event_filter=${event_id}` :
      (typeof(event_id) === "object" ?
        '/api/eventdefinitions?event_filter=[' + event_id.join(",") + "]" :
        "/api/eventdefinitions/"))

  axios
    .get(getString, tokenConfig(getState))
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
      dispatch(createMessage({ addEventDefinition: "Event Definition Created" }));
      dispatch({
        type: ADD_EVENTDEFINITION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// EDIT EVENT DEFINITION
export const editEventDefinition = (event_id, event_change) => (dispatch, getState) => {
  axios
    .patch(`/api/eventdefinitions/${event_id}/`, event_change, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editEventDefinition: "Event Definition Edited" }));
      dispatch({
        type: EDIT_EVENTDEFINITION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET EVENT TYPE AS A BOOLEAN
export const getEventType = (event_id) => (dispatch, getState) => {
  axios
    .get(`/api/strictevents?event_filter=${event_id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_EVENTTYPE,
        payload: event_id === -1 ? "unknown" : (res.data.length === 1 ? "true" : "false"),
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET STRICT EVENTS
export const getStrictEvents = (event_id) => (dispatch, getState) => {

  const getString = typeof(event_id) === "number" ?
    `/api/strictevents/${event_id}/` :
    (typeof(event_id) === "string" ?
      `/api/strictevents?event_filter=${event_id}` :
      "/api/strictevents/")

  axios
    .get(getString, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_STRICTEVENTS,
        payload: typeof(res.data.length) === "number" ? res.data : [res.data],
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE STRICT EVENT
export const deleteStrictEvent = (event_id) => (dispatch, getState) => {
  axios
    .delete(`/api/strictevents/${event_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_STRICTEVENT,
        payload: event_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD STRICT EVENT
export const addStrictEvent = (strictevent) => (dispatch, getState) => {
  axios
    .post("/api/strictevents/", strictevent, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_STRICTEVENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// EDIT OLD STRICT EVENT
export const editStrictEvent = (event_id, edit_object) => (dispatch, getState) => {
  axios
    .patch(`/api/strictevents/${event_id}/`, edit_object, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editStrictEvent: "Strict Event Edited" }));
      dispatch({
        type: EDIT_STRICTEVENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET LOOSE EVENTS
export const getLooseEvents = (event_id) => (dispatch, getState) => {

  const getString = typeof(event_id) === "number" ?
    `/api/looseevents/${event_id}/` :
    (typeof(event_id) === "string" ?
      `/api/looseevents?event_filter=${event_id}` :
      "/api/looseevents/")

  axios
    .get(getString, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_LOOSEEVENTS,
        payload: typeof(res.data.length) === "number" ? res.data : [res.data],
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE LOOSE EVENT
export const deleteLooseEvent = (event_id) => (dispatch, getState) => {
  console.log("entering delete loose event");
  axios
    .delete(`/api/looseevents/${event_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_LOOSEEVENT,
        payload: event_id,
      });
    })
    .catch((err) => console.log(err));
  console.log("exiting delete loose event")
};

// ADD LOOSE EVENT
export const addLooseEvent = (looseevent) => (dispatch, getState) => {
  axios
    .post("/api/looseevents/", looseevent, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_LOOSEEVENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// EDIT OLD LOOSE EVENT
export const editLooseEvent = (event_id, edit_object) => (dispatch, getState) => {
  axios
    .patch(`/api/looseevents/${event_id}/`, edit_object, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editLooseEvent: "Loose Event Edited" }));
      dispatch({
        type: EDIT_LOOSEEVENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET DAYS
export const getDays = (day_id) => (dispatch, getState) => {

  const getString = typeof(day_id) === "number" ?
    `/api/days/${day_id}/` :
    (typeof(day_id) === "string" ?
      `/api/days?day_filter=${day_id}` :
      (typeof(day_id) === "object" ?
        '/api/days?day_filter=[' + day_id.join(",") + "]" :
        "/api/days/"))
  axios
    .get(getString, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_DAYS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE DAY
export const deleteDay = (day_id) => (dispatch, getState) => {
  axios
    .delete(`/api/days/${day_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_DAY,
        payload: day_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD DAY
export const addDay = (day) => (dispatch, getState) => {
  axios
    .post("/api/days/", day, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_DAY,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// EDIT OLD DAY
export const editDay = (day_id, edit_object) => (dispatch, getState) => {
  axios
    .patch(`/api/days/${day_id}/`, edit_object, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editDay: "Day Edited" }));
      dispatch({
        type: EDIT_DAY,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET TIMES
export const getTimes = (time_id) => (dispatch, getState) => {

  const getString = typeof(time_id) === "number" ?
    `/api/times/${time_id}/` :
    (typeof(time_id) === "string" ?
      `/api/times?time_filter=${time_id}` :
      (typeof(time_id) === "object" ?
        '/api/times?time_filter=[' + time_id.join(",") + "]" :
        "/api/times/"))
  axios
    .get(getString, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_TIMES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE TIME
export const deleteTime = (time_id) => (dispatch, getState) => {
  axios
    .delete(`/api/times/${time_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_TIME,
        payload: time_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD TIME
export const addTime = (time) => (dispatch, getState) => {
  axios
    .post("/api/times/", time, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_TIME,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// EDIT OLD TIME
export const editTime = (time_id, edit_object) => (dispatch, getState) => {
  axios
    .patch(`/api/times/${time_id}/`, edit_object, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editTime: "Time Edited" }));
      dispatch({
        type: EDIT_TIME,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET OCCURS_ON_1S
export const getoccurs_on_1s = (o_o_id) => (dispatch, getState) => {
  const getString = typeof(o_o_id) === "number" ?
    `/api/occurs_on_1s/${o_o_id}/` :
    (typeof(o_o_id) === "string" ?
      `/api/occurs_on_1s?o_o_1_filter=${o_o_id}` :
      (typeof(o_o_id) === "object" ?
        '/api/occurs_on_1s?o_o_1_filter=[' + o_o_id.join(",") + "]" :
        "/api/occurs_on_1s/"))
  axios
    .get(getString, tokenConfig(getState))
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
export const deleteoccurs_on_1 = (o_o_id) => (dispatch, getState) => {
  axios
    .delete(
      `/api/occurs_on_1s/${o_o_id}/`,
      tokenConfig(getState),
    )
    .then((res) => {
      dispatch({
        type: DELETE_OCCURS_ON_1,
        payload: o_o_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD OCCURS_ON_1
export const addoccurs_on_1 = (occurs_on_1) => (dispatch, getState) => {
  axios
    .post("/api/occurs_on_1s/", occurs_on_1, tokenConfig(getState))
    .then((res) => {
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
export const getoccurs_on_2s = (o_o_id) => (dispatch, getState) => {
  const getString = typeof(o_o_id) === "number" ?
    `/api/occurs_on_2s/${o_o_id}/` :
    (typeof(o_o_id) === "string" ?
      `/api/occurs_on_2s?o_o_2_filter=${o_o_id}` :
      (typeof(o_o_id) === "object" ?
        '/api/occurs_on_2s?o_o_2_filter=[' + o_o_id.join(",") + "]" :
        "/api/occurs_on_2s/"));
  axios
    .get(getString, tokenConfig(getState))
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
export const deleteoccurs_on_2 = (o_o_id) => (dispatch, getState) => {
  axios
    .delete(`/api/occurs_on_2s/${o_o_id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_OCCURS_ON_2,
        payload: o_o_id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD OCCURS_ON_2
export const addoccurs_on_2 = (occurs_on_2) => (dispatch, getState) => {
  axios
    .post("/api/occurs_on_2s/", occurs_on_2, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_OCCURS_ON_2,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

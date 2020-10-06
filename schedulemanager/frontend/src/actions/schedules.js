import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_SCHEDULES, DELETE_SCHEDULE, ADD_SCHEDULE } from "./types";

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
export const deleteSchedule = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/schedules/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteSchedule: "Schedule Deleted" }));
      dispatch({
        type: DELETE_SCHEDULE,
        payload: id,
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

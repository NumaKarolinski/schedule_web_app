import axios from "axios";
import { createMessage } from "./messages";

import {
  GET_SCHEDULES,
  DELETE_SCHEDULE,
  ADD_SCHEDULE,
  GET_ERRORS,
} from "./types";

// GET SCHEDULES
export const getSchedules = () => (dispatch) => {
  axios
    .get("/api/schedules/")
    .then((res) => {
      dispatch({
        type: GET_SCHEDULES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// DELETE LEAD
export const deleteSchedule = (id) => (dispatch) => {
  axios
    .delete(`/api/schedules/${id}/`)
    .then((res) => {
      dispatch(createMessage({ deleteSchedule: "Schedule Deleted" }));
      dispatch({
        type: DELETE_SCHEDULE,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD LEAD
export const addSchedule = (schedule) => (dispatch) => {
  axios
    .post("/api/schedules/", schedule)
    .then((res) => {
      dispatch(createMessage({ addSchedule: "Schedule Added" }));
      dispatch({
        type: ADD_SCHEDULE,
        payload: res.data,
      });
    })
    .catch((err) => {
      const errors = {
        msg: err.response.data,
        status: err.response.status,
      };
      dispatch({
        type: GET_ERRORS,
        payload: errors,
      });
    });
};

import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import { GET_SCHEDULES, DELETE_SCHEDULE, ADD_SCHEDULE } from "./types";

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
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE SCHEDULE
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

// ADD SCHEDULE
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
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

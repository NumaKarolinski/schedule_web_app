import axios from "axios";

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
    .catch((err) => console.log(err));
};

// DELETE LEAD
export const deleteSchedule = (id) => (dispatch) => {
  axios
    .delete(`/api/schedules/${id}/`)
    .then((res) => {
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
      dispatch({
        type: ADD_SCHEDULE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

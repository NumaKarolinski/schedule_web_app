import axios from "axios";
import { returnErrors } from "./messages";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_SCHEDULES,
  CLEAR_VIEWS,
  CLEAR_EVENTDEFINITIONS,
  CLEAR_TIMEDELTAS,
  CLEAR_OCCURS_ON_1S,
  CLEAR_OCCURS_ON_2S,
} from "./types";

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
  // User Loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

// LOGIN USER
export const login = (username, password) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // Request Body
  const body = JSON.stringify({ username, password });

  axios
    .post("/api/auth/login", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: LOGIN_FAIL });
    });
};

// REGISTER USER
export const register = ({ username, password, email }) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // Request Body
  const body = JSON.stringify({ username, password, email });

  axios
    .post("/api/auth/register", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: REGISTER_FAIL });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post("/api/auth/logout/", null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CLEAR_SCHEDULES,
      });
      dispatch({
        type: CLEAR_VIEWS,
      });
      dispatch({
        type: CLEAR_EVENTDEFINITIONS,
      });
      dispatch({
        type: CLEAR_TIMEDELTAS,
      });
      dispatch({
        type: CLEAR_OCCURS_ON_1S,
      });
      dispatch({
        type: CLEAR_OCCURS_ON_2S,
      });
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // Get token from state
  const token = getState().auth.token;

  //Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};

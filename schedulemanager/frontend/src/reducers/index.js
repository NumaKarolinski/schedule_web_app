import { combineReducers } from "redux";
import schedules from "./schedules";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";

export default combineReducers({
  schedules,
  errors,
  messages,
  auth,
});

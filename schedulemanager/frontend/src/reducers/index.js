import { combineReducers } from "redux";
import schedules from "./schedules";
import errors from "./errors";
import messages from "./messages";

export default combineReducers({
  schedules,
  errors,
  messages,
});

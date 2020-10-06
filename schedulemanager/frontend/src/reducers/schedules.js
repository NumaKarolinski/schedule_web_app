import {
  GET_SCHEDULES,
  DELETE_SCHEDULE,
  ADD_SCHEDULE,
  CLEAR_SCHEDULES,
} from "../actions/types.js";

const initialState = {
  schedules: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SCHEDULES:
      return {
        ...state,
        schedules: action.payload,
      };
    case DELETE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.filter(
          (schedule) => schedule.id !== action.payload
        ),
      };
    case ADD_SCHEDULE:
      return {
        ...state,
        schedules: [...state.schedules, action.payload],
      };
    case CLEAR_SCHEDULES:
      return {
        ...state,
        schedules: [],
      };
    default:
      return state;
  }
}

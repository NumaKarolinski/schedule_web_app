import {
  GET_SCHEDULES,
  DELETE_SCHEDULE,
  ADD_SCHEDULE,
  CLEAR_SCHEDULES,
  GET_VIEWS,
  DELETE_VIEW,
  ADD_VIEW,
  CLEAR_VIEWS,
  GET_EVENTDEFINITIONS,
  DELETE_EVENTDEFINITION,
  ADD_EVENTDEFINITION,
  CLEAR_EVENTDEFINITIONS,
  GET_TIMEDELTAS,
  DELETE_TIMEDELTA,
  ADD_TIMEDELTA,
  CLEAR_TIMEDELTAS,
  GET_OCCURS_ON_1S,
  DELETE_OCCURS_ON_1,
  ADD_OCCURS_ON_1,
  CLEAR_OCCURS_ON_1S,
  GET_OCCURS_ON_2S,
  DELETE_OCCURS_ON_2,
  ADD_OCCURS_ON_2,
  CLEAR_OCCURS_ON_2S,
} from "../actions/types.js";

const initialState = {
  schedules: [],
  views: [],
  eventdefinitions: [],
  timedeltas: [],
  occurs_on_1s: [],
  occurs_on_2s: [],
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
          (schedule) => schedule.schedule_id !== action.payload
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

    case GET_VIEWS:
      return {
        ...state,
        views: action.payload,
      };
    case DELETE_VIEW:
      return {
        ...state,
        views: state.views.filter(
          (view) =>
            view.user_id !== action.payload.user_id &&
            view.schedule_id !== action.payload.schedule_id
        ),
      };
    case ADD_VIEW:
      return {
        ...state,
        views: [...state.views, action.payload],
      };
    case CLEAR_VIEWS:
      return {
        ...state,
        views: [],
      };

    case GET_EVENTDEFINITIONS:
      return {
        ...state,
        eventdefinitions: action.payload,
      };
    case DELETE_EVENTDEFINITION:
      return {
        ...state,
        eventdefinitions: state.eventdefinitions.filter(
          (eventdefinition) => eventdefinition.event_id !== action.payload
        ),
      };
    case ADD_EVENTDEFINITION:
      return {
        ...state,
        eventdefinitions: [...state.eventdefinitions, action.payload],
      };
    case CLEAR_EVENTDEFINITIONS:
      return {
        ...state,
        eventdefinitions: [],
      };

    case GET_TIMEDELTAS:
      return {
        ...state,
        timedeltas: action.payload,
      };
    case DELETE_TIMEDELTA:
      return {
        ...state,
        timedeltas: state.timedeltas.filter(
          (timedelta) => timedelta.td_id !== action.payload
        ),
      };
    case ADD_TIMEDELTA:
      return {
        ...state,
        timedeltas: [...state.timedeltas, action.payload],
      };
    case CLEAR_TIMEDELTAS:
      return {
        ...state,
        timedeltas: [],
      };

    case GET_OCCURS_ON_1S:
      return {
        ...state,
        occurs_on_1s: action.payload,
      };
    case DELETE_OCCURS_ON_1:
      return {
        ...state,
        occurs_on_1s: state.occurs_on_1s.filter(
          (occurs_on_1) =>
            occurs_on_1.event_id !== action.payload.event_id &&
            occurs_on_1.day_id !== action.payload.day_id &&
            occurs_on_1.time_id !== action.payload.time_id
        ),
      };
    case ADD_OCCURS_ON_1:
      return {
        ...state,
        occurs_on_1s: [...state.occurs_on_1s, action.payload],
      };
    case CLEAR_OCCURS_ON_1S:
      return {
        ...state,
        occurs_on_1s: [],
      };

    case GET_OCCURS_ON_2S:
      return {
        ...state,
        occurs_on_2s: action.payload,
      };
    case DELETE_OCCURS_ON_2:
      return {
        ...state,
        occurs_on_2s: state.occurs_on_2s.filter(
          (occurs_on_2) =>
            occurs_on_2.event_id !== action.payload.event_id &&
            occurs_on_2.day_id !== action.payload.day_id
        ),
      };
    case ADD_OCCURS_ON_2:
      return {
        ...state,
        occurs_on_2s: [...state.occurs_on_2s, action.payload],
      };
    case CLEAR_OCCURS_ON_2S:
      return {
        ...state,
        occurs_on_2s: [],
      };

    default:
      return state;
  }
}

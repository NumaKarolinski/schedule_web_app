import {
  GET_SCHEDULES,
  DELETE_SCHEDULE,
  ADD_SCHEDULE,
  CLEAR_SCHEDULES,
  GET_TIMEDELTAS,
  DELETE_TIMEDELTA,
  ADD_TIMEDELTA,
  CLEAR_TIMEDELTAS,
  GET_VIEWS,
  DELETE_VIEW,
  ADD_VIEW,
  CLEAR_VIEWS,
  GET_EVENTDEFINITIONS,
  DELETE_EVENTDEFINITION,
  ADD_EVENTDEFINITION,
  EDIT_EVENTDEFINITION,
  CLEAR_EVENTDEFINITIONS,
  GET_EVENTTYPE,
  GET_STRICTEVENTS,
  DELETE_STRICTEVENT,
  ADD_STRICTEVENT,
  EDIT_STRICTEVENT,
  CLEAR_STRICTEVENTS,
  GET_LOOSEEVENTS,
  DELETE_LOOSEEVENT,
  ADD_LOOSEEVENT,
  EDIT_LOOSEEVENT,
  CLEAR_LOOSEEVENTS,
  GET_DAYS,
  DELETE_DAY,
  ADD_DAY,
  EDIT_DAY,
  CLEAR_DAYS,
  GET_TIMES,
  DELETE_TIME,
  ADD_TIME,
  EDIT_TIME,
  CLEAR_TIMES,
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
  timedeltas: [],
  timeDeltasUpdated: false,
  views: [],
  eventdefinitions: [],
  eventTypeBool: "unknown",
  strictevents: [],
  looseevents: [],
  days: [],
  times: [],
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

    case GET_TIMEDELTAS:
      return {
        ...state,
        timedeltas: action.payload,
        timeDeltasUpdated: true,
      };
    case DELETE_TIMEDELTA:
      return {
        ...state,
        timedeltas: state.timedeltas.filter(
          (timedelta) => timedelta.date_time.slice(0, 10) !== action.payload
        ),
      };
    case ADD_TIMEDELTA:
      return {
        ...state,
        timedeltas: [ ...state.timedeltas ].concat(action.payload),
        timeDeltasUpdated: true,
      };
    case CLEAR_TIMEDELTAS:
      return {
        ...state,
        timedeltas: [],
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
        timeDeltasUpdated: false,
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
    case EDIT_EVENTDEFINITION:
      return {
        ...state,
        eventdefinitions: state.eventdefinitions.map(
          (eventdefinition) => (eventdefinition.event_id !== action.payload.event_id) ? eventdefinition : action.payload
        ),
      }
    case CLEAR_EVENTDEFINITIONS:
      return {
        ...state,
        eventdefinitions: [],
      };

    case GET_EVENTTYPE:
      return {
        ...state,
        eventTypeBool: action.payload,
      };
    case GET_STRICTEVENTS:
      return {
        ...state,
        strictevents: action.payload,
      };
    case DELETE_STRICTEVENT:
      return {
        ...state,
        strictevents: state.strictevents.filter(
          (strictevent) => strictevent.event_id !== action.payload
        ),
        eventdefinitions: state.eventdefinitions.filter(
          (eventdefinition) => eventdefinition.event_id !== action.payload
        ),
      };
    case ADD_STRICTEVENT:
      return {
        ...state,
        strictevents: [...state.strictevents, action.payload],
        eventdefinitions: [...state.eventdefinitions, action.payload],
      };
    case EDIT_STRICTEVENT:
      return {
        ...state,
        strictevents: state.strictevents.map(
          (strictevent) => (strictevent.event_id !== action.payload.event_id) ? strictevent : action.payload
        ),
        eventdefinitions: state.eventdefinitions.map(
          (eventdefinition) => (eventdefinition.event_id !== action.payload.event_id) ? eventdefinition : action.payload
        ),
      };
    case CLEAR_STRICTEVENTS:
      return {
        ...state,
        strictevents: [],
      };

    case GET_LOOSEEVENTS:
      return {
        ...state,
        looseevents: action.payload,
      };
    case DELETE_LOOSEEVENT:
      return {
        ...state,
        looseevents: state.looseevents.filter(
          (looseevent) => looseevent.event_id !== action.payload
        ),
        eventdefinitions: state.eventdefinitions.filter(
          (eventdefinition) => eventdefinition.event_id !== action.payload
        ),
      };
    case ADD_LOOSEEVENT:
      return {
        ...state,
        looseevents: [...state.looseevents, action.payload],
        eventdefinitions: [...state.eventdefinitions, action.payload],
      };
    case EDIT_LOOSEEVENT:
      return {
        ...state,
        looseevents: state.looseevents.map(
          (looseevent) => (looseevent.event_id !== action.payload.event_id) ? looseevent : action.payload
        ),
        eventdefinitions: state.eventdefinitions.map(
          (eventdefinition) => (eventdefinition.event_id !== action.payload.event_id) ? eventdefinition : action.payload
        ),
      };
    case CLEAR_LOOSEEVENTS:
      return {
        ...state,
        looseevents: [],
      };

    case GET_DAYS:
      return {
        ...state,
        days: action.payload,
      };
    case DELETE_DAY:
      return {
        ...state,
        days: state.days.filter(
          (day) => day.day_id !== action.payload
        ),
      };
    case ADD_DAY:
      return {
        ...state,
        days: [...state.days, action.payload],
      };
    case EDIT_DAY:
      return {
        ...state,
        days: state.days.map(
          (day) => (day.day_id !== action.payload.day_id) ? day : action.payload
        ),
      };
    case CLEAR_DAYS:
      return {
        ...state,
        days: [],
      };

    case GET_TIMES:
      return {
        ...state,
        times: action.payload,
      };
    case DELETE_TIME:
      return {
        ...state,
        times: state.times.filter(
          (time) => time.time_id !== action.payload
        ),
      };
    case ADD_TIME:
      return {
        ...state,
        times: [...state.times, action.payload],
      };
    case EDIT_TIME:
      return {
        ...state,
        times: state.times.map(
          (time) => (time.time_id !== action.payload.time_id) ? time : action.payload
        ),
      };
    case CLEAR_TIMES:
      return {
        ...state,
        times: [],
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
          (occurs_on_1) => occurs_on_1.id !== action.payload
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
          (occurs_on_2) => occurs_on_2.id !== action.payload
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

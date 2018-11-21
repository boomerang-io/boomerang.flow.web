/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  FETCH_INSIGHTS_RESET: "FETCH_INSIGHTS_RESET",
  FETCH_INSIGHTS_REQUEST: "FETCH_INSIGHTS_REQUEST",
  FETCH_INSIGHTS_SUCCESS: "FETCH_INSIGHTS_SUCCESS",
  FETCH_INSIGHTS_FAILURE: "FETCH_INSIGHTS_FAILURE"
};
Object.freeze(types);

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.FETCH_INSIGHTS_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_INSIGHTS_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_INSIGHTS_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_INSIGHTS_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const fetchRequest = () => ({ type: types.FETCH_INSIGHTS_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_INSIGHTS_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_INSIGHTS_FAILURE, error });
const reset = () => ({ type: types.FETCH_INSIGHTS_RESET });

const fetchActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancel = () => dispatch => dispatch(fetchApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetch,
  fetchRequest,
  fetchFailure,
  fetchSuccess,
  cancel,
  reset
};
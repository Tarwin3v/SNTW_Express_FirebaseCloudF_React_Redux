import { SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";

const INITIAL_STATE = {
  loading: false,
  errors: {}
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: { ...action.payload }
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {}
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

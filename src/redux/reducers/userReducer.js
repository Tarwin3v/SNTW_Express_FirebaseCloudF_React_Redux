import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_HOWL,
  UNLIKE_HOWL
} from "../types";

const INITIAL_STATE = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return INITIAL_STATE;
    case SET_USER:
      return {
        ...state,
        loading: false,
        authenticated: true,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case LIKE_HOWL:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            howlId: action.payload.howlId
          }
        ]
      };
    case UNLIKE_HOWL:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.howlId !== action.payload.howlId
        )
      };

    default:
      return state;
  }
}

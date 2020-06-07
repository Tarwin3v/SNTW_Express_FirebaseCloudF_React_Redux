import { SET_HOWLS, DELETE_HOWL, LIKE_HOWL, UNLIKE_HOWL, LOADING_DATA, POST_HOWL } from '../types';

const INITIAL_STATE = {
	howls: [],
	howl: {},
	loading: false
};

export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: false
			};
		case SET_HOWLS:
			return {
				...state,
				howls: action.payload,
				loading: false
			};
		case LIKE_HOWL:
		case UNLIKE_HOWL:
			let index = state.howls.findIndex((howl) => howl.howlId === action.payload.howlId);
			state.howls[index] = action.payload;
			return {
				...state
			};

		case POST_HOWL:
			return {
				...state,
				howls: [ action.payload, ...state.howls ]
			};
		case DELETE_HOWL:
			let indel = state.howls.findIndex((howl) => howl.howlId === action.payload);
			state.howls.splice(indel, 1);
			return {
				...state
			};
		default:
			return state;
	}
}

import {
	SET_HOWLS,
	LOADING_DATA,
	LIKE_HOWL,
	UNLIKE_HOWL,
	DELETE_HOWL,
	LOADING_UI,
	SET_ERRORS,
	CLEAR_ERRORS,
	POST_HOWL
} from '../types';
import axios from 'axios';

export const getHowls = () => (dispatch) => {
	dispatch({ type: LOADING_DATA });

	axios
		.get('/howls')
		.then((res) => {
			dispatch({ type: SET_HOWLS, payload: res.data });
		})
		.catch((err) => {
			dispatch({ type: SET_HOWLS, payload: [] });
		});
};

export const likeHowl = (howlId) => (dispatch) => {
	axios
		.post(`/howl/${howlId}/like`)
		.then((res) => {
			dispatch({ type: LIKE_HOWL, payload: res.data });
		})
		.catch((err) => {
			console.log(err);
		});
};

export const unlikeHowl = (howlId) => (dispatch) => {
	axios
		.post(`/howl/${howlId}/unlike`)
		.then((res) => {
			dispatch({ type: UNLIKE_HOWL, payload: res.data });
		})
		.catch((err) => {
			console.log(err);
		});
};

export const deleteHowl = (id) => (dispatch) => {
	axios
		.delete(`/howl/${id}`)
		.then(() => {
			dispatch({ type: DELETE_HOWL, payload: id });
		})
		.catch((err) => console.log(err));
};

export const postHowl = (howlData) => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios
		.post('/howl', howlData)
		.then((res) => {
			dispatch({ type: POST_HOWL, payload: res.data });
			dispatch({ type: CLEAR_ERRORS });
		})
		.catch((err) => {
			dispatch({ type: SET_ERRORS, payload: err.response.data });
		});
};

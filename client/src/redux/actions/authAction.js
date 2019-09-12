import { GET_TOKEN, USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS } from '../types';

// Login User
export const login = (code) => (dispatch) => {
	return fetch('/google-api', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			code
		})
	})
		.then((res) => res.json())
		.then((data) => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: data.email
			});
		})
		.catch(() => {
			dispatch({
				type: LOGIN_FAIL
			});
		});
};

// Load User
export const loadUser = () => (dispatch) => {
	fetch('/get_data', {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => res.json())
		.then((data) => {
			dispatch({
				type: USER_LOADED,
				payload: data.email
			});
		})
		.catch(() => {
			dispatch({
				type: LOGIN_FAIL
			});
		});
};

// Logout User
export const logout = () => (dispatch) => {
	return fetch('/logout', {
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(() => {
		dispatch({
			type: LOGOUT_SUCCESS
		});
	});
};

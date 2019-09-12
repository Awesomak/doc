import {
	USER_LOADED,
	USER_LOADING,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	GET_TOKEN
} from '../types';

const initialState = {
	isAuthenticated: false,
	isLoading: false,
	email: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case USER_LOADING:
			return {
				...state,
				isLoading: true
			};
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				email: action.payload
			};
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			return {
				...state,
				email: action.payload,
				isAuthenticated: true,
				isLoading: false
			};
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT_SUCCESS:
		case REGISTER_FAIL:
			return {
				...state,
				isAuthenticated: false,
				email: null,
				isLoading: false
			};
		case GET_TOKEN:
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
}

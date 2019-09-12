import React from 'react';
import Chat from '../Chat';
import Login from './Login';
import StartPage from './StartPage';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

const AuthChecker = (props) => {
	if (!props.isAuthenticated) {
		return <Login />;
	} else {
		return (
			<>
				<Route path="/" exact component={StartPage} />
				<Route path="/doc/:filename" component={Chat} />
			</>
		);
	}
};

AuthChecker.propTypes = {
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, null)(AuthChecker);

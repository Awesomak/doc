import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../redux/actions/authAction';

const Wait = (props) => {
	useEffect(() => {
		var url = new URL(window.location.href);
		var code = url.searchParams.get('code');

		props.login(code).then(() => props.history.push('/'));
	}, []);

	return <div>Waiting...</div>;
};

Wait.propTypes = {
	email: PropTypes.string,
	login: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	email: state.auth.email
});

export default connect(mapStateToProps, { login })(Wait);

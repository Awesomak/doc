import React, { useEffect, useState } from 'react';
import DocCard from './DocCard';
import socket from '../socket';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/authAction';

const StartPage = (props) => {
	let [ docs, setDocs ] = useState(null);
	let [ docsa, setDocsa ] = useState(null);

	const handleCreate = () => {
		socket.emit('create-doc');
	};

	const handleLogout = () => {
		props.logout().then(() => {
			props.history.push('/login');
		});
	};

	const openDoc = (val) => {
		props.history.push(`/doc/${val}`);
	};

	useEffect(() => {
		socket.on('doc-name', (filename) => {
			fetch('/doc', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					filename,
					access: []
				})
			}).then(() => {
				socket.emit('save-file', '');
				props.history.push(`/doc/${filename}`);
			});
		});

		fetch('/docs', {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				setDocs(data.docs);
				setDocsa(data.docsa);
			});
	}, []);

	return (
		<div className="start_page">
			<button className="save" onClick={handleCreate}>
				Create new document
			</button>
			<h4>Your documents:</h4>
			<div className="documents">
				{docs ? (
					docs.map((e) => {
						return <DocCard key={e._id} val={e.filename} openDoc={openDoc} />;
					})
				) : (
					'You dont create document before'
				)}
			</div>
			<h4>Documents you have access to:</h4>
			<div className="documents">
				{docsa ? (
					docsa.map((e) => {
						return <DocCard key={e._id} val={e.filename} openDoc={openDoc} />;
					})
				) : (
					'You dont have access to any document'
				)}
			</div>
			<br />
			<button className="save" onClick={handleLogout}>
				Log out
			</button>
		</div>
	);
};

StartPage.propTypes = {
	logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(StartPage);

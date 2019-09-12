import React, { useState, useEffect } from 'react';
import socket from './socket';
import Access from './components/Access';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

let timeout = null;

const Chat = (props) => {
	let [ value, setValue ] = useState('');
	let [ errors, setError ] = useState(null);
	let [ succes, setSucces ] = useState(null);
	let [ load, setLoad ] = useState(false);
	let [ typers, setTypers ] = useState([]);
	let [ typing, setTyping ] = useState(false);
	let [ creator, setCreator ] = useState(false);
	let [ access, setAccess ] = useState([]);
	let [ crName, setName ] = useState(null);

	const onChange = (val) => {
		if (typeof window.orientation !== 'undefined') {
			return null;
		}

		if (!typing) socket.emit('start-typing');
		setTyping(true);
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			socket.emit('stop-typing');
			setTyping(false);
		}, 1000);

		socket.emit('doc-change', val);
		setValue(val);
	};

	const home = () => {
		props.history.push('/');
	}

	const copyToClipboard = () => {
		var textArea = document.createElement('textarea');
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = '2px';
		textArea.style.height = '2px';
		textArea.style.padding = 0;
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		textArea.value = window.location.href;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}

		document.body.removeChild(textArea);
		setTimeout(() => {
			setSucces(false);
		}, 1000);
	};

	const handleSave = () => {
		socket.emit('save-file', value);
	};

	const handleSaveAccess = () => {
		const filename = props.match.params.filename;
		socket.emit('update-members')
		fetch('/doc/' + filename, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				access
			})
		})
			.then((res) => res.text())
			.then((data) => {
				console.log(data);
			});
	};

	const handleKey = (event) => {
		const charCode = String.fromCharCode(event.which).toLowerCase();
		if ((event.metaKey || event.ctrlKey) && charCode === 'z') {
			event.preventDefault();
			socket.emit('prev');
		}
		if ((event.metaKey || event.ctrlKey) && charCode === 'y') {
			event.preventDefault();
			socket.emit('next');
		}
	};

	useEffect(() => {
		const filename = props.match.params.filename;

		socket.emit('start-data', filename);

		socket.on('parse-data', () => {	
			fetch('/doc/' + filename, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => res.json())
				.then((data) => {
					if (!data.access) setError('You dont have access to this file');
					setAccess(data.accessD);
					setCreator(data.creator);
					setName(data.creatorName);
					setLoad(true);
				});
			socket.emit('email', props.email)
		});

		socket.on('save-db', () => {
			fetch('/doc', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					filename: props.match.params.filename,
					access: []
				})
			})
				.then((res) => res.text())
				.then((data) => {
					console.log(data);
				});
		});

		socket.on('changes', (msg) => {
			setValue(msg);
		});

		socket.on('problem', (msg) => {
			setError(msg);
		});

		socket.on('start-type', (msg) => {
			setTypers((prevState) => [ ...prevState, msg ]);
		});

		socket.on('stop-type', (msg) => {
			const arr = typers.filter((e) => {
				return e !== msg;
			});
			setTypers(arr);
		});

		socket.on('succes', (msg) => {
			setSucces(msg);
			setTimeout(() => {
				setSucces(false);
			}, 6000);
		});

		return () => {
			socket.off('changes');
			socket.off('problem');
			socket.off('succes');
			socket.off('start-type');
			socket.off('stop-type');
			socket.off('save-db');
			socket.off('parse-data');
		};
	}, []);

	if(!load) {
		return <div></div>
	} else if(errors) {
		return	(			
			<h5 className="error" style={errors ? null : { display: 'none' }}>
				{errors}
			</h5>
		)
	} else {
	return (
		<div className="doc_viewer">
			<div className="work_area">
				<div className="succes" style={succes ? null : { display: 'none' }} onClick={copyToClipboard}>
					File saved and available at
					<strong>{' ' + window.location.href}</strong>
					. Click to copy.
				</div>
				{!errors && load ? (
					<>
						<textarea onChange={(e) => onChange(e.target.value)} onKeyDown={handleKey} value={value} />
						<br />
						<button className="save" onClick={handleSave}>
							Save
						</button>
					</>
				) : null}
			</div>
			<Access
				access={access}
				setAccess={setAccess}
				handleSave={handleSaveAccess}
				creator={creator}
				crName={crName}
				filename={props.match.params.filename}
				typers={typers}
				home={home}
			/>
		</div>
	);}
};

Chat.propTypes = {
	email: PropTypes.string
};

const mapStateToProps = (state) => ({
	email: state.auth.email
});

export default connect(mapStateToProps, null)(Chat);

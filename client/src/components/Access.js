import React, { useState } from 'react';
import AccessChild from './AccessChild';

const Access = (props) => {
	let [ emails, setEmails ] = useState('');
	let [ errors, setError ] = useState(null);

	const addEmails = () => {
		const str = emails.replace(/\s+/g, '');
		const arr2 = str.split(',');
		const arr = [];
		const err = [];
		arr2.forEach((e) => {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (re.test(String(e).toLowerCase())) arr.push(e);
			else err.push(e);
		});
		const errors = err.join(',');
		setError(errors);
		const newArr = arr.concat(props.access);
		props.setAccess(newArr);
		document.getElementById('emails').value = errors;
	};

	const removeAccess = (val) => {
		const arr = [ ...props.access ];
		arr.splice(arr.indexOf(val), 1);
		props.setAccess(arr);
	};

	return (
		<div className="accesses">
			<button className="en_access" onClick={props.home}>
				Home
			</button>
			<br />
			<h4>Document: {props.filename}</h4>
			<h4>Creator: {props.crName}</h4>
			<h4>Members: </h4>
			{props.access ? (
				props.access.map((e, i) => {
					return <AccessChild key={i} val={e} i={i} removeAccess={removeAccess} />;
				})
			) : null}
			{props.creator ? (
				<div>
					<h4>Enter emails through coma</h4>
					<input
						type="text"
						id="emails"
						onChange={(e) => {
							setEmails(e.target.value);
						}}
					/>
					<button onClick={addEmails} className="en_access">
						Enable access
					</button>
					<br />
					{errors ? <p className="email_error">{errors + ' are not valid emails'}</p> : null}
					<button className="save access_btn" onClick={props.handleSave}>
						Save
					</button>
				</div>
			) : null}
			<h4>Formating:</h4>
			<div className="typers">
				{props.typers ? (
					props.typers.map((e) => {
						return (
							<p key={e}>
								<span>{e}</span> is now typing
							</p>
						);
					})
				) : null}
			</div>
		</div>
	);
};

export default Access;

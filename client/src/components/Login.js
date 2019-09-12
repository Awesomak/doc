import React, { useState, useEffect } from 'react';

const Login = () => {
	let [ link, setLink ] = useState(null);

	useEffect(() => {
		let unm = false;
		fetch('/google', {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((l) => {
				if (!unm) setLink(l.link);
			});
		return () => {
			unm = true;
		};
	}, []);

	return (
		<div style={{ marginTop: '40vh' }}>
			{link ? (
				<a href={link} className="link">
					Sing up with google
				</a>
			) : null}
		</div>
	);
};

export default Login;

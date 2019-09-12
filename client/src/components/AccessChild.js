import React from 'react';

const AccessChild = (props) => {
	return (
		<div className="emails">
			<strong>{props.i + 1}.</strong>
			{props.val}
			<span onClick={() => props.removeAccess(props.val)}>delete</span>
		</div>
	);
};

export default AccessChild;

import React from 'react';

const DocCard = (props) => {
	return (
		<div className="docs" onDoubleClick={() => props.openDoc(props.val)}>
			{props.val}
		</div>
	);
};

export default DocCard;

import React from "react";

const Button = props => {
	const { id, children, onClick } = props;
	return (
		<button id={id} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;

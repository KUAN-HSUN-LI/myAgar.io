import React from "react";
export default ({ onChange, onKeyPress }) => {
	return (
		<input
			type="text"
			id="playerNameInput"
			tabIndex="0"
			autoFocus
			placeholder="Enter your name here"
			onChange={onChange}
			onKeyPress={onKeyPress}
			maxLength="25"
		/>
	);
};

import React, { useState } from "react";

const chatInput = props => {
	const [message, setMessage] = useState("");
	const handleChange = e => {
		setMessage(e.target.value);
	};
	const handleKeyPress = e => {
		if (e.key === "Enter") {
			if (message) {
				props.socket.emit("message", message);
				setMessage("");
			}
		}
	};

	return (
		<input
			id="chatInput"
			type="text"
			className="chat-input"
			placeholder="Chat here..."
			maxLength="35"
			value={message}
			onKeyPress={e => handleKeyPress(e)}
			onChange={e => handleChange(e)}
		/>
	);
};

export default chatInput;

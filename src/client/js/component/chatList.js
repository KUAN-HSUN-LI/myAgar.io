import React, { useContext, useEffect } from "react";
import { Context } from "../context";

const chatList = () => {
	const { state, dispatch } = useContext(Context);
	useEffect(() => {
		let c = document.getElementById("chatList");
		c.scrollTo(0, c.scrollHeight);
	});
	return (
		<ul id="chatList" className="chat-list">
			{state.messages.map((e, idx) => (
				<li className="friend" key={idx}>
					{e.name}: {e.msg}
				</li>
			))}
		</ul>
	);
};

export default chatList;

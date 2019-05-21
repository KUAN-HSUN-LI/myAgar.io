import React, { useLayoutEffect, useContext, useState, useEffect } from "react";
import { Context } from "../context";

const chatList = () => {
	const { state, dispatch } = useContext(Context);
	return (
		<ul id="chatList" className="chat-list">
			<li className="friend">123</li>
			{state.messages.map((e, idx) => (
				<li className="friend" key={idx}>
					{e.name}: {e.msg}
				</li>
			))}
		</ul>
	);
};

export default chatList;

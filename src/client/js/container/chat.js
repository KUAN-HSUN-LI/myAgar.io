import React, { useContext, useEffect } from "react";
import ChatList from "../component/chatList";
import ChatInput from "../component/chatInput";
import { Context } from "../context";

const Chat = props => {
	const { state, dispatch } = useContext(Context);
	useEffect(() => {
		state.socket.on("updateMsg", data => {
			dispatch({ type: "UPDATE_USER_MESSAGE", payload: data });
		});
	}, []);

	return (
		<div className="chatbox" id="chatbox">
			<ChatList />
			<ChatInput socket={state.socket} />
		</div>
	);
};
export default Chat;

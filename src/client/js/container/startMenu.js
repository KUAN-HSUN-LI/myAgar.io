import React, { useState, useContext } from "react";
import Input from "../component/input";
import Button from "../component/button";
import Setting from "../component/setting";
import Instruction from "../component/instruction";
import Canvas from "./game";
import { Context } from "../context";
import io from "socket.io-client";

const StartMenu = () => {
	// console.log("start");
	const { state, dispatch } = useContext(Context);
	const [user, setUsername] = useState();

	const validNick = name => {
		let regex = /^\w*$/;
		return regex.exec(name) !== null;
	};

	const handleKeyPress = e => {
		if (e.key === "Enter") {
			handleLogin();
		}
	};

	const generateUid = () => {
		return new Date().getTime() + "" + Math.floor(Math.random() * 999 + 1);
	};

	const handleLogin = async () => {
		const uid = generateUid();
		const username = user;
		if (validNick(username)) {
			await dispatch({ type: "connect" });
			dispatch({ type: "login", payload: { uid, username } });
		}
	};

	return (
		<>
			{state.uid ? (
				<Canvas />
			) : (
				<div id="startMenuWrapper">
					<div id="startMenu">
						<p>Agar</p>

						<Input onChange={e => setUsername(e.target.value)} onKeyPress={handleKeyPress} />
						<b className="input-error">Nick must be alphanumeric characters only!</b>
						<br />
						{/* <a onClick="document.getElementById('spawn_cell').play();"> */}
						<Button id="startButton" onClick={() => handleLogin()}>
							Play
						</Button>
						<Button id="spectateButton">Spectate</Button>
						<Setting />
						<Instruction />
					</div>
				</div>
			)}
		</>
	);
	// }
};
export default StartMenu;

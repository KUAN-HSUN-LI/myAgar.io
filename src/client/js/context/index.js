import React, { createContext, useReducer } from "react";
import io from "socket.io-client";

const Context = createContext();

const initValue = {
	username: "",
	uid: "",
	x: "",
	y: "",
	mass: "",
	color: "",
	players: [],
	foods: [],
	viruses: [],
	messages: [],
	leaderboard: [],
	socket: "",
};

function reducer(state, action) {
	switch (action.type) {
		case "connect":
			return { ...state, ...{ socket: io.connect() } };
		case "login":
			return { ...state, ...action.payload };
		case "init":
			return {
				...state,
				...{ x: action.payload.x, y: action.payload.y, mass: action.payload.mass, color: action.payload.color },
			};
		case "move":
			return {
				...state,
				...{ x: action.payload.x },
				...{ y: action.payload.y },
				...{ players: action.payload.players },
				...{ foods: action.payload.foods },
				...{ viruses: action.payload.viruses },
				...{ leaderboard: action.payload.leaderboard },
			};
		case "dead":
			return { ...state, ...{ uid: "" } };
		case "disconnect":
			return { ...state, ...{ disconnect: action.payload } };
		case "UPDATE_USER_MESSAGE":
			return { ...state, ...{ messages: state.messages.concat(action.payload) } };
		default:
			return state;
	}
}

const ContextProvider = props => {
	const [state, dispatch] = useReducer(reducer, initValue);
	return <Context.Provider value={{ state, dispatch }}>{props.children}</Context.Provider>;
};

export { Context, ContextProvider };

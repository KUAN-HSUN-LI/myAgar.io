import React, { useLayoutEffect, useContext, useState, useCallback, useEffect } from "react";
import LeaderBoard from "../component/leaderBoard";
import { drawPlayer, drawFood, drawVirus } from "../component/util";
import { Context } from "../context";
import Chat from "./chat";
import Canvas from "./canvas";
import cfg from "../config.json";

const Game = () => {
	const { state, dispatch } = useContext(Context);

	return (
		<div id="gameAreaWrapper">
			<LeaderBoard leaderboard={state.leaderboard} />
			<Chat />
			<Canvas />
		</div>
	);
};

export default Game;

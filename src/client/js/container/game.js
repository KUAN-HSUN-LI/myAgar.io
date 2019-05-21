import React, { useLayoutEffect, useContext, useState, useCallback, useEffect } from "react";
import LeaderBoard from "../component/leaderBoard";
import { drawPlayer, drawFood, drawVirus } from "../component/util";
import { Context } from "../context";
import Chat from "./chat";
import cfg from "../config.json";

const Game = () => {
	const { state, dispatch } = useContext(Context);
	const [width, setwidth] = useState(window.innerWidth);
	const [height, setheight] = useState(window.innerHeight);
	const [dead, setDead] = useState(false);
	const [disconnect, setDisconnect] = useState(false);
	const [record, setRecord] = useState([]);
	const drawgrid = ctx => {
		ctx.strokeStyle = "black";
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
		for (let x = -width / 2; x < cfg.gameWidth + width / 2; x += height / 18) {
			ctx.moveTo(x, -height / 2);
			ctx.lineTo(x, height / 2 + cfg.gameHeight);
		}
		for (let y = -height / 2; y < cfg.gameHeight + height / 2; y += height / 18) {
			ctx.moveTo(-width / 2, y);
			ctx.lineTo(width / 2 + cfg.gameWidth, y);
		}
		ctx.stroke();
		ctx.globalAlpha = 1;
	};
	const paint = () => {
		let cv = document.getElementById("cvs");
		cv.width = width;
		cv.height = height;
		let ctx = cv.getContext("2d");
		if (dead) {
			console.log("dead");

			const handledead = () => {
				dispatch({ type: "dead" });
			};
			ctx.fillStyle = "#333333";
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

			ctx.fillStyle = "#FFFFFF";
			ctx.font = "bold 30px sans-serif";

			ctx.textAlign = "center";

			ctx.fillText("Name", window.innerWidth / 2.5, window.innerHeight / 5);
			ctx.fillText("Score", window.innerWidth / 2, window.innerHeight / 5);

			record.map((r, idx) => {
				ctx.textAlign = "left";
				ctx.fillText(
					String(idx + 1) + ".",
					window.innerWidth / 3,
					window.innerHeight / 5 + (window.innerHeight / 20) * (idx + 1)
				);
				ctx.textAlign = "center";
				ctx.fillText(r.name, window.innerWidth / 2.5, window.innerHeight / 5 + (window.innerHeight / 20) * (idx + 1));
				ctx.fillText(r.score, window.innerWidth / 2, window.innerHeight / 5 + (window.innerHeight / 20) * (idx + 1));
			});
			setTimeout(handledead, 1000);
		} else if (disconnect) {
			ctx.fillStyle = "#333333";
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

			ctx.textAlign = "center";
			ctx.fillStyle = "white";
			ctx.font = "bold 30px sans-serif";

			ctx.fillText("Disconnected!", window.innerWidth / 2, window.innerHeight / 2);
		} else {
			ctx.fillStyle = "#f2fbff";
			ctx.translate(width / 2 - state.x, height / 2 - state.y);
			ctx.fillRect(-width / 2, -height / 2, cfg.gameWidth + width, cfg.gameHeight + height);
			drawgrid(ctx);
			state.foods.forEach(e => drawFood(ctx, e.x, e.y, e.radius, e.color));
			state.viruses.forEach(e => drawVirus(ctx, e.x, e.y, e.radius, e.color));
			Object.values(state.players).map(e => {
				drawPlayer(ctx, e);
			});
		}
	};
	useLayoutEffect(() => {
		console.log("setting");
		state.socket.emit("login", { uid: state.uid, username: state.username });
		state.socket.on("init", defaultData => {
			dispatch({ type: "init", payload: defaultData });
		});
		var mouseX = state.x,
			mouseY = state.y;
		var eventListener = window.addEventListener("mousemove", mouse => {
			mouseX = mouse.x;
			mouseY = mouse.y;
		});
		window.addEventListener("keypress", e => {
			if (e.key === "Enter") {
				document.getElementById("chatInput").focus();
			} else if (e.key === " ") {
				state.socket.emit("split", 0);
			}
		});
		const change = () => {
			if (width !== window.innerWidth) {
				setwidth(width => window.innerWidth);
			}
			if (height !== window.innerHeight) {
				setheight(height => window.innerHeight);
			}
			state.socket.emit("move", { mouseX: mouseX - width / 2, mouseY: mouseY - height / 2 });
		};
		const pos = setInterval(() => {
			change();
		}, 1000 / 60);
		state.socket.on("serverTellPlayerMove", ds => {
			dispatch({ type: "move", payload: ds });
		});
		state.socket.on("dead", records => {
			state.socket.close();
			setRecord(record => records);
			setDead(dead => true);
		});
		state.socket.on("disconnect", () => {
			state.socket.close();
			setDisconnect(disconnect => true);
		});
		return () => {
			window.removeEventListener("mousemove", eventListener);
			clearInterval(pos);
		};
	}, []);
	useLayoutEffect(() => {
		paint();
	}, [paint]);
	return (
		<div id="gameAreaWrapper">
			<LeaderBoard leaderboard={state.leaderboard} />
			<Chat />
			<canvas tabIndex="1" id="cvs" />
		</div>
	);
};

export default Game;

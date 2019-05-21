const express = require("express");
const openBrowsers = require("open-browsers");
const mongoose = require("mongoose");
const SAT = require("sat");
const util = require("./src/client/js/component/util");
const cfg = require("./src/client/js/config.json");

// Create server to serve index.html
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 3300;

const Record = require("./src/models/Record");
// const Message = require("./src/models/Message");

// compile react
if (process.env.NODE_ENV !== "production") {
	const webpack = require("webpack");
	const config = require("./webpack.config");
	const compiler = webpack(config);
	// use in develope mode
	app.use(
		require("webpack-dev-middleware")(compiler, {
			publicPath: config.output.publicPath,
		})
	);
	app.use(require("webpack-hot-middleware")(compiler));
}

// Socket.io serverSocket
const io = require("socket.io")(http);

mongoose.connect("mogodb-URL", {
	useNewUrlParser: true,
});
var db = mongoose.connection;

db.on("error", error => {
	console.log(error);
});

var foods = [];
var players = {};
var viruses = [];
var leaderboard = [];

const addFoods = () => {
	let totalFoodMass = cfg.totalFoodMass;
	while (totalFoodMass > 0) {
		const x = util.randomPos().x;
		const y = util.randomPos().y;
		const mass = Math.floor(Math.random() * 4 + 1);
		const color = util.randomColor();
		const radius = util.massToRadius(mass);
		totalFoodMass -= mass;
		foods.push({
			x: x,
			y: y,
			mass: mass,
			radius: radius,
			color: color,
		});
	}
};

const addFood = f => {
	f.x = util.randomPos().x;
	f.y = util.randomPos().x;
	f.mass = Math.floor(Math.random() * 4 + 1);
	f.color = util.randomColor();
	f.radius = util.massToRadius(f.mass);
};

const addViruses = () => {
	let totalVirus = cfg.maxVirus;
	while (totalVirus > 0) {
		const x = util.randomPos().x;
		const y = util.randomPos().y;
		const mass = Math.floor(Math.random() * 100 + 100);
		const color = "rgb(0,200,0)";
		const radius = util.massToRadius(mass);
		--totalVirus;
		viruses.push({
			x: x,
			y: y,
			mass: mass,
			radius: radius,
			color: color,
		});
	}
};

const addVirus = v => {
	v.x = util.randomPos().x;
	v.y = util.randomPos().x;
	v.mass = Math.floor(Math.random() * 10 + 20);
	v.color = "rgb(0,200,0)";
	v.radius = util.massToRadius(v.mass);
};

addFoods();
addViruses();

io.on("connection", socket => {
	console.log("socket connect");
	var username;
	socket.on("login", user => {
		console.log(user.username + " login");
		username = user.username;
		socket.id = user.uid;
		const { x, y, mass, color } = util.init();
		var maxMass = 0;
		players[user.uid] = {
			username: user.username,
			x: x,
			y: y,
			Totalmass: mass,
			cells: [
				{
					x: x,
					y: y,
					mass: mass,
					speed: cfg.defaultSpeed,
				},
			],
			target: { x: 0, y: 0 },
			color: color,
		};
		socket.emit("init", { x, y, mass, color });
		var tick = setInterval(async () => {
			if (players[user.uid].Totalmass <= 0) {
				const record = new Record({ name: user.username, score: maxMass });
				await record.save(err => {
					if (err) console.error(err);
				});
				await Record.find()
					.sort({ score: "-1" })
					.limit(10)
					.exec((err, res) => {
						if (err) throw err;
						socket.emit("dead", res);
						socket.disconnect();
					});
			} else {
				const check = () => {
					if (!players[user.uid]) {
						return;
					}
				};
				await check();

				if (players[user.uid].Totalmass > maxMass) {
					maxMass = players[user.uid].Totalmass;
				}
				movePlayer(players[user.uid]);
				socket.emit("serverTellPlayerMove", {
					x: players[user.uid].x,
					y: players[user.uid].y,
					players,
					foods,
					viruses,
					leaderboard,
				});
				for (let uid in players) {
					handlePlayer(uid);
				}
			}
		}, 1000 / 60);
		socket.on("disconnect", async () => {
			await clearInterval(tick);
			await console.log(user.username + " log out");
			delete players[user.uid];
		});
		socket.on("move", move => {
			if (players[user.uid]) {
				players[user.uid].target.x = move.mouseX;
				players[user.uid].target.y = move.mouseY;
			}
		});
		const movePlayer = player => {
			let x = 0,
				y = 0;
			for (let i = 0; i < player.cells.length; ++i) {
				let target = {
					x: player.x - player.cells[i].x + player.target.x,
					y: player.y - player.cells[i].y + player.target.y,
				};
				let dist = Math.sqrt(target.y ** 2 + target.x ** 2);
				let slowDown = 1;
				if (player.cells[i].speed <= 6.25) {
					slowDown = Math.log(player.cells[i].mass) / 1.5 - 0.5;
				}
				let dx = (player.cells[i].speed * target.x) / dist / slowDown;
				let dy = (player.cells[i].speed * target.y) / dist / slowDown;
				if (player.cells[i].speed > 6.25) {
					player.cells[i].speed -= 0.5;
				}
				let radius = util.massToRadius(mass);
				if (dist < 50 + radius) {
					dy *= dist / (50 + radius);
					dx *= dist / (50 + radius);
				}
				if (!isNaN(dy)) {
					player.cells[i].y += dy;
				}
				if (!isNaN(dx)) {
					player.cells[i].x += dx;
				}

				for (var j = 0; j < player.cells.length; ++j) {
					if (j != i && player.cells[i] !== undefined) {
						var distance = Math.sqrt(
							(player.cells[j].y - player.cells[i].y) ** 2 + (player.cells[j].x - player.cells[i].x) ** 2
						);
						var radiusTotal = radius + util.massToRadius(player.cells[j].mass);
						if (distance < radiusTotal) {
							if (player.lastSplit > new Date().getTime() - 1000 * cfg.mergeTimer) {
								if (player.cells[i].x < player.cells[j].x) {
									--player.cells[i].x;
								} else if (player.cells[i].x > player.cells[j].x) {
									++player.cells[i].x;
								}
								if (player.cells[i].y < player.cells[j].y) {
									--player.cells[i].y;
								} else if (player.cells[i].y > player.cells[j].y) {
									++player.cells[i].y;
								}
							} else if (distance < radiusTotal / 1.75) {
								player.cells[i].mass += player.cells[j].mass;

								player.cells.splice(j, 1);
							}
						}
					}
				}
				if (player.cells.length > i) {
					var borderCalc = radius / 3;
					if (player.cells[i].x > cfg.gameWidth - borderCalc) {
						player.cells[i].x = cfg.gameWidth - borderCalc;
					}
					if (player.cells[i].y > cfg.gameHeight - borderCalc) {
						player.cells[i].y = cfg.gameHeight - borderCalc;
					}
					if (player.cells[i].x < borderCalc) {
						player.cells[i].x = borderCalc;
					}
					if (player.cells[i].y < borderCalc) {
						player.cells[i].y = borderCalc;
					}
					x += player.cells[i].x;
					y += player.cells[i].y;
				}
			}

			player.x = x / player.cells.length;
			player.y = y / player.cells.length;
		};
		socket.on("split", mode => {
			let player = players[user.uid];
			handleSplit(mode, player);
		});
	});
	socket.on("message", data => {
		const msg = {
			name: username,
			msg: data,
		};
		socket.broadcast.emit("updateMsg", msg);
	});
});

const handleSplit = (mode, player, c) => {
	const splitCell = cell => {
		if (cell.mass >= cfg.defaultPlayerMass * 2) {
			cell.mass = cell.mass / 2;
			cell.radius = util.massToRadius(cell.mass);
			player.cells.push({
				mass: cell.mass,
				x: cell.x,
				y: cell.y,
				radius: cell.radius,
				speed: 25,
			});
		}
	};
	if (mode == 0) {
		if (player.Totalmass >= cfg.defaultPlayerMass * 2) {
			if (player.cells.length < cfg.limitSplit) {
				if (player.cells.length < cfg.limitSplit) {
					var numMax = player.cells.length;
					for (var d = 0; d < numMax; d++) {
						splitCell(player.cells[d]);
					}
				}
			}
			player.lastSplit = new Date().getTime();
		}
	} else if (mode == 1) {
		splitCell(c);
		player.lastSplit = new Date().getTime();
	}
};

var V = SAT.Vector;
var C = SAT.Circle;

const handlePlayer = uid => {
	var player = players[uid];

	player.cells.map(c => {
		let radius = util.massToRadius(c.mass);
		let cellCircle = new C(new V(c.x, c.y), radius);
		foods.map(f => {
			if (SAT.pointInCircle(new V(f.x, f.y), cellCircle)) {
				player.Totalmass += f.mass;
				c.mass += f.mass;
				addFood(f);
			}
		});
		viruses.map(v => {
			if (SAT.pointInCircle(new V(v.x, v.y), cellCircle)) {
				if (c.mass > v.mass) {
					handleSplit(1, player, c);
					addVirus(v);
				}
			}
		});
		Object.keys(players).map(k => {
			if (k != uid) {
				players[k].cells.map((c2, idx) => {
					if (c.mass > c2.mass) {
						if (SAT.pointInCircle(new V(c2.x, c2.y), cellCircle)) {
							let dis = Math.sqrt((c.x - c2.x) ** 2 + (c.y - c2.y) ** 2);
							if (dis < util.massToRadius(c.mass) - util.massToRadius(c2.mass)) {
								c.mass += c2.mass;
								player.Totalmass += c.mass;
								players[k].cells.splice(idx, 1);
								players[k].Totalmass -= c2.mass;
							}
						}
					}
				});
			}
		});
	});

	//leaderBoard
	leaderboard.length = 0;
	Object.values(players)
		.sort((a, b) => {
			return a.Totalmass < b.Totalmass;
		})
		.slice(0, 10)
		.map(e => leaderboard.push(e.username));
};

http.listen(port, function(err) {
	// openBrowsers("http://localhost:3300");
	console.log("Listening at *:3300");
});

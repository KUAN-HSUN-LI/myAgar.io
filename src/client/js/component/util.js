const cfg = require("../config.json");

const massToRadius = mass => {
	return 4 + Math.sqrt(mass) * 6;
};

const randomColor = () => {
	return "hsl(" + Math.floor(Math.random() * 255) + ", 100%, 50%";
};

const randomPos = () => {
	let x = Math.floor(Math.random() * 5000),
		y = Math.floor(Math.random() * 5000);
	return { x, y };
};

const drawCircle = (ctx, centerX, centerY, radius, color, withBorder = false) => {
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	ctx.fillStyle = color;
	ctx.fill();
	if (withBorder) {
		ctx.fillStyle = "black";
		ctx.lineWidth = 5;
		ctx.stroke();
	}
};

const drawPlayer = (ctx, player) => {
	player.cells.map(e => {
		let radius = massToRadius(e.mass);
		drawCircle(ctx, e.x, e.y, radius, player.color, true);
		var fontSize = Math.max(radius / 3, 12);
		ctx.lineWidth = cfg.playerConfig.textBorderSize;
		ctx.fillStyle = cfg.playerConfig.textColor;
		ctx.strokeStyle = cfg.playerConfig.textBorder;
		ctx.miterLimit = 1;
		ctx.lineJoin = "round";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "bold " + fontSize + "px sans-serif";
		ctx.strokeText(e.mass, e.x, e.y);
		ctx.fillText(e.mass, e.x, e.y);
	});
};

const drawFood = (ctx, centerX, centerY, radius, color) => {
	drawCircle(ctx, centerX, centerY, radius, color, false);
};

const drawVirus = (ctx, centerX, centerY, radius, color) => {
	drawCircle(ctx, centerX, centerY, radius, color, true);
};

const init = () => {
	let x = Math.floor(Math.random() * 5000);
	let y = Math.floor(Math.random() * 5000);
	let mass = cfg.defaultPlayerMass;
	let color = randomColor();
	return { x, y, mass, color };
};

const generateid = name => {
	return name + new Date().getTime() + "" + Math.floor(Math.random() * 999 + 1);
};

export { massToRadius, randomPos, init, drawPlayer, drawVirus, drawFood, randomColor };

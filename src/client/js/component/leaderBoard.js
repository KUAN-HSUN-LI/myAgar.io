import React from "react";

export default props => {
	return (
		<div id="status">
			<span className="title">Leaderboard</span>
			<br />
			{props.leaderboard.map((e, index) => (
				<div key={index}>
					<span className="me">{index + 1 + ". " + e}</span>
					<br />
				</div>
			))}
		</div>
	);
};

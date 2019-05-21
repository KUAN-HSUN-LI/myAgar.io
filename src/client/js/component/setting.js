import React, { Component, Fragment } from "react";
import Button from "./button";

export default class Setting extends Component {
	settingSwitch() {
		let settings = document.getElementById("settings").style;
		settings.display === "" ? (settings.display = "inline") : (settings.display = "");
	}
	render() {
		return (
			<Fragment>
				<Button id="settingsButton" onClick={() => this.settingSwitch()}>
					Settings
				</Button>
				<br />
				<div id="settings">
					<h3>Settings</h3>
					<div id="checkbox">
						<label>
							<input id="visBord" type="checkbox" />
							Show border
						</label>
						<br />
						<label>
							<input id="showMass" type="checkbox" />
							Show mass
						</label>
						<br />
						<label>
							<input id="continuity" type="checkbox" />
							Continue moving when mouse is off-screen
						</label>
						<br />
						<label>
							<input id="roundFood" type="checkbox" defaultChecked />
							Rounded food
						</label>
						<br />
						<label>
							<input id="darkMode" type="checkbox" />
							Toggle Dark Mode
						</label>
					</div>
				</div>
			</Fragment>
		);
	}
}

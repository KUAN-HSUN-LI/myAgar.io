import React from "react";
import ReactDOM from "react-dom";
import App from "./client/js/App";
import { ContextProvider } from "./client/js/context";

ReactDOM.render(
	<ContextProvider>
		<App />
	</ContextProvider>,
	document.getElementById("root")
);

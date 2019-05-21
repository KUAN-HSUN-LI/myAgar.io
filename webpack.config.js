var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: ["./src/index", "webpack-hot-middleware/client?reload=true"],
	devtool: "source-map",
	output: {
		path: path.join(__dirname),
		filename: "bundle.js",
		publicPath: "/",
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: "index.html",
		}),
		new webpack.HotModuleReplacementPlugin(),
		// Use NoErrorsPlugin for webpack 1.x
		new webpack.NoEmitOnErrorsPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
};

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: ['main.es'],
	output: {
		path: __dirname + '/public/js/app/',
		filename: '[name].js'
	},
	resolve: {
		root: path.resolve('public/js/app/')
	},
	module: {
		loaders: [
			{
				test: /\.es$/,
				exclude: /(node_modules)/,
				loader: 'babel'
			}
		]
	},
	externals: {
		jquery: 'jQuery',
		underscore: '_',
		backbone: 'Backbone',
		handlebars: 'Handlebars'
	},
	plugins: [
		new webpack.DefinePlugin({
			VERSION: '"0.1.0"',
			'process.env': {
				NODE_ENV: '"development"'
			}
		})
	]
};

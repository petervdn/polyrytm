const config = require('../config');
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const opn = require('opn');
const fs = require('fs');
const https = require('https');
const http = require('http');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');
const detectPort = require('detect-port');

const disableHotReload = process.argv.indexOf('--disableHotReloading') != -1 || false;

// default port where dev server listens for incoming traffic
// if the port is in use it will use the first open port it can find
let port = process.env.PORT || config.dev.port;

detectPort(port).then((openPort) => createServer(openPort));

function createServer(port)
{
	// Define HTTP proxies to your custom API backend
	// https://github.com/chimurai/http-proxy-middleware
	const proxyTable = config.dev.proxyTable;

	const server = express();
	const compiler = webpack(webpackConfig);

	const devMiddleware = require('webpack-dev-middleware')(compiler, {
		publicPath: webpackConfig.output.publicPath,
		quiet: true
	});

	let hotMiddleware = null;

	if(!disableHotReload){
		hotMiddleware = require('webpack-hot-middleware')(compiler, {
			log: () => {
			}
		});
	}

	// force page reload when html-webpack-plugin template changes
	compiler.plugin('compilation', function (compilation) {
		compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
			if(!disableHotReload){
				//disable for now because it is executed every time the code changes.
				//hotMiddleware.publish({action: 'reload'});
			}
			cb();
		})
	});

	// proxy api requests
	Object.keys(proxyTable).forEach(function (context) {
		let options = proxyTable[context];
		if (typeof options === 'string') {
			options = {target: options};
		}
		console.log(context);
		console.log(options);
		server.use(proxyMiddleware(context, options));
	});

	// handle fallback for HTML5 history API
	server.use(require('connect-history-api-fallback')());

	// serve webpack bundle output
	server.use(devMiddleware);

	// enable hot-reload and state-preserving
	// compilation error display
	if(!disableHotReload) {
		server.use(hotMiddleware);
	}

	// serve pure static assets
	const staticPath = path.posix.join('/', 'static');
	server.use(staticPath, express.static('./static'));


	devMiddleware.waitUntilValid(function () {
		console.log('> Listening at ' + uri + '\n');
	});

	let createdServer;
	const uri = (config.useHttps ? 'https' : 'http') + '://localhost:' + port;

	if(config.useHttps)
	{
		createdServer = https.createServer({
			key: fs.readFileSync(path.join(__dirname, './ssl/key.pem')),
			cert: fs.readFileSync(path.join(__dirname, './ssl/cert.pem'))
		}, server);
	}
	else
	{
		createdServer = http.createServer(server);
	}

	return createdServer.listen(port, function (err) {
		if (err) {
			console.log(err);
			return;
		}

		opn(uri).catch(() => {});
	});
}

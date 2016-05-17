import http from 'http';
import express from 'express';
import path from 'path';

import routes from './routes';

class Server {
  constructor() {
    const app = express();
    this._app = app;

    if (__DEVELOPMENT__) {
      this.initHotReload();
    }

    this.initMiddleware();
    this.initRoutes();
  }

  get app() {
    return this._app;
  }

  get httpServer() {
    return this._httpServer;
  }

  initHotReload() {
    console.log('Initializing hot reload');

    // Step 1: Create & configure a webpack compiler
    const webpack = require('webpack');
    const webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../../webpack.config');
    const compiler = webpack(webpackConfig);

    // Step 2: Attach the dev middleware to the compiler & the server
    this.app.use(require("webpack-dev-middleware")(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    this.app.use(require("webpack-hot-middleware")(compiler, {
      log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
  }

  initMiddleware() {
    this.app.use(express.static(path.join(__dirname, '..', '..', 'static')));
  }

  initRoutes() {
    for(let i in routes) {
      routes[i](this);
    }
  }

  listen(port, callback) {
    this._httpServer = http.createServer(this.app);
    this._httpServer.listen(port, function() {
      if (callback) {
        callback();
      }
    });
  }
};

module.exports = Server;

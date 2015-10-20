#!/usr/bin/env babel-node
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import fs from 'fs';
import url from 'url';

import serveIndex from 'serve-index';

import compression from 'compression';
import minimist from 'minimist';

import config from './webpack.config.babel.js';

import history from 'connect-history-api-fallback';

//parse cli arguments
let argv = minimist(process.argv.slice(2));

const app = express();
const compiler = webpack(config);

process.env.NODE_ENV = "development";

//override node environment if --env flag was set to prod
if(argv.prod)  process.env.NODE_ENV = "production";

let host = 'localhost';
if(argv.host) host = argv.host;

let port = process.env.PORT || 9000;
if(argv.port) port = argv.port;

app.use(compression());

if(!argv.prod) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}


//app.use(history());

if(argv.demo) {
  app.use('/', express.static('./demos/' + argv.demo));
}else{
  app.use('/', express.static('./demos'));
}

app.use('/style.css', express.static('./style.css'));

app.use('/', serveIndex('./demos', {'icons': true}));

app.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listening at http://${host}:${port}`);
});

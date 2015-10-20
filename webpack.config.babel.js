import webpack from 'webpack';
import path from 'path';
import minimist from 'minimist';

// parse cli arguments and set defaults
let argv = minimist(process.argv.slice(2),{
  default: {
    env: 'dev'
  }
});

process.env.NODE_ENV = "development";

//override node enviroment if --prod flag was set to prod
if(argv.prod)  process.env.NODE_ENV = "production";

let port = process.env.PORT || 9000;
if(argv.port) port = argv.port;

let plugins = [

  new webpack.ResolverPlugin(
    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
  ),
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })

];

if(argv.prod){
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
  ])
}else{
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
  ]);
}

let preloaders = [

];

if(argv.lint){
  preloaders = preloaders.concat([
    {test: /\.jsx?$/, loader: 'eslint', exclude: /build|lib|bower_components|node_modules|bundle.js/},
  ]);
}else{
  plugins.push(new webpack.NoErrorsPlugin());
}

let output = {};
let entry = {};



let newEntry = {};
newEntry[argv.demo] = `./demos/${argv.demo}/index.jsx`;
entry = newEntry;

if(!argv.prod){
  //create files at the root during dev
  output = {
    filename: 'bundle.js',
    publicPath: '/',
    path: __dirname + '/'
  };
}else {
  //build bundled files into the demo dir
  output = {
    filename: '[name]/bundle.js',
    publicPath: '/demos/',
    path: __dirname + '/demos/'
  };
}

if(!argv.prod) {
  //add hot module reloading client as an entry during dev
  entry = Object.keys(entry).reduce(function(result, key) {
    result[key] = ['webpack-hot-middleware/client',entry[key]];
    return result;
  }, {});
}

//eslint settings
let eslint = {
  configFile: '.eslintrc',
  //formatter: require("eslint/lib/formatters/stylish"),
  failOnWarning: false,
  failOnError: false
};


if(argv.prod) {
  plugins = plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin()
  ]);

  eslint.failOnWarning = true;
  eslint.failOnError = true;
}


module.exports = {
  devtool: 'source-map',
  entry: entry,
  port: port,

  output: output,
  resolve: {
    extensions: ['','.js', '.jsx', '.json']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /bower_components|node_modules|bundle.js/,
        loader: 'babel'
      }
    ],
    preLoaders: preloaders,
  },
  node: {
    fs: 'empty'
  },
  //postcss: postcss,
  plugins: plugins,
  eslint: eslint
};

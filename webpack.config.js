var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['./src/assets/javascripts/entry.js'],
  output: {
    path: path.join(__dirname,'dist/assets/javascripts/'),
    filename: 'bundle.js',
    // publicPath: '/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
        // query: {stage: 0}
      },
      {
        test: /scss$/,
        loaders: ["style","css","sass"]
      }
    ]
  }
}

module.exports = {
  entry: [
    './src/weather.js'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot-loader!babel-loader'
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname ,
    publicPath: '/',
    filename: 'bundle.js'
  }
};

module.exports = {
	devtool: 'eval',
  output: {
		libraryTarget: 'umd',
		globalObject: 'this',
		// libraryExport: 'default',
		library: 'rtc'
  },
  entry: {
    browser: ['@babel/polyfill', './src/index.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};

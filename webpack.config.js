const path = require('path');

module.exports = {
  mode: 'development',  // Or 'development' for local dev
  entry: './src/index.ts',  // Entry point for your worker (adjust if needed)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'worker.js',  // Output file
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Support for TypeScript and JavaScript files
    fallback: {
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "assert": false,
      "util": false,
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
      "http": false,
      "os": require.resolve("os-browserify/browser"),
      "querystring": false,
      "zlib": false,
      "vm": false,
      "net":false,
      "url": require.resolve("url/")
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',  // Use ts-loader for compiling TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  target: 'webworker',  // Specify the target as a web worker (Cloudflare Worker)
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { exec } = require('child_process');

// Custom plugin to run the manifest generation script
class GenerateManifestPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('GenerateManifestPlugin', (compilation, callback) => {
      exec('node src/generate-manifest.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error generating manifest: ${error}`);
          return callback(error);
        }
        console.log(stdout);
        callback();
      });
    });
  }
}

module.exports = {
  mode: 'production',
  entry: {
    content: './src/content.js',
    popup: './src/popup.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new GenerateManifestPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'popup.html', to: 'popup.html' },
        { from: 'popup.css', to: 'popup.css' },
        { from: 'content.css', to: 'content.css' },
        { from: 'icons', to: 'icons' },
      ],
    }),
  ],
}; 
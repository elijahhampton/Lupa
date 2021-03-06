var path = require("path");
//const metroBundler = require('metro-bundler');

var config = {
  extraNodeModules: {
    "react-native": path.resolve(__dirname, "node_modules/react-native"),
    "react": path.resolve(__dirname, "node_modules/react"),
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),
      path.resolve(__dirname, "../lupa-api"), // path to the external module
    ];
  },
  assets: ['./assets/fonts/'],
}
module.exports = config;
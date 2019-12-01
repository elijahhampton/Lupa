module.exports = (api) => {
  api.cache(true)
  return {
    "env": {
      "development": {
        "plugins": [
          "@babel/transform-react-jsx-source",
          ["module-resolver", {
            "root": ["./src/ui"]
          }]
        ]
      }
    },
    presets: ['babel-preset-expo', 'module:react-native-dotenv']
  }
}
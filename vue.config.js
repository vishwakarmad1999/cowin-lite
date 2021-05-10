const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../cowin-express/dist"),
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
};

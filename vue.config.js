const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: "/",
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/crypto-dashboard-3/" // Thay tên repository
      : "/",
});

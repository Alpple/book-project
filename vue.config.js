const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // outputDir: "F:\\Users\\User\\Desktop\\AAAAA\\",
  devServer: {
    // /api/login => http://localhost:8088/login
    proxy: {
      '^/api': {
        target: 'http://localhost:8088/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})

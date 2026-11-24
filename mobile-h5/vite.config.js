import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 手机通过局域网访问时，/api 由开发服务器转发到本机后端，浏览器端不涉及跨域
const proxy = {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
  }
}

export default defineConfig({
  base: './',
  // 打包成单个 HTML，方便直接发给手机、离线打开
  plugins: [vue(), viteSingleFile()],
  server: { host: '0.0.0.0', port: 5173, proxy },
  preview: { host: '0.0.0.0', port: 4173, proxy },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000,
    chunkSizeWarningLimit: 2000
  }
})

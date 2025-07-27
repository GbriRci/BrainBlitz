import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: { //reinderizza le richieste che iniziano con /api e con /img al backend
      "/api": "http://localhost:3000", 
      "/img": "http://localhost:3000"
    },
  },
})

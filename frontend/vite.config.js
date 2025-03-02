import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    https: {
      key: fs.readFileSync('./certs/client.key'),
      cert: fs.readFileSync('./certs/client.crt'),
      ca: fs.readFileSync('./certs/ca.crt')
    }
  }
})

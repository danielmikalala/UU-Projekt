import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/authentication": {
                target: "http://localhost",
                changeOrigin: true,
            },
            "/users": {
                target: "http://localhost",
                changeOrigin: true,
            },
            "/project": {
                target: "http://localhost",
                changeOrigin: true,
            }
        }
    }
});

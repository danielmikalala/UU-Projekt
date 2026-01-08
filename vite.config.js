import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// ZCHECNOUT JESTLI NENI NOVA URL PRED POUZITIM U SIMONA const hostUrl = "https://convicted-consumer-product-accordingly.trycloudflare.com"

//const hostUrl = "http://localhost:80";
const hostUrl = "https://convicted-consumer-product-accordingly.trycloudflare.com"
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/authentication": {
        target: hostUrl,
        changeOrigin: true,
      },
      "/users": {
        target: hostUrl,
        changeOrigin: true,
      },
      "/projects": {
        target: hostUrl,
        changeOrigin: true,
      },
      "/categories": {
        target: hostUrl,
        changeOrigin: true,
      },
      "/donations": {
        target: hostUrl,
        changeOrigin: true,
      },
    },
  },
});

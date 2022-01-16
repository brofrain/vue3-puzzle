import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";

export default ({ mode }) => {
  const cwd = process.cwd();
  const viteEnv = loadEnv(mode, cwd);

  return defineConfig({
    plugins: [vue(), eslintPlugin()],
    resolve: {
      alias: [{ find: "@/", replacement: `${cwd}/src/` }]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_variables.scss";
            @import "@/styles/_mixins.scss";
            @import "@/styles/_animations.scss";
          `
        }
      }
    },
    clearScreen: false,
    base: viteEnv.VITE_BASE_URL
  });
};

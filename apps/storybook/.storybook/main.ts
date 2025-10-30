import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path, { dirname, join } from "path";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {},
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@one-portal/ui/styles.css": path.resolve(
            __dirname,
            "../../../packages/ui/dist/styles.css",
          ),
          "@one-portal/ui": path.resolve(__dirname, "../../../packages/ui/src"),
          // Ensure single React instance for React 19 compatibility
          react: path.resolve(__dirname, "../../../node_modules/react"),
          "react-dom": path.resolve(
            __dirname,
            "../../../node_modules/react-dom",
          ),
        },
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}

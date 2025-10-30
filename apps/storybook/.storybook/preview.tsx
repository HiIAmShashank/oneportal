import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@one-portal/ui/styles.css";
import "./storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: {
          name: "light",
          value: "#ffffff",
        },

        dark: {
          name: "dark",
          value: "#0a0a0a",
        },
      },
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <div style={{ padding: "2rem", minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],

  initialGlobals: {
    backgrounds: {
      value: "light",
    },
  },
};

export default preview;

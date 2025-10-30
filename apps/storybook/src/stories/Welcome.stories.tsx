import type { Meta, StoryObj } from "@storybook/react-vite";

const Welcome = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to DataTable Storybook
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        This Storybook showcases all features of the OnePortal DataTable
        component.
      </p>

      <div className="space-y-4">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Story Categories</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>Basic Features</strong> - Sorting, filtering, pagination,
              search
            </li>
            <li>
              <strong>Advanced Features</strong> - Inline editing, grouping,
              expanding, server-side
            </li>
            <li>
              <strong>Column Features</strong> - Resizing, reordering, pinning,
              visibility
            </li>
            <li>
              <strong>Selection & Actions</strong> - Row selection, bulk
              actions, per-row actions
            </li>
            <li>
              <strong>UI Variations</strong> - Density, themes, filter modes,
              variants
            </li>
            <li>
              <strong>Real-World Examples</strong> - Users, orders, products,
              financial data
            </li>
            <li>
              <strong>Persistence & State</strong> - localStorage,
              controlled/uncontrolled modes
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
          <p className="text-muted-foreground">
            Navigate through the stories in the sidebar to explore different
            features and use cases. Each story is interactive and demonstrates
            specific DataTable capabilities.
          </p>
        </section>

        <section className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="text-xl font-semibold mb-2">Theme Toggle</h3>
          <p className="text-sm text-muted-foreground">
            Use the theme switcher in the toolbar above to toggle between light
            and dark modes.
          </p>
        </section>
      </div>
    </div>
  );
};

const meta: Meta<typeof Welcome> = {
  title: "Welcome",
  component: Welcome,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Welcome>;

export const Default: Story = {};

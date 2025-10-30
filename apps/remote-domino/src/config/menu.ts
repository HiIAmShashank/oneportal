import type { MenuItem } from "../types/menu";

/**
 * Documentation menu configuration for OnePortal
 *
 * This app serves as a boilerplate and documentation reference
 * for developers building micro-frontends in the OnePortal ecosystem.
 */
export const menuItems: MenuItem[] = [
  {
    name: "Home",
    path: "/",
    icon: "Home",
    order: 1,
    description: "Welcome to OnePortal",
  },
  {
    name: "Getting Started",
    path: "/getting-started",
    icon: "Rocket",
    order: 2,
    description: "Quick start guide",
  },
  {
    name: "Repository",
    path: "/repository",
    icon: "FolderTree",
    order: 3,
    description: "Project structure",
  },
  {
    name: "Tech Stack",
    path: "/tech-stack",
    icon: "Layers",
    order: 4,
    description: "Technologies used",
  },
  {
    name: "UI Components",
    path: "/components",
    icon: "Box",
    order: 5,
    description: "Shared component library",
  },
  {
    name: "DataTable",
    path: "/datatable",
    icon: "Table",
    order: 6,
    description: "DataTable guide",
  },
  {
    name: "Routing",
    path: "/routing",
    icon: "Route",
    order: 7,
    description: "TanStack Router",
  },
  {
    name: "Styling",
    path: "/styling",
    icon: "Palette",
    order: 8,
    description: "Tailwind CSS",
  },
];

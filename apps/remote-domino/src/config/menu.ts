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
    name: "Events",
    path: "/events",
    icon: "Activity",
    order: 2,
    description: "View Domino Event System events",
  },
  {
    name: "Event Types",
    path: "/event-types",
    icon: "Tag",
    order: 3,
    description: "View and manage event type definitions",
  },
  {
    name: "Applications",
    path: "/applications",
    icon: "AppWindow",
    order: 4,
    description: "View and manage registered applications",
  },
  {
    name: "Subscriptions",
    path: "/subscriptions",
    icon: "Key",
    order: 5,
    description: "View and manage registered subscriptions",
  },
  {
    name: "Job Types",
    path: "/job-types",
    icon: "Briefcase",
    order: 6,
    description: "View and manage job type definitions",
  },
  {
    name: "Workflow Steps",
    path: "/workflow-steps",
    icon: "Workflow",
    order: 7,
    description: "View and manage workflow step definitions",
  },
  {
    name: "Workflow Types",
    path: "/workflow-step-types",
    icon: "Network",
    order: 8,
    description: "View and manage workflow step type definitions",
  },
];

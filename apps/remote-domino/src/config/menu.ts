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
];

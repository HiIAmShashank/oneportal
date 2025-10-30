export type MountFunction = (containerId: string) => any;

export type UnmountFunction = (container?: HTMLElement) => Promise<void> | void;

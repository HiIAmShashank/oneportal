// Shadcn UI Components - Layout & Navigation
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from "./components/ui/button";
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb";
export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";

// Shadcn UI Components - Display
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
export { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Badge, badgeVariants } from "./components/ui/badge";
export { Separator } from "./components/ui/separator";
export { Skeleton } from "./components/ui/skeleton";
export { Progress } from "./components/ui/progress";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/ui/tooltip";
export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./components/ui/empty";

// Shadcn UI Components - Overlays
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/ui/command";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
export { Toaster as Sonner } from "./components/ui/sonner";
export { toast } from "sonner";

// Shadcn UI Components - Forms
export { Input } from "./components/ui/input";
export { Label } from "./components/ui/label";
export { Switch } from "./components/ui/switch";
export { Checkbox } from "./components/ui/checkbox";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";

// Shadcn UI Components - Overlays
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./components/ui/popover";

// Legacy components (deprecated - use shadcn equivalents)
export { Spinner, type SpinnerProps } from "./components/ui/spinner";

// Auth Components
export { SignInPrompt } from "./components/auth/SignInPrompt";
export { AuthLoadingSpinner } from "./components/auth/AuthLoadingSpinner";

// Utilities
export { cn } from "./lib/utils";
export { useIsMobile } from "./hooks/use-mobile";

// DataTable Component (V2)
export * from "./data-table-v2";

// Icons (re-export from lucide-react for convenience)
export {
  AlertCircle,
  RefreshCw,
  Settings,
  User,
  Moon,
  Sun,
  Laptop,
  ChevronDown,
  ChevronRight,
  LogOut,
  UserCircle,
  Bell,
  Search,
  ShieldCheck,
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
} from "lucide-react";

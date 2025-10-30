/**
 * DataTable V2 - Custom Cell Rendering Stories
 *
 * Demonstrates how to render custom JSX, components, and complex layouts inside cells.
 * All examples work seamlessly with sorting, filtering, pagination, and all other DataTable features.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import {
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
} from "@one-portal/ui";
import {
  Star,
  StarHalf,
  Copy,
  Eye,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// =============================================================================
// DATA TYPES
// =============================================================================

interface Product {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  stockPercentage: number;
  tags: string[];
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  position: string;
  salary: number;
  performance: number; // 0-100
  skills: string[];
  location: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "On Hold" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Critical";
  progress: number;
  team: { name: string; avatar: string }[];
  dueDate: Date;
  budget: number;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    thumbnail: "https://picsum.photos/seed/prod1/80/80",
    price: 129.99,
    category: "Electronics",
    rating: 4.5,
    reviews: 234,
    stock: 45,
    stockPercentage: 75,
    tags: ["Bluetooth", "Noise Cancelling", "Premium"],
    status: "In Stock",
  },
  {
    id: "2",
    name: "Smart Watch",
    thumbnail: "https://picsum.photos/seed/prod2/80/80",
    price: 299.99,
    category: "Wearables",
    rating: 4.8,
    reviews: 567,
    stock: 12,
    stockPercentage: 20,
    tags: ["Fitness", "GPS", "Waterproof"],
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Laptop Stand",
    thumbnail: "https://picsum.photos/seed/prod3/80/80",
    price: 49.99,
    category: "Accessories",
    rating: 4.2,
    reviews: 89,
    stock: 0,
    stockPercentage: 0,
    tags: ["Ergonomic", "Aluminum"],
    status: "Out of Stock",
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    thumbnail: "https://picsum.photos/seed/prod4/80/80",
    price: 159.99,
    category: "Peripherals",
    rating: 5.0,
    reviews: 1203,
    stock: 78,
    stockPercentage: 90,
    tags: ["RGB", "Cherry MX", "Gaming"],
    status: "In Stock",
  },
  {
    id: "5",
    name: "USB-C Hub",
    thumbnail: "https://picsum.photos/seed/prod5/80/80",
    price: 39.99,
    category: "Accessories",
    rating: 3.8,
    reviews: 45,
    stock: 23,
    stockPercentage: 40,
    tags: ["Multi-Port", "Compact"],
    status: "In Stock",
  },
];

const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=1",
    department: "Engineering",
    position: "Senior Developer",
    salary: 125000,
    performance: 92,
    skills: ["React", "TypeScript", "Node.js"],
    location: "San Francisco, CA",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@company.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://i.pravatar.cc/150?img=12",
    department: "Design",
    position: "Lead Designer",
    salary: 110000,
    performance: 88,
    skills: ["Figma", "UI/UX", "Prototyping"],
    location: "New York, NY",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://i.pravatar.cc/150?img=5",
    department: "Marketing",
    position: "Marketing Manager",
    salary: 95000,
    performance: 76,
    skills: ["SEO", "Content", "Analytics"],
    location: "Austin, TX",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@company.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://i.pravatar.cc/150?img=14",
    department: "Engineering",
    position: "DevOps Engineer",
    salary: 115000,
    performance: 95,
    skills: ["AWS", "Docker", "Kubernetes"],
    location: "Seattle, WA",
  },
  {
    id: "5",
    name: "Jessica Brown",
    email: "jessica.b@company.com",
    phone: "+1 (555) 567-8901",
    avatar: "https://i.pravatar.cc/150?img=9",
    department: "Sales",
    position: "Account Executive",
    salary: 105000,
    performance: 84,
    skills: ["B2B Sales", "CRM", "Negotiation"],
    location: "Boston, MA",
  },
];

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    status: "Active",
    priority: "High",
    progress: 65,
    team: [
      { name: "Sarah", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Michael", avatar: "https://i.pravatar.cc/150?img=12" },
    ],
    dueDate: new Date("2025-12-15"),
    budget: 50000,
  },
  {
    id: "2",
    name: "Mobile App Launch",
    description: "iOS and Android app for customer engagement",
    status: "Active",
    priority: "Critical",
    progress: 88,
    team: [
      { name: "David", avatar: "https://i.pravatar.cc/150?img=14" },
      { name: "Sarah", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Emily", avatar: "https://i.pravatar.cc/150?img=5" },
    ],
    dueDate: new Date("2025-11-30"),
    budget: 150000,
  },
  {
    id: "3",
    name: "Security Audit",
    description: "Comprehensive security review and penetration testing",
    status: "On Hold",
    priority: "Medium",
    progress: 30,
    team: [{ name: "David", avatar: "https://i.pravatar.cc/150?img=14" }],
    dueDate: new Date("2026-02-28"),
    budget: 25000,
  },
  {
    id: "4",
    name: "Marketing Campaign Q4",
    description: "Holiday season marketing push across all channels",
    status: "Completed",
    priority: "High",
    progress: 100,
    team: [
      { name: "Emily", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Jessica", avatar: "https://i.pravatar.cc/150?img=9" },
    ],
    dueDate: new Date("2025-10-31"),
    budget: 75000,
  },
  {
    id: "5",
    name: "Legacy System Migration",
    description: "Migrate from on-premise to cloud infrastructure",
    status: "Cancelled",
    priority: "Low",
    progress: 15,
    team: [{ name: "David", avatar: "https://i.pravatar.cc/150?img=14" }],
    dueDate: new Date("2026-06-30"),
    budget: 200000,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Render star rating
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-gray-300 dark:text-gray-600"
        />
      ))}
    </div>
  );
};

// =============================================================================
// COLUMN DEFINITIONS
// =============================================================================

// Product columns with custom rendering
const productColumns: ColumnDef<Product>[] = [
  {
    id: "thumbnail",
    accessorKey: "thumbnail",
    header: "Image",
    size: 100,
    cell: ({ row }) => (
      <img
        src={row.original.thumbnail}
        alt={row.original.name}
        className="h-12 w-12 rounded-lg object-cover border border-border"
      />
    ),
    enableSorting: false,
    enableFiltering: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Product",
    size: 200,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.category}
        </span>
      </div>
    ),
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    size: 120,
    cell: ({ row }) => (
      <span className="font-semibold text-green-600 dark:text-green-400">
        ${row.original.price.toFixed(2)}
      </span>
    ),
  },
  {
    id: "rating",
    accessorKey: "rating",
    header: "Rating",
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {renderStars(row.original.rating)}
        <span className="text-xs text-muted-foreground">
          ({row.original.reviews})
        </span>
      </div>
    ),
  },
  {
    id: "stock",
    accessorKey: "stockPercentage",
    header: "Stock",
    size: 200,
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {row.original.stock} units
          </span>
          <span className="text-xs font-medium">
            {row.original.stockPercentage}%
          </span>
        </div>
        <Progress value={row.original.stockPercentage} className="h-2" />
      </div>
    ),
  },
  {
    id: "tags",
    accessorKey: "tags",
    header: "Tags",
    size: 250,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ row }) => {
      const statusConfig = {
        "In Stock": {
          icon: CheckCircle2,
          variant: "default" as const,
          className: "text-green-600 dark:text-green-400",
        },
        "Low Stock": {
          icon: AlertCircle,
          variant: "outline" as const,
          className: "text-yellow-600 dark:text-yellow-400",
        },
        "Out of Stock": {
          icon: XCircle,
          variant: "destructive" as const,
          className: "text-red-600 dark:text-red-400",
        },
      };

      const config = statusConfig[row.original.status];
      const Icon = config.icon;

      return (
        <Badge variant={config.variant} className="gap-1">
          <Icon className={`h-3 w-3 ${config.className}`} />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 140,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => alert(`View ${row.original.name}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => alert(`Copy ${row.original.name}`)}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => alert(`Delete ${row.original.name}`)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableFiltering: false,
  },
];

// Employee columns with custom rendering
const employeeColumns: ColumnDef<Employee>[] = [
  {
    id: "employee",
    accessorKey: "name",
    header: "Employee",
    size: 280,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.position}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    accessorKey: "email",
    header: "Contact",
    size: 250,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <a
            href={`mailto:${row.original.email}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.email}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{row.original.phone}</span>
        </div>
      </div>
    ),
  },
  {
    id: "location",
    accessorKey: "location",
    header: "Location",
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.original.location}</span>
      </div>
    ),
  },
  {
    id: "performance",
    accessorKey: "performance",
    header: "Performance",
    size: 200,
    cell: ({ row }) => {
      const value = row.original.performance;
      const color =
        value >= 90
          ? "bg-green-500"
          : value >= 75
            ? "bg-blue-500"
            : value >= 60
              ? "bg-yellow-500"
              : "bg-red-500";

      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{value}%</span>
            <Badge
              variant={value >= 75 ? "default" : "secondary"}
              className="text-xs"
            >
              {value >= 90
                ? "Excellent"
                : value >= 75
                  ? "Good"
                  : "Needs Improvement"}
            </Badge>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`${color} h-2 rounded-full transition-all`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "skills",
    accessorKey: "skills",
    header: "Skills",
    size: 220,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.skills.map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "salary",
    accessorKey: "salary",
    header: "Salary",
    size: 140,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(row.original.salary)}
      </span>
    ),
  },
];

// Project columns with custom rendering
const projectColumns: ColumnDef<Project>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Project",
    size: 250,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{row.original.name}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ row }) => {
      const statusConfig = {
        Active: {
          variant: "default" as const,
          className:
            "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        },
        "On Hold": {
          variant: "secondary" as const,
          className:
            "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
        },
        Completed: {
          variant: "outline" as const,
          className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        },
        Cancelled: { variant: "destructive" as const, className: "" },
      };

      const config = statusConfig[row.original.status];

      return (
        <Badge variant={config.variant} className={config.className}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: "Priority",
    size: 120,
    cell: ({ row }) => {
      const priorityConfig = {
        Low: { variant: "secondary" as const, dots: 1 },
        Medium: { variant: "outline" as const, dots: 2 },
        High: { variant: "default" as const, dots: 3 },
        Critical: { variant: "destructive" as const, dots: 4 },
      };

      const config = priorityConfig[row.original.priority];

      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < config.dots ? "bg-current" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <Badge variant={config.variant} className="text-xs">
            {row.original.priority}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "progress",
    accessorKey: "progress",
    header: "Progress",
    size: 200,
    cell: ({ row }) => {
      const value = row.original.progress;
      return (
        <div className="flex items-center gap-3">
          <Progress value={value} className="h-2 flex-1" />
          <span className="text-sm font-medium w-12 text-right">{value}%</span>
        </div>
      );
    },
  },
  {
    id: "team",
    accessorKey: "team",
    header: "Team",
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {row.original.team.slice(0, 3).map((member, i) => (
            <Avatar key={i} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {row.original.team.length > 3 && (
          <span className="ml-2 text-xs text-muted-foreground">
            +{row.original.team.length - 3} more
          </span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "dueDate",
    accessorKey: "dueDate",
    header: "Due Date",
    size: 150,
    cell: ({ row }) => {
      const dueDate = new Date(row.original.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      const isOverdue = daysUntilDue < 0;
      const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm">
            {dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs w-fit">
              {Math.abs(daysUntilDue)} days overdue
            </Badge>
          )}
          {isDueSoon && !isOverdue && (
            <Badge variant="outline" className="text-xs w-fit">
              {daysUntilDue} days left
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "budget",
    accessorKey: "budget",
    header: "Budget",
    size: 140,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(row.original.budget)}
      </span>
    ),
  },
];

// =============================================================================
// STORIES
// =============================================================================

const meta = {
  title: "DataTable V2/13-Custom Cell Rendering",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Demonstrates various custom cell rendering techniques including images, badges, progress bars, star ratings, action buttons, chip arrays, avatars, and complex layouts. All examples work seamlessly with sorting, filtering, pagination, and other DataTable features.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story 1: Product Catalog with Images, Stars, Progress, and Tags
export const ProductCatalog: Story = {
  args: {
    data: sampleProducts,
    columns: productColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: {
        enabled: true,
      },
      columns: {
        enableResizing: true,
        enablePinning: true,
      },
    },
    ui: {
      variant: "default",
      density: "default",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Product catalog showcasing:\n- Thumbnail images with rounded borders\n- Star rating visualization\n- Stock progress bars\n- Tag chips (multiple badges)\n- Status badges with icons\n- Inline action buttons (view, copy, delete)\n- Multi-line cells with primary/secondary text",
      },
    },
  },
};

// Story 2: Employee Directory with Avatars and Complex Contact Info
export const EmployeeDirectory: Story = {
  args: {
    data: sampleEmployees,
    columns: employeeColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: {
        enabled: true,
      },
      columns: {
        enableResizing: true,
      },
    },
    ui: {
      variant: "default",
      density: "default",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Employee directory showcasing:\n- Avatar with image fallback\n- Multi-line employee info (name + position)\n- Contact information with icons (email + phone)\n- Clickable email links\n- Custom performance indicators (progress bar + badge)\n- Skill chips\n- Formatted currency (salary)\n- Location with icon",
      },
    },
  },
};

// Story 3: Project Dashboard with Team Avatars and Priority Indicators
export const ProjectDashboard: Story = {
  args: {
    data: sampleProjects,
    columns: projectColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: {
        enabled: true,
      },
      columns: {
        enableResizing: true,
      },
    },
    ui: {
      variant: "bordered",
      density: "comfortable",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Project dashboard showcasing:\n- Multi-line project info with description truncation\n- External link icons\n- Color-coded status badges\n- Priority indicators with dot visualization\n- Horizontal progress bars with percentage\n- Overlapping avatar groups for teams\n- Dynamic due date badges (overdue/due soon)\n- Formatted budget amounts",
      },
    },
  },
};

// Story 4: Compact View with Custom Rendering
export const CompactView: Story = {
  args: {
    data: sampleProducts,
    columns: productColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      sorting: {
        enabled: true,
      },
    },
    ui: {
      variant: "default",
      density: "compact",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates that all custom cell rendering works perfectly in compact density mode. Images, badges, progress bars, and action buttons adapt to the smaller row height.",
      },
    },
  },
};

// Story 5: Striped Variant with Custom Cells
export const StripedVariant: Story = {
  args: {
    data: sampleEmployees,
    columns: employeeColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
    ui: {
      variant: "striped",
      density: "default",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows custom cell rendering with striped table variant. Avatars, badges, progress bars, and skill chips maintain proper contrast against alternating row backgrounds.",
      },
    },
  },
};

// Story 6: With Column Pinning and Custom Cells
export const WithColumnPinning: Story = {
  args: {
    data: sampleProducts,
    columns: productColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: {
        enabled: true,
      },
      columns: {
        enableResizing: true,
        enablePinning: true,
        initialPinning: {
          left: ["thumbnail", "name"],
          right: ["actions"],
        },
      },
    },
    ui: {
      variant: "default",
      density: "default",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates custom cell rendering with pinned columns. Image and product name pinned left, action buttons pinned right. All custom rendering works seamlessly with sticky positioning.",
      },
    },
  },
};

// Story 7: Kitchen Sink - All Custom Rendering Techniques
export const KitchenSink: Story = {
  args: {
    data: sampleProjects,
    columns: projectColumns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 5,
      },
      sorting: {
        enabled: true,
      },
      columns: {
        enableResizing: true,
        enablePinning: true,
        enableReordering: true,
        enableVisibility: true,
      },
      filters: {
        enabled: true,
        mode: "toolbar",
      },
      globalSearch: {
        enabled: true,
      },
    },
    ui: {
      variant: "bordered",
      density: "comfortable",
      showToolbar: true,
      showViewOptions: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete example showing all custom rendering techniques working together with all DataTable features:\n- Badges with custom styling\n- Progress bars\n- Avatar groups (overlapping)\n- Priority dot indicators\n- Dynamic date badges\n- External link icons\n- All features enabled: sorting, filtering, pagination, column controls, etc.",
      },
    },
  },
};

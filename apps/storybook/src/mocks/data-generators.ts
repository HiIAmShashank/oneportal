/**
 * Mock data generators for DataTable stories
 * Uses @faker-js/faker for realistic data generation
 */

import { faker } from "@faker-js/faker";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Inactive" | "Pending";
  avatar: string;
  department: string;
  lastLogin: Date;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: number;
  date: Date;
  shippingAddress: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supplier: string;
  lastRestocked: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
  category: string;
  balance: number;
  reference: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Todo" | "In Progress" | "Review" | "Done";
  dueDate: Date;
  tags: string[];
  estimatedHours: number;
  completedHours?: number;
}

// =============================================================================
// USER DATA GENERATOR
// =============================================================================

export function generateUser(): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const roles: User["role"][] = ["Admin", "Editor", "Viewer"];
  const statuses: User["status"][] = ["Active", "Inactive", "Pending"];

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    role: faker.helpers.arrayElement(roles),
    status: faker.helpers.arrayElement(statuses),
    avatar: faker.image.avatar(),
    department: faker.commerce.department(),
    lastLogin: faker.date.recent({ days: 30 }),
    createdAt: faker.date.past({ years: 2 }),
  };
}

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, generateUser);
}

// =============================================================================
// ORDER DATA GENERATOR
// =============================================================================

export function generateOrder(): Order {
  const statuses: Order["status"][] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return {
    id: faker.string.uuid(),
    orderNumber: `ORD-${faker.number.int({ min: 10000, max: 99999 })}`,
    customer: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    amount: faker.number.float({ min: 10, max: 5000, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(statuses),
    items: faker.number.int({ min: 1, max: 10 }),
    date: faker.date.recent({ days: 90 }),
    shippingAddress: faker.location.streetAddress({ useFullAddress: true }),
  };
}

export function generateOrders(count: number): Order[] {
  return Array.from({ length: count }, generateOrder);
}

// =============================================================================
// PRODUCT DATA GENERATOR
// =============================================================================

export function generateProduct(): Product {
  const stock = faker.number.int({ min: 0, max: 1000 });
  let status: Product["status"];

  if (stock === 0) {
    status = "Out of Stock";
  } else if (stock < 50) {
    status = "Low Stock";
  } else {
    status = "In Stock";
  }

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sku: `SKU-${faker.string.alphanumeric({ length: 8, casing: "upper" })}`,
    category: faker.commerce.department(),
    price: faker.number.float({ min: 5, max: 999, fractionDigits: 2 }),
    stock,
    status,
    supplier: faker.company.name(),
    lastRestocked: faker.date.recent({ days: 60 }),
  };
}

export function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, generateProduct);
}

// =============================================================================
// FINANCIAL DATA GENERATOR
// =============================================================================

export function generateTransaction(
  previousBalance: number = 10000,
): Transaction {
  const types: Transaction["type"][] = ["Credit", "Debit"];
  const type = faker.helpers.arrayElement(types);
  const amount = faker.number.float({ min: 10, max: 5000, fractionDigits: 2 });
  const balance =
    type === "Credit" ? previousBalance + amount : previousBalance - amount;

  return {
    id: faker.string.uuid(),
    date: faker.date.recent({ days: 90 }),
    description: faker.finance.transactionDescription(),
    amount,
    type,
    category: faker.finance.transactionType(),
    balance,
    reference: `REF-${faker.string.alphanumeric({ length: 10, casing: "upper" })}`,
  };
}

export function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  let balance = 10000;

  for (let i = 0; i < count; i++) {
    const transaction = generateTransaction(balance);
    transactions.push(transaction);
    balance = transaction.balance;
  }

  // Sort by date descending (most recent first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// =============================================================================
// TASK DATA GENERATOR
// =============================================================================

export function generateTask(): Task {
  const priorities: Task["priority"][] = ["Low", "Medium", "High", "Critical"];
  const statuses: Task["status"][] = ["Todo", "In Progress", "Review", "Done"];
  const estimatedHours = faker.number.int({ min: 1, max: 40 });
  const status = faker.helpers.arrayElement(statuses);

  return {
    id: faker.string.uuid(),
    title: faker.hacker.phrase(),
    assignee: faker.person.fullName(),
    priority: faker.helpers.arrayElement(priorities),
    status,
    dueDate: faker.date.soon({ days: 30 }),
    tags: faker.helpers.arrayElements(
      [
        "Frontend",
        "Backend",
        "Design",
        "Bug",
        "Feature",
        "Documentation",
        "Testing",
      ],
      { min: 1, max: 3 },
    ),
    estimatedHours,
    completedHours:
      status === "Done"
        ? estimatedHours
        : status === "In Progress"
          ? faker.number.int({ min: 1, max: estimatedHours })
          : undefined,
  };
}

export function generateTasks(count: number): Task[] {
  return Array.from({ length: count }, generateTask);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Seed faker for consistent data across refreshes (useful for testing)
 */
export function seedFaker(seed: number) {
  faker.seed(seed);
}

/**
 * Generate mixed data for testing (users, orders, products, etc.)
 */
export function generateMixedData() {
  return {
    users: generateUsers(50),
    orders: generateOrders(100),
    products: generateProducts(75),
    transactions: generateTransactions(200),
    tasks: generateTasks(60),
  };
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Target,
  Kanban,
  FileText,
  ShoppingCart,
  Package,
  Warehouse,
  UserCircle,
  Building,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "CRM",
    items: [
      { title: "Contacts", href: "/crm/contacts", icon: Users },
      { title: "Leads", href: "/crm/leads", icon: Target },
      { title: "Pipeline", href: "/crm/pipeline", icon: Kanban },
    ],
  },
  {
    label: "Sales",
    items: [
      { title: "Orders", href: "/sales/orders", icon: ShoppingCart },
      { title: "Invoices", href: "/sales/invoices", icon: FileText },
    ],
  },
  {
    label: "Inventory",
    items: [
      { title: "Products", href: "/inventory/products", icon: Package },
      { title: "Warehouses", href: "/inventory/warehouses", icon: Warehouse },
    ],
  },
  {
    label: "HR",
    items: [
      { title: "Employees", href: "/hr/employees", icon: UserCircle },
      { title: "Departments", href: "/hr/departments", icon: Building },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Enterprises", href: "/settings/enterprises", icon: Building },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          O
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-foreground">OperationCRM</h1>
          <p className="text-[10px] text-muted-foreground">Enterprise Suite</p>
        </div>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {group.label}
                {collapsed[group.label] ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {!collapsed[group.label] && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

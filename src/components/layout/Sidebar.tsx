/**
 * src/components/layout/Sidebar.tsx
 *
 * Persistent vertical navigation menu for desktop views.
 * Utilizes a configuration array for scalable route management.
 */
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase } from "lucide-react";

/**
 * Single source of truth for dashboard navigation routes.
 */
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
];

export const Sidebar: React.FC<{ className?: string }> = ({
  className = "hidden md:flex",
}) => {
  return (
    <aside
      className={`${className} flex-col w-64 border-r border-border bg-background h-full`}
    >
      {/* Brand / Logo Area */}
      <div className="flex items-center h-16 px-6 border-b border-border/50">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Electric <span className="text-primary">Pulse</span>
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            // The 'end' prop ensures the base '/dashboard' route doesn't stay active when on sub-routes like '/dashboard/clients'
            end={item.href === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => {
              // Extract the Icon component to render it dynamically
              const Icon = item.icon;
              return (
                <>
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>

      {/* Optional: Bottom utility area (e.g., Settings, Logout) could go here */}
    </aside>
  );
};

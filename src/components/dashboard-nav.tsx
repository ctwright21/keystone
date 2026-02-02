"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Trophy,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminNavItem = { href: "/admin", label: "Admin", icon: Shield };

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "SUPER_ADMIN";
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-bg-deep border-r border-border-subtle fixed top-0 left-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-power rounded-md flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-text-inverse" />
            </div>
            <span className="text-xl font-bold text-text-primary">Keystone</span>
          </Link>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200",
                      isActive
                        ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/30 glow-primary"
                        : "text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-9 h-9 bg-bg-surface rounded-md flex items-center justify-center border border-border-default">
              <span className="text-sm font-semibold text-text-primary">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-text-tertiary truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 mt-2 w-full rounded-md transition-all"
            style={{ color: '#A0A0B0', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F0F0F5';
              e.currentTarget.style.backgroundColor = '#2A2A38';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A0A0B0';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg-deep border-b border-border-subtle">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-power rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-text-inverse" />
            </div>
            <span className="text-lg font-bold text-text-primary">Keystone</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="px-4 pb-4 bg-bg-deep border-b border-border-subtle">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md transition-all",
                        isActive
                          ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/30"
                          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-md transition-all"
                  style={{ color: '#A0A0B0', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F0F0F5';
                    e.currentTarget.style.backgroundColor = '#2A2A38';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#A0A0B0';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}

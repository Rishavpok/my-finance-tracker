"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import AuthGuard from "@/components/AuthGuard";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💸" },
  { href: "/add", label: "Add Transaction", icon: "➕" },
  { href: "/categories", label: "Categories", icon: "🏷️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthGuard>
          <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>

        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💰</span>
          <span className={styles.logoText}>FinTrack</span>
        </div>

        {/* Nav links */}
        <nav className={styles.nav}>
          <p className={styles.navLabel}>Main Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className={styles.sidebarFooter}>
          <div className={styles.user}>
            <div className={styles.userAvatar}>J</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Doe</p>
              <p className={styles.userEmail}>john@email.com</p>
            </div>
          </div>
          <button className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* ── Main area ── */}
      <div className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>
              {navItems.find((item) => item.pathname === pathname)?.label ?? "Dashboard"}
            </h1>
            <p className={styles.pageDate}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userAvatarSm}>J</div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          {children}
        </main>

      </div>
    </div>
    </AuthGuard>
  );
}
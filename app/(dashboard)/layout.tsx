"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./layout.module.css";
import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💸" },
  { href: "/add", label: "Add Transaction", icon: "➕" },
  { href: "/categories", label: "Categories", icon: "🏷️" },
  //  { href: "/insights", label: "AI Insights", icon: "🏷️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);

  function handleLogout() {
    localStorage.clear();
    router.push("/login");
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  return (
    <AuthGuard>
      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          {/* Logo */}
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💰</span>
            <span className={styles.logoText}>MyFinance</span>
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
              <div className={styles.userAvatar}>
                {user && user["name"]?.charAt(0)}
              </div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user && user["name"]}</p>
                <p className={styles.userEmail}>{user && user["email"]}</p>
              </div>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>🚪 Logout</button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className={styles.main}>
          {/* Header */}
          <header className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>
                {navItems.find((item) => item.pathname === pathname)?.label ??
                  "Dashboard"}
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
              <div className={styles.userAvatarSm}>
                {user && user["name"]?.charAt(0)}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

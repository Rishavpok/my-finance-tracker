"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");

    if (!user && !isPublicRoute) {
      // Not logged in → trying to access protected page → send to login
      router.push("/login");
    }

    if (user && isPublicRoute) {
      // Already logged in → trying to access login/register → send to dashboard
      router.push("/");
    }

  }, [pathname]);

  return <>{children}</>;
}
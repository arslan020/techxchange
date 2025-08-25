"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRequireAuth(roles?: Array<"buyer"|"seller"|"admin">) {
  const r = useRouter();
  useEffect(() => {
    const raw = localStorage.getItem("txc_user");
    if (!raw) {
      localStorage.setItem("txc_return_to", location.pathname + location.search);
      r.replace("/login");
      return;
    }
    if (roles?.length) {
      const u = JSON.parse(raw) as { role: "buyer"|"seller"|"admin" };
      if (!roles.includes(u.role)) r.replace("/");
    }
  }, [r, roles]);
}
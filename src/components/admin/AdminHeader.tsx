"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, LifeBuoy } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  userEmail: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-black text-terex-navy">איש הברזל CMS</h1>
        <p className="text-sm text-terex-muted">{userEmail}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-terex-navy hover:bg-terex-sand/40"
        >
          <LifeBuoy className="h-4 w-4" aria-hidden="true" />
          תמיכה
        </Link>
        <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        התנתקות
      </Button>
      </div>
    </div>
  );
}

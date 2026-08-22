"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        התנתקות
      </Button>
    </div>
  );
}

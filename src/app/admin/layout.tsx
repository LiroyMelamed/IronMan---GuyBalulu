import type { Metadata } from "next";
import { PoweredByMelaMedia } from "@/components/layout/PoweredByMelaMedia";

export const metadata: Metadata = {
  title: "Admin Login | איש הברזל CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-terex-gray" dir="rtl">
      <div className="flex-1">{children}</div>
      <footer className="py-6 flex justify-center">
        <PoweredByMelaMedia />
      </footer>
    </div>
  );
}

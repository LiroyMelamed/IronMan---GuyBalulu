import { Providers } from "@/components/providers";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}

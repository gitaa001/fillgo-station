import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FillGo Station — Pengelola",
  description: "Panel pengelola sistem monitoring dispenser air FillGo Station",
};

export default function PengelolaRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
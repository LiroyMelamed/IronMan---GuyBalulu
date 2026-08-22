"use client";

import Link from "next/link";
import { getContentValue, type SiteContentMap } from "@/lib/content";
import { NavbarClient, FooterClient } from "./NavbarClient";

interface NavbarProps {
  content: SiteContentMap;
}

export function Navbar({ content }: NavbarProps) {
  return <NavbarClient content={content} />;
}

interface FooterProps {
  content: SiteContentMap;
}

export function Footer({ content }: FooterProps) {
  return <FooterClient content={content} />;
}

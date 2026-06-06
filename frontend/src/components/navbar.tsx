"use client";

import { useState } from "react";
import { Button, Link } from "@heroui/react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  HeartFilledIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Core navigation targets requested
  const navigationItems = [
    { label: "Chat", href: "/chat" },
    { label: "Chart", href: "/chart" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-separator bg-background/70 backdrop-blur-md">
      <header className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-6">

        {/* Left Section: Application Identity */}
        <div className="flex items-center gap-8">
          <a className="flex items-center gap-2 group" href="/">
            <Logo className="text-foreground" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wider text-foreground">
                ARADHANA
              </span>
              <span className="text-[10px] tracking-widest text-muted uppercase -mt-1">
                Companion
              </span>
            </div>
          </a>

          {/* Main Contextual Nav Options (Desktop) */}
          <ul className="hidden sm:flex gap-6 items-center">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  className={clsx(
                    "text-sm tracking-wide text-foreground hover:text-accent transition-colors font-medium",
                    "data-[active=true]:text-accent data-[active=true]:font-bold"
                  )}
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section: Tooling, Repository Links & Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1 border-l border-separator pl-4">
            <Link
              aria-label="Github"
              className="text-muted hover:text-accent transition-colors p-1"
              href={siteConfig.links.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon className="w-4 h-4" />
            </Link>

            <ThemeSwitch className="text-muted hover:text-accent transition-colors" />
          </div>

          {/* <div className="hidden md:flex"> */}
          {/*   <Button */}
          {/*     className="text-xs font-medium rounded-[var(--radius)]" */}
          {/*     variant="solid" */}
          {/*     onPress={() => window.open(siteConfig.links.sponsor, "_blank")} */}
          {/*   > */}
          {/*     <HeartFilledIcon className="w-3.5 h-3.5 text-danger" /> */}
          {/*     Sponsor */}
          {/*   </Button> */}
          {/* </div> */}
        </div>

        {/* Mobile menu trigger toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeSwitch />
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="p-2 text-foreground rounded-[var(--radius)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drop-panel layout matching options */}
      {isMenuOpen && (
        <div className="border-t border-separator bg-background sm:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="block py-2.5 text-sm font-medium text-foreground hover:text-accent transition-colors no-underline"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

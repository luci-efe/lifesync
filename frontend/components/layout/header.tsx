"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useState } from "react";

export function Header() {
    const [showMobileNav, setShowMobileNav] = useState(false);

    return (
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 dark:bg-gray-800/40 px-6">
            <Link className="lg:hidden" href="/">
                <span className="font-semibold">LifeSync</span>
            </Link>
            <div className="w-full flex-1">
                {/* Add search or page title here if needed */}
            </div>
            <ThemeToggle />
            <UserButton />
            <Button
                className="lg:hidden"
                size="icon"
                variant="ghost"
                onClick={() => setShowMobileNav(true)}
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            {showMobileNav && (
                <MobileNav onClose={() => setShowMobileNav(false)} />
            )}
        </header>
    );
}

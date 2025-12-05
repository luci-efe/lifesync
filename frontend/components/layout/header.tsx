"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
    return (
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex h-16 items-center px-4">
                <MobileNav />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, FileText, Calendar, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Calendar", href: "/calendar", icon: Calendar },
];

interface MobileNavProps {
    onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-900 pt-5 pb-4">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <Button
                        variant="ghost"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                        <span className="sr-only">Close sidebar</span>
                    </Button>
                </div>
                <div className="flex flex-shrink-0 items-center px-4">
                    <span className="text-xl font-semibold">LifeSync</span>
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                                        pathname === item.href || pathname.startsWith(item.href + "/")
                                            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                                            : "text-gray-600 dark:text-gray-400"
                                    )}
                                >
                                    <Icon className="mr-4 h-6 w-6 flex-shrink-0" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}

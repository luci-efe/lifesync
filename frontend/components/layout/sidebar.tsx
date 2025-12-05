"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, StickyNote, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Tasks",
        icon: CheckSquare,
        href: "/tasks",
    },
    {
        label: "Notes",
        icon: StickyNote,
        href: "/notes",
    },
    {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-secondary border-r border-border">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        LifeSync
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-2 w-full justify-start font-medium cursor-pointer rounded-md transition-colors",
                                pathname === route.href
                                    ? "bg-primary/5 text-primary font-semibold"
                                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-4 w-4 mr-3", pathname === route.href ? "text-primary" : "text-muted-foreground")} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, StickyNote, Calendar, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Tasks",
        icon: CheckSquare,
        href: "/tasks",
        color: "text-violet-500",
    },
    {
        label: "Notes",
        icon: StickyNote,
        href: "/notes",
        color: "text-pink-700",
    },
    {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
        color: "text-orange-700",
    },
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <div className="space-y-4 py-4 flex flex-col h-full bg-background">
                    <div className="px-3 py-2 flex-1">
                        <Link href="/dashboard" className="flex items-center pl-3 mb-14" onClick={() => setOpen(false)}>
                            <h1 className="text-2xl font-bold tracking-tighter">
                                LifeSync
                            </h1>
                        </Link>
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition-all",
                                        pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex items-center flex-1">
                                        <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                        {route.label}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

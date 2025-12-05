"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface CalendarNavProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

export function CalendarNav({
    currentDate,
    onPrevMonth,
    onNextMonth,
    onToday,
}: CalendarNavProps) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
                {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onToday}>
                    Today
                </Button>
                <div className="flex items-center rounded-md border bg-background">
                    <Button variant="ghost" size="icon" onClick={onPrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-4 w-[1px] bg-border" />
                    <Button variant="ghost" size="icon" onClick={onNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

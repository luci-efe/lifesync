"use client";

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addMonths,
    subMonths,
} from "date-fns";
import { useState } from "react";
import { Task } from "@/lib/types";
import { CalendarNav } from "./calendar-nav";
import { CalendarDay } from "./calendar-day";

interface CalendarGridProps {
    tasks: Task[];
}

export function CalendarGrid({ tasks }: CalendarGridProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());

    return (
        <div className="flex flex-col gap-4">
            <CalendarNav
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
            />
            <div className="rounded-lg border bg-card shadow-sm">
                <div className="grid grid-cols-7 border-b">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="py-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day) => (
                        <CalendarDay
                            key={day.toISOString()}
                            date={day}
                            tasks={tasks}
                            isCurrentMonth={isSameMonth(day, monthStart)}
                            onClick={() => { }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

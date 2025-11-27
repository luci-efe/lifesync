import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder for stats */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Tasks</h3>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Notes</h3>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                </div>
            </div>
            {/* Placeholder for recent activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Tasks</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <p className="text-sm text-muted-foreground">No tasks yet.</p>
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Notes</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <p className="text-sm text-muted-foreground">No notes yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

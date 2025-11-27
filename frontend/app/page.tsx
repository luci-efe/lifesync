import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, CheckSquare, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6 lg:px-8">
        <div className="flex items-center gap-2 font-bold text-xl">
          LifeSync
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {userId ? (
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Synchronize your life with <span className="text-primary-600 dark:text-primary-400">LifeSync</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage tasks, notes, and your calendar in one beautiful, seamless application.
                </p>
              </div>
              <div className="space-x-4">
                {userId ? (
                  <Link href="/dashboard">
                    <Button size="lg">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button size="lg">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gray-50 dark:bg-gray-900 py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
                  <CheckSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Organize your tasks with priorities, due dates, and status tracking.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
                  <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold">Notes</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Capture your thoughts with a powerful markdown editor.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
                  <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold">Calendar</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Visualize your schedule and upcoming deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left dark:text-gray-400">
            Built for LifeSync.
          </p>
        </div>
      </footer>
    </div>
  );
}

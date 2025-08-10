import { ThemeToggle } from '@/components/theme-toggle';
import { CatLauncher } from '@/components/cat-launcher';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative w-full max-w-3xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60 blur-2xl dark:opacity-60" />
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-white/30 bg-white/70 p-10 text-center shadow-glow backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:shadow-elevated dark:shadow-neonViolet">
        <div className="flex w-full items-center justify-between">
          <div className="text-left">
            <h1 className="bg-gradient-to-r from-neon-pink via-neon-violet to-neon-blue bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-neon">
              Stunning Ideas
            </h1>
            <p className="mt-2 text-sm text-black/70 dark:text-white/80">
              Smooth and stunning ideas for your next project.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <p className="text-balance text-lg text-black/70 dark:text-white/90">
          Bring your concept and we will shape it into three elegant sections: hero, about, and
          contact. Start crafting now.
        </p>

        <div className="grid w-full gap-4 md:grid-cols-2">
          <Link
            className="group rounded-xl border border-white/40 bg-white/80 p-6 text-left transition hover:shadow-glow hover:backdrop-blur-lg dark:border-white/10 dark:bg-black/30"
            href="/create"
          >
            <h2 className="mb-2 text-xl font-semibold">Create an Idea →</h2>
            <p className="text-sm text-black/60 group-hover:text-black/80 dark:text-white/60 dark:group-hover:text-white/80">
              Post a new idea to the backend.
            </p>
          </Link>
          <Link
            className="group rounded-xl border border-white/40 bg-white/80 p-6 text-left transition hover:shadow-glow hover:backdrop-blur-lg dark:border-white/10 dark:bg-black/30"
            href={{ pathname: "/ideas" }}
          >
            <h2 className="mb-2 text-xl font-semibold">Browse Ideas →</h2>
            <p className="text-sm text-black/60 group-hover:text-black/80 dark:text-white/60 dark:group-hover:text-white/80">
              List and explore created ideas.
            </p>
          </Link>
        </div>
      </div>
      <CatLauncher />
    </main>
  );
}

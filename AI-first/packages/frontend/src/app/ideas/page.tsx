"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Idea } from "@shared/types";
import { fetcher } from "@/utils/fetcher";
import { API_BASE_URL } from "@/utils/env";

type FetchState = "loading" | "success" | "error";

export default function IdeasListPage() {
  const [state, setState] = useState<FetchState>("loading");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setState("loading");
    setError(null);
    try {
      const data = await fetcher<Idea[]>(`${API_BASE_URL}/api/ideas`);
      setIdeas(data);
      setState("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      setError(message);
      setState("error");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="relative w-full max-w-3xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60 blur-2xl dark:opacity-60" />
      <div className="flex flex-col gap-6 rounded-2xl border border-white/30 bg-white/70 p-10 shadow-glow backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:shadow-elevated dark:shadow-neonViolet">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ideas</h1>
          <Link className="text-sm underline hover:opacity-80" href="/create">
            Create new
          </Link>
        </div>

        {state === "loading" && <ListSkeleton />}

        {state === "error" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
              {error ?? "Something went wrong"}
            </div>
            <div>
              <button
                onClick={() => void load()}
                className="rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black dark:border-white/10 dark:bg-white/10"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {state === "success" && (
          <ul className="grid gap-4">
            {ideas.map((idea) => (
              <li key={idea._id}
                  className="rounded-xl border border-white/40 bg-white/80 p-6 transition hover:shadow-glow dark:border-white/10 dark:bg-black/30">
                <Link href={`/preview/${idea._id}`} className="block">
                  <h3 className="text-lg font-semibold line-clamp-2">{idea.idea}</h3>
                  <p className="mt-1 text-sm text-black/60 dark:text-white/70">
                    {new Date(idea.createdAt ?? Date.now()).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function ListSkeleton() {
  return (
    <ul className="grid gap-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <li key={idx} className="animate-pulse rounded-xl border border-white/40 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-2 h-5 w-3/4 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10" />
        </li>
      ))}
    </ul>
  );
}



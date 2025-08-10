"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Section, Idea } from "@shared/types";
import { fetcher } from "@/utils/fetcher";
import { API_BASE_URL } from "@/utils/env";
import { useToast } from "@/components/toast";

type FetchState = "idle" | "loading" | "success" | "error";

export default function PreviewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [state, setState] = useState<FetchState>("loading");
  const [idea, setIdea] = useState<Idea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  function buildDefaultSections(text: string): Section[] {
    const hero: Section = {
      key: "hero",
      title: `Your ${text}`,
      body: "one-line tagline",
      order: 0,
    };
    const about: Section = {
      key: "about",
      title: "About",
      body: `A short paragraph about ${text}.`,
      order: 1,
    };
    const contact: Section = {
      key: "contact",
      title: "Contact",
      body: "call-to-action line",
      order: 2,
    };
    return [hero, about, contact];
  }

  const sortedSections: Section[] = useMemo(() => {
    const sections = idea?.sections?.length
      ? idea.sections
      : idea?.idea
        ? buildDefaultSections(idea.idea)
        : [];
    return sections.slice().sort((a, b) => a.order - b.order);
  }, [idea]);

  async function load() {
    if (!id) return;
    setState("loading");
    setError(null);
    try {
      const data = await fetcher<Idea>(`${API_BASE_URL}/api/ideas/${id}`);
      setIdea(data);
      setState("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      setError(message);
      setState("error");
      showToast(message);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className="relative w-full max-w-3xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60 blur-2xl dark:opacity-60" />
      <div className="flex flex-col gap-6 rounded-2xl border border-white/30 bg-white/70 p-10 shadow-glow backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:shadow-elevated dark:shadow-neonViolet">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Preview</h1>
          <Link className="text-sm underline hover:opacity-80" href="/create">
            Back to form
          </Link>
        </div>

        {state === "loading" && <LoadingSkeleton />}

        {state === "error" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
              {error ?? "Something went wrong"}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => void load()}
                className="rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black dark:border-white/10 dark:bg-white/10"
              >
                Retry
              </button>
              <Link
                href="/create"
                className="rounded-md border border-white/40 bg-white/80 px-4 py-2 text-black transition hover:shadow-glow dark:border-white/10 dark:bg-black/30 dark:text-white"
              >
                Back to form
              </Link>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col gap-6">
            {sortedSections.map((section) => (
              <SectionCard key={section.key} section={section} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="animate-pulse rounded-xl border border-white/40 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
        <div className="mb-2 h-8 w-2/3 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      </div>
      <div className="animate-pulse rounded-xl border border-white/40 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
        <div className="mb-2 h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
        <div className="mb-2 h-4 w-5/6 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      </div>
      <div className="animate-pulse rounded-xl border border-white/40 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
        <div className="h-10 w-32 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  if (section.key === "hero") {
    return (
      <div className="rounded-xl border border-white/40 bg-white/80 p-8 text-center dark:border-white/10 dark:bg-black/30">
        <h2 className="text-3xl font-extrabold">{section.title}</h2>
        <p className="mt-2 text-black/70 dark:text-white/80">{section.body}</p>
      </div>
    );
  }
  if (section.key === "about") {
    return (
      <div className="rounded-xl border border-white/40 bg-white/80 p-6 dark:border-white/10 dark:bg-black/30">
        <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
        <p className="text-black/80 dark:text-white/80">{section.body}</p>
      </div>
    );
  }
  if (section.key === "contact") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/80 p-6 dark:border-white/10 dark:bg-black/30">
        <div>
          <h3 className="text-xl font-semibold">{section.title}</h3>
          <p className="text-black/70 dark:text-white/80">{section.body}</p>
        </div>
        <button className="rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black dark:border-white/10 dark:bg-white/10">
          Contact
        </button>
      </div>
    );
  }
  return null;
}

type PageProps = { params: { id: string } };

// NOTE: this file exports a single default component above; this type is unused but kept for clarity
// of the params shape in the route segment.



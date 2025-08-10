"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      title: "Launch your idea",
      body: "A clean, responsive landing page preview to showcase what you're building.",
      order: 0,
    };
    const about: Section = {
      key: "about",
      title: "About this idea",
      body: text,
      order: 1,
    };
    const contact: Section = {
      key: "contact",
      title: "Get in touch",
      body: "Ready to ship? Let's talk.",
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
    <main className="fixed inset-0 overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60 blur-2xl dark:opacity-60" />
      {/* Back to form moved into navbar to avoid overlap */}

      {state === "loading" && (
        <div className="grid min-h-dvh place-items-center px-6 py-10">
          <LoadingSkeleton />
        </div>
      )}

      {state === "error" && (
        <div className="grid min-h-dvh place-items-center px-6 py-10">
          <div className="flex max-w-lg flex-col gap-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <div className="text-sm text-red-700 dark:text-red-300">
              {error ?? "Something went wrong"}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => void load()}
                className="rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/10 dark:bg-white/10 dark:focus-visible:outline-white"
              >
                Retry
              </button>
              <Link
                href="/create"
                className="rounded-md border border-white/40 bg-white/80 px-4 py-2 text-black transition hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus-visible:outline-white"
              >
                Back to form
              </Link>
            </div>
          </div>
        </div>
      )}

      {state === "success" && (
        <div className="flex min-h-dvh flex-col">
          <SiteNavbar />
          <div className="mx-auto max-w-6xl flex-1 px-6 py-10">
            {sortedSections.map((section) => (
              <div key={section.key} className="mb-6 last:mb-0">
                <SectionCard section={section} />
                {section.key === "about" && <FeaturesGrid />}
              </div>
            ))}
          </div>
          <SiteFooter />
        </div>
      )}
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
      <section
        id="hero"
        className="relative isolate scroll-mt-20 overflow-hidden rounded-2xl bg-gradient-to-b from-white to-white/60 text-center shadow-glow dark:from-black/40 dark:to-black/10"
      >
        <div aria-hidden className="hero-ambient" />
        <div className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-6xl flex-col items-center justify-center gap-5 px-6 py-16 sm:min-h-[calc(100dvh-64px)]">
          <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            Preview
          </span>
          <h2 className="bg-gradient-to-r from-black via-black/80 to-black/60 bg-clip-text text-balance text-5xl font-extrabold text-transparent dark:from-white dark:via-white/80 dark:to-white/60 sm:text-7xl">
            {section.title}
          </h2>
          <p className="max-w-2xl text-balance text-lg text-black/70 dark:text-white/70">
            {section.body}
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="rounded-md border border-white/40 bg-black px-5 py-2.5 text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/10 dark:bg-white/10"
            >
              Get Started
            </a>
            <a
              href="#about"
              className="rounded-md border border-black/10 bg-white/90 px-5 py-2.5 text-black transition hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus-visible:outline-white"
            >
              Learn more
            </a>
            <a
              href="#contact"
              className="rounded-md border border-black/10 bg-white/50 px-5 py-2.5 text-black/80 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/10 dark:bg-white/5 dark:text-white/80"
            >
              Live demo
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-black/60 dark:text-white/60">
            <span className="rounded-full border border-black/10 bg-white/70 px-2 py-1 dark:border-white/10 dark:bg-white/5">Fast</span>
            <span className="rounded-full border border-black/10 bg-white/70 px-2 py-1 dark:border-white/10 dark:bg-white/5">Responsive</span>
            <span className="rounded-full border border-black/10 bg-white/70 px-2 py-1 dark:border-white/10 dark:bg-white/5">Accessible</span>
          </div>
        </div>
      </section>
    );
  }
  if (section.key === "about") {
    return (
      <section
        id="about"
        className="scroll-mt-20 rounded-2xl border border-white/40 bg-white/80 p-6 dark:border-white/10 dark:bg-black/30"
      >
        <div className="grid items-center gap-6 sm:grid-cols-2">
          <div className="order-2 sm:order-1">
            <h3 className="mb-3 text-2xl font-semibold">{section.title}</h3>
            <p className="text-black/80 dark:text-white/80">{section.body}</p>
          </div>
          <div className="order-1 flex justify-center sm:order-2">
            <div className="relative h-40 w-40 sm:h-56 sm:w-56">
              <Image
                src="/window.svg"
                alt="Preview illustration"
                fill
                className="drop-shadow-xl opacity-90 dark:opacity-80"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (section.key === "contact") {
    return (
      <section
        id="contact"
        className="scroll-mt-20 rounded-2xl border border-white/40 bg-white/80 p-6 dark:border-white/10 dark:bg-black/30"
      >
        <div className="mb-4">
          <h3 className="text-2xl font-semibold">{section.title}</h3>
          <p className="text-black/70 dark:text-white/80">{section.body}</p>
        </div>
        <form className="grid gap-3 sm:grid-cols-2">
          <input
            disabled
            placeholder="Name"
            className="rounded-md border border-white/40 bg-white/70 p-3 text-black/90 outline-none ring-0 placeholder:text-black/40 dark:border-white/10 dark:bg-black/20 dark:text-white/90"
          />
          <input
            disabled
            placeholder="Email"
            className="rounded-md border border-white/40 bg-white/70 p-3 text-black/90 outline-none ring-0 placeholder:text-black/40 dark:border-white/10 dark:bg-black/20 dark:text-white/90"
          />
          <textarea
            disabled
            placeholder="Message"
            className="min-h-28 rounded-md border border-white/40 bg-white/70 p-3 text-black/90 outline-none ring-0 placeholder:text-black/40 dark:border-white/10 dark:bg-black/20 dark:text-white/90 sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <button
              disabled
              className="w-full rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10"
            >
              Contact Us
            </button>
          </div>
        </form>
      </section>
    );
  }
  return null;
}

function FeaturesGrid() {
  return (
    <section
      id="features"
      className="scroll-mt-20 rounded-2xl border border-white/40 bg-white/80 p-6 dark:border-white/10 dark:bg-black/30"
    >
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-semibold">Why you'll love it</h3>
        <p className="mt-1 text-black/70 dark:text-white/70">Built for speed, clarity, and conversion.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/40 bg-white/70 p-5 dark:border-white/10 dark:bg-black/20">
          <h4 className="text-lg font-semibold">Instant setup</h4>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Start fast with sensible defaults and clean UI.</p>
        </div>
        <div className="rounded-xl border border-white/40 bg-white/70 p-5 dark:border-white/10 dark:bg-black/20">
          <h4 className="text-lg font-semibold">Responsive by design</h4>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Looks great on phones, tablets, and desktops.</p>
        </div>
        <div className="rounded-xl border border-white/40 bg-white/70 p-5 dark:border-white/10 dark:bg-black/20">
          <h4 className="text-lg font-semibold">Accessible</h4>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Focusable controls and readable contrast out‑of‑the‑box.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <blockquote className="rounded-xl border border-white/40 bg-white/70 p-5 text-sm italic text-black/80 dark:border-white/10 dark:bg-black/20 dark:text-white/80">
          “This preview saved us days of work and looked amazing.” — Ahmed, Founder
        </blockquote>
        <blockquote className="rounded-xl border border-white/40 bg-white/70 p-5 text-sm italic text-black/80 dark:border-white/10 dark:bg-black/20 dark:text-white/80">
          “Clean, fast, and easy to use. Exactly what we needed.” — Ali, PM
        </blockquote>
      </div>
    </section>
  );
}

function SiteNavbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/40 bg-white/80 px-5 py-3 backdrop-blur-md dark:border-white/10 dark:bg-black/30">
      <div className="flex items-center gap-2">
        <div className="relative h-6 w-6">
          <Image src="/globe.svg" alt="Logo" fill className="opacity-90 dark:opacity-80" />
        </div>
        <span className="text-sm font-semibold tracking-wide">Stunnin.So</span>
      </div>
      <nav className="hidden items-center gap-5 text-sm text-black/70 dark:text-white/70 sm:flex">
        <a href="#about" className="hover:opacity-80">About</a>
        <a href="#contact" className="hover:opacity-80">Contact</a>
      </nav>
      <div className="flex items-center gap-2">
        <Link
          href="/create"
          className="rounded-md border border-black/10 bg-white/90 px-3 py-1.5 text-sm text-black transition hover:shadow-glow dark:border-white/10 dark:bg-black/30 dark:text-white"
        >
          Back to form
        </Link>
        <Link
          href="#"
          className="hidden rounded-md border border-black/10 bg-white/90 px-3 py-1.5 text-sm text-black transition hover:shadow-glow dark:border-white/10 dark:bg-black/30 dark:text-white sm:inline-block"
        >
          Sign in
        </Link>
        <a
          href="#contact"
          className="rounded-md border border-white/40 bg-black/90 px-3 py-1.5 text-sm text-white transition hover:bg-black dark:border-white/10 dark:bg-white/10"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-white/40 bg-white/70 px-5 py-6 text-sm text-black/60 dark:border-white/10 dark:bg-black/30 dark:text-white/60">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <span>© {new Date().getFullYear()} A</span>
        <div className="flex items-center gap-4">
          <a href="#about" className="hover:opacity-80">About</a>
          <a href="#contact" className="hover:opacity-80">Contact</a>
          <a href="#" className="hover:opacity-80">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

type PageProps = { params: { id: string } };

// NOTE: this file exports a single default component above; this type is unused but kept for clarity
// of the params shape in the route segment.



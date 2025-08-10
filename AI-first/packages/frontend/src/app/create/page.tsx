"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "../../utils/env";

type FormValues = {
  idea: string;
};

export default function CreateIdeaPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { idea: "" },
    mode: "onTouched",
  });

  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
      }
      const data = (await res.json()) as { _id: string };
      reset();
      router.push(`/preview/${data._id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setServerError(message);
    }
  }

  return (
    <main className="relative w-full max-w-3xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60 blur-2xl dark:opacity-60" />
      <div className="flex flex-col gap-6 rounded-2xl border border-white/30 bg-white/70 p-10 shadow-glow backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:shadow-elevated dark:shadow-neonViolet">
        <h1 className="text-2xl font-bold">Create an Idea</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="text-sm font-medium" htmlFor="idea">
            Your idea (70–300 characters)
          </label>
          <textarea
            id="idea"
            className="min-h-40 rounded-md border border-white/40 bg-white/80 p-3 text-black/90 outline-none ring-0 placeholder:text-black/40 focus:border-neon-violet focus:shadow-glow dark:border-white/10 dark:bg-black/30 dark:text-white/90"
            {...register("idea", {
              required: "Idea is required",
              minLength: { value: 70, message: "Must be at least 70 characters" },
              maxLength: { value: 300, message: "Must be at most 300 characters" },
            })}
            placeholder="Describe your stunning idea…"
            disabled={isSubmitting}
          />
          {errors.idea && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.idea.message}</p>
          )}

          {serverError && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
              {serverError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10"
            >
              {isSubmitting && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
              )}
              <span>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}



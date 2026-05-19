import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Global nav — pure black, 44px, white nav links */}
      <header className="h-11 bg-surface-black text-body-on-dark flex items-center px-5">
        <div className="text-nav-link font-medium">AxDD Skill Builder</div>
        <nav className="ml-8 flex items-center gap-5 text-nav-link text-body-on-dark/85">
          <span>UX/UI</span>
          <span className="opacity-50">Product</span>
          <span className="opacity-50">Frontend</span>
          <span className="opacity-50">Design System</span>
        </nav>
        <div className="ml-auto text-nav-link text-body-on-dark/70">
          Static MVP
        </div>
      </header>

      {/* Hero tile — light canvas, edge-to-edge */}
      <section className="flex-1 bg-canvas flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center">
          <div className="text-caption uppercase tracking-[0.18em] text-ink-muted-48 mb-5">
            AxDD Skill Builder
          </div>
          <h1
            className="font-semibold text-ink"
            style={{
              fontSize: "56px",
              lineHeight: 1.07,
              letterSpacing: "-0.28px",
            }}
          >
            Build AI Agent Skills without writing SKILL.md from scratch.
          </h1>
          <p
            className="mt-6 text-ink-muted-80 mx-auto max-w-2xl"
            style={{
              fontSize: "21px",
              lineHeight: 1.42,
              letterSpacing: "0.011em",
              fontWeight: 400,
            }}
          >
            Compose, preview, edit, and download structured AI Agent Skill
            packages. The first MVP supports the UX/UI Designer category and
            generates a complete package from a deterministic template engine.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[22px] py-[11px] text-[17px] font-normal hover:opacity-95 transition"
            >
              Open Builder
            </Link>
            <span
              className="inline-flex items-center justify-center rounded-pill border border-primary text-primary px-[22px] py-[11px] text-[17px] font-normal opacity-70 cursor-not-allowed select-none"
              title="Phase 2"
            >
              Learn more
            </span>
          </div>
        </div>
      </section>

      {/* Parchment tile — three-bullet description */}
      <section className="bg-canvas-parchment border-t border-divider-soft">
        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCell
            title="Deterministic generation"
            body="No AI calls. Templates compose SKILL.md, README, references, templates, and examples directly from your settings."
          />
          <FeatureCell
            title="Preview before download"
            body="A file tree, markdown render, and raw editor live in the same workspace. Edit any file before you export."
          />
          <FeatureCell
            title="Quality score"
            body="Eleven structural checks plus contextual warnings and suggestions, recomputed on every edit."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-canvas-parchment border-t border-divider-soft">
        <div className="max-w-5xl mx-auto px-6 py-8 text-fine-print text-ink-muted-48 flex items-center justify-between">
          <span>AxDD Skill Builder · Static MVP</span>
          <span>UX/UI Designer category</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCell({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-tagline text-ink">{title}</div>
      <p className="mt-2 text-ink-muted-80" style={{ fontSize: 17, lineHeight: 1.47 }}>
        {body}
      </p>
    </div>
  );
}

import React from "react";
import DefaultLayout from "@/layouts/default";
import { Button, Card, Link } from "@heroui/react";

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={props.className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
  </svg>
);

export default function LandingPage() {
  return (
    <DefaultLayout>
      <div className="w-full min-h-[calc(100vh-5rem)] max-w-5xl mx-auto flex flex-col justify-center items-center px-4 sm:px-6 py-12 gap-16 overflow-hidden">

        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary/50 border border-separator/40 text-[11px] font-medium tracking-wider uppercase text-accent">
            <SparklesIcon className="w-3.5 h-3.5" />
            Aradhana Internship 2026 Task
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Agentic Companion for <br />
            <span className="text-accent font-extrabold">Spiritual Guidance</span>
          </h1>

          <p className="text-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Compute real ephemeris birth geometry, analyze daily cosmic transits, and explore tailored shastra reference logs via a stateful reasoning graph interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-2">
            <Button
              as={Link}
              href="/chat"
              className="w-full sm:w-auto px-8 font-semibold text-xs tracking-wider uppercase h-11 bg-accent text-accent-foreground rounded-[var(--field-radius)]"
            >
              Open AstroAgent Chat
            </Button>
            <Button
              as={Link}
              href="https://github.com"
              isExternal
              variant="bordered"
              className="w-full sm:w-auto px-8 font-medium text-xs tracking-wider uppercase h-11 border-separator/60 text-foreground bg-surface-secondary/10 hover:bg-surface-secondary/40 rounded-[var(--field-radius)]"
            >
              View Repository Specs
            </Button>
          </div>
        </section>

        {/* Feature Grid Core Capabilities */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card className="p-5 bg-surface-secondary/20 border border-separator/40 rounded-[var(--field-radius)] shadow-none flex flex-col gap-2">
            <div className="text-[11px] font-bold tracking-widest text-accent uppercase font-mono">01 / Logic</div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">LangGraph Topology</h3>
            <p className="text-muted text-xs leading-relaxed">
              Exposes a robust stateful supervisor graph engineered to manage conditional routing and complex intent classification seamlessly.
            </p>
          </Card>

          <Card className="p-5 bg-surface-secondary/20 border border-separator/40 rounded-[var(--field-radius)] shadow-none flex flex-col gap-2">
            <div className="text-[11px] font-bold tracking-widest text-accent uppercase font-mono">02 / Physics</div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Verified Ephemeris Math</h3>
            <p className="text-muted text-xs leading-relaxed">
              No mathematical hallucinations. Grounded coordinates queried securely across real-time geocoding and physical transit parameters.
            </p>
          </Card>

          <Card className="p-5 bg-surface-secondary/20 border border-separator/40 rounded-[var(--field-radius)] shadow-none flex flex-col gap-2">
            <div className="text-[11px] font-bold tracking-widest text-accent uppercase font-mono">03 / Safety</div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Deterministic Assertions</h3>
            <p className="text-muted text-xs leading-relaxed">
              Built-in strict guardrail layers gracefully deflect injection threats or requests targeting financial and medical execution.
            </p>
          </Card>
        </section>

        {/* Subtle Footer */}
        <footer className="w-full border-t border-separator/30 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-muted tracking-wide font-mono gap-2 mt-auto">
          <span>Engine Status: Build Validated</span>
          <span>Aradhana System Platform • 2026</span>
        </footer>

      </div>
    </DefaultLayout>
  );
}

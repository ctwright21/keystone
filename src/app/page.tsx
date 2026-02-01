import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Zap, Target, Trophy, TrendingUp, ArrowRight, Flame, Star } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg-deepest">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-power rounded-md flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-text-inverse" />
            </div>
            <span className="text-2xl font-bold text-text-primary">Keystone</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:-translate-y-0.5"
              style={{
                backgroundColor: '#00F0FF',
                color: '#0A0A0F',
              }}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-deep border border-border-subtle rounded-md mb-6">
            <Flame className="w-4 h-4 text-accent-tertiary animate-fire-pulse" />
            <span className="text-text-secondary text-sm font-medium uppercase tracking-wide">Level Up Your Life</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Forge Your{" "}
            <span className="text-gradient-power">
              Daily Habits
            </span>
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            Track your habits, earn XP, unlock achievements, and watch yourself
            grow. Keystone makes building good habits feel like a game.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-base font-semibold uppercase tracking-wide transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:-translate-y-0.5"
              style={{
                backgroundColor: '#00F0FF',
                color: '#0A0A0F',
              }}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="flex items-center justify-center gap-8 mt-12">
          <div className="text-center">
            <div className="font-mono text-3xl font-bold text-accent-primary tabular-nums">7</div>
            <div className="text-xs text-text-tertiary uppercase tracking-wide mt-1">Days/Week</div>
          </div>
          <div className="w-px h-10 bg-border-subtle" />
          <div className="text-center">
            <div className="font-mono text-3xl font-bold text-accent-secondary tabular-nums">∞</div>
            <div className="text-xs text-text-tertiary uppercase tracking-wide mt-1">Habits</div>
          </div>
          <div className="w-px h-10 bg-border-subtle" />
          <div className="text-center">
            <div className="font-mono text-3xl font-bold text-tier-gold tabular-nums">100+</div>
            <div className="text-xs text-text-tertiary uppercase tracking-wide mt-1">Achievements</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          <div className="card group hover:glow-primary">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 transition-colors">
              <Target className="w-6 h-6 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Weekly Snapshots
            </h3>
            <p className="text-text-secondary text-sm">
              Track your habits week by week with a visual grid that shows your progress at a glance.
            </p>
          </div>

          <div className="card group hover:glow-primary">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 transition-colors">
              <Zap className="w-6 h-6 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              XP & Leveling
            </h3>
            <p className="text-text-secondary text-sm">
              Earn experience points for every habit you complete and level up your profile.
            </p>
          </div>

          <div className="card group hover:glow-achievement">
            <div className="w-12 h-12 bg-tier-gold/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-tier-gold/20 transition-colors">
              <Trophy className="w-6 h-6 text-tier-gold" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Achievements
            </h3>
            <p className="text-text-secondary text-sm">
              Unlock achievements as you reach milestones and build impressive streaks.
            </p>
          </div>

          <div className="card group hover:glow-success">
            <div className="w-12 h-12 bg-success/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Progress History
            </h3>
            <p className="text-text-secondary text-sm">
              Review your past weeks and see how far you&apos;ve come on your journey.
            </p>
          </div>
        </div>

        {/* Tier Badges Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Climb the Ranks</h2>
          <p className="text-text-secondary mb-8">Level up and unlock prestigious tier badges</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="badge-tier badge-bronze">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="badge-tier badge-silver">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="badge-tier badge-gold">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="badge-tier badge-platinum">
              <Star className="w-6 h-6 text-gray-800" />
            </div>
            <div className="badge-tier badge-diamond">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-power rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-text-inverse" />
            </div>
            <span className="text-text-secondary">Keystone</span>
          </div>
          <p className="text-text-tertiary text-sm">
            &copy; {new Date().getFullYear()} Keystone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      className="min-h-screen bg-[#1A1A1A] text-[#EDE8DF] overflow-hidden"
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-7 max-w-5xl mx-auto">
          <span className="text-base tracking-[0.2em] uppercase text-[#EDE8DF]">
            Flowly
          </span>
          <Link
            href="/login"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            className="text-xs tracking-widest uppercase text-[#EDE8DF]/60 hover:text-[#EDE8DF] transition-colors duration-300"
          >
            Sign in
          </Link>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-8 pt-20 pb-28">
          <div
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            className="inline-flex items-center gap-2 mb-14"
          >
            <span className="w-1 h-1 rounded-full bg-[#A8E6A3]"></span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#EDE8DF]/60">
              Now live
            </span>
          </div>

          <h1
            className="text-[clamp(3rem,8vw,6.5rem)] font-normal leading-[0.95] mb-10"
            style={{ letterSpacing: "-0.03em" }}
          >
            The task manager
            <br />
            <span className="text-[#EDE8DF]/45">that helps</span>
            <br />
            you start.
          </h1>

          <div className="flex items-start gap-16 mt-14">
            <p
              style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              className="text-sm text-[#EDE8DF]/75 max-w-xs leading-relaxed"
            >
              Flowly breaks every task into steps so small they feel stupid to
              skip. Built for ADHD. Ruthlessly focused.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="px-7 py-3 bg-[#EDE8DF] text-[#1A1A1A] text-xs tracking-widest uppercase font-medium hover:bg-[#EDE8DF]/90 transition-colors duration-200"
              >
                Start free
              </Link>
              <span
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-[10px] tracking-widest uppercase text-[#EDE8DF]/45 text-center"
              >
                No card required
              </span>
            </div>
          </div>
        </section>

        {/* Divider line */}
        <div className="max-w-5xl mx-auto px-8">
          <div className="h-px bg-[#EDE8DF]/12"></div>
        </div>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-8 py-24">
          <p
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            className="text-[10px] tracking-[0.3em] uppercase text-[#EDE8DF]/50 mb-16"
          >
            How it works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EDE8DF]/10">
            <div className="bg-[#1A1A1A] p-10 pr-12">
              <p className="text-5xl font-normal text-[#EDE8DF]/20 mb-8 tracking-tight">
                01
              </p>
              <h3 className="text-sm font-normal mb-3 text-[#EDE8DF]">
                Add the tasks you have been avoiding
              </h3>
              <p
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-xs text-[#EDE8DF]/60 leading-relaxed"
              >
                Anything. Clean the kitchen. Send that email. Write the report.
              </p>
            </div>
            <div className="bg-[#1A1A1A] p-10 pr-12">
              <p className="text-5xl font-normal text-[#EDE8DF]/20 mb-8 tracking-tight">
                02
              </p>
              <h3 className="text-sm font-normal mb-3 text-[#EDE8DF]">
                AI breaks it into micro-steps
              </h3>
              <p
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-xs text-[#EDE8DF]/60 leading-relaxed"
              >
                Not vague advice. Just exact physical actions that take under 2
                minutes.
              </p>
            </div>
            <div className="bg-[#1A1A1A] p-10 pr-12">
              <p className="text-5xl font-normal text-[#EDE8DF]/20 mb-8 tracking-tight">
                03
              </p>
              <h3 className="text-sm font-normal mb-3 text-[#EDE8DF]">
                Just take the first step
              </h3>
              <p
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-xs text-[#EDE8DF]/60 leading-relaxed"
              >
                Focus on one step at a time. The rest will follow naturally.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-8">
          <div className="h-px bg-[#EDE8DF]/12"></div>
        </div>

        {/* Pricing */}
        <section className="max-w-5xl mx-auto px-8 py-24">
          <p
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            className="text-[10px] tracking-[0.3em] uppercase text-[#EDE8DF]/50 mb-16"
          >
            Pricing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EDE8DF]/10 max-w-2xl">
            <div className="bg-[#1A1A1A] p-10">
              <p
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-[10px] tracking-widest uppercase text-[#EDE8DF]/50 mb-6"
              >
                Free
              </p>
              <p className="text-4xl font-normal mb-8 tracking-tight">$0</p>
              <ul
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="space-y-3 text-xs text-[#EDE8DF]/70 mb-10"
              >
                <li>Unlimited tasks</li>
                <li>5 AI breakdowns per day</li>
                <li>Google sign in</li>
              </ul>
              <Link
                href="/login"
                className="text-xs tracking-widest uppercase text-[#EDE8DF]/65 hover:text-[#EDE8DF] transition-colors duration-200"
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              >
                Get started →
              </Link>
            </div>

            <div className="bg-[#222222] p-10 relative">
              <div
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="absolute top-6 right-6 text-[9px] tracking-widest uppercase text-[#A8E6A3] border border-[#A8E6A3]/30 px-2 py-1"
              >
                Pro
              </div>
              <p
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-[10px] tracking-widest uppercase text-[#EDE8DF]/50 mb-6"
              >
                Pro
              </p>
              <p className="text-4xl font-normal mb-1 tracking-tight">$8</p>
              <p
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="text-xs text-[#EDE8DF]/50 mb-8"
              >
                NZD per month
              </p>
              <ul
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
                className="space-y-3 text-xs text-[#EDE8DF]/80 mb-10"
              >
                <li>Everything in Free</li>
                <li>Unlimited AI breakdowns</li>
                <li>Priority support</li>
              </ul>
              <Link
                href="/login"
                className="text-xs tracking-widest uppercase text-[#EDE8DF] hover:text-[#EDE8DF]/60 transition-colors duration-200"
                style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
              >
                Get started →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="max-w-5xl mx-auto px-8">
          <div className="h-px bg-[#EDE8DF]/12"></div>
        </div>
        <footer className="max-w-5xl mx-auto px-8 py-10 flex items-center justify-between">
          <span
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            className="text-[10px] tracking-[0.3em] uppercase text-[#EDE8DF]/40"
          >
            Flowly
          </span>
          <span
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
            className="text-[10px] tracking-[0.2em] uppercase text-[#EDE8DF]/40"
          >
            Break anything down. Start anyway.
          </span>
        </footer>
      </div>
    </main>
  );
}

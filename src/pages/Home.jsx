import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">

      {/* ── LEFT PANEL — stacks on top in mobile, side column on md+ ── */}
      <div className="relative flex flex-col justify-center gap-8 px-6 pt-10 pb-6 md:flex-1 md:px-10 xl:px-16 md:py-12 overflow-hidden min-w-0">

        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-700/20 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-700/15 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Go Chat</span>
        </div>

        {/* Hero content */}
        <div className="relative">
          <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-indigo-400" />
            Real-time messaging
          </p>
          <h1 className="text-4xl md:text-4xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-4">
            Connect with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              anyone,
            </span>
            <br />anywhere.
          </h1>
          <p className="text-slate-400 text-sm md:text-base xl:text-lg leading-relaxed max-w-lg">
            No friction, no clutter. Just fast, secure conversations with the people who matter.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-3">
          {[
            { n: "01", title: "Create your account", desc: "Enter your name, email, and a password to get started." },
            { n: "02", title: "Sign in with your email", desc: "Use your registered credentials to access your inbox." },
            { n: "03", title: "Start chatting instantly", desc: "Open a room or find a contact and send your first message." },
          ].map((step) => (
            <div key={step.n} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 group hover:bg-white/[0.05] transition-colors duration-200 flex sm:flex-col items-start gap-4 sm:gap-0">
              <span className="text-2xl font-black text-white/10 group-hover:text-indigo-500/30 transition-colors duration-300 leading-none select-none shrink-0 sm:mb-3">
                {step.n}
              </span>
              <div>
                <p className="text-white text-sm font-semibold mb-1">{step.title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="relative">
          <p className="text-slate-600 text-xs flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Enterprise-grade encryption · No phone or card required
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 md:flex-none md:w-[420px] xl:w-[460px] flex flex-col md:border-l border-t md:border-t-0 border-white/[0.06] bg-slate-900/50 relative overflow-hidden">

        {/* Form area */}
        <div className="relative flex-1 flex items-center justify-center px-6 py-10 md:px-8 xl:px-10 md:py-12">
          <div className="w-full max-w-sm md:max-w-none">
            <Outlet />
          </div>
        </div>

        {/* Mobile bottom note */}
        <div className="relative px-6 pb-8 md:hidden">
          <p className="text-slate-600 text-xs flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Enterprise-grade encryption · No phone or card required
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;
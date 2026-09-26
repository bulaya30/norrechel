export default function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Large blue glow */}
      <div className="absolute -top-64 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/[0.08]" />

      {/* Secondary blue glow */}
      <div className="absolute top-[45rem] -left-64 h-[34rem] w-[34rem] rounded-full bg-blue-400/[0.045] " />

      {/* Indigo glow */}
      <div className="absolute top-[90rem] -right-64 h-[38rem] w-[38rem] rounded-full bg-indigo-500/[0.045] " />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2563eb 1px, transparent 1px),
            linear-gradient(to bottom, #2563eb 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Fade the grid toward the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
    </div>
  );
}
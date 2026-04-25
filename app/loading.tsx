export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #fdf8f5 0%, #f5e6d8 40%, #e8d5c4 100%)" }}>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-3 h-3 rounded-full typing-dot"
            style={{ background: "#C9956A", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

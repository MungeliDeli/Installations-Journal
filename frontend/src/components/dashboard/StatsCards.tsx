export default function StatsCards() {
  const cards = [
    {
      title: "TOTAL INSTALLS (ALL-TIME)",
      value: "1,492",
      change: "+1.2% vs Last Period",
      changeColor: "text-(--color-success)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "INSTALLS THIS MONTH",
      value: "87",
      valueColor: "text-(--color-accent-red)",
      target: "Target: 100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      title: "AVG. PER DAY (ACTIVE)",
      value: "2.8",
      valueColor: "text-(--color-accent-red)",
      range: "Optimal Range",
      rangeColor: "text-orange-500",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      title: "ACTIVE SYSTEM STATUS",
      value: "ONLINE",
      valueColor: "text-(--color-success)",
      uptime: "Uptime: 45 Days",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-(--color-surface) border-l-4 border-(--color-accent-red) rounded p-4 relative shadow-[0_0_10px_rgba(220,38,38,0.2)]"
        >
          <div className="absolute top-4 right-4 text-(--color-text-muted)">
            {card.icon}
          </div>
          <h3 className="text-xs text-(--color-text-secondary) uppercase tracking-wide mb-3 font-semibold">
            {card.title}
          </h3>
          <p className={`text-2xl font-bold mb-1 ${card.valueColor || "text-(--color-text-primary)"}`}>
            {card.value}
          </p>
          {card.change && (
            <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
          )}
          {card.target && (
            <p className="text-xs text-(--color-text-secondary)">{card.target}</p>
          )}
          {card.range && (
            <p className={`text-xs ${card.rangeColor}`}>{card.range}</p>
          )}
          {card.uptime && (
            <p className="text-xs text-(--color-text-secondary)">{card.uptime}</p>
          )}
        </div>
      ))}
    </div>
  );
}


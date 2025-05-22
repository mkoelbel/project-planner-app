// Status enums
export const STATUSES = [
  { key: "not_started", label: "Not Started", color: "#bfbfbf" },
  { key: "in_progress", label: "In Progress", color: "#4096ff" },
  { key: "completed", label: "Completed", color: "#60cc52" },
  { key: "overdue", label: "Overdue", color: "#ff4d4f" },
  { key: "paused", label: "Paused", color: "#faad14" },
];

// Derived lookup maps
export const STATUS_LABELS = Object.fromEntries(
  STATUSES.map(({ key, label }) => [key, label])
);

export const STATUS_COLORS = Object.fromEntries(
  STATUSES.map(({ key, color }) => [key, color])
);


// Priority enums
export const PRIORITIES = [
    { key: "low", label: "Low", color: "#60cc52" },
    { key: "medium", label: "Medium", color: "#faad14" },
    { key: "high", label: "High", color: "#ff4d4f" },
];

// Derived lookup maps
export const PRIORITY_LABELS = Object.fromEntries(
  PRIORITIES.map(({ key, label }) => [key, label])
);

export const PRIORITY_COLORS = Object.fromEntries(
  PRIORITIES.map(({ key, color }) => [key, color])
);

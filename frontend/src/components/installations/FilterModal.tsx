import Button from "../ui/Button";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-6 w-full max-w-md shadow-[0_0_20px_rgba(220,38,38,0.3)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-(--color-text-primary) font-bold tracking-[1px] uppercase text-lg">
            <span className="text-(--color-accent-red)">FILTER</span> OPTIONS
          </h2>
          <button
            onClick={onClose}
            className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-(--color-border) rounded bg-(--color-background)">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-(--color-accent-red)"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                Filter Configuration
              </span>
            </div>
            <p className="text-(--color-text-secondary) text-xs tracking-[0.5px]">
              Advanced filtering options will be implemented here. This includes date ranges, status filters, location filters, and speed thresholds.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outlined"
              color="red"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              CANCEL
            </Button>
            <Button
              variant="filled"
              color="red"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              APPLY FILTERS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
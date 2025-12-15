import type { Installation } from "../../types/installation";
import Button from "../ui/Button";
import ImageGallery from "../ui/ImageGallery";

interface InstallationDetailsModalProps {
  installation: Installation | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (installation: Installation) => void;
}

export default function InstallationDetailsModal({
  installation,
  isOpen,
  onClose,
  onDelete,
}: InstallationDetailsModalProps) {
  if (!isOpen || !installation) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-6 w-full max-w-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-(--color-text-primary) font-bold tracking-[1px] uppercase text-lg">
            <span className="text-(--color-accent-red)">INSTALLATION</span> DETAILS
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

        <div className="space-y-6">
          {/* Installation Overview */}
          <div className="p-4 border border-(--color-border) rounded bg-(--color-background)">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-(--color-accent-red)"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                Installation Overview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Installation Date
                </label>
                <div className="text-(--color-text-primary) font-mono text-sm">
                  {formatDate(installation.installedAt)}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Customer
                </label>
                <div className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                  {installation.customer}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Location
                </label>
                <div className="text-(--color-text-primary) font-mono text-sm">
                  {installation.location}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Phone
                </label>
                <div className="text-(--color-text-primary) font-mono text-sm">
                  {installation.phone}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Speed (Mbps)
                </label>
                <div className="font-mono text-sm">
                  <span
                    className={`${installation.speed >= 50
                      ? "text-green-400"
                      : installation.speed >= 25
                        ? "text-yellow-400"
                        : "text-(--color-accent-red)"
                      }`}
                  >
                    {installation.speed}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Installation ID
                </label>
                <div className="text-(--color-text-primary) font-mono text-sm">
                  {installation._id}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Reference Phone
                </label>
                <div className="text-(--color-text-primary) font-mono text-sm">
                  {installation.reference}
                </div>
              </div>

              {installation.rsrp && (
                <div>
                  <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                    RSRP (dBm)
                  </label>
                  <div className="text-(--color-text-primary) font-mono text-sm">
                    {installation.rsrp}
                  </div>
                </div>
              )}

              {installation.notes && (
                <div className="md:col-span-2">
                  <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                    Notes
                  </label>
                  <div className="text-(--color-text-primary) text-sm">
                    {installation.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Installation Summary */}
          <div className="p-4 border border-(--color-border) rounded bg-(--color-background)">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-(--color-accent-red)"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
              </svg>
              <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                Installation Summary
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border border-(--color-border) rounded">
                <div className="text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Speed Status
                </div>
                <div className={`font-mono text-sm ${
                  installation.speed >= 50
                    ? "text-green-400"
                    : installation.speed >= 25
                    ? "text-yellow-400"
                    : "text-(--color-accent-red)"
                }`}>
                  {installation.speed} Mbps
                </div>
              </div>

              <div className="text-center p-3 border border-(--color-border) rounded">
                <div className="text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Images Uploaded
                </div>
                <div className="text-(--color-text-primary) font-mono text-lg font-bold">
                  {installation.images?.length || 0}
                </div>
              </div>

              <div className="text-center p-3 border border-(--color-border) rounded">
                <div className="text-(--color-text-secondary) text-xs tracking-[1px] uppercase mb-1">
                  Created
                </div>
                <div className="text-(--color-text-primary) font-mono text-sm">
                  {formatDate(installation.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          {installation.images && installation.images.length > 0 && (
            <div className="p-4 border border-(--color-border) rounded bg-(--color-background)">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-(--color-accent-red)"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                  Installation Images ({installation.images.length})
                </span>
              </div>

              <ImageGallery images={installation.images} />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outlined"
              color="red"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              CLOSE
            </Button>
            <Button
              variant="filled"
              color="red"
              size="md"
              onClick={() => {
                onDelete(installation);
                onClose(); // Close the details modal so the delete confirmation modal can appear
              }}
              className="flex-1"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              }
            >
              DELETE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
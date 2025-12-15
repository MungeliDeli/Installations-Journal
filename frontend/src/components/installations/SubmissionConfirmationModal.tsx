// src/components/installations/SubmissionConfirmationModal.tsx

import Button from "../ui/Button";

interface SubmissionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  uploadProgress?: string | null;
}

export default function SubmissionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  uploadProgress,
}: SubmissionConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
      <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-6 w-full max-w-md shadow-[0_0_30px_rgba(220,38,38,0.4)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-(--color-accent-red)/10 rounded-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-(--color-accent-red)"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 className="text-(--color-text-primary) font-bold text-lg tracking-[0.5px] uppercase">
            Confirm Submission
          </h3>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-(--color-text-primary) text-sm">
            Are you sure you want to submit this installation?
          </p>

          <div className="p-3 bg-(--color-accent-red)/5 border border-(--color-accent-red)/20 rounded space-y-2">
            <div className="flex items-start gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-(--color-accent-red) shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-xs text-(--color-text-secondary)">
                Once submitted, installation details can be edited, but{" "}
                <strong className="text-(--color-text-primary)">
                  images cannot be modified, added, or removed
                </strong>
                .
              </p>
            </div>

            {uploadProgress && (
              <div className="flex items-center gap-2 pt-2 border-t border-(--color-accent-red)/20">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-(--color-accent-red) animate-spin"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <p className="text-xs text-(--color-text-primary) font-medium">
                  {uploadProgress}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outlined"
            color="red"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            CANCEL
          </Button>
          <Button
            type="button"
            variant="filled"
            color="green"
            size="md"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1"
            icon={
              isSubmitting ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="animate-spin"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )
            }
          >
            {isSubmitting ? "SUBMITTING..." : "CONFIRM"}
          </Button>
        </div>
      </div>
    </div>
  );
}

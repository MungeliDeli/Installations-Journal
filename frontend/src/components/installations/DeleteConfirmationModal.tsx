import Button from "../ui/Button";
import { useDeleteInstallation } from "../../hooks/useInstallations";
import type { Installation } from "../../types/installation";

interface DeleteConfirmationModalProps {
  installation: Installation | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmationModal({
  installation,
  isOpen,
  onClose,
  onSuccess,
}: DeleteConfirmationModalProps) {
  const deleteInstallation = useDeleteInstallation();

  const handleDelete = async () => {
    if (!installation) return;

    try {
      await deleteInstallation.mutateAsync(installation._id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting installation:", error);
    }
  };

  if (!isOpen || !installation) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleteInstallation.isPending) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-6 w-full max-w-md shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-(--color-accent-red)"
            >
              <polyline points="3,6 5,6 21,6" />
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-(--color-text-primary) font-bold tracking-[1px] uppercase text-sm">
              Delete Installation
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-(--color-text-secondary) text-sm tracking-[0.5px] mb-3">
            Are you sure you want to delete this installation? This action cannot be undone and will also delete all associated images from storage.
          </p>
          
          <div className="p-3 bg-(--color-background) rounded border border-(--color-border)">
            <div className="text-(--color-text-primary) font-semibold text-sm mb-1">
              {installation.customer}
            </div>
            <div className="text-(--color-text-secondary) text-xs mb-2">
              {new Date(installation.installedAt).toLocaleDateString()} • {installation.location}
            </div>
            {installation.images && installation.images.length > 0 && (
              <div className="flex items-center gap-2 text-(--color-accent-red) text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>{installation.images.length} image(s) will be permanently deleted</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outlined"
            color="red"
            size="md"
            onClick={onClose}
            disabled={deleteInstallation.isPending}
            className="flex-1"
          >
            CANCEL
          </Button>
          <Button
            variant="filled"
            color="red"
            size="md"
            onClick={handleDelete}
            disabled={deleteInstallation.isPending}
            className="flex-1"
            icon={
              deleteInstallation.isPending ? (
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
                  <polyline points="3,6 5,6 21,6" />
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                </svg>
              )
            }
          >
            {deleteInstallation.isPending ? "DELETING..." : "DELETE"}
          </Button>
        </div>
      </div>
    </div>
  );
}
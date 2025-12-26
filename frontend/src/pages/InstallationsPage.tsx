import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import InstallationsTable from "../components/installations/InstallationsTable";
import SearchBar from "../components/installations/SearchBar";
import FilterModal from "../components/installations/FilterModal";
import NewInstallationModal from "../components/installations/NewInstallationModal";
import InstallationDetailsModal from "../components/installations/InstallationDetailsModal";
import DeleteConfirmationModal from "../components/installations/DeleteConfirmationModal";

import ResponsiveButton from "../components/ui/ResponsiveButton";
import NotificationModal from "../components/ui/NotificationModal";
import { useInstallations } from "../hooks/useInstallations";
import type { Installation } from "../types/installation";

interface InstallationsPageProps {
  onMenuToggle?: () => void;
}

export default function InstallationsPage({ onMenuToggle = () => {} }: InstallationsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewInstallationModalOpen, setIsNewInstallationModalOpen] = useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [installationToDelete, setInstallationToDelete] = useState<Installation | null>(null);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // Fetch installations from API
  const { data: installationsData, isLoading, error } = useInstallations();
  const installations = installationsData?.installations || [];

  const handleInstallationClick = (installation: Installation) => {
    setSelectedInstallation(installation);
  };

  const handleCloseDetailsModal = () => {
    setSelectedInstallation(null);
  };

  const handleDeleteClick = (installation: Installation) => {
    setInstallationToDelete(installation);
  };

  const handleDeleteSuccess = () => {
    // Close any open modals
    setSelectedInstallation(null);
    setInstallationToDelete(null);
    
    setNotification({
      isOpen: true,
      type: "success",
      title: "Installation Deleted",
      message: "The installation has been successfully deleted.",
    });
  };

  const headerActions = (
    <div className="flex gap-2 sm:gap-3">
      <ResponsiveButton
        variant="outlined"
        color="red"
        size="md"
        onClick={() => setIsFilterModalOpen(true)}
        ariaLabel="Filter installations"
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        }
      >
        FILTER: STATUS/DATE
      </ResponsiveButton>
      <ResponsiveButton
        variant="filled"
        color="green"
        size="md"
        onClick={() => setIsNewInstallationModalOpen(true)}
        ariaLabel="Create new installation"
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      >
        NEW INSTALLATION
      </ResponsiveButton>
    </div>
  );

  return (
    <>
      <PageHeader
        title={
          <>
            <span className="text-(--color-accent-red)">JOURNAL</span>{" "}
            <span className="text-(--color-text-primary)">LOG (F01)</span>
          </>
        }
        subtitle="INSTALLATION DATABASE"
        onMenuToggle={onMenuToggle}
        actions={headerActions}
      />

      <div className="mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="SEARCH CUSTOMER, LOCATION, OR DATE..."
        />
      </div>

      {isLoading ? (
        <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-8 text-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <div className="flex items-center justify-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin text-(--color-accent-red)"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            <span className="text-(--color-text-secondary) text-sm tracking-[1px] uppercase">
              Loading installations...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-8 text-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-(--color-accent-red)"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span className="text-(--color-text-primary) font-semibold text-sm tracking-[1px] uppercase">
              Error Loading Data
            </span>
          </div>
          <p className="text-(--color-text-secondary) text-sm">
            Failed to load installations. Please try again later.
          </p>
        </div>
      ) : (
        <InstallationsTable
          installations={installations}
          searchQuery={searchQuery}
          onInstallationClick={handleInstallationClick}

        />
      )}

      {/* Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      <NewInstallationModal
        isOpen={isNewInstallationModalOpen}
        onClose={() => setIsNewInstallationModalOpen(false)}
      />

      <InstallationDetailsModal
        installation={selectedInstallation}
        isOpen={!!selectedInstallation}
        onClose={handleCloseDetailsModal}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationModal
        installation={installationToDelete}
        isOpen={!!installationToDelete}
        onClose={() => setInstallationToDelete(null)}
        onSuccess={handleDeleteSuccess}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
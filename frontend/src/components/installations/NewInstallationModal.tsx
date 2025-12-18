// src/components/installations/NewInstallationModal.tsx

import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import ImageUpload from "../ui/ImageUpload";
import NotificationModal from "../ui/NotificationModal";
import SubmissionConfirmationModal from "./SubmissionConfirmationModal";
import { useCreateInstallation } from "../../hooks/useInstallations";
import {
  validateInstallationForm,
  type ValidationError,
} from "../../utils/validation";
import type { CreateInstallationData } from "../../types/installation";

interface NewInstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewInstallationModal({
  isOpen,
  onClose,
}: NewInstallationModalProps) {
  const [formData, setFormData] = useState<CreateInstallationData>({
    customer: "",
    phone: "",
    location: "",
    reference: "",
    installedAt: "",
    speed: 0,
    notes: "",
    rsrp: 0,
    images: [],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const [errors, setErrors] = useState<ValidationError[]>([]);
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

  const createInstallation = useCreateInstallation();

  const handleInputChange = (
    field: keyof CreateInstallationData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors.some((error) => error.field === field)) {
      setErrors((prev) => prev.filter((error) => error.field !== field));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));

    // Clear images error if any
    if (errors.some((error) => error.field === "images")) {
      setErrors((prev) => prev.filter((error) => error.field !== "images"));
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((error) => error.field === field)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateInstallationForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmSubmission = async () => {
    try {
      setUploadProgress("Preparing installation data...");

      // Convert speed to number and filter out empty optional fields
      const submitData: CreateInstallationData = {
        ...formData,
        speed: Number(formData.speed),
        rsrp: Number(formData.rsrp),
        notes: formData.notes?.trim() || undefined,
        images: formData.images,
      };

      if (submitData.images && submitData.images.length > 0) {
        setUploadProgress(`Uploading ${submitData.images.length} image(s)...`);
      }

      console.log("Submitting installation with data:", {
        ...submitData,
        images: submitData.images?.map((img) => ({
          name: img.name,
          size: img.size,
          type: img.type,
        })),
      });

      await createInstallation.mutateAsync(submitData);

      // Close confirmation modal
      setShowConfirmation(false);
      setUploadProgress(null);

      // Show success notification
      setNotification({
        isOpen: true,
        type: "success",
        title: "Installation Created",
        message:
          formData.images && formData.images.length > 0
            ? `Installation created successfully with ${formData.images.length} image(s).`
            : "The installation has been successfully created.",
      });

      // Reset form
      setFormData({
        customer: "",
        phone: "",
        location: "",
        reference: "",
        installedAt: "",
        speed: 0,
        notes: "",
        rsrp: 0,
        images: [],
      });
      setErrors([]);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Error creating installation:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Close confirmation modal
      setShowConfirmation(false);
      setUploadProgress(null);

      // Parse error message
      let errorMessage = "Failed to create installation. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors
            .map((e: any) => e.message || e.field)
            .join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error notification
      setNotification({
        isOpen: true,
        type: "error",
        title: "Creation Failed",
        message: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!createInstallation.isPending) {
      onClose();
      // Reset form when closing
      setFormData({
        customer: "",
        phone: "",
        location: "",
        reference: "",
        installedAt: "",
        speed: 0,
        notes: "",
        rsrp: 0,
        images: [],
      });
      setErrors([]);
      setShowConfirmation(false);
      setUploadProgress(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !createInstallation.isPending) {
            handleClose();
          }
        }}
      >
        <div
          className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-6 w-full max-w-2xl max-h-[90vh] shadow-[0_0_20px_rgba(220,38,38,0.3)] overflow-y-auto scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-(--color-text-primary) font-bold tracking-[1px] uppercase text-lg">
              <span className="text-(--color-accent-red)">NEW</span>{" "}
              INSTALLATION
            </h2>
            <button
              onClick={handleClose}
              disabled={createInstallation.isPending}
              className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors disabled:opacity-50"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                  Customer Information
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Customer Name"
                  required
                  value={formData.customer}
                  onChange={(e) =>
                    handleInputChange("customer", e.target.value)
                  }
                  error={getFieldError("customer")}
                  placeholder="Enter customer name"
                />

                <Input
                  label="Phone Number"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={getFieldError("phone")}
                  placeholder="+1-555-0123"
                />

                <Input
                  label="Location"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  error={getFieldError("location")}
                  placeholder="Address or GPS coordinates"
                  className="md:col-span-2"
                />

                <Input
                  label="Reference Phone"
                  required
                  type="tel"
                  value={formData.reference}
                  onChange={(e) =>
                    handleInputChange("reference", e.target.value)
                  }
                  error={getFieldError("reference")}
                  placeholder="0978882033 or +260978882033"
                />
              </div>
            </div>

            {/* Installation Details */}
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
                  <path d="M14.7 6.3 17 4l3 3-2.3 2.3a2 2 0 0 0-.5 1.9l.7 2.3-2.1 2.1-2.3-.7a2 2 0 0 0-1.9.5L9 19l-4-4 3.6-3.6a2 2 0 0 0 .5-1.9l-.7-2.3 2.1-2.1 2.3.7a2 2 0 0 0 1.9-.5z" />
                </svg>
                <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                  Installation Details
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Installation Date"
                  required
                  type="date"
                  value={formData.installedAt}
                  onChange={(e) =>
                    handleInputChange("installedAt", e.target.value)
                  }
                  error={getFieldError("installedAt")}
                />

                <Input
                  label="Speed (Mbps)"
                  required
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.speed || ""}
                  onChange={(e) =>
                    handleInputChange("speed", parseFloat(e.target.value) || 0)
                  }
                  error={getFieldError("speed")}
                  placeholder="0.0"
                />

                <Input
                  label="RSRP (dBm)"
                  required
                  type="number"
                  value={formData.rsrp || ""}
                  onChange={(e) =>
                    handleInputChange("rsrp", parseFloat(e.target.value) || 0)
                  }
                  error={getFieldError("rsrp")}
                  placeholder="Enter RSRP value"
                />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes or comments about the installation..."
                  rows={3}
                />
              </div>
            </div>

            {/* Images Upload */}
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
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                  Installation Images
                </span>
              </div>

              <ImageUpload
                images={formData.images || []}
                onImagesChange={handleImagesChange}
                maxImages={10}
                error={getFieldError("images")}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outlined"
                color="red"
                size="md"
                onClick={handleClose}
                disabled={createInstallation.isPending}
                className="flex-1"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="filled"
                color="green"
                size="md"
                disabled={createInstallation.isPending}
                className="flex-1"
                icon={
                  createInstallation.isPending ? (
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
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )
                }
              >
                {createInstallation.isPending
                  ? "CREATING..."
                  : "CREATE INSTALLATION"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
      />

      <SubmissionConfirmationModal
        isOpen={showConfirmation}
        onClose={() =>
          !createInstallation.isPending && setShowConfirmation(false)
        }
        onConfirm={handleConfirmSubmission}
        isSubmitting={createInstallation.isPending}
        uploadProgress={uploadProgress}
      />
    </>
  );
}

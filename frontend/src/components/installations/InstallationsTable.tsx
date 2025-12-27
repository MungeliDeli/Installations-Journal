import { useState, useMemo } from "react";
import type { Installation } from "../../types/installation";

interface InstallationsTableProps {
  installations: Installation[];
  searchQuery: string;
  onInstallationClick: (installation: Installation) => void;
}

type SortField = "date" | "customer" | "location" | "speed";
type SortDirection = "asc" | "desc";

export default function InstallationsTable({
  installations,
  searchQuery,
  onInstallationClick,
}: InstallationsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedInstallations = useMemo(() => {
    // Create a copy to avoid mutating the original array
    let filtered = [...installations];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (installation) =>
          installation.customer.toLowerCase().includes(query) ||
          installation.location.toLowerCase().includes(query) ||
          installation.installedAt.includes(query) ||
          installation.phone.includes(query) ||
          installation.reference.toLowerCase().includes(query)
      );
    }

    // Sort the filtered array
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "date":
          const dateA = new Date(a.installedAt);
          const dateB = new Date(b.installedAt);
          
          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) {
            comparison = 0;
          } else if (isNaN(dateA.getTime())) {
            comparison = 1; // Put invalid dates at the end
          } else if (isNaN(dateB.getTime())) {
            comparison = -1; // Put invalid dates at the end
          } else {
            comparison = dateA.getTime() - dateB.getTime();
          }
          break;
          
        case "customer":
          const customerA = (a.customer || "").toLowerCase().trim();
          const customerB = (b.customer || "").toLowerCase().trim();
          comparison = customerA.localeCompare(customerB);
          break;
          
        case "location":
          const locationA = (a.location || "").toLowerCase().trim();
          const locationB = (b.location || "").toLowerCase().trim();
          comparison = locationA.localeCompare(locationB);
          break;
          
        case "speed":
          const speedA = Number(a.speed) || 0;
          const speedB = Number(b.speed) || 0;
          comparison = speedA - speedB;
          break;
          
        default:
          return 0;
      }

      // Apply sort direction
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [installations, searchQuery, sortField, sortDirection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 9l4-4 4 4" />
          <path d="M16 15l-4 4-4-4" />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 15l4-4 4 4" />
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 9l4 4 4-4" />
      </svg>
    );
  };

  return (
    <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] overflow-hidden">
      <div className="p-4 border-b border-(--color-border)">
        <div className="flex items-center gap-2">
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
          <h2 className="text-(--color-text-primary) font-bold tracking-[1px] uppercase text-sm">
            INSTALLATION LOG DATABASE
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-background)">
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  DATE
                  <SortIcon field="date" />
                </button>
              </th>
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                <button
                  onClick={() => handleSort("customer")}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  CUSTOMER
                  <SortIcon field="customer" />
                </button>
              </th>
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                <button
                  onClick={() => handleSort("location")}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  LOCATION (GPS)
                  <SortIcon field="location" />
                </button>
              </th>
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                PHONE
              </th>
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                REFERENCE
              </th>
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                <button
                  onClick={() => handleSort("speed")}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  SPEED (MBPS)
                  <SortIcon field="speed" />
                </button>
              </th>
              <th className="text-left p-3 text-(--color-accent-red) font-semibold text-xs tracking-[1px] uppercase">
                RSRP (dBm)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedInstallations.map((installation) => (
              <tr
                key={installation._id}
                onClick={() => onInstallationClick(installation)}
                className="border-b border-(--color-border) hover:bg-(--color-sidebar-hover) cursor-pointer transition-colors"
              >
                <td className="p-3 text-(--color-text-primary) font-mono text-sm">
                  {formatDate(installation.installedAt)}
                </td>
                <td className="p-3 text-(--color-text-primary) font-semibold text-sm tracking-[0.5px] uppercase">
                  {installation.customer}
                </td>
                <td className="p-3 text-(--color-text-secondary) font-mono text-sm">
                  {installation.location}
                </td>
                <td className="p-3 text-(--color-text-secondary) font-mono text-sm">
                  {installation.phone}
                </td>
                <td className="p-3 text-(--color-text-secondary) font-mono text-sm">
                  {installation.reference}
                </td>
                <td className="p-3 font-mono text-sm">
                  <span
                    className={`${
                      installation.speed >= 50
                        ? "text-green-400"
                        : installation.speed >= 25
                        ? "text-yellow-400"
                        : "text-(--color-accent-red)"
                    }`}
                  >
                    {installation.speed}
                  </span>
                </td>
                <td className="p-3 text-(--color-text-secondary) font-mono text-sm">
                  {installation.rsrp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedInstallations.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-(--color-text-secondary) text-sm tracking-[1px] uppercase">
              NO INSTALLATIONS FOUND
            </div>
            {searchQuery && (
              <div className="text-(--color-text-muted) text-xs mt-2">
                Try adjusting your search criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
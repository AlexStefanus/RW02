import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchAndFilterBarProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  mounted?: boolean;
}

const SearchAndFilterBar = ({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Cari...",
  statusFilter,
  onStatusFilterChange,
  statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Lorem Ipsum", label: "Lorem Ipsum" },
    { value: "Published", label: "Published" },
    { value: "Draft", label: "Draft" },
  ],
  mounted = true,
}: SearchAndFilterBarProps) => {
  return (
    <div className="pb-4 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="app-text-lg font-semibold text-black smooth-transition">{title}</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <FiSearch className="absolute search-icon top-1/2 transform -translate-y-1/2 text-gray-500 smooth-transition" size={14} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input app-form-input search-input w-full sm:w-48 pr-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a753] focus:border-transparent text-black smooth-transition"
            />
          </div>
          {onStatusFilterChange && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="form-input app-form-input app-select border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a753] focus:border-transparent bg-white text-black smooth-transition"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  className,
}) => {
  return (
    <div
      className={`flex items-center w-72 ml-auto bg-modern-bg
    shadow-sm border border-modern-border ${className}`}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        className="p-1 pl-2 text-sm w-full rounded-l-lg outline-none
        focus:border-modern-point_30 bg-modern-bg"
        placeholder="검색"
      />
      <span className="p-1 pr-2 border-text2">
        <Search className="text-sm text-text2" width={18} strokeWidth={3} />
      </span>
    </div>
  );
};

export default SearchInput;


import React, { useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, FilterConfig } from "@/types";

interface FilterBarProps {
  onFilter: (filter: FilterConfig) => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<keyof InboundRecord | ''>('');
  const [filterValue, setFilterValue] = useState('');

  const fields: { label: string; value: keyof InboundRecord | '' }[] = [
    { label: 'All Fields', value: '' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Customer Record', value: 'customerRecordId' },
    { label: 'Product', value: 'product' },
    { label: 'Source', value: 'source' },
    { label: 'State', value: 'state' },
  ];

  const applyFilter = () => {
    onFilter({
      field: selectedField,
      value: filterValue
    });
    setIsOpen(false);
  };

  const clearFilter = () => {
    setSelectedField('');
    setFilterValue('');
    onFilter({ field: '', value: '' });
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 h-10",
          "rounded-full border border-gray-200/50 text-sm font-medium",
          "transition-all duration-150 bg-white/80 backdrop-blur-md",
          "hover:border-gray-300/70 text-gray-700",
          isOpen && "ring-2 ring-apple-blue/30 border-apple-blue/20"
        )}
      >
        <Filter size={16} className={isOpen ? "text-apple-blue" : "text-gray-500"} />
        <span>Filter</span>
        <ChevronDown size={16} className={cn(
          "text-gray-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 w-64 bg-white rounded-lg shadow-lg p-3 border border-gray-200/50 z-10 glass">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Field</label>
              <div className="relative">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value as keyof InboundRecord | '')}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue/50 appearance-none"
                >
                  {fields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Value</label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue/50"
                placeholder="Enter filter value..."
              />
            </div>

            <div className="flex gap-2 pt-1.5">
              <button
                onClick={clearFilter}
                className="px-3 py-1.5 text-xs rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-150 flex-1"
              >
                Clear
              </button>
              <button
                onClick={applyFilter}
                className="px-3 py-1.5 text-xs rounded-md text-white bg-apple-blue hover:bg-apple-light-blue transition-colors duration-150 flex-1"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

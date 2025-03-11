
import React, { useState } from "react";
import { Columns, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, ColumnVisibility } from "@/types";

interface ColumnVisibilityControlProps {
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
  columnVisibility,
  onColumnVisibilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const columnLabels: { key: keyof InboundRecord; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'customerRecordId', label: 'Customer Record' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zip', label: 'Zip' },
    { key: 'phone', label: 'Phone' },
    { key: 'product', label: 'Product' },
    { key: 'email', label: 'Email' },
    { key: 'sender', label: 'Sender' },
    { key: 'received', label: 'Received' },
    { key: 'source', label: 'Source' },
    { key: 'subSource', label: 'SubSource' },
    { key: 'market', label: 'Market' },
    { key: 'notes', label: 'Notes' },
    { key: 'checkOutDate', label: 'CheckOutDate' },
    { key: 'checkedOutBy', label: 'CheckedOutBy' },
  ];

  const handleToggleColumn = (key: string) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [key]: !columnVisibility[key],
    });
  };

  const handleToggleAll = (value: boolean) => {
    const newVisibility: ColumnVisibility = {};
    Object.keys(columnVisibility).forEach(key => {
      newVisibility[key] = value;
    });
    onColumnVisibilityChange(newVisibility);
  };

  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
  const totalCount = Object.keys(columnVisibility).length;

  return (
    <div className="relative">
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
        <Columns size={16} className={isOpen ? "text-apple-blue" : "text-gray-500"} />
        <span>Columns ({visibleCount}/{totalCount})</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-gray-400 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200/50 z-10 glass">
          <div className="p-3 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Toggle Columns</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleAll(true)}
                  className="text-xs text-apple-blue hover:text-apple-light-blue"
                >
                  Show All
                </button>
                <button
                  onClick={() => handleToggleAll(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Hide All
                </button>
              </div>
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {columnLabels.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => handleToggleColumn(key)}
              >
                <div
                  className={cn(
                    "w-4 h-4 mr-2 rounded border flex items-center justify-center",
                    columnVisibility[key]
                      ? "bg-apple-blue border-apple-blue text-white"
                      : "border-gray-300"
                  )}
                >
                  {columnVisibility[key] && <Check size={12} />}
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilityControl;

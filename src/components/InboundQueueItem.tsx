
import React from "react";
import { cn } from "@/lib/utils";
import { InboundRecord } from "@/types";
import { User, Calendar, ClipboardCheck, Mail, Phone } from "lucide-react";

interface InboundQueueItemProps {
  record: InboundRecord;
  isSelected: boolean;
  onClick: () => void;
  visibleColumns?: (keyof InboundRecord)[];
}

const InboundQueueItem: React.FC<InboundQueueItemProps> = ({ 
  record, 
  isSelected,
  onClick,
  visibleColumns = []
}) => {
  // Format date string for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const receivedDate = formatDate(record.received);
  const checkOutDate = record.checkOutDate ? formatDate(record.checkOutDate) : null;

  // Determine status based on checkOutDate
  const isCheckedOut = !!record.checkOutDate;
  
  const renderCell = (key: keyof InboundRecord) => {
    const value = record[key];
    
    switch (key) {
      case 'received':
        return (
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gray-400" />
            <span>{receivedDate}</span>
          </div>
        );
      case 'checkOutDate':
        return checkOutDate ? (
          <div className="flex items-center gap-1.5">
            <ClipboardCheck size={12} className="text-green-500" />
            <span>{checkOutDate}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      case 'checkedOutBy':
        return record.checkedOutBy ? (
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-gray-400" />
            <span>{record.checkedOutBy}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      case 'source':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            {value as string}
          </span>
        );
      case 'email':
        return (
          <div className="flex items-center gap-1.5">
            <Mail size={12} className="text-gray-400" />
            <span>{value as string}</span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="text-gray-400" />
            <span>{value as string}</span>
          </div>
        );
      default:
        return value as React.ReactNode;
    }
  };
  
  return (
    <tr 
      className={cn(
        "border-b transition-all duration-200 cursor-pointer animate-fade-in stagger-item",
        isSelected ? "bg-blue-50/80" : "hover:bg-gray-50/80",
        record.isNew && "animate-pulse-soft bg-blue-50/60 ring-1 ring-inset ring-blue-100",
      )}
      onClick={onClick}
    >
      {visibleColumns.map((column) => (
        <td key={column} className="px-4 py-3 text-xs whitespace-nowrap">
          {renderCell(column)}
        </td>
      ))}
    </tr>
  );
};

export default InboundQueueItem;

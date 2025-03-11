
import React from "react";
import { cn } from "@/lib/utils";
import { InboundRecord } from "@/types";
import { User, Calendar, ClipboardCheck, Mail, Phone, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InboundQueueItemProps {
  record: InboundRecord;
  isSelected: boolean;
  isChecked: boolean;
  onClick: () => void;
  onCheckboxChange: () => void;
  visibleColumns?: (keyof InboundRecord)[];
}

const InboundQueueItem: React.FC<InboundQueueItemProps> = ({ 
  record, 
  isSelected,
  isChecked,
  onClick,
  onCheckboxChange,
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
      case 'status':
        if (!value) return <span className="text-gray-400">-</span>;
        return (
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            value === 'new' && "bg-blue-100 text-blue-800",
            value === 'contacted' && "bg-yellow-100 text-yellow-800",
            value === 'qualified' && "bg-green-100 text-green-800",
            value === 'converted' && "bg-purple-100 text-purple-800",
            value === 'closed' && "bg-gray-100 text-gray-800"
          )}>
            {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
          </span>
        );
      default:
        return value as React.ReactNode;
    }
  };

  // Handle the checkbox click without triggering the row click
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheckboxChange();
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
      <td className="px-3 py-3">
        <div className="flex items-center" onClick={handleCheckboxClick}>
          <input
            type="checkbox"
            className="rounded text-apple-blue focus:ring-apple-blue"
            checked={isChecked}
            readOnly
          />
        </div>
      </td>

      {visibleColumns.map((column) => (
        <td key={column} className="px-4 py-3 text-xs whitespace-nowrap">
          {renderCell(column)}
        </td>
      ))}

      <td className="px-2 py-3 whitespace-nowrap text-right text-xs">
        <div className="flex justify-center gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Eye size={14} className="text-gray-500" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // Edit functionality would go here
            }}
          >
            <Edit size={14} className="text-gray-500" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // More options functionality would go here
            }}
          >
            <MoreHorizontal size={14} className="text-gray-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default InboundQueueItem;

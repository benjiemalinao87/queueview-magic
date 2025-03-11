
import React from "react";
import { cn } from "@/lib/utils";
import { InboundRecord } from "@/types";
import { User, Calendar, ClipboardCheck } from "lucide-react";

interface InboundQueueItemProps {
  record: InboundRecord;
  isSelected: boolean;
  onClick: () => void;
}

const InboundQueueItem: React.FC<InboundQueueItemProps> = ({ 
  record, 
  isSelected,
  onClick
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
  
  return (
    <tr 
      className={cn(
        "border-b transition-all duration-200 cursor-pointer animate-fade-in stagger-item",
        isSelected ? "bg-blue-50/80" : "hover:bg-gray-50/80",
        record.isNew && "animate-pulse-soft bg-blue-50/60 ring-1 ring-inset ring-blue-100",
      )}
      onClick={onClick}
    >
      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
        {record.id}
      </td>
      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
        {record.customerRecordId}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.firstName}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.lastName}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.address}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.city}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.state}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.zip}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.phone}
      </td>
      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
        {record.product}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.email}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.sender}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-gray-400" />
          <span>{receivedDate}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
          {record.source}
        </span>
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.subSource}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.market}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap max-w-[200px] truncate">
        {record.notes}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {checkOutDate ? (
          <div className="flex items-center gap-1.5">
            <ClipboardCheck size={12} className="text-green-500" />
            <span>{checkOutDate}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        {record.checkedOutBy ? (
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-gray-400" />
            <span>{record.checkedOutBy}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
};

export default InboundQueueItem;

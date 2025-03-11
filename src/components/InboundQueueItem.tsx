
import React from "react";
import { cn } from "@/lib/utils";
import { InboundRecord } from "@/types";
import { 
  User, Calendar, ClipboardCheck, Mail, Phone, Eye, Edit, 
  MoreHorizontal, MapPin, Package, ArrowUpRight, Clock, 
  Building, AlertCircle, Globe, Users, ExternalLink, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

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

  // Get relative time (e.g., "2 hours ago")
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "";
    }
  };

  const receivedDate = formatDate(record.received);
  const timeAgo = getTimeAgo(record.received);
  const checkOutDate = record.checkOutDate ? formatDate(record.checkOutDate) : null;

  // Determine status based on checkOutDate and status field
  const isCheckedOut = !!record.checkOutDate;
  
  const renderCell = (key: keyof InboundRecord) => {
    const value = record[key];
    
    switch (key) {
      case 'received':
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar size={14} className="text-indigo-500" />
            <span>{receivedDate}</span>
            {timeAgo && <span className="text-xs text-gray-500 ml-1">({timeAgo})</span>}
          </div>
        );
      case 'checkOutDate':
        return checkOutDate ? (
          <div className="flex items-center gap-1.5 text-sm">
            <ClipboardCheck size={14} className="text-green-500" />
            <span>{checkOutDate}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not checked out</span>
        );
      case 'checkedOutBy':
        return record.checkedOutBy ? (
          <div className="flex items-center gap-1.5 text-sm">
            <User size={14} className="text-violet-500" />
            <span>{record.checkedOutBy}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        );
      case 'source':
        const getSourceIcon = (source: string) => {
          switch(source.toLowerCase()) {
            case 'email': return <Mail size={14} className="text-blue-500" />;
            case 'direct': return <User size={14} className="text-green-500" />;
            case 'partner': return <Users size={14} className="text-orange-500" />;
            case 'social': return <MessageSquare size={14} className="text-pink-500" />;
            case 'retail': return <Building size={14} className="text-slate-500" />;
            case 'support': return <Phone size={14} className="text-indigo-500" />;
            case 'online': return <Globe size={14} className="text-teal-500" />;
            default: return <Globe size={14} className="text-gray-500" />;
          }
        };
        
        return (
          <div className="flex items-center gap-1.5">
            {getSourceIcon(value as string)}
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
              {value as string}
            </span>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Mail size={14} className="text-blue-400" />
            <span className="truncate max-w-[180px]">{value as string}</span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Phone size={14} className="text-green-400" />
            <span>{value as string}</span>
          </div>
        );
      case 'product':
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Package size={14} className="text-purple-400" />
            <span>{value as string}</span>
          </div>
        );
      case 'city':
      case 'state':
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin size={14} className="text-red-400" />
            <span>{value as string}</span>
          </div>
        );
      case 'market':
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Building size={14} className="text-slate-400" />
            <span>{value as string}</span>
          </div>
        );
      case 'status':
        if (!value) return <span className="text-gray-400 text-sm">-</span>;
        return (
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
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
        return <span className="text-sm">{value as React.ReactNode}</span>;
    }
  };

  // Handle the checkbox click without triggering the row click
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheckboxChange();
  };
  
  // Only for table view
  if (visibleColumns.length > 0) {
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
              className="rounded text-indigo-600 focus:ring-indigo-500"
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
              <Eye size={14} className="text-indigo-500" />
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
  }
  
  // Grid view (card)
  return (
    <div 
      className={cn(
        "group relative rounded-xl border overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:border-indigo-200/70 cursor-pointer",
        isSelected ? "border-indigo-300 bg-indigo-50/50 shadow-sm" : "border-gray-200/70 bg-white",
        record.isNew && "ring-2 ring-blue-300/50"
      )}
      onClick={onClick}
    >
      {/* Status indicator at top */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
        <div 
          className={cn(
            "h-full",
            record.status === 'new' ? "bg-blue-500" : 
            record.status === 'contacted' ? "bg-yellow-500" : 
            record.status === 'qualified' ? "bg-green-500" : 
            record.status === 'converted' ? "bg-purple-500" : 
            record.status === 'closed' ? "bg-gray-500" : "bg-gray-300",
            isCheckedOut ? "w-full" : "w-1/3"
          )} 
        />
      </div>
      
      {/* New badge */}
      {record.isNew && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center">
          <AlertCircle size={10} className="mr-1" />
          New
        </div>
      )}
      
      {/* Checkbox */}
      <div 
        className="absolute top-3 left-3" 
        onClick={(e) => {
          e.stopPropagation();
          onCheckboxChange();
        }}
      >
        <input
          type="checkbox"
          className="rounded text-indigo-600 focus:ring-indigo-500"
          checked={isChecked}
          readOnly
        />
      </div>
      
      <div className="pt-8 pb-4 px-4">
        {/* Header section */}
        <div className="mb-3 mt-1">
          <h3 className="font-medium text-gray-900 text-lg">
            {record.firstName} {record.lastName}
          </h3>
          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
            <span>ID: {record.id}</span>
            {record.status && (
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                record.status === 'new' && "bg-blue-100 text-blue-800",
                record.status === 'contacted' && "bg-yellow-100 text-yellow-800",
                record.status === 'qualified' && "bg-green-100 text-green-800",
                record.status === 'converted' && "bg-purple-100 text-purple-800",
                record.status === 'closed' && "bg-gray-100 text-gray-800"
              )}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            )}
          </div>
        </div>
        
        {/* Content grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Product</div>
            <div className="flex items-center text-sm">
              <Package size={14} className="text-indigo-400 mr-1.5" />
              <span className="font-medium text-gray-700">{record.product}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Source</div>
            <div className="flex items-center text-sm">
              {record.source?.toLowerCase() === 'email' ? (
                <Mail size={14} className="text-blue-400 mr-1.5" />
              ) : record.source?.toLowerCase() === 'direct' ? (
                <User size={14} className="text-green-400 mr-1.5" />
              ) : record.source?.toLowerCase() === 'partner' ? (
                <Users size={14} className="text-orange-400 mr-1.5" />
              ) : record.source?.toLowerCase() === 'online' ? (
                <Globe size={14} className="text-teal-400 mr-1.5" />
              ) : (
                <Globe size={14} className="text-gray-400 mr-1.5" />
              )}
              <span className="font-medium text-gray-700">{record.source}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
            <div className="flex items-center text-sm">
              <MapPin size={14} className="text-red-400 mr-1.5" />
              <span className="font-medium text-gray-700">{record.city}, {record.state}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Received</div>
            <div className="flex items-center text-sm">
              <Calendar size={14} className="text-purple-400 mr-1.5" />
              <div>
                <span className="font-medium text-gray-700">{receivedDate}</span>
                {timeAgo && (
                  <div className="text-xs text-gray-500">{timeAgo}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact info with icons */}
        {record.email && (
          <div className="flex items-center mb-2 text-xs text-gray-600">
            <Mail size={12} className="text-gray-400 mr-1.5" />
            <span className="truncate">{record.email}</span>
          </div>
        )}
        
        {record.phone && (
          <div className="flex items-center mb-2 text-xs text-gray-600">
            <Phone size={12} className="text-gray-400 mr-1.5" />
            <span>{record.phone}</span>
          </div>
        )}
        
        {/* Footer section */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Eye size={12} className="mr-1" />
            View Details
          </Button>
          
          {record.checkOutDate ? (
            <div className="flex items-center text-xs text-gray-500">
              <ClipboardCheck size={12} className="text-green-500 mr-1" />
              <span>Checked out</span>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation();
                // Check out functionality would go here
              }}
            >
              <ExternalLink size={12} className="mr-1" />
              Check Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboundQueueItem;

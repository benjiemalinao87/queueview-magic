
import React from "react";
import { InboundRecord } from "@/types";
import { X, User, Phone, Mail, Calendar, MapPin, Tag, FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LeadDetailSidebarProps {
  record: InboundRecord | null;
  onClose: () => void;
}

const LeadDetailSidebar: React.FC<LeadDetailSidebarProps> = ({ record, onClose }) => {
  if (!record) return null;

  // Format date string for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const handleCheckout = () => {
    toast({
      title: "Lead checked out",
      description: `You have checked out ${record.firstName} ${record.lastName}`,
    });
  };
  
  const handleContact = () => {
    toast({
      title: "Contact initiated",
      description: "Contact information has been copied to clipboard",
    });
  };

  const handleAssign = () => {
    toast({
      title: "Lead assignment",
      description: "Lead assignment dialog would appear here",
    });
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg border-l border-gray-200",
        "flex flex-col z-20 animate-slide-in-right"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Lead Details</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Header with name and status */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{record.firstName} {record.lastName}</h2>
            <p className="text-sm text-gray-500">ID: {record.id}</p>
          </div>
          <div>
            {record.status ? (
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                record.status === 'new' && "bg-blue-100 text-blue-800",
                record.status === 'contacted' && "bg-yellow-100 text-yellow-800",
                record.status === 'qualified' && "bg-green-100 text-green-800",
                record.status === 'converted' && "bg-purple-100 text-purple-800",
                record.status === 'closed' && "bg-gray-100 text-gray-800"
              )}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            ) : record.isNew ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Unprocessed
              </span>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Information</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-gray-400" />
              <span className="text-gray-900 font-medium">{record.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-900">{record.email}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={16} className="text-gray-400 mt-0.5" />
              <div>
                <div className="text-gray-900">{record.address}</div>
                <div className="text-gray-900">{record.city}, {record.state} {record.zip}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lead Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Product</p>
              <p className="text-sm font-medium">{record.product}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Source</p>
              <p className="text-sm font-medium">{record.source}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Market</p>
              <p className="text-sm font-medium">{record.market}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Sub Source</p>
              <p className="text-sm font-medium">{record.subSource}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <Calendar size={14} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Lead Received</p>
                <p className="text-xs text-gray-500">{formatDate(record.received)}</p>
              </div>
            </div>
            {record.checkOutDate && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <CheckCircle2 size={14} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Checked Out</p>
                  <p className="text-xs text-gray-500">{formatDate(record.checkOutDate)} by {record.checkedOutBy}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Notes</h4>
          <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 min-h-[100px]">
            {record.notes || "No notes available."}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={handleContact}
          >
            Contact
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={handleAssign}
          >
            Assign
          </Button>
          <Button 
            variant="default" 
            className="w-full text-sm bg-apple-blue hover:bg-apple-light-blue"
            onClick={handleCheckout}
          >
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailSidebar;

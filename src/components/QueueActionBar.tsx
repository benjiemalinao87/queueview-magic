
import React from "react";
import { CheckCircle2, Share2, XCircle, Clipboard, Download } from "lucide-react";

interface QueueActionBarProps {
  selectedCount: number;
  onCheckout: () => void;
  onAssign: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

const QueueActionBar: React.FC<QueueActionBarProps> = ({
  selectedCount,
  onCheckout,
  onAssign,
  onExport,
  onClearSelection
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-slide-up">
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="flex items-center gap-2 pr-4 border-r border-gray-700">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="font-medium">{selectedCount} leads selected</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Clipboard size={14} />
          <span>Check Out</span>
        </button>
        
        <button
          onClick={onAssign}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Share2 size={14} />
          <span>Assign</span>
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
        
        <button
          onClick={onClearSelection}
          className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-300 hover:text-white transition-colors"
        >
          <XCircle size={14} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default QueueActionBar;

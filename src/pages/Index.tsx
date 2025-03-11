
import { useEffect, useState } from "react";
import InboundQueue from "@/components/InboundQueue";
import HeatMapModal from "@/components/HeatMapModal";
import { toast } from "@/hooks/use-toast";
import { Map, BarChart3 } from "lucide-react";
import { InboundRecord } from "@/types";
import { generateMockData } from "@/utils/mockData";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<InboundRecord[]>([]);
  const [isHeatMapOpen, setIsHeatMapOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setRecords(generateMockData());
      setIsLoading(false);
      toast({
        title: "Queue loaded",
        description: "Real-time incoming leads are now active",
        variant: "default",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenHeatMap = () => {
    setIsHeatMapOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Inbound Lead Management</h1>
              <button
                onClick={handleOpenHeatMap}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-apple-blue to-apple-light-blue hover:from-apple-light-blue hover:to-apple-blue text-white text-sm transition-all duration-200 shadow-sm hover:shadow"
              >
                <BarChart3 size={16} />
                <span>Heat Map of Leads</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 rounded-full border-2 border-apple-blue border-t-transparent animate-spin"></div>
                <p className="text-sm text-gray-500">Loading queue data...</p>
              </div>
            </div>
          ) : (
            <div className="animate-slide-up">
              <InboundQueue onRecordsChange={setRecords} initialRecords={records} />
            </div>
          )}
        </div>
      </main>
      
      <HeatMapModal 
        isOpen={isHeatMapOpen} 
        onClose={() => setIsHeatMapOpen(false)} 
        records={records}
      />
    </div>
  );
};

export default Index;

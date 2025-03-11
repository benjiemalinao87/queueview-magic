
import { useEffect, useState } from "react";
import InboundQueue from "@/components/InboundQueue";
import HeatMapModal from "@/components/HeatMapModal";
import { toast } from "@/hooks/use-toast";
import { Map, BarChart3, FileBarChart2, CircleUser, Phone, Zap, Clock } from "lucide-react";
import { InboundRecord } from "@/types";
import { generateMockData } from "@/utils/mockData";
import QueueMetrics from "@/components/QueueMetrics";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<InboundRecord[]>([]);
  const [isHeatMapOpen, setIsHeatMapOpen] = useState(false);
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);

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

  // Calculate metrics for the dashboard
  const getQueueMetrics = () => {
    if (records.length === 0) return null;
    
    const newLeads = records.filter(r => r.isNew).length;
    const pendingLeads = records.filter(r => !r.checkOutDate).length;
    const checkedOutLeads = records.filter(r => r.checkOutDate).length;
    
    // Group by product
    const productCounts: Record<string, number> = {};
    records.forEach(record => {
      productCounts[record.product] = (productCounts[record.product] || 0) + 1;
    });
    
    // Group by source
    const sourceCounts: Record<string, number> = {};
    records.forEach(record => {
      sourceCounts[record.source] = (sourceCounts[record.source] || 0) + 1;
    });
    
    // Find top product and source
    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    
    // Calculate conversion rate (using status for conversion metrics)
    const qualifiedLeads = records.filter(r => r.status === 'qualified' || r.status === 'converted').length;
    const conversionRate = records.length > 0 ? Math.round((qualifiedLeads / records.length) * 100) : 0;
    
    // Calculate average time before checkout (in minutes)
    const todayLeads = records.filter(r => {
      const receivedDate = new Date(r.received);
      const today = new Date();
      return receivedDate.toDateString() === today.toDateString();
    });
    
    return {
      total: records.length,
      newLeads,
      pendingLeads,
      checkedOutLeads,
      topProduct,
      topSource,
      conversionRate,
      todayLeads: todayLeads.length
    };
  };

  const metrics = getQueueMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Inbound Lead Management</h1>
              <div className="flex space-x-2">
                <button
                  onClick={handleOpenHeatMap}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-apple-blue to-apple-light-blue hover:from-apple-light-blue hover:to-apple-blue text-white text-sm transition-all duration-200 shadow-sm hover:shadow"
                >
                  <BarChart3 size={16} />
                  <span>Heat Map</span>
                </button>
                <button
                  onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm transition-all duration-200 shadow-sm hover:shadow"
                >
                  <FileBarChart2 size={16} />
                  <span>{isDashboardExpanded ? 'Hide' : 'Show'} Dashboard</span>
                </button>
              </div>
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
          {/* Dashboard Section */}
          {isDashboardExpanded && !isLoading && metrics && (
            <div className="mb-6 animate-fade-in">
              <QueueMetrics metrics={metrics} />
            </div>
          )}

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

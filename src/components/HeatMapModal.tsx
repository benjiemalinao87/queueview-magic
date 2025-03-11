
import React, { useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, GroupedLeadData } from "@/types";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  Treemap,
  Cell,
} from "recharts";

interface HeatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: InboundRecord[];
}

const COLORS = [
  "#9b87f5", // primary purple
  "#7E69AB", // secondary purple
  "#6E59A5", // tertiary purple
  "#D6BCFA", // light purple
  "#E5DEFF", // soft purple
];

const HeatMapModal: React.FC<HeatMapModalProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  // Process data for the heat map
  const processedData = useMemo(() => {
    if (!records.length) return [];

    // Group by source and product
    const sourceProductMap = new Map<string, Map<string, number>>();
    
    records.forEach(record => {
      if (!sourceProductMap.has(record.source)) {
        sourceProductMap.set(record.source, new Map<string, number>());
      }
      
      const productMap = sourceProductMap.get(record.source)!;
      const currentCount = productMap.get(record.product) || 0;
      productMap.set(record.product, currentCount + 1);
    });
    
    // Count total leads by source
    const sourceCountMap = new Map<string, number>();
    sourceProductMap.forEach((productMap, source) => {
      let total = 0;
      productMap.forEach(count => {
        total += count;
      });
      sourceCountMap.set(source, total);
    });
    
    // Get top 5 sources
    const topSources = Array.from(sourceCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    // Format data for treemap
    const formattedData: GroupedLeadData[] = topSources.map(source => {
      return {
        name: source,
        value: sourceCountMap.get(source) || 0
      };
    });
    
    return formattedData;
  }, [records]);
  
  // Define tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200 text-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{payload[0].value}</span> leads
          </p>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-[90vw] max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Heat Map of Leads</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Top 5 Lead Sources</h3>
            <p className="text-sm text-gray-500">
              This heat map shows the distribution of leads across the top 5 sources.
              Larger blocks represent more leads from that source.
            </p>
          </div>
          
          <div className="h-[450px] w-full">
            {processedData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={processedData}
                  dataKey="value"
                  nameKey="name"
                  stroke="#fff"
                  animationDuration={500}
                >
                  {processedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </Treemap>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="flex flex-wrap gap-3">
              {processedData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-sm mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              Visualization based on {records.length} total leads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapModal;


import React, { useMemo, useState } from "react";
import { X, BarChart, PieChart, TrendingUp, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, GroupedLeadData } from "@/types";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  Treemap,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Sector,
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
  "#FEC6A1", // soft orange
  "#FEF7CD", // soft yellow
  "#F2FCE2", // soft green
  "#D3E4FD", // soft blue
  "#FFDEE2", // soft pink
];

type VisualizationType = 'treemap' | 'piechart';
type GroupingDimension = 'source' | 'product' | 'both';

const HeatMapModal: React.FC<HeatMapModalProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  const [visualization, setVisualization] = useState<VisualizationType>('treemap');
  const [grouping, setGrouping] = useState<GroupingDimension>('source');
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Process data for the visualizations
  const processedData = useMemo(() => {
    if (!records.length) return [];

    if (grouping === 'source') {
      // Group by source
      const sourceMap = new Map<string, number>();
      
      records.forEach(record => {
        const currentCount = sourceMap.get(record.source) || 0;
        sourceMap.set(record.source, currentCount + 1);
      });
      
      // Get top sources
      const sources = Array.from(sourceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map((entry, index) => ({
          name: entry[0],
          value: entry[1],
          color: COLORS[index % COLORS.length]
        }));
      
      return sources;
    } else if (grouping === 'product') {
      // Group by product
      const productMap = new Map<string, number>();
      
      records.forEach(record => {
        const currentCount = productMap.get(record.product) || 0;
        productMap.set(record.product, currentCount + 1);
      });
      
      // Get top products
      const products = Array.from(productMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map((entry, index) => ({
          name: entry[0],
          value: entry[1],
          color: COLORS[index % COLORS.length]
        }));
      
      return products;
    } else {
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
      
      // Format data for hierarchical visualization
      const formattedData: GroupedLeadData[] = topSources.map((source, sourceIndex) => {
        const children: GroupedLeadData[] = [];
        const productMap = sourceProductMap.get(source);
        
        if (productMap) {
          Array.from(productMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3) // Top 3 products per source
            .forEach(([product, count], productIndex) => {
              children.push({
                name: product,
                value: count,
                color: COLORS[(sourceIndex * 3 + productIndex) % COLORS.length]
              });
            });
        }
        
        return {
          name: source,
          value: sourceCountMap.get(source) || 0,
          color: COLORS[sourceIndex % COLORS.length],
          children: children.length > 0 ? children : undefined
        };
      });
      
      return formattedData;
    }
  }, [records, grouping]);
  
  // Define tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200 text-sm animate-fade-in">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{payload[0].value}</span> leads
          </p>
          {payload[0].payload.children && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Top Products:</p>
              {payload[0].payload.children.map((child: any, index: number) => (
                <p key={index} className="text-xs text-gray-600">
                  {child.name}: <span className="font-medium">{child.value}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Active shape for PieChart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-lg font-semibold">
          {value}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999" className="text-xs">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.8}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 1}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className={cn(
          "bg-white rounded-xl shadow-2xl w-[90vw] max-h-[90vh] overflow-hidden transition-all duration-300",
          expanded ? "max-w-6xl" : "max-w-4xl"
        )}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Heat Map of Leads</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title={expanded ? "Collapse view" : "Expand view"}
            >
              {expanded ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronUp size={20} className="text-gray-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setVisualization('treemap')}
                  className={cn(
                    "px-3 py-1.5 flex items-center gap-2 rounded-md text-sm font-medium transition-colors",
                    visualization === 'treemap' 
                      ? "bg-white shadow-sm text-apple-blue" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                  )}
                >
                  <BarChart size={16} />
                  <span>Treemap</span>
                </button>
                <button
                  onClick={() => setVisualization('piechart')}
                  className={cn(
                    "px-3 py-1.5 flex items-center gap-2 rounded-md text-sm font-medium transition-colors",
                    visualization === 'piechart' 
                      ? "bg-white shadow-sm text-apple-blue" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                  )}
                >
                  <PieChart size={16} />
                  <span>Pie Chart</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Filter size={14} />
                <span>Group by:</span>
              </div>
              <select
                value={grouping}
                onChange={(e) => setGrouping(e.target.value as GroupingDimension)}
                className="bg-gray-100 text-gray-800 text-sm py-1.5 px-3 rounded-md border-0 font-medium focus:ring-1 focus:ring-apple-blue focus:outline-none"
              >
                <option value="source">Source</option>
                <option value="product">Product</option>
                <option value="both">Source & Product</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {grouping === 'source' ? 'Top Lead Sources' : 
                 grouping === 'product' ? 'Top Products' : 
                 'Top 5 Lead Sources by Product'}
              </h3>
              <p className="text-sm text-gray-500">
                {visualization === 'treemap' ? 
                  'This treemap visualization shows the distribution of leads. Larger blocks represent more leads.' : 
                  'This pie chart shows the percentage distribution of leads. Click on segments for details.'}
              </p>
            </div>
            
            <div className={cn("w-full transition-all duration-300", expanded ? "h-[600px]" : "h-[450px]")}>
              {processedData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {visualization === 'treemap' ? (
                    <Treemap
                      data={processedData}
                      dataKey="value"
                      nameKey="name"
                      stroke="#ffffff"
                      animationDuration={500}
                      animationEasing="ease-out"
                    >
                      {processedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || COLORS[index % COLORS.length]} 
                          className="drop-shadow-sm transition-opacity duration-200 hover:opacity-90"
                        />
                      ))}
                      <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                  ) : (
                    <RechartsPieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={processedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={expanded ? 100 : 80}
                        outerRadius={expanded ? 160 : 130}
                        dataKey="value"
                        nameKey="name"
                        onMouseEnter={handlePieEnter}
                        paddingAngle={2}
                      >
                        {processedData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                            className="drop-shadow-md transition-opacity duration-200 hover:opacity-90"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-3">
              {processedData.slice(0, 7).map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-sm mr-2"
                    style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600">{entry.name}</span>
                </div>
              ))}
              {processedData.length > 7 && (
                <div className="text-xs text-gray-500">+{processedData.length - 7} more</div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-apple-blue" />
              <p className="text-xs text-gray-500">
                Based on {records.length} leads
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapModal;

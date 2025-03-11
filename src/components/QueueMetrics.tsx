
import React from "react";
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BarChart, 
  TrendingUp,
  CalendarClock,
  Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsProps {
  metrics: {
    total: number;
    newLeads: number;
    pendingLeads: number;
    checkedOutLeads: number;
    topProduct: string;
    topSource: string;
    conversionRate: number;
    todayLeads: number;
  };
}

const QueueMetrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-800">Queue Dashboard</h3>
        <p className="text-sm text-gray-500">Real-time metrics and insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* KPI Cards */}
        <KpiCard 
          title="Total Leads"
          value={metrics.total}
          icon={<Boxes size={18} className="text-apple-blue" />}
          description="Total leads in queue"
          color="bg-blue-50"
        />
        
        <KpiCard 
          title="New Leads"
          value={metrics.newLeads}
          icon={<Zap size={18} className="text-amber-500" />}
          description="Unprocessed new leads"
          color="bg-amber-50"
          isHighlighted={metrics.newLeads > 0}
        />
        
        <KpiCard 
          title="Pending"
          value={metrics.pendingLeads}
          icon={<Clock size={18} className="text-orange-500" />}
          description="Awaiting checkout"
          color="bg-orange-50"
        />
        
        <KpiCard 
          title="Checked Out"
          value={metrics.checkedOutLeads}
          icon={<CheckCircle2 size={18} className="text-green-500" />}
          description="Assigned to agents"
          color="bg-green-50"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 pt-0">
        {/* Insight Cards */}
        <InsightCard 
          title="Today's Activity"
          value={`${metrics.todayLeads} leads`}
          icon={<CalendarClock size={18} className="text-purple-500" />}
          color="bg-purple-50"
        />
        
        <InsightCard 
          title="Top Product"
          value={metrics.topProduct}
          icon={<BarChart size={18} className="text-indigo-500" />}
          color="bg-indigo-50"
        />
        
        <InsightCard 
          title="Top Source"
          value={metrics.topSource}
          icon={<TrendingUp size={18} className="text-cyan-500" />}
          color="bg-cyan-50"
        />
        
        <InsightCard 
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={<AlertCircle size={18} className="text-emerald-500" />}
          color="bg-emerald-50"
        />
      </div>
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  isHighlighted?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon, 
  description,
  color,
  isHighlighted = false
}) => {
  return (
    <div className={cn(
      "rounded-lg p-4 border border-gray-100 transition-all duration-300",
      color,
      isHighlighted && "animate-pulse-soft border border-amber-200"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface InsightCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  value, 
  icon, 
  color 
}) => {
  return (
    <div className={cn(
      "rounded-lg p-4 border border-gray-100 transition-all duration-200 hover:shadow-md",
      color
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-white shadow-sm">
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">{title}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueMetrics;

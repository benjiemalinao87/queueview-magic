
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, RefreshCw, PlusCircle, Eye, EyeOff, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, SortConfig, FilterConfig, ColumnVisibility } from "@/types";
import InboundQueueItem from "./InboundQueueItem";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ColumnVisibilityControl from "./ColumnVisibilityControl";
import LeadDetailSidebar from "./LeadDetailSidebar";
import { toast } from "@/hooks/use-toast";
import { addNewRecord } from "@/utils/mockData";

interface InboundQueueProps {
  initialRecords?: InboundRecord[];
  onRecordsChange?: (records: InboundRecord[]) => void;
}

const InboundQueue: React.FC<InboundQueueProps> = ({ 
  initialRecords = [],
  onRecordsChange
}) => {
  const [records, setRecords] = useState<InboundRecord[]>(initialRecords);
  const [loading, setLoading] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterConfig>({ field: '', value: '' });
  const [sort, setSort] = useState<SortConfig>({ key: 'received', direction: 'desc' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Initialize default column visibility
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: false,
    customerRecordId: true,
    firstName: true,
    lastName: true,
    address: false,
    city: true,
    state: true,
    zip: false,
    phone: true,
    product: true,
    email: true,
    sender: false,
    received: true,
    source: true,
    subSource: false,
    market: true,
    notes: false,
    checkOutDate: true,
    checkedOutBy: true,
  });

  useEffect(() => {
    if (initialRecords.length > 0) {
      setRecords(initialRecords);
    }
  }, [initialRecords]);

  useEffect(() => {
    if (onRecordsChange) {
      onRecordsChange(records);
    }
  }, [records, onRecordsChange]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new lead
        const updatedRecords = [...records];
        addNewRecord(updatedRecords, (newRecords) => {
          setRecords(newRecords);
        });
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [records]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshedRecords = [...records].sort(() => Math.random() - 0.5);
      setRecords(refreshedRecords);
      setIsRefreshing(false);
      toast({
        title: "Queue refreshed",
        description: "The lead queue has been refreshed",
      });
    }, 800);
  };

  const handleAddRecord = () => {
    const updatedRecords = [...records];
    addNewRecord(updatedRecords, (newRecords) => {
      setRecords(newRecords);
      toast({
        title: "New lead added",
        description: "A new lead has been added to the queue",
      });
    });
  };

  const handleSort = (key: keyof InboundRecord) => {
    setSort(prev => {
      const newDirection = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction: newDirection };
    });
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((newFilter: FilterConfig) => {
    setFilter(newFilter);
  }, []);

  const handleSelectRecord = (id: string) => {
    setSelectedRecordId(id === selectedRecordId ? null : id);
    setIsDetailSidebarOpen(id !== selectedRecordId);
  };

  const handleCloseSidebar = () => {
    setIsDetailSidebarOpen(false);
  };

  const selectedRecord = useMemo(() => {
    return records.find(record => record.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = [...records];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        Object.values(record).some(value => 
          value && typeof value === 'string' && value.toLowerCase().includes(query)
        )
      );
    }
    
    if (filter.value && filter.field) {
      filtered = filtered.filter(record => {
        const fieldValue = record[filter.field];
        return fieldValue && typeof fieldValue === 'string' && 
          fieldValue.toLowerCase().includes(filter.value.toLowerCase());
      });
    }
    
    filtered.sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = 
        typeof aValue === 'string' && typeof bValue === 'string' 
          ? aValue.localeCompare(bValue) 
          : (aValue as any) - (bValue as any);
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [records, searchQuery, filter, sort]);

  const visibleColumns = useMemo(() => {
    return Object.entries(columnVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([key]) => key as keyof InboundRecord);
  }, [columnVisibility]);

  const headerCells: { key: keyof InboundRecord; label: string }[] = [
    { key: 'id', label: 'Inbound Record' },
    { key: 'customerRecordId', label: 'Customer Record' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zip', label: 'Zip' },
    { key: 'phone', label: 'Phone' },
    { key: 'product', label: 'Product' },
    { key: 'email', label: 'Email' },
    { key: 'sender', label: 'Sender' },
    { key: 'received', label: 'Received' },
    { key: 'source', label: 'Source' },
    { key: 'subSource', label: 'SubSource' },
    { key: 'market', label: 'Market' },
    { key: 'notes', label: 'Notes' },
    { key: 'checkOutDate', label: 'CheckOutDate' },
    { key: 'checkedOutBy', label: 'CheckedOutBy' },
  ];
  
  const visibleHeaderCells = headerCells.filter(cell => 
    columnVisibility[cell.key as string]
  );
  
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-medium text-gray-800">Inbound Queue</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredAndSortedRecords.length} leads • Sorted by {sort.key} ({sort.direction})
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex bg-gray-100 rounded-full p-1 mr-1">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                viewMode === 'table' ? "bg-white shadow-sm text-gray-700" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                viewMode === 'grid' ? "bg-white shadow-sm text-gray-700" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Grid size={16} />
            </button>
          </div>

          <SearchBar onSearch={handleSearch} />
          <FilterBar onFilter={handleFilter} />
          <ColumnVisibilityControl 
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
          
          <button
            onClick={handleRefresh}
            className={cn(
              "p-2 rounded-full text-gray-500 hover:text-gray-700",
              "hover:bg-gray-100 transition-all duration-200",
              isRefreshing && "animate-spin text-apple-blue"
            )}
          >
            <RefreshCw size={18} />
          </button>
          
          <button
            onClick={handleAddRecord}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-apple-blue hover:bg-apple-light-blue text-white text-sm transition-colors duration-200"
          >
            <PlusCircle size={16} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200/70 bg-white shadow-sm overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80 backdrop-blur-xs">
                <tr>
                  {visibleHeaderCells.map(({ key, label }) => (
                    <th
                      key={key}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        "transition-colors duration-150 cursor-pointer hover:bg-gray-100"
                      )}
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <div className="flex flex-col">
                          <ChevronUp 
                            size={12} 
                            className={cn(
                              "text-gray-400 -mb-1",
                              sort.key === key && sort.direction === 'asc' && "text-apple-blue"
                            )} 
                          />
                          <ChevronDown 
                            size={12} 
                            className={cn(
                              "text-gray-400",
                              sort.key === key && sort.direction === 'desc' && "text-apple-blue"
                            )} 
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse shimmer">
                      {Array.from({ length: visibleHeaderCells.length }).map((_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredAndSortedRecords.length > 0 ? (
                  filteredAndSortedRecords.map((record) => (
                    <InboundQueueItem
                      key={record.id}
                      record={record}
                      isSelected={record.id === selectedRecordId}
                      onClick={() => handleSelectRecord(record.id)}
                      visibleColumns={visibleColumns}
                    />
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={visibleHeaderCells.length} 
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAndSortedRecords.length > 0 ? (
              filteredAndSortedRecords.map((record) => (
                <div 
                  key={record.id}
                  onClick={() => handleSelectRecord(record.id)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-150",
                    "hover:shadow-md hover:border-gray-300",
                    record.id === selectedRecordId ? "border-apple-blue bg-blue-50/50" : "border-gray-200",
                    record.isNew && "animate-pulse-soft bg-blue-50/30"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{record.firstName} {record.lastName}</h3>
                    {record.isNew && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">ID: {record.id}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <p className="text-gray-500">Product</p>
                      <p className="font-medium">{record.product}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500">Source</p>
                      <p className="font-medium">{record.source}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{record.city}, {record.state}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500">Received</p>
                      <p className="font-medium">{new Date(record.received).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-sm text-gray-500">
                No records found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Sidebar */}
      {isDetailSidebarOpen && (
        <LeadDetailSidebar 
          record={selectedRecord} 
          onClose={handleCloseSidebar} 
        />
      )}
    </div>
  );
};

export default InboundQueue;

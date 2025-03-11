
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, RefreshCw, PlusCircle, Eye, EyeOff, Grid, List, AlertTriangle, Calendar, Users, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, SortConfig, FilterConfig, ColumnVisibility, LeadStatus } from "@/types";
import InboundQueueItem from "./InboundQueueItem";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ColumnVisibilityControl from "./ColumnVisibilityControl";
import LeadDetailSidebar from "./LeadDetailSidebar";
import QueueActionBar from "./QueueActionBar";
import { toast } from "@/hooks/use-toast";
import { addNewRecord } from "@/utils/mockData";
import { Button } from "./ui/button";

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
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
  
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
    status: true, // Add status column
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

  const handleToggleSelectRecord = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(recordId => recordId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredAndSortedRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredAndSortedRecords.map(record => record.id));
    }
  };

  const handleBulkAction = (action: 'checkout' | 'assign' | 'export') => {
    if (selectedRecords.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select leads to perform this action",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case 'checkout':
        // Mark selected records as checked out
        const updatedRecords = records.map(record => {
          if (selectedRecords.includes(record.id)) {
            return {
              ...record,
              checkOutDate: new Date().toISOString(),
              checkedOutBy: 'Current User',
              status: 'contacted' as LeadStatus
            };
          }
          return record;
        });
        setRecords(updatedRecords);
        setSelectedRecords([]);
        toast({
          title: "Leads checked out",
          description: `${selectedRecords.length} leads have been checked out`,
        });
        break;
      case 'assign':
        toast({
          title: "Assign leads",
          description: `${selectedRecords.length} leads selected for assignment`,
        });
        break;
      case 'export':
        toast({
          title: "Export leads",
          description: `${selectedRecords.length} leads will be exported`,
        });
        break;
    }
  };

  const handleDateFilterChange = (filter: 'all' | 'today' | 'yesterday' | 'week') => {
    setDateFilter(filter);
  };

  const handleStatusFilterChange = (status: LeadStatus | 'all') => {
    setStatusFilter(status);
  };

  const selectedRecord = useMemo(() => {
    return records.find(record => record.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = [...records];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        Object.values(record).some(value => 
          value && typeof value === 'string' && value.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply field filter
    if (filter.value && filter.field) {
      filtered = filtered.filter(record => {
        const fieldValue = record[filter.field];
        return fieldValue && typeof fieldValue === 'string' && 
          fieldValue.toLowerCase().includes(filter.value.toLowerCase());
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

      filtered = filtered.filter(record => {
        const receivedDate = new Date(record.received);
        
        switch (dateFilter) {
          case 'today':
            return receivedDate >= today;
          case 'yesterday':
            return receivedDate >= yesterday && receivedDate < today;
          case 'week':
            return receivedDate >= weekAgo;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
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
  }, [records, searchQuery, filter, sort, statusFilter, dateFilter]);

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
    { key: 'status', label: 'Status' },
  ];
  
  const visibleHeaderCells = headerCells.filter(cell => 
    columnVisibility[cell.key as string]
  );

  // Compute stats for the quick filters
  const newLeadsCount = records.filter(r => r.isNew).length;
  const pendingLeadsCount = records.filter(r => !r.checkOutDate).length;
  const checkedOutLeadsCount = records.filter(r => !!r.checkOutDate).length;
  const todayLeadsCount = records.filter(r => {
    const receivedDate = new Date(r.received);
    const today = new Date();
    return receivedDate.toDateString() === today.toDateString();
  }).length;
  
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-medium text-gray-800">Inbound Queue</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredAndSortedRecords.length} leads • Sorted by {sort.key} ({sort.direction})
            {filter.field && ` • Filtered by ${filter.field}`}
            {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
            {dateFilter !== 'all' && ` • Date: ${dateFilter}`}
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

      {/* Quick filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusFilterChange('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            statusFilter === 'all' 
              ? "bg-gray-200 text-gray-800" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          All Leads
        </button>
        
        <button
          onClick={() => handleStatusFilterChange('new')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
            statusFilter === 'new' 
              ? "bg-blue-200 text-blue-800" 
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          )}
        >
          <AlertTriangle size={12} />
          <span>New Leads</span>
          {newLeadsCount > 0 && <span className="px-1.5 py-0.5 bg-white rounded-full text-xs">{newLeadsCount}</span>}
        </button>
        
        <button
          onClick={() => handleDateFilterChange('today')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
            dateFilter === 'today' 
              ? "bg-green-200 text-green-800" 
              : "bg-green-50 text-green-600 hover:bg-green-100"
          )}
        >
          <Calendar size={12} />
          <span>Today</span>
          {todayLeadsCount > 0 && <span className="px-1.5 py-0.5 bg-white rounded-full text-xs">{todayLeadsCount}</span>}
        </button>
        
        <button
          onClick={() => handleStatusFilterChange('contacted')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
            statusFilter === 'contacted' 
              ? "bg-purple-200 text-purple-800" 
              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
          )}
        >
          <Users size={12} />
          <span>Contacted</span>
        </button>
        
        <button
          onClick={() => handleDateFilterChange('week')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            dateFilter === 'week' 
              ? "bg-amber-200 text-amber-800" 
              : "bg-amber-50 text-amber-600 hover:bg-amber-100"
          )}
        >
          Last 7 Days
        </button>
        
        {(statusFilter !== 'all' || dateFilter !== 'all') && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setDateFilter('all');
            }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Action Bar for Selected Records */}
      {selectedRecords.length > 0 && (
        <QueueActionBar 
          selectedCount={selectedRecords.length}
          onCheckout={() => handleBulkAction('checkout')}
          onAssign={() => handleBulkAction('assign')}
          onExport={() => handleBulkAction('export')}
          onClearSelection={() => setSelectedRecords([])}
        />
      )}

      <div className="rounded-xl border border-gray-200/70 bg-white shadow-sm overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80 backdrop-blur-xs">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-apple-blue focus:ring-apple-blue"
                        checked={selectedRecords.length === filteredAndSortedRecords.length && filteredAndSortedRecords.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
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
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse shimmer">
                      <td className="px-3 py-3"></td>
                      {Array.from({ length: visibleHeaderCells.length }).map((_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                      ))}
                      <td className="px-4 py-3"></td>
                    </tr>
                  ))
                ) : filteredAndSortedRecords.length > 0 ? (
                  filteredAndSortedRecords.map((record) => (
                    <InboundQueueItem
                      key={record.id}
                      record={record}
                      isSelected={record.id === selectedRecordId}
                      isChecked={selectedRecords.includes(record.id)}
                      onClick={() => handleSelectRecord(record.id)}
                      onCheckboxChange={() => handleToggleSelectRecord(record.id)}
                      visibleColumns={visibleColumns}
                    />
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={visibleHeaderCells.length + 2} 
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
                  className={cn(
                    "relative p-4 rounded-lg border cursor-pointer transition-all duration-150",
                    "hover:shadow-md hover:border-gray-300",
                    record.id === selectedRecordId ? "border-apple-blue bg-blue-50/50" : "border-gray-200",
                    record.isNew && "animate-pulse-soft bg-blue-50/30"
                  )}
                >
                  <div className="absolute top-2 right-2">
                    <input
                      type="checkbox"
                      className="rounded text-apple-blue focus:ring-apple-blue"
                      checked={selectedRecords.includes(record.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelectRecord(record.id);
                      }}
                    />
                  </div>
                  
                  <div onClick={() => handleSelectRecord(record.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{record.firstName} {record.lastName}</h3>
                      {record.status && (
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs",
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
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRecord(record.id);
                        }}
                      >
                        View Details
                      </Button>
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

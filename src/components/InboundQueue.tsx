import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, RefreshCw, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundRecord, SortConfig, FilterConfig } from "@/types";
import InboundQueueItem from "./InboundQueueItem";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
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
    }, 800);
  };

  const handleAddRecord = () => {
    const updatedRecords = [...records];
    addNewRecord(updatedRecords, (newRecords) => {
      setRecords(newRecords);
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
  };

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
          <SearchBar onSearch={handleSearch} />
          <FilterBar onFilter={handleFilter} />
          
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80 backdrop-blur-xs">
              <tr>
                {headerCells.map(({ key, label }) => (
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
                    {Array.from({ length: headerCells.length }).map((_, cellIndex) => (
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
                  />
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={headerCells.length} 
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InboundQueue;


import React from 'react';

interface TimeRangeSelectorProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function TimeRangeSelector({ timeRange, setTimeRange }: TimeRangeSelectorProps) {
  return (
    <div className="flex bg-secondary/20 rounded-md">
      <button 
        className={`px-3 py-1 text-xs ${timeRange === '1D' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
        onClick={() => setTimeRange('1D')}
      >
        1D
      </button>
      <button 
        className={`px-3 py-1 text-xs ${timeRange === '1W' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
        onClick={() => setTimeRange('1W')}
      >
        1W
      </button>
      <button 
        className={`px-3 py-1 text-xs ${timeRange === '1M' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
        onClick={() => setTimeRange('1M')}
      >
        1M
      </button>
      <button 
        className={`px-3 py-1 text-xs ${timeRange === '3M' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
        onClick={() => setTimeRange('3M')}
      >
        3M
      </button>
      <button 
        className={`px-3 py-1 text-xs ${timeRange === '6M' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
        onClick={() => setTimeRange('6M')}
      >
        6M
      </button>
      <button 
        className={`px-3 py-1 text-xs ${timeRange === '1Y' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
        onClick={() => setTimeRange('1Y')}
      >
        1Y
      </button>
    </div>
  );
}

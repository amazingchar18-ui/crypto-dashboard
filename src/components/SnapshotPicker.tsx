import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import type { Snapshot } from '../types';

interface SnapshotPickerProps {
  snapshots: Snapshot[];
  currentSnapshotId: string;
  onSnapshotSelect: (snapshotId: string) => void;
  className?: string;
}

export function SnapshotPicker({
  snapshots,
  currentSnapshotId,
  onSnapshotSelect,
  className,
}: SnapshotPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHour, setSelectedHour] = useState<number | undefined>();
  const [selectedMinute, setSelectedMinute] = useState<number | undefined>();

  const currentSnapshot = snapshots.find(s => s.id === currentSnapshotId);
  const latestSnapshot = snapshots[snapshots.length - 1];

  // Initialize selections when opening the picker
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && currentSnapshot) {
      const date = new Date(currentSnapshot.timestamp);
      setSelectedDate(date);
      setSelectedHour(date.getHours());
      setSelectedMinute(date.getMinutes());
    }
  };

  const formatSnapshotDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get available dates that have snapshots
  const getAvailableDates = () => {
    const dates = new Set<string>();
    snapshots.forEach(snapshot => {
      const date = new Date(snapshot.timestamp);
      dates.add(date.toDateString());
    });
    return Array.from(dates).map(d => new Date(d));
  };

  // Get hours available for selected date
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const hours = new Set<number>();
    snapshots.forEach(snapshot => {
      const snapshotDate = new Date(snapshot.timestamp);
      if (snapshotDate.toDateString() === date.toDateString()) {
        hours.add(snapshotDate.getHours());
      }
    });
    return Array.from(hours).sort((a, b) => a - b);
  };

  // Get minutes available for selected date and hour
  const getAvailableMinutes = (date: Date | undefined, hour: number | undefined) => {
    if (!date || hour === undefined) return [];
    const minutes = new Set<number>();
    snapshots.forEach(snapshot => {
      const snapshotDate = new Date(snapshot.timestamp);
      if (
        snapshotDate.toDateString() === date.toDateString() &&
        snapshotDate.getHours() === hour
      ) {
        minutes.add(snapshotDate.getMinutes());
      }
    });
    return Array.from(minutes).sort((a, b) => a - b);
  };

  // Find snapshot by date, hour, and minute
  const findSnapshot = (date: Date | undefined, hour: number | undefined, minute: number | undefined) => {
    if (!date || hour === undefined || minute === undefined) return null;
    
    return snapshots.find(snapshot => {
      const snapshotDate = new Date(snapshot.timestamp);
      return (
        snapshotDate.toDateString() === date.toDateString() &&
        snapshotDate.getHours() === hour &&
        snapshotDate.getMinutes() === minute
      );
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedHour(undefined);
    setSelectedMinute(undefined);
  };

  const handleNow = () => {
    if (latestSnapshot) {
      const date = new Date(latestSnapshot.timestamp);
      setSelectedDate(date);
      setSelectedHour(date.getHours());
      setSelectedMinute(date.getMinutes());
    }
  };

  const handleOk = () => {
    const snapshot = findSnapshot(selectedDate, selectedHour, selectedMinute);
    if (snapshot) {
      onSnapshotSelect(snapshot.id);
      setOpen(false);
      // Reset selections for next time
      setSelectedDate(undefined);
      setSelectedHour(undefined);
      setSelectedMinute(undefined);
    }
  };

  const availableHours = getAvailableHours(selectedDate);
  const availableMinutes = getAvailableMinutes(selectedDate, selectedHour);
  const availableDates = getAvailableDates();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal w-[280px]",
            !currentSnapshot && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentSnapshot ? formatSnapshotDateTime(currentSnapshot.timestamp) : "选择快照时间"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-lg" align="start">
        <div className="flex bg-white">
          {/* Calendar Section */}
          <div className="border-r bg-white">
            <div className="px-4 py-2.5 border-b bg-gray-50">
              <div className="text-xs text-gray-600">
                共 {snapshots.length} 个快照
              </div>
            </div>
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => !availableDates.some(d => d.toDateString() === date.toDateString())}
                initialFocus
                className="p-0"
              />
            </div>
          </div>

          {/* Time Selection Section */}
          <div className="flex">
            {/* Hours */}
            <div className="w-20 border-r bg-gray-50">
              <div className="text-center py-2 border-b text-sm bg-white">小时</div>
              <ScrollArea className="h-[280px]">
                <div className="py-1">
                  {selectedDate ? (
                    availableHours.length > 0 ? (
                      availableHours.map((hour) => (
                        <button
                          key={hour}
                          onClick={() => {
                            setSelectedHour(hour);
                            setSelectedMinute(undefined);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-center text-sm hover:bg-accent transition-colors font-mono",
                            selectedHour === hour && "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                        >
                          {hour.toString().padStart(2, '0')}
                        </button>
                      ))
                    ) : (
                      <div className="text-center text-xs text-gray-400 py-4">无数据</div>
                    )
                  ) : (
                    <div className="text-center text-xs text-gray-400 py-4">请选择日期</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Minutes */}
            <div className="w-20 bg-gray-50">
              <div className="text-center py-2 border-b text-sm bg-white">分钟</div>
              <ScrollArea className="h-[280px]">
                <div className="py-1">
                  {selectedHour !== undefined ? (
                    availableMinutes.length > 0 ? (
                      availableMinutes.map((minute) => (
                        <button
                          key={minute}
                          onClick={() => setSelectedMinute(minute)}
                          className={cn(
                            "w-full px-3 py-2 text-center text-sm hover:bg-accent transition-colors font-mono",
                            selectedMinute === minute && "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                        >
                          {minute.toString().padStart(2, '0')}
                        </button>
                      ))
                    ) : (
                      <div className="text-center text-xs text-gray-400 py-4">无数据</div>
                    )
                  ) : (
                    <div className="text-center text-xs text-gray-400 py-4">请选择小时</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <Button
              variant="link"
              size="sm"
              onClick={handleNow}
              className="text-blue-600 h-auto p-0 hover:underline font-medium"
            >
              Now
            </Button>
            <Button
              size="sm"
              onClick={handleOk}
              disabled={!findSnapshot(selectedDate, selectedHour, selectedMinute)}
              className="px-6"
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

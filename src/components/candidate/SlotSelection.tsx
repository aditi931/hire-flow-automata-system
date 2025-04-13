
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DayContentProps } from 'react-day-picker';
import { addHours, isSunday, isToday, isAfter, startOfDay, format } from 'date-fns';

interface TimeSlot {
  id: string;
  date: Date;
  start: string;
  end: string;
  interviewerId: string;
  jobId: string;
}

// Mock available slots data
const availableSlots: TimeSlot[] = [
  { id: '1', date: new Date(2025, 3, 15), start: '10:00', end: '10:30', interviewerId: 'int1', jobId: 'job1' },
  { id: '2', date: new Date(2025, 3, 15), start: '11:00', end: '11:30', interviewerId: 'int1', jobId: 'job1' },
  { id: '3', date: new Date(2025, 3, 15), start: '14:00', end: '14:30', interviewerId: 'int2', jobId: 'job1' },
  { id: '4', date: new Date(2025, 3, 16), start: '09:30', end: '10:00', interviewerId: 'int2', jobId: 'job1' },
  { id: '5', date: new Date(2025, 3, 16), start: '13:00', end: '13:30', interviewerId: 'int1', jobId: 'job2' },
  { id: '6', date: new Date(2025, 3, 17), start: '11:30', end: '12:00', interviewerId: 'int2', jobId: 'job2' },
  { id: '7', date: new Date(2025, 3, 17), start: '15:30', end: '16:00', interviewerId: 'int1', jobId: 'job1' },
];

const SlotSelection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to check if a date is disabled (past or Sunday)
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isSunday(date) || !isAfter(date, today);
  };
  
  // Filter slots based on current date and validation rules
  const getValidSlots = () => {
    if (!selectedDate) return [];
    
    return availableSlots.filter(slot => {
      // Match the selected date
      const sameDate = 
        slot.date.getDate() === selectedDate.getDate() && 
        slot.date.getMonth() === selectedDate.getMonth() && 
        slot.date.getFullYear() === selectedDate.getFullYear();
      
      if (!sameDate) return false;
      
      // If today, check if slot is at least 1 hour from now
      if (isToday(selectedDate)) {
        const now = new Date();
        const [startHour, startMinute] = slot.start.split(':').map(Number);
        const slotTime = new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate(), 
          startHour, 
          startMinute
        );
        
        return slotTime > addHours(now, 1);
      }
      
      return true;
    });
  };
  
  const filteredSlots = getValidSlots();
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };
  
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };
  
  const handleConfirmSlot = () => {
    if (!selectedSlot) return;
    
    const slot = availableSlots.find(s => s.id === selectedSlot);
    
    toast({
      title: "Interview Scheduled!",
      description: `Your interview is scheduled for ${format(slot?.date as Date, 'EEEE, MMMM d')} at ${slot?.start}-${slot?.end}.`,
      duration: 5000,
    });
    
    // Here is where we would save the booking to a database
    // We would associate the candidate ID with the interview slot
  };
  
  // Custom day renderer to highlight days with available slots
  const dayWithSlotsRenderer = (props: DayContentProps) => {
    const date = props.date;
    if (!date) return <span>{props.date?.getDate()}</span>;
    
    // Don't highlight Sundays or past dates
    if (isDateDisabled(date)) {
      return <span>{date.getDate()}</span>;
    }
    
    const hasSlots = availableSlots.some(slot => {
      if (!slot.date) return false;
      
      return (
        slot.date.getDate() === date.getDate() && 
        slot.date.getMonth() === date.getMonth() && 
        slot.date.getFullYear() === date.getFullYear()
      );
    });
    
    if (hasSlots) {
      return (
        <div className="relative h-8 w-8 p-0 font-normal aria-selected:opacity-100">
          <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-hiring-secondary"></span>
          <span>{date.getDate()}</span>
        </div>
      );
    }
    
    return <span>{date.getDate()}</span>;
  };
  
  const formattedDate = selectedDate ? 
    format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
  
  return (
    <div className="grid md:grid-cols-5 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Select Interview Date</CardTitle>
          <CardDescription>
            Days with available slots are marked with a dot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
            components={{
              DayContent: dayWithSlotsRenderer
            }}
          />
          
          {selectedDate && isSunday(selectedDate) && (
            <div className="mt-4 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Sundays are not available for interviews
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Available Time Slots</CardTitle>
          <CardDescription>
            {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSlots.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>No available slots for this date</p>
              <p className="text-sm mt-2">Please select another date from the calendar</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {filteredSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant="outline"
                    className={`justify-start h-auto py-3 ${
                      selectedSlot === slot.id 
                        ? 'border-hiring-primary border-2 bg-hiring-light' 
                        : ''
                    }`}
                    onClick={() => handleSlotSelect(slot.id)}
                  >
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-hiring-primary" />
                      <div>
                        <p className="font-medium">{slot.start} - {slot.end}</p>
                        <p className="text-xs text-muted-foreground">Interview Slot</p>
                      </div>
                    </div>
                    {selectedSlot === slot.id && (
                      <CheckCircle2 className="h-4 w-4 ml-auto text-hiring-primary" />
                    )}
                  </Button>
                ))}
              </div>
              
              {isToday(selectedDate as Date) && (
                <div className="mb-4 text-sm text-amber-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Only showing time slots that are at least 1 hour from current time
                </div>
              )}
              
              <Separator className="my-4" />
              
              <Button 
                className="w-full bg-hiring-secondary hover:bg-hiring-secondary/90"
                disabled={!selectedSlot}
                onClick={handleConfirmSlot}
              >
                Confirm Selected Time Slot
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotSelection;

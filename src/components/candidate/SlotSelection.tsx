
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  date: Date;
  start: string;
  end: string;
}

// Mock available slots data
const availableSlots: TimeSlot[] = [
  { id: '1', date: new Date(2025, 3, 15), start: '10:00', end: '10:30' },
  { id: '2', date: new Date(2025, 3, 15), start: '11:00', end: '11:30' },
  { id: '3', date: new Date(2025, 3, 15), start: '14:00', end: '14:30' },
  { id: '4', date: new Date(2025, 3, 16), start: '09:30', end: '10:00' },
  { id: '5', date: new Date(2025, 3, 16), start: '13:00', end: '13:30' },
  { id: '6', date: new Date(2025, 3, 17), start: '11:30', end: '12:00' },
  { id: '7', date: new Date(2025, 3, 17), start: '15:30', end: '16:00' },
];

const SlotSelection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredSlots = selectedDate 
    ? availableSlots.filter(slot => 
        slot.date.getDate() === selectedDate.getDate() && 
        slot.date.getMonth() === selectedDate.getMonth() && 
        slot.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };
  
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };
  
  const handleConfirmSlot = () => {
    if (!selectedSlot) return;
    
    const slot = availableSlots.find(s => s.id === selectedSlot);
    
    toast({
      title: "Interview Scheduled!",
      description: `Your interview is scheduled for ${slot?.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${slot?.start}-${slot?.end}.`,
      duration: 5000,
    });
  };
  
  // Custom day renderer to highlight days with available slots
  const dayWithSlotsRenderer = (day: Date) => {
    const hasSlots = availableSlots.some(slot => 
      slot.date.getDate() === day.getDate() && 
      slot.date.getMonth() === day.getMonth() && 
      slot.date.getFullYear() === day.getFullYear()
    );
    
    return hasSlots ? <div className="relative h-8 w-8 p-0 font-normal aria-selected:opacity-100">
      <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-hiring-secondary"></span>
      <span>{day.getDate()}</span>
    </div> : day.getDate();
  };
  
  const formattedDate = selectedDate ? 
    selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '';
  
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
            className="rounded-md border"
            components={{
              DayContent: ({ day }) => dayWithSlotsRenderer(day)
            }}
          />
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

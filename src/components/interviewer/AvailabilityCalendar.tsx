
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { addHours, isSunday, isToday, isAfter, startOfDay, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

const timeOptions = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

const AvailabilityCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("09:30");
  const { toast } = useToast();
  
  // Function to check if a date is disabled (past or Sunday)
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isSunday(date) || !isAfter(date, today);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
    }
  };
  
  const addTimeSlot = () => {
    // Validation: end time must be after start time
    if (timeOptions.indexOf(endTime) <= timeOptions.indexOf(startTime)) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }
    
    // Check if selected date is today and if the time slot is at least 1 hour from now
    if (isToday(selectedDate as Date)) {
      const now = new Date();
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
      
      const oneHourFromNow = addHours(now, 1);
      
      if (slotTime < oneHourFromNow) {
        toast({
          title: "Invalid Time Slot",
          description: "Time slots must be at least 1 hour from current time",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Check for overlapping slots
    const isOverlapping = selectedTimeSlots.some(slot => {
      const existingStart = timeOptions.indexOf(slot.start);
      const existingEnd = timeOptions.indexOf(slot.end);
      const newStart = timeOptions.indexOf(startTime);
      const newEnd = timeOptions.indexOf(endTime);
      
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
    
    if (isOverlapping) {
      toast({
        title: "Overlapping Time Slot",
        description: "This time slot overlaps with an existing slot",
        variant: "destructive",
      });
      return;
    }
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: startTime,
      end: endTime
    };
    
    setSelectedTimeSlots([...selectedTimeSlots, newSlot]);
    
    toast({
      title: "Time Slot Added",
      description: `Added availability for ${format(selectedDate as Date, 'EEEE, MMMM d')} at ${startTime} - ${endTime}`,
    });
    
    // Reset selection to the next 30-minute slot
    const endTimeIndex = timeOptions.indexOf(endTime);
    if (endTimeIndex < timeOptions.length - 1) {
      setStartTime(endTime);
      setEndTime(timeOptions[endTimeIndex + 1]);
    }
  };
  
  const removeTimeSlot = (id: string) => {
    setSelectedTimeSlots(selectedTimeSlots.filter(slot => slot.id !== id));
    toast({
      title: "Time Slot Removed",
      description: "The time slot has been removed from your availability",
    });
  };

  const saveAvailability = () => {
    // Here is where we would save to a database
    // For now, we'll just show a success toast
    toast({
      title: "Availability Saved",
      description: `Your availability has been saved for ${format(selectedDate as Date, 'EEEE, MMMM d')}`,
    });
  };
  
  const formattedDate = selectedDate ? 
    format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
  
  return (
    <div className="grid md:grid-cols-5 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
          
          {selectedDate && isSunday(selectedDate) && (
            <div className="mt-4 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Sundays are not available for interviews
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="md:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Add Available Time Slots for {formattedDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={addTimeSlot} 
              className="mt-4 w-full bg-hiring-primary hover:bg-hiring-primary/90"
              disabled={!selectedDate || isSunday(selectedDate as Date)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Time Slot
            </Button>
            
            {isToday(selectedDate as Date) && (
              <div className="mt-2 text-sm text-amber-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Time slots must be at least 1 hour from current time
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Your Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTimeSlots.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No time slots added for this date
              </div>
            ) : (
              <ul className="space-y-3">
                {selectedTimeSlots
                  .sort((a, b) => timeOptions.indexOf(a.start) - timeOptions.indexOf(b.start))
                  .map((slot) => (
                    <li key={slot.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-hiring-light text-hiring-primary">
                          <Clock className="mr-1 h-3 w-3" /> {slot.start} - {slot.end}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTimeSlot(slot.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
              </ul>
            )}
            <Separator className="my-4" />
            <Button 
              className="w-full bg-hiring-secondary hover:bg-hiring-secondary/90"
              disabled={selectedTimeSlots.length === 0}
              onClick={saveAvailability}
            >
              Save Availability
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

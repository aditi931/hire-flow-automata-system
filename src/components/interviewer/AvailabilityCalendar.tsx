
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2 } from 'lucide-react';

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
  
  const addTimeSlot = () => {
    // Validation: end time must be after start time
    if (timeOptions.indexOf(endTime) <= timeOptions.indexOf(startTime)) {
      alert("End time must be after start time");
      return;
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
      alert("This time slot overlaps with an existing slot");
      return;
    }
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: startTime,
      end: endTime
    };
    
    setSelectedTimeSlots([...selectedTimeSlots, newSlot]);
    
    // Reset selection to the next 30-minute slot
    const endTimeIndex = timeOptions.indexOf(endTime);
    if (endTimeIndex < timeOptions.length - 1) {
      setStartTime(endTime);
      setEndTime(timeOptions[endTimeIndex + 1]);
    }
  };
  
  const removeTimeSlot = (id: string) => {
    setSelectedTimeSlots(selectedTimeSlots.filter(slot => slot.id !== id));
  };
  
  const formattedDate = selectedDate ? 
    selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  
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
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
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
            >
              <Plus className="mr-2 h-4 w-4" /> Add Time Slot
            </Button>
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

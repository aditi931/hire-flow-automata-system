
import React from 'react';
import PageTitle from '@/components/ui/PageTitle';
import SlotSelection from '@/components/candidate/SlotSelection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarClock, Info } from 'lucide-react';

const CandidateSlotSelection: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <PageTitle 
        title="Schedule Your Interview" 
        subtitle="Select a suitable time slot for your interview"
      />
      
      <Alert className="mb-6 bg-hiring-light border-hiring-primary">
        <Info className="h-4 w-4 text-hiring-primary" />
        <AlertTitle>Interview Details</AlertTitle>
        <AlertDescription>
          Your interview for the Frontend Developer position is ready to be scheduled. 
          Please select a date and time slot that works best for you.
        </AlertDescription>
      </Alert>
      
      <SlotSelection />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <CalendarClock className="mr-2 h-5 w-5 text-hiring-primary" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>All interview slots are displayed in your local timezone.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Once confirmed, you will receive a calendar invitation and confirmation email.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>The interview will be conducted via video conference. The link will be provided in the calendar invitation.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>If you need to reschedule, please do so at least 24 hours in advance.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSlotSelection;

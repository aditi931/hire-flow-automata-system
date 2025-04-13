
import React from 'react';
import PageTitle from '@/components/ui/PageTitle';
import AvailabilityCalendar from '@/components/interviewer/AvailabilityCalendar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircle } from 'lucide-react';

const InterviewerAvailability: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <PageTitle 
        title="Interviewer Availability" 
        subtitle="Manage your available time slots for candidate interviews"
      />
      
      <Alert className="mb-6 bg-hiring-light border-hiring-primary">
        <InfoCircle className="h-4 w-4 text-hiring-primary" />
        <AlertDescription>
          Add your availability for upcoming interviews. Candidates will be able to book these slots.
          You can only add slots for future dates, and slots must be at least 1 hour from the current time.
          Sundays are not available for interviews.
        </AlertDescription>
      </Alert>
      
      <AvailabilityCalendar />
    </div>
  );
};

export default InterviewerAvailability;

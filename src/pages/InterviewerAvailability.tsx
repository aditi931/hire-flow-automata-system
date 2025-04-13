
import React from 'react';
import PageTitle from '@/components/ui/PageTitle';
import AvailabilityCalendar from '@/components/interviewer/AvailabilityCalendar';

const InterviewerAvailability: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <PageTitle 
        title="Interviewer Availability" 
        subtitle="Manage your available time slots for candidate interviews"
      />
      
      <AvailabilityCalendar />
    </div>
  );
};

export default InterviewerAvailability;

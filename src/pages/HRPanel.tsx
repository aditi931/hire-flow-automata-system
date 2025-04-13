
import React from 'react';
import PageTitle from '@/components/ui/PageTitle';
import HRTabs from '@/components/hr/HRTabs';

const HRPanel: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <PageTitle 
        title="HR Panel" 
        subtitle="Manage shortlisted candidates, interview invitations, and reschedule requests"
      />
      
      <HRTabs />
    </div>
  );
};

export default HRPanel;

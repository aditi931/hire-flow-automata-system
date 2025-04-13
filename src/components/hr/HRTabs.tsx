
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShortlistedCandidates from './ShortlistedCandidates';
import InterviewMail from './InterviewMail';
import RescheduleRequests from './RescheduleRequests';
import { UserCheck, Mail, CalendarClock } from 'lucide-react';

const HRTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shortlisted');
  
  return (
    <Tabs defaultValue="shortlisted" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="shortlisted" className="flex items-center">
          <UserCheck className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">HR Connect</span>
          <span className="sm:hidden">Connect</span>
        </TabsTrigger>
        <TabsTrigger value="interview-mail" className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Interview Invite</span>
          <span className="sm:hidden">Invite</span>
        </TabsTrigger>
        <TabsTrigger value="reschedule" className="flex items-center">
          <CalendarClock className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Reschedule Requests</span>
          <span className="sm:hidden">Reschedule</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="shortlisted" className="mt-0">
        <ShortlistedCandidates />
      </TabsContent>
      
      <TabsContent value="interview-mail" className="mt-0">
        <InterviewMail />
      </TabsContent>
      
      <TabsContent value="reschedule" className="mt-0">
        <RescheduleRequests />
      </TabsContent>
    </Tabs>
  );
};

export default HRTabs;

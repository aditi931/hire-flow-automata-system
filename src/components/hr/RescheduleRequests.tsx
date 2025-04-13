
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const rescheduleRequests = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    position: 'Frontend Developer',
    currentDate: '2025-04-15',
    currentTime: '10:00 - 10:30',
    requestedDate: '2025-04-17',
    requestedTime: '14:00 - 14:30',
    reason: 'Unexpected conflict with another appointment',
    status: 'pending' as const,
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    position: 'UX Designer',
    currentDate: '2025-04-16',
    currentTime: '14:00 - 14:30',
    requestedDate: '2025-04-18',
    requestedTime: '11:00 - 11:30',
    reason: 'Personal emergency',
    status: 'approved' as const,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    position: 'Backend Developer',
    currentDate: '2025-04-17',
    currentTime: '11:00 - 11:30',
    requestedDate: '2025-04-19',
    requestedTime: '15:30 - 16:00',
    reason: 'Medical appointment',
    status: 'pending' as const,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    position: 'Data Scientist',
    currentDate: '2025-04-15',
    currentTime: '15:30 - 16:00',
    requestedDate: '2025-04-16',
    requestedTime: '09:30 - 10:00',
    reason: 'Travel issues',
    status: 'rejected' as const,
  }
];

const RescheduleRequests: React.FC = () => {
  const { toast } = useToast();
  
  const handleRescheduleAction = (requestId: string, action: 'approve' | 'reject') => {
    const request = rescheduleRequests.find(r => r.id === requestId);
    
    if (action === 'approve') {
      toast({
        title: "Reschedule Request Approved",
        description: `Rescheduled interview for ${request?.name} to ${request?.requestedDate} at ${request?.requestedTime}.`,
      });
    } else {
      toast({
        title: "Reschedule Request Rejected",
        description: `Rejected reschedule request for ${request?.name}.`,
      });
    }
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead className="hidden lg:table-cell">Position</TableHead>
              <TableHead>Current Schedule</TableHead>
              <TableHead>Requested Schedule</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rescheduleRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">{request.email}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{request.position}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {request.currentDate}
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {request.currentTime}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {request.requestedDate}
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {request.requestedTime}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm truncate max-w-[200px]" title={request.reason}>
                    {request.reason}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }
                  >
                    {request.status === 'approved' 
                      ? 'Approved' 
                      : request.status === 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRescheduleAction(request.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleRescheduleAction(request.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RescheduleRequests;

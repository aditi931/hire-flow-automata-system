
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Send, Mail, Check, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const pendingInterviews = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    position: 'Frontend Developer',
    interviewDate: '2025-04-15',
    interviewTime: '10:00 - 10:30',
    mailStatus: 'not_sent' as const,
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    position: 'UX Designer',
    interviewDate: '2025-04-16',
    interviewTime: '14:00 - 14:30',
    mailStatus: 'sent' as const,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    position: 'Backend Developer',
    interviewDate: '2025-04-17',
    interviewTime: '11:00 - 11:30',
    mailStatus: 'not_sent' as const,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    position: 'Data Scientist',
    interviewDate: '2025-04-15',
    interviewTime: '15:30 - 16:00',
    mailStatus: 'sent' as const,
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@example.com',
    position: 'Product Manager',
    interviewDate: '2025-04-16',
    interviewTime: '09:30 - 10:00',
    mailStatus: 'not_sent' as const,
  }
];

const InterviewMail: React.FC = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleSelectAll = () => {
    if (selectedCandidates.length === pendingInterviews.filter(c => c.mailStatus === 'not_sent').length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(
        pendingInterviews
          .filter(c => c.mailStatus === 'not_sent')
          .map(c => c.id)
      );
    }
  };
  
  const handleSelectCandidate = (candidateId: string) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };
  
  const handleSendMail = () => {
    if (selectedCandidates.length === 0) return;
    
    toast({
      title: "Interview Invitation Sent",
      description: `Successfully sent interview invitations to ${selectedCandidates.length} candidate(s).`,
    });
    
    setSelectedCandidates([]);
  };
  
  const handleSendSingleMail = (candidateId: string) => {
    const candidate = pendingInterviews.find(c => c.id === candidateId);
    
    toast({
      title: "Interview Invitation Sent",
      description: `Successfully sent interview invitation to ${candidate?.name}.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={
                      selectedCandidates.length > 0 && 
                      selectedCandidates.length === pendingInterviews.filter(c => c.mailStatus === 'not_sent').length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead className="hidden md:table-cell">Position</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Interview
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInterviews.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    {candidate.mailStatus === 'not_sent' && (
                      <Checkbox 
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => handleSelectCandidate(candidate.id)}
                        aria-label={`Select ${candidate.name}`}
                      />
                    )}
                    {candidate.mailStatus === 'sent' && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {candidate.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.position}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{candidate.interviewDate}</div>
                      <div className="text-sm text-muted-foreground">{candidate.interviewTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={candidate.mailStatus === 'sent' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}
                    >
                      {candidate.mailStatus === 'sent' ? 'Sent' : 'Not Sent'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {candidate.mailStatus === 'not_sent' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-hiring-primary hover:text-hiring-primary/90 hover:bg-hiring-light"
                        onClick={() => handleSendSingleMail(candidate.id)}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedCandidates.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
          <div>
            <span className="font-medium">{selectedCandidates.length} candidate(s) selected</span>
          </div>
          <Button 
            className="bg-hiring-primary hover:bg-hiring-primary/90"
            onClick={handleSendMail}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Interview Invitations
          </Button>
        </div>
      )}
    </div>
  );
};

export default InterviewMail;

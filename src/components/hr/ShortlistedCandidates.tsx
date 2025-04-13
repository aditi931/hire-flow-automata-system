
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
import { Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const shortlistedCandidates = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 234-567-8901',
    position: 'Frontend Developer',
    status: 'pending' as const,
    dateShortlisted: '2025-04-10'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '+1 234-567-8902',
    position: 'UX Designer',
    status: 'contacted' as const,
    dateShortlisted: '2025-04-09'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 234-567-8903',
    position: 'Backend Developer',
    status: 'pending' as const,
    dateShortlisted: '2025-04-08'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 234-567-8904',
    position: 'Data Scientist',
    status: 'contacted' as const,
    dateShortlisted: '2025-04-07'
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1 234-567-8905',
    position: 'Product Manager',
    status: 'pending' as const,
    dateShortlisted: '2025-04-06'
  }
];

const ShortlistedCandidates: React.FC = () => {
  const { toast } = useToast();
  
  const handleAction = (candidateId: string, action: 'contact' | 'skip') => {
    const candidate = shortlistedCandidates.find(c => c.id === candidateId);
    
    if (action === 'contact') {
      toast({
        title: "Candidate Contacted",
        description: `${candidate?.name} has been marked as contacted.`,
      });
    } else {
      toast({
        title: "Candidate Skipped",
        description: `${candidate?.name} has been skipped from the HR connect process.`,
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
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">Date Shortlisted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortlistedCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {candidate.email}
                      </div>
                      <div className="hidden sm:flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {candidate.phone}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{candidate.position}</TableCell>
                <TableCell className="hidden md:table-cell">{candidate.dateShortlisted}</TableCell>
                <TableCell>
                  <Badge 
                    className={candidate.status === 'contacted' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}
                  >
                    {candidate.status === 'contacted' ? 'Contacted' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {candidate.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleAction(candidate.id, 'skip')}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Skip</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleAction(candidate.id, 'contact')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Contact</span>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShortlistedCandidates;

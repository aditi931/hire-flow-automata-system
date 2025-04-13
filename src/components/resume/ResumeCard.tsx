
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink } from 'lucide-react';

interface ResumeCardProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    position: string;
    experience: number;
    skills: string[];
    resumeUrl: string;
    status: 'new' | 'shortlisted' | 'rejected';
  };
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ candidate, onShortlist, onReject }) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.email}</p>
          </div>
          <Badge 
            className={candidate.status === 'shortlisted' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : candidate.status === 'rejected' 
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
          >
            {candidate.status === 'shortlisted' 
              ? 'Shortlisted' 
              : candidate.status === 'rejected' 
                ? 'Rejected' 
                : 'New'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">Position: </span>
            <span className="text-sm">{candidate.position}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium">Experience: </span>
            <span className="text-sm">{candidate.experience} years</span>
          </div>
          
          <div>
            <span className="text-sm font-medium">Skills: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {candidate.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() => window.open(candidate.resumeUrl, '_blank')}
        >
          View Resume <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
        
        <div className="flex gap-2">
          {candidate.status === 'new' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject(candidate.id)}
              >
                <X className="mr-1 h-4 w-4" /> Reject
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => onShortlist(candidate.id)}
              >
                <Check className="mr-1 h-4 w-4" /> Shortlist
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResumeCard;

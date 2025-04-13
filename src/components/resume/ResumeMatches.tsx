import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, User, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { ResumeMatchResult } from '@/utils/resumeMatching';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface ResumeMatchesProps {
  matches: ResumeMatchResult[];
  onShortlist: (ids: string[]) => void;
  onSendEmailToInterviewer: (selectedIds: string[]) => void;
}

const ResumeMatches: React.FC<ResumeMatchesProps> = ({ 
  matches, 
  onShortlist,
  onSendEmailToInterviewer
}) => {
  const { toast } = useToast();
  const [selectedResumes, setSelectedResumes] = React.useState<string[]>([]);

  const handleToggleSelection = (id: string) => {
    setSelectedResumes(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedResumes.length === matches.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(matches.map(match => match.id));
    }
  };

  const handleShortlist = () => {
    if (selectedResumes.length === 0) {
      toast({
        title: "No resumes selected",
        description: "Please select at least one resume to shortlist.",
        variant: "destructive",
      });
      return;
    }
    
    onShortlist(selectedResumes);
    toast({
      title: "Candidates shortlisted",
      description: `${selectedResumes.length} candidates have been shortlisted.`,
    });
  };

  const handleSendEmailToInterviewer = () => {
    if (selectedResumes.length === 0) {
      toast({
        title: "No resumes selected",
        description: "Please select at least one resume to notify interviewers about.",
        variant: "destructive",
      });
      return;
    }
    
    onSendEmailToInterviewer(selectedResumes);
    toast({
      title: "Notification sent",
      description: `Interviewers have been notified about ${selectedResumes.length} candidates.`,
    });
  };

  if (matches.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Matches Available</h3>
          <p className="text-sm text-gray-500">
            Upload resumes and process a job description to see matches.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resume Matches ({matches.length})</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedResumes.length === matches.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleShortlist}
            disabled={selectedResumes.length === 0}
            className="bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Shortlist Selected
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSendEmailToInterviewer}
            disabled={selectedResumes.length === 0}
          >
            <Mail className="h-4 w-4 mr-1" />
            Notify Interviewers
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match) => (
          <Card key={match.id} className={`${match.matchScore >= 70 ? 'border-green-300' : match.matchScore >= 50 ? 'border-yellow-300' : 'border-gray-300'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex gap-2 items-center">
                  <Checkbox 
                    id={`select-${match.id}`}
                    checked={selectedResumes.includes(match.id)}
                    onCheckedChange={() => handleToggleSelection(match.id)}
                  />
                  <CardTitle className="text-lg">{match.fileName}</CardTitle>
                </div>
                <Badge className={`
                  ${match.matchScore >= 70 ? 'bg-green-500' : 
                    match.matchScore >= 50 ? 'bg-yellow-500' : 
                    'bg-gray-500'}
                `}>
                  {match.matchScore}% Match
                </Badge>
              </div>
              <CardDescription>
                {match.matchedKeywords.length} keywords matched
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Experience: {match.relevantExperience} years</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Education: {match.education}</span>
                </div>
                
                <div>
                  <p className="text-sm mb-1">Matched Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {match.matchedKeywords.slice(0, 5).map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {match.matchedKeywords.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{match.matchedKeywords.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Resume viewed",
                      description: `Viewing ${match.fileName}`,
                    });
                  }}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Resume
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    onShortlist([match.id]);
                    toast({
                      title: "Candidate shortlisted",
                      description: `${match.fileName} has been shortlisted.`,
                    });
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Shortlist
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeMatches;

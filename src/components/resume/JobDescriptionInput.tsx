
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Check, FileSpreadsheet } from 'lucide-react';
import { extractRequirementsFromJobDescription } from '@/utils/resumeMatching';

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onSubmit }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedRequirements, setParsedRequirements] = useState<{
    skills: string[];
    experience: number;
    education: boolean;
  } | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (jobDescription.trim().length < 50) {
      toast({
        title: "Description too short",
        description: "Please provide a more detailed job description for better matching.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Parse the job description
      const requirements = extractRequirementsFromJobDescription(jobDescription);
      setParsedRequirements(requirements);
      
      // Process with a simulated delay (for UI feedback)
      setTimeout(() => {
        onSubmit(jobDescription);
        toast({
          title: "Job description processed",
          description: "Your job description has been analyzed for resume matching.",
        });
        setIsAnalyzing(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing job description:", error);
      toast({
        title: "Processing error",
        description: "An error occurred while analyzing the job description.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
      toast({
        title: "Content pasted",
        description: "Job description pasted from clipboard.",
      });
    } catch (err) {
      toast({
        title: "Paste failed",
        description: "Unable to access clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full" id="job-description-section">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Job Description</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePaste}
              className="flex items-center gap-1"
            >
              <Clipboard className="h-4 w-4" />
              <span>Paste</span>
            </Button>
          </div>
          
          <Textarea
            placeholder="Paste the job description here..."
            className="min-h-[200px]"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          
          {parsedRequirements && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <h4 className="font-medium text-sm mb-2">Parsed Requirements:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-start">
                  <span className="font-semibold w-24">Skills:</span>
                  <span className="flex-1">{parsedRequirements.skills.join(', ')}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Experience:</span>
                  <span>{parsedRequirements.experience} years</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Education:</span>
                  <span>{parsedRequirements.education ? 'Required' : 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            <p>For better results, include:</p>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Required skills and technologies</li>
              <li>Education and experience requirements</li>
              <li>Responsibilities and role description</li>
              <li>Any must-have qualifications</li>
            </ul>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isAnalyzing || jobDescription.trim().length < 50}
          >
            {isAnalyzing ? 'Analyzing...' : 'Process Job Description'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;

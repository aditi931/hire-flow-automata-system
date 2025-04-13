
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Check } from 'lucide-react';

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onSubmit }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    
    // Simulate analysis delay
    setTimeout(() => {
      onSubmit(jobDescription);
      toast({
        title: "Job description processed",
        description: "Your job description has been analyzed for resume matching.",
      });
      setIsAnalyzing(false);
    }, 1500);
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
    <Card className="w-full">
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


import React, { useState } from 'react';
import PageTitle from '@/components/ui/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Upload, FileText, Briefcase, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ResumeCard from '@/components/resume/ResumeCard';
import ResumeUpload from '@/components/resume/ResumeUpload';
import JobDescriptionInput from '@/components/resume/JobDescriptionInput';
import ResumeMatches from '@/components/resume/ResumeMatches';
import { 
  extractResumeContent,
  matchResumesToJob,
  ResumeMatchResult,
  extractRequirementsFromJobDescription,
  extractKeywords
} from '@/utils/resumeMatching';
import {
  JobDescription,
  Resume,
  ResumeMatch,
  sendSlotSelectionEmail
} from '@/utils/databaseSchema';

const initialResumes = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    position: 'Frontend Developer',
    experience: 3,
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
    resumeUrl: '#',
    status: 'new' as const,
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    position: 'UX Designer',
    experience: 5,
    skills: ['Figma', 'UI Design', 'User Testing', 'Wireframing', 'Prototyping'],
    resumeUrl: '#',
    status: 'new' as const,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    position: 'Backend Developer',
    experience: 4,
    skills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'API Design'],
    resumeUrl: '#',
    status: 'shortlisted' as const,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    position: 'Data Scientist',
    experience: 2,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics'],
    resumeUrl: '#',
    status: 'new' as const,
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@example.com',
    position: 'Product Manager',
    experience: 6,
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile', 'A/B Testing'],
    resumeUrl: '#',
    status: 'rejected' as const,
  },
  {
    id: '6',
    name: 'Jennifer Parker',
    email: 'jennifer.parker@example.com',
    position: 'Frontend Developer',
    experience: 2,
    skills: ['React', 'Vue', 'CSS', 'JavaScript', 'Responsive Design'],
    resumeUrl: '#',
    status: 'new' as const,
  }
];

const ResumeScreener: React.FC = () => {
  const [resumes, setResumes] = useState(initialResumes);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'shortlisted' | 'rejected'>('all');
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeMatches, setResumeMatches] = useState<ResumeMatchResult[]>([]);
  const [jobRequirements, setJobRequirements] = useState({
    skills: [] as string[],
    experience: 0,
    education: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleShortlist = (id: string) => {
    setResumes(
      resumes.map((resume) =>
        resume.id === id ? { ...resume, status: 'shortlisted' as const } : resume
      )
    );
    
    const candidate = resumes.find(r => r.id === id);
    
    toast({
      title: "Candidate Shortlisted",
      description: `${candidate?.name} has been added to the shortlist.`,
    });
  };
  
  const handleReject = (id: string) => {
    setResumes(
      resumes.map((resume) =>
        resume.id === id ? { ...resume, status: 'rejected' as const } : resume
      )
    );
    
    const candidate = resumes.find(r => r.id === id);
    
    toast({
      title: "Candidate Rejected",
      description: `${candidate?.name} has been rejected.`,
    });
  };
  
  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch = 
      resume.name.toLowerCase().includes(search.toLowerCase()) ||
      resume.position.toLowerCase().includes(search.toLowerCase()) ||
      resume.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && resume.status === activeFilter;
  });
  
  const resumeCountsByStatus = {
    all: resumes.length,
    new: resumes.filter(r => r.status === 'new').length,
    shortlisted: resumes.filter(r => r.status === 'shortlisted').length,
    rejected: resumes.filter(r => r.status === 'rejected').length,
  };
  
  const handleUploadComplete = (files: File[]) => {
    setUploadedFiles(files);
    
    toast({
      title: "Resumes Uploaded",
      description: `${files.length} resumes are ready for processing.`,
    });
  };
  
  const handleProcessJobDescription = (jdText: string) => {
    const requirements = extractRequirementsFromJobDescription(jdText);
    
    setJobRequirements({
      skills: requirements.skills || [],
      experience: requirements.experience || 0,
      education: requirements.education || false
    });
  };
  
  const handleJobDescriptionSubmit = async (description: string) => {
    setJobDescription(description);
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "No resumes uploaded",
        description: "Please upload resumes before processing the job description.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const keywords = extractKeywords(description);
      
      const extractedResumes = await extractResumeContent(uploadedFiles);
      
      const matches = matchResumesToJob(extractedResumes, keywords);
      
      setResumeMatches(matches);
      
      toast({
        title: "Processing complete",
        description: `${matches.length} resume matches found.`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the resumes.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBatchShortlist = (ids: string[]) => {
    toast({
      title: "Candidates Shortlisted",
      description: `${ids.length} candidates have been shortlisted.`,
    });
    
    ids.forEach(id => {
      sendSlotSelectionEmail(id, 'job-1');
    });
  };
  
  const handleNotifyInterviewers = (ids: string[]) => {
    toast({
      title: "Interviewers Notified",
      description: `Interviewers have been notified about ${ids.length} candidates.`,
    });
    
    ids.forEach(id => {
      sendSlotSelectionEmail(id, 'job-1');
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageTitle 
        title="Resume Screener" 
        subtitle="Review and manage candidate applications"
      />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'auto')} className="mb-6">
        <TabsList>
          <TabsTrigger value="manual" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            Manual Screening
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Automated Matching
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by name, position or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
                className={activeFilter === 'all' ? 'bg-hiring-primary hover:bg-hiring-primary/90' : ''}
              >
                All <Badge className="ml-2 bg-white text-gray-600">{resumeCountsByStatus.all}</Badge>
              </Button>
              
              <Button
                variant={activeFilter === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('new')}
                className={activeFilter === 'new' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                New <Badge className="ml-2 bg-white text-gray-600">{resumeCountsByStatus.new}</Badge>
              </Button>
              
              <Button
                variant={activeFilter === 'shortlisted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('shortlisted')}
                className={activeFilter === 'shortlisted' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Shortlisted <Badge className="ml-2 bg-white text-gray-600">{resumeCountsByStatus.shortlisted}</Badge>
              </Button>
              
              <Button
                variant={activeFilter === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('rejected')}
                className={activeFilter === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                Rejected <Badge className="ml-2 bg-white text-gray-600">{resumeCountsByStatus.rejected}</Badge>
              </Button>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {filteredResumes.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  candidate={resume}
                  onShortlist={handleShortlist}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ResumeUpload onUploadComplete={handleUploadComplete} />
            <JobDescriptionInput onSubmit={handleProcessJobDescription} />
          </div>
          
          {isProcessing ? (
            <Card className="w-full mb-6">
              <CardContent className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <div className="mb-4 animate-spin">
                    <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Processing Resumes</h3>
                  <p className="text-sm text-gray-500">
                    Analyzing resumes and matching with job description...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            uploadedFiles.length > 0 && jobDescription && (
              <ResumeMatches 
                matches={resumeMatches} 
                onShortlist={handleBatchShortlist} 
                onSendEmailToInterviewer={handleNotifyInterviewers}
              />
            )
          )}
          
          {!uploadedFiles.length && !jobDescription && (
            <Card className="w-full mb-6">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Get Started</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload resumes and provide a job description to automatically match candidates.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Resumes
                  </Button>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('job-description-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <FileText className="h-4 w-4" />
                    Add Job Description
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeScreener;


import React, { useState } from 'react';
import PageTitle from '@/components/ui/PageTitle';
import ResumeCard from '@/components/resume/ResumeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
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
  
  return (
    <div className="container mx-auto py-6">
      <PageTitle 
        title="Resume Screener" 
        subtitle="Review and manage candidate applications"
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, position or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
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
    </div>
  );
};

export default ResumeScreener;

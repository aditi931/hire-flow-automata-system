
// Simple resume matching algorithm based on keyword matching
// In a real-world application, you might want to use more sophisticated
// NLP techniques or a dedicated service

export interface ResumeMatchResult {
  id: string;
  fileName: string;
  matchScore: number;
  matchedKeywords: string[];
  relevantExperience?: number;
  education?: string;
}

export interface ExtractedResume {
  id: string;
  fileName: string;
  content: string;
  metadata?: {
    experience?: number;
    education?: string;
    skills?: string[];
  };
}

// Extract keywords from job description
export const extractKeywords = (jobDescription: string): string[] => {
  // Normalize text
  const text = jobDescription.toLowerCase();
  
  // Common tech skills and qualifications to look for
  const commonTechSkills = [
    'javascript', 'python', 'java', 'c#', 'c++', 'ruby', 'php', 'typescript',
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops', 'ci/cd',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'oracle', 'database',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui',
    'rest', 'graphql', 'api', 'microservices', 'serverless',
    'git', 'github', 'gitlab', 'bitbucket', 'version control',
    'agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello',
    'ml', 'ai', 'machine learning', 'data science', 'deep learning',
    'mobile', 'android', 'ios', 'swift', 'kotlin', 'flutter', 'react native',
    'testing', 'tdd', 'unit testing', 'integration testing', 'qa', 'quality assurance'
  ];
  
  // Extract years of experience
  const experiencePattern = /(\d+)[\+]?\s*(?:years|yrs|yr)(?:\s*of)?\s*experience/i;
  const experienceMatch = text.match(experiencePattern);
  const yearsRequired = experienceMatch ? parseInt(experienceMatch[1]) : 0;
  
  // Extract education requirements
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'bs', 'ms', 'ba', 'mba'];
  const educationRequired = educationKeywords.some(edu => text.includes(edu));
  
  // Find which common tech skills are mentioned in the job description
  const mentionedSkills = commonTechSkills.filter(skill => text.includes(skill));
  
  // Extract custom keywords that might be specific to the job
  // Look for words that appear after "experience with" or "knowledge of"
  const customKeywordPatterns = [
    /experience (?:with|in) ([\w\s,\/\-\+]+?)(?:\.|\,|\;|\n)/gi,
    /knowledge of ([\w\s,\/\-\+]+?)(?:\.|\,|\;|\n)/gi,
    /familiarity with ([\w\s,\/\-\+]+?)(?:\.|\,|\;|\n)/gi,
    /proficient in ([\w\s,\/\-\+]+?)(?:\.|\,|\;|\n)/gi
  ];
  
  let customKeywords: string[] = [];
  customKeywordPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const keywordText = match[1].trim();
      // Split by commas or 'and'
      const keywords = keywordText
        .split(/,|\sand\s/)
        .map(k => k.trim())
        .filter(k => k.length > 0);
      customKeywords = [...customKeywords, ...keywords];
    }
  });
  
  // Combine all keywords, filtering out duplicates
  const allKeywords = [...new Set([...mentionedSkills, ...customKeywords])];
  
  return {
    skills: allKeywords,
    experience: yearsRequired,
    education: educationRequired
  };
};

// Mock function to simulate extracting content from uploaded files
export const extractResumeContent = async (files: File[]): Promise<ExtractedResume[]> => {
  // In a real application, you would use a parser library or service
  // This is just a simulation
  return Promise.all(files.map(async (file, index) => {
    // Simulate parsing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a mock extracted content
    return {
      id: `resume-${index}`,
      fileName: file.name,
      content: `Sample content for ${file.name}`,
      metadata: {
        experience: Math.floor(Math.random() * 10) + 1, // 1-10 years
        education: ['High School', 'Bachelor\'s', 'Master\'s', 'PhD'][Math.floor(Math.random() * 4)],
        skills: [
          'JavaScript', 'React', 'TypeScript', 'HTML', 'CSS',
          'Python', 'Java', 'SQL', 'Node.js', 'Express'
        ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 3)
      }
    };
  }));
};

// Match resumes against job description keywords
export const matchResumesToJob = (
  resumes: ExtractedResume[],
  jobKeywords: {
    skills: string[];
    experience: number;
    education: boolean;
  }
): ResumeMatchResult[] => {
  return resumes.map(resume => {
    // Calculate matched keywords
    const matchedKeywords = jobKeywords.skills.filter(keyword => 
      resume.content.toLowerCase().includes(keyword.toLowerCase()) ||
      resume.metadata?.skills?.some(skill => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // Calculate match score (0-100)
    let matchScore = 0;
    
    // Score based on keywords match (up to 60 points)
    const keywordScore = matchedKeywords.length / jobKeywords.skills.length;
    matchScore += Math.min(keywordScore * 60, 60);
    
    // Score based on experience (up to 30 points)
    if (resume.metadata?.experience !== undefined && jobKeywords.experience > 0) {
      const experienceRatio = resume.metadata.experience / jobKeywords.experience;
      matchScore += Math.min(experienceRatio * 30, 30);
    }
    
    // Score based on education (up to 10 points)
    if (jobKeywords.education && resume.metadata?.education) {
      const educationLevels = {
        'High School': 1,
        'Bachelor\'s': 2,
        'Master\'s': 3,
        'PhD': 4
      };
      
      const eduLevel = educationLevels[resume.metadata.education as keyof typeof educationLevels] || 0;
      matchScore += Math.min(eduLevel * 2.5, 10);
    }
    
    return {
      id: resume.id,
      fileName: resume.fileName,
      matchScore: Math.round(matchScore),
      matchedKeywords,
      relevantExperience: resume.metadata?.experience,
      education: resume.metadata?.education
    };
  }).sort((a, b) => b.matchScore - a.matchScore); // Sort by highest match score
};


import { extractKeywords } from "./keywordExtraction";

export interface ResumeMatchResult {
  id: string;
  fileName: string;
  matchScore: number;
  matchedKeywords: string[];
  relevantExperience: number;
  education: string;
  skills: string[];
  keyPoints: string[];
}

// Function to extract content from uploaded resume files
export const extractResumeContent = async (files: File[]): Promise<any[]> => {
  // In a real application, this would use a PDF parsing library
  // For this demo, we'll return mock data
  
  return Promise.resolve(files.map((file, index) => {
    return {
      id: `resume-${index + 1}`,
      fileName: file.name,
      text: `Mock resume content for ${file.name}. This would contain experience details, education, and skills.
        Experience: 3 years of software development
        Education: Bachelor's in Computer Science
        Skills: JavaScript, React, TypeScript, Node.js, Express, MongoDB`,
      keyPoints: [
        "3 years of software development experience",
        "Bachelor's in Computer Science",
        "Proficient in JavaScript, React, TypeScript",
        "Experience with Node.js, Express, MongoDB"
      ]
    };
  }));
};

// Function to extract job requirements from a job description
export const extractRequirementsFromJobDescription = (jobDescription: string) => {
  // Extract skills using keyword extraction
  const skills = extractKeywords(jobDescription);
  
  // Look for experience hints
  let experience = 0;
  const experienceRegex = /(\d+)\s*(?:year|years)\s*(?:of)?\s*experience/i;
  const experienceMatch = jobDescription.match(experienceRegex);
  if (experienceMatch && experienceMatch[1]) {
    experience = parseInt(experienceMatch[1]);
  }
  
  // Look for education hints
  let education = false;
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'diploma'];
  education = educationKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword));
  
  return {
    skills,
    experience,
    education
  };
};

// Function to match resumes against job description
export const matchResumesToJob = (
  resumes: any[],
  jobRequirements: string[]
): ResumeMatchResult[] => {
  return resumes.map(resume => {
    const text = resume.text.toLowerCase();
    const matchedKeywords = jobRequirements.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    // Calculate match score
    const matchScore = Math.round(
      (matchedKeywords.length / jobRequirements.length) * 100
    );
    
    // Extract experience
    let experience = 0;
    const experienceRegex = /(\d+)\s*(?:year|years)\s*(?:of)?\s*experience/i;
    const experienceMatch = text.match(experienceRegex);
    if (experienceMatch && experienceMatch[1]) {
      experience = parseInt(experienceMatch[1]);
    }
    
    // Extract education
    let education = "Not specified";
    const educationKeywords = {
      "bachelor": "Bachelor's Degree",
      "master": "Master's Degree",
      "phd": "PhD",
      "diploma": "Diploma",
      "degree": "Degree"
    };
    
    for (const [key, value] of Object.entries(educationKeywords)) {
      if (text.includes(key)) {
        education = value;
        break;
      }
    }
    
    // Extract skills (simplified)
    const skills = extractKeywords(text);
    
    return {
      id: resume.id,
      fileName: resume.fileName,
      matchScore,
      matchedKeywords,
      relevantExperience: experience,
      education,
      skills,
      keyPoints: resume.keyPoints
    };
  });
};

// Function to match a resume against job description requirements
export const matchResumeToJob = (resumeData: {
  text: string;
  keyPoints: string[];
}, jobRequirements: {
  skills: string[];
  experience: number;
  education: boolean;
}) => {
  // Normalize text for case-insensitive matching
  const resumeText = resumeData.text.toLowerCase();
  
  // Match skills
  const matchedSkills = jobRequirements.skills.filter(skill => 
    resumeText.includes(skill.toLowerCase())
  );
  
  // Calculate skills match percentage
  const skillsMatchPercentage = Math.round(
    (matchedSkills.length / jobRequirements.skills.length) * 100
  );
  
  // Look for experience hints
  let hasExperience = false;
  const experienceRegex = new RegExp(`\\b${jobRequirements.experience}\\+?\\s+years?\\b`, 'i');
  hasExperience = experienceRegex.test(resumeText);
  
  // Look for education hints if required
  let hasEducation = false;
  if (jobRequirements.education) {
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'diploma'];
    hasEducation = educationKeywords.some(keyword => resumeText.includes(keyword));
  }
  
  // Calculate overall match score (weighted)
  const overallScore = Math.round(
    (skillsMatchPercentage * 0.6) + 
    (hasExperience ? 30 : 0) + 
    (hasEducation ? 10 : 0)
  );
  
  return {
    score: overallScore,
    matchedSkills,
    skillsMatchPercentage,
    hasExperience,
    hasEducation,
    keyPoints: resumeData.keyPoints
  };
};

// Function to rank resumes based on match score
export const rankResumes = (resumes: any[]) => {
  // Sort resumes by match score in descending order
  return resumes.sort((a, b) => b.score - a.score);
};

// Re-export extractKeywords for backwards compatibility
export { extractKeywords } from "./keywordExtraction";

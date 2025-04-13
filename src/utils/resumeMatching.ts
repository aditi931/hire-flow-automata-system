import { extractKeywords } from "./keywordExtraction";

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

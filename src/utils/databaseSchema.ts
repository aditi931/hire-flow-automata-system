
// This file defines the database schema for the hiring system
// In a real application, this would be implemented in an actual database

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'interviewer' | 'hr' | 'admin';
  created_at: Date;
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  location: string;
  salary_range?: string;
  created_at: Date;
  created_by: string; // User ID
  status: 'active' | 'closed' | 'draft';
  interviewers: string[]; // Array of interviewer IDs assigned to this JD
}

export interface JobRequirements {
  id: string;
  job_id: string; // References JobDescription.id
  skills: string[];
  experience: number;
  education: boolean;
  embedding?: number[]; // For vector search
}

export interface Resume {
  id: string;
  candidate_id: string; // References User.id
  file_name: string;
  file_url: string;
  content: string; // Extracted text from resume
  key_points: string[];
  skills: string[];
  experience: number;
  education: string;
  embedding?: number[]; // For vector search
  created_at: Date;
}

export interface ResumeMatch {
  id: string;
  resume_id: string; // References Resume.id
  job_id: string; // References JobDescription.id
  match_score: number;
  matched_keywords: string[];
  status: 'new' | 'shortlisted' | 'rejected' | 'interviewed';
  created_at: Date;
}

export interface InterviewerAvailability {
  id: string;
  interviewer_id: string; // References User.id with role 'interviewer'
  job_id: string; // References JobDescription.id
  date: Date;
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
  status: 'available' | 'booked' | 'cancelled';
  created_at: Date;
}

export interface Interview {
  id: string;
  candidate_id: string; // References User.id with role 'candidate'
  interviewer_id: string; // References User.id with role 'interviewer'
  job_id: string; // References JobDescription.id
  resume_id: string; // References Resume.id
  availability_id: string; // References InterviewerAvailability.id
  date: Date;
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: string;
  rating?: number;
  created_at: Date;
}

export interface EmailNotification {
  id: string;
  recipient_id: string; // References User.id
  subject: string;
  body: string;
  type: 'interview_invitation' | 'slot_selection' | 'reschedule' | 'cancellation' | 'reminder';
  related_id?: string; // Can reference Interview.id, JobDescription.id, etc.
  status: 'pending' | 'sent' | 'failed';
  sent_at?: Date;
  created_at: Date;
}

// Mock database functions (in a real app, these would connect to a real database)

// Sample in-memory database
const db = {
  users: [] as User[],
  job_descriptions: [] as JobDescription[],
  job_requirements: [] as JobRequirements[],
  resumes: [] as Resume[],
  resume_matches: [] as ResumeMatch[],
  interviewer_availabilities: [] as InterviewerAvailability[],
  interviews: [] as Interview[],
  email_notifications: [] as EmailNotification[]
};

// Get all interviewers for a specific job
export const getInterviewersForJob = (jobId: string): User[] => {
  const job = db.job_descriptions.find(jd => jd.id === jobId);
  if (!job) return [];
  
  return db.users.filter(user => 
    user.role === 'interviewer' && job.interviewers.includes(user.id)
  );
};

// Get available slots for a job
export const getAvailableSlotsForJob = (jobId: string): InterviewerAvailability[] => {
  return db.interviewer_availabilities.filter(
    slot => slot.job_id === jobId && slot.status === 'available'
  );
};

// Get shortlisted candidates for a job
export const getShortlistedCandidatesForJob = (jobId: string): User[] => {
  const shortlistedMatches = db.resume_matches.filter(
    match => match.job_id === jobId && match.status === 'shortlisted'
  );
  
  const resumeIds = shortlistedMatches.map(match => match.resume_id);
  const candidateIds = db.resumes
    .filter(resume => resumeIds.includes(resume.id))
    .map(resume => resume.candidate_id);
  
  return db.users.filter(user => candidateIds.includes(user.id));
};

// Schedule an interview
export const scheduleInterview = (
  candidateId: string,
  interviewerId: string,
  jobId: string,
  resumeId: string,
  availabilityId: string,
  date: Date,
  startTime: string,
  endTime: string
): Interview => {
  // Mark availability as booked
  const availabilityIndex = db.interviewer_availabilities.findIndex(
    slot => slot.id === availabilityId
  );
  
  if (availabilityIndex !== -1) {
    db.interviewer_availabilities[availabilityIndex].status = 'booked';
  }
  
  // Create interview record
  const interview: Interview = {
    id: `interview-${db.interviews.length + 1}`,
    candidate_id: candidateId,
    interviewer_id: interviewerId,
    job_id: jobId,
    resume_id: resumeId,
    availability_id: availabilityId,
    date,
    start_time: startTime,
    end_time: endTime,
    status: 'scheduled',
    created_at: new Date()
  };
  
  db.interviews.push(interview);
  
  // Create email notification
  const candidate = db.users.find(user => user.id === candidateId);
  if (candidate) {
    const notification: EmailNotification = {
      id: `email-${db.email_notifications.length + 1}`,
      recipient_id: candidateId,
      subject: 'Interview Scheduled',
      body: `Your interview has been scheduled for ${date.toDateString()} at ${startTime}.`,
      type: 'interview_invitation',
      related_id: interview.id,
      status: 'pending',
      created_at: new Date()
    };
    
    db.email_notifications.push(notification);
  }
  
  return interview;
};

// Send slot selection email to candidate
export const sendSlotSelectionEmail = (
  candidateId: string,
  jobId: string
): EmailNotification => {
  const job = db.job_descriptions.find(jd => jd.id === jobId);
  const candidate = db.users.find(user => user.id === candidateId);
  
  if (!job || !candidate) {
    throw new Error('Job or candidate not found');
  }
  
  const notification: EmailNotification = {
    id: `email-${db.email_notifications.length + 1}`,
    recipient_id: candidateId,
    subject: `Interview Slot Selection for ${job.title}`,
    body: `Please select a time slot for your interview for the ${job.title} position.`,
    type: 'slot_selection',
    related_id: jobId,
    status: 'pending',
    created_at: new Date()
  };
  
  db.email_notifications.push(notification);
  return notification;
};

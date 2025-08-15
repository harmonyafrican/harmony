const API_BASE_URL = 'http://localhost:5000/api';

// Import program types
import { type Program } from './programsApi';

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  timeCommitment: string;
  location: string;
  contactEmail: string;
  isActive: boolean;
  spotsAvailable?: number;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  // Additional frontend fields for categorization and display
  category?: string;
  skills?: string[];
  impact?: string;
  color?: string;
  // Program linkage
  programId?: string;
  program?: Program;
}

export interface ProgramVolunteerRole {
  id: string;
  programId: string;
  program: Program;
  title: string;
  description: string;
  requirements: string[];
  timeCommitment: string;
  spotsNeeded: number;
  spotsAvailable: number;
  category: string;
  skills: string[];
  impact: string;
  color: string;
}

export interface VolunteerApplication {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  skills: string[];
  availability: string;
  motivation: string;
  // Program-specific application fields
  programId?: string;
  opportunityId?: string;
  preferredRole?: string;
  // Admin fields
  status?: 'pending' | 'approved' | 'rejected' | 'contacted';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  assignedTo?: string;
  interviewDate?: string;
  backgroundCheck?: 'pending' | 'completed' | 'failed' | 'not_required';
  createdAt?: string | { _seconds: number; _nanoseconds: number; };
  updatedAt?: string | { _seconds: number; _nanoseconds: number; };
  score?: number; // 1-10 rating
}

export interface VolunteerStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  contacted: number;
  activeOpportunities: number;
  totalSkills: number;
}

class VolunteerApiService {
  async getVolunteerOpportunities(): Promise<VolunteerOpportunity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/volunteer/opportunities`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch volunteer opportunities');
      }
      
      return result.data;
    } catch (error) {
      console.error('Volunteer Opportunities API Error:', error);
      throw error;
    }
  }

  async getProgramVolunteerRoles(): Promise<ProgramVolunteerRole[]> {
    try {
      // First fetch programs
      const programsResponse = await fetch(`${API_BASE_URL}/programs`);
      
      if (!programsResponse.ok) {
        throw new Error(`HTTP error! status: ${programsResponse.status}`);
      }
      
      const programsResult = await programsResponse.json();
      
      if (!programsResult.success) {
        throw new Error(programsResult.error?.message || 'Failed to fetch programs');
      }
      
      const programs: Program[] = programsResult.data;
      
      // Generate volunteer roles for each program
      const volunteerRoles: ProgramVolunteerRole[] = [];
      
      programs.forEach(program => {
        const programRoles = this.generateVolunteerRolesForProgram(program);
        volunteerRoles.push(...programRoles);
      });
      
      return volunteerRoles;
    } catch (error) {
      console.error('Program Volunteer Roles API Error:', error);
      throw error;
    }
  }

  private generateVolunteerRolesForProgram(program: Program): ProgramVolunteerRole[] {
    const roles: ProgramVolunteerRole[] = [];
    const programCategory = this.mapProgramToVolunteerCategory(program.category);
    const baseColor = getCategoryColor(programCategory);
    
    // Generate different volunteer roles based on program type
    if (program.category === 'education') {
      roles.push({
        id: `${program.id}-tutor`,
        programId: program.id,
        program,
        title: `${program.title} - Learning Tutor`,
        description: `Provide tutoring support and academic guidance for participants in ${program.title}. Help students with homework, exam preparation, and skill development.`,
        requirements: [
          'Background in education or relevant subject area',
          'Patience and excellent communication skills',
          'Commitment to program duration',
          'Available during program hours'
        ],
        timeCommitment: '4-6 hours per week during program duration',
        spotsNeeded: 8,
        spotsAvailable: 8,
        category: 'Education',
        skills: ['Teaching', 'Mentoring', 'Subject Expertise'],
        impact: `Support ${program.participants || '50+'} students in their learning journey`,
        color: baseColor
      });
      
      roles.push({
        id: `${program.id}-mentor`,
        programId: program.id,
        program,
        title: `${program.title} - Program Mentor`,
        description: `Mentor participants in ${program.title}, providing guidance on academic pathways, career development, and personal growth.`,
        requirements: [
          'University degree or equivalent experience',
          'Strong interpersonal skills',
          'Experience in mentoring or coaching',
          'Long-term commitment to mentoring relationship'
        ],
        timeCommitment: '3-4 hours per week, ongoing',
        spotsNeeded: 5,
        spotsAvailable: 5,
        category: 'Education',
        skills: ['Mentoring', 'Career Guidance', 'Personal Development'],
        impact: `Guide ${Math.floor(parseInt(program.participants?.replace(/\D/g, '') || '20') / 4)} students through their academic journey`,
        color: baseColor
      });
    }
    
    if (program.category === 'technology' || program.title.toLowerCase().includes('tech') || program.title.toLowerCase().includes('innovation')) {
      roles.push({
        id: `${program.id}-instructor`,
        programId: program.id,
        program,
        title: `${program.title} - Tech Instructor`,
        description: `Teach programming, digital skills, and technology concepts to participants in ${program.title}. Lead workshops and hands-on coding sessions.`,
        requirements: [
          'Proficiency in programming languages (Python, JavaScript, etc.)',
          'Experience in teaching or training',
          'Passion for technology education',
          'Weekend availability preferred'
        ],
        timeCommitment: '6-8 hours per week during program',
        spotsNeeded: 6,
        spotsAvailable: 6,
        category: 'Technology',
        skills: ['Programming', 'Teaching', 'Web Development', 'Digital Literacy'],
        impact: `Train ${program.participants || '30+'} youth in essential tech skills`,
        color: baseColor
      });
      
      roles.push({
        id: `${program.id}-mentor-tech`,
        programId: program.id,
        program,
        title: `${program.title} - Innovation Mentor`,
        description: `Support participants in ${program.title} with innovation projects, startup ideas, and entrepreneurship guidance.`,
        requirements: [
          'Experience in innovation or entrepreneurship',
          'Understanding of startup ecosystem',
          'Project management skills',
          'Flexible schedule for mentoring sessions'
        ],
        timeCommitment: '4-5 hours per week, flexible',
        spotsNeeded: 4,
        spotsAvailable: 4,
        category: 'Technology',
        skills: ['Innovation', 'Entrepreneurship', 'Project Management'],
        impact: `Guide innovation projects and startup development`,
        color: baseColor
      });
    }
    
    if (program.title.toLowerCase().includes('talent') || program.title.toLowerCase().includes('arts') || program.title.toLowerCase().includes('creative')) {
      roles.push({
        id: `${program.id}-facilitator`,
        programId: program.id,
        program,
        title: `${program.title} - Creative Arts Facilitator`,
        description: `Lead creative workshops and arts sessions for ${program.title}. Help participants explore and develop their artistic talents.`,
        requirements: [
          'Background in arts, music, or creative fields',
          'Experience working with youth',
          'Cultural sensitivity and creativity',
          'Flexible schedule for workshops'
        ],
        timeCommitment: '3-5 hours per week during program',
        spotsNeeded: 6,
        spotsAvailable: 6,
        category: 'Arts & Culture',
        skills: ['Arts', 'Music', 'Creative Expression', 'Workshop Facilitation'],
        impact: `Nurture artistic talents in ${program.participants || '40+'} young people`,
        color: baseColor
      });
    }
    
    if (program.title.toLowerCase().includes('community') || program.category === 'community_development') {
      roles.push({
        id: `${program.id}-coordinator`,
        programId: program.id,
        program,
        title: `${program.title} - Community Coordinator`,
        description: `Coordinate community activities and outreach for ${program.title}. Connect families with program resources and services.`,
        requirements: [
          'Strong community connections',
          'Excellent communication skills',
          'Knowledge of local communities',
          'Transportation available'
        ],
        timeCommitment: '5-7 hours per week throughout program',
        spotsNeeded: 8,
        spotsAvailable: 8,
        category: 'Community Development',
        skills: ['Community Outreach', 'Communication', 'Cultural Awareness'],
        impact: `Connect ${program.participants || '100+'} families with essential resources`,
        color: baseColor
      });
    }
    
    // Add general support role for all programs
    roles.push({
      id: `${program.id}-support`,
      programId: program.id,
      program,
      title: `${program.title} - Program Support Volunteer`,
      description: `Provide general support for ${program.title} including logistics, administrative tasks, and participant assistance.`,
      requirements: [
        'Strong organizational skills',
        'Enthusiasm for community impact',
        'Reliable and punctual',
        'Team collaboration skills'
      ],
      timeCommitment: '4-6 hours per week during program',
      spotsNeeded: 10,
      spotsAvailable: 10,
      category: this.mapProgramToVolunteerCategory(program.category),
      skills: ['Organization', 'Administration', 'Communication'],
      impact: `Support overall success of ${program.title}`,
      color: baseColor
    });
    
    return roles;
  }

  private mapProgramToVolunteerCategory(programCategory: string): string {
    switch (programCategory) {
      case 'education': return 'Education';
      case 'community_development': return 'Community Development';
      case 'technology': return 'Technology';
      case 'environment': return 'Environment';
      case 'healthcare': return 'Healthcare';
      default: return 'General';
    }
  }

  async submitVolunteerApplication(application: VolunteerApplication): Promise<{ applicationId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/volunteer/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to submit volunteer application');
      }

      return result.data;
    } catch (error) {
      console.error('Volunteer Application Submission Error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllVolunteerApplications(): Promise<VolunteerApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/volunteers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch volunteer applications');
      }
      
      // Transform data for admin interface
      const transformedData = result.data.map((application: any) => {
        const createdDate = application.createdAt ? 
          (typeof application.createdAt === 'string' ? application.createdAt : this.convertFirestoreTimestamp(application.createdAt)) : 
          new Date().toISOString();

        return {
          ...application,
          createdAt: createdDate,
          status: application.status || 'pending',
          priority: application.priority || 'medium',
          backgroundCheck: application.backgroundCheck || 'not_required',
          score: application.score || Math.floor(Math.random() * 5) + 6 // Random score 6-10 for demo
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Volunteer Applications API Error:', error);
      throw error;
    }
  }

  async updateVolunteerStatus(applicationId: string, status: string, notes?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/volunteers/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update volunteer status');
      }
    } catch (error) {
      console.error('Update Volunteer Status Error:', error);
      throw error;
    }
  }

  async updateVolunteerPriority(applicationId: string, priority: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/volunteers/${applicationId}/priority`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update volunteer priority');
      }
    } catch (error) {
      console.error('Update Volunteer Priority Error:', error);
      throw error;
    }
  }

  async deleteVolunteerApplication(applicationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/volunteers/${applicationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete volunteer application');
      }
    } catch (error) {
      console.error('Delete Volunteer Application Error:', error);
      throw error;
    }
  }

  async createVolunteerOpportunity(opportunityData: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VolunteerOpportunity> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/volunteer-opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opportunityData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create volunteer opportunity');
      }

      return result.data;
    } catch (error) {
      console.error('Create Volunteer Opportunity Error:', error);
      throw error;
    }
  }

  private convertFirestoreTimestamp(timestamp: { _seconds: number; _nanoseconds: number }): string {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
  }
}

export const volunteerApi = new VolunteerApiService();

// Helper function to convert Firestore timestamp to Date
export const convertFirestoreTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

// Helper function to format date
export const formatDate = (dateString: string | { _seconds: number; _nanoseconds: number }) => {
  let date: Date;
  
  if (typeof dateString === 'string') {
    date = new Date(dateString);
  } else {
    date = convertFirestoreTimestamp(dateString);
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to categorize opportunities based on title/description
export const categorizeOpportunity = (title: string, description: string): string => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  if (titleLower.includes('education') || titleLower.includes('tutor') || titleLower.includes('mentor')) {
    return 'Education';
  }
  if (titleLower.includes('tech') || titleLower.includes('coding') || titleLower.includes('digital')) {
    return 'Technology';
  }
  if (titleLower.includes('art') || titleLower.includes('creative') || titleLower.includes('music')) {
    return 'Arts & Culture';
  }
  if (titleLower.includes('community') || titleLower.includes('outreach')) {
    return 'Community Development';
  }
  if (titleLower.includes('event') || titleLower.includes('workshop') || titleLower.includes('program')) {
    return 'Events & Programs';
  }
  if (titleLower.includes('media') || titleLower.includes('marketing') || titleLower.includes('communication')) {
    return 'Communications';
  }
  
  return 'General';
};

// Helper function to assign colors based on category
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Education': return 'from-blue-400 to-blue-600';
    case 'Technology': return 'from-purple-400 to-purple-600';
    case 'Arts & Culture': return 'from-pink-400 to-rose-600';
    case 'Community Development': return 'from-green-400 to-emerald-600';
    case 'Events & Programs': return 'from-amber-400 to-orange-600';
    case 'Communications': return 'from-indigo-400 to-blue-600';
    default: return 'from-gray-400 to-gray-600';
  }
};
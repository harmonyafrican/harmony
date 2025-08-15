const API_BASE_URL = 'http://localhost:5000/api';

export interface Program {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'education' | 'healthcare' | 'community_development' | 'environment' | 'other';
  status: 'active' | 'completed' | 'paused' | 'draft' | 'archived';
  startDate: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  endDate?: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  budget?: number | {
    total: number;
    currency: string;
    usdEquivalent: number;
    breakdown?: Record<string, number>;
  };
  beneficiaries?: number;
  location: string;
  images?: string[];
  duration: string;
  ageGroup: string;
  features: string[];
  color: string;
  bgColor?: string;
  participants: string;
  successRate: string;
  donationTiers: Array<{
    amount: number;
    impact: string;
    icon: string;
  }>;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  applicationCount?: number;
  donationCount?: number;
  totalDonations?: number;
  partnerships?: string[];
  proposedDates?: string;
  dailySchedule?: Record<string, any>;
  createdAt: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: string | {
    _seconds: number;
    _nanoseconds: number;
  };
  // Admin fields
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  managedBy?: string;
  progress?: number; // 0-100 percentage
  fundingGoal?: number;
  fundingRaised?: number;
  impactScore?: number; // 1-10 rating
}

export interface ProgramStats {
  total: number;
  active: number;
  completed: number;
  paused: number;
  draft: number;
  totalBeneficiaries: number;
  totalBudget: number;
  avgSuccessRate: number;
}

class ProgramsApiService {
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/programs`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch programs');
      }
      
      return result.data;
    } catch (error) {
      console.error('Programs API Error:', error);
      throw error;
    }
  }

  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string): Promise<{ subscriberId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          preferences: {
            newsletter: true,
            events: false,
            programs: true,
            volunteering: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Subscription failed');
      }

      return result.data;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllPrograms(): Promise<Program[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch all programs');
      }
      
      // Transform data for admin interface
      const transformedData = result.data.map((program: any) => {
        const startDate = program.startDate ? 
          (typeof program.startDate === 'string' ? program.startDate : this.convertFirestoreTimestamp(program.startDate)) : 
          new Date().toISOString();
        
        const createdDate = program.createdAt ? 
          (typeof program.createdAt === 'string' ? program.createdAt : this.convertFirestoreTimestamp(program.createdAt)) : 
          new Date().toISOString();

        return {
          ...program,
          startDate: startDate,
          createdAt: createdDate,
          status: program.status || 'draft',
          priority: program.priority || 'medium',
          progress: program.progress || Math.floor(Math.random() * 100),
          fundingGoal: program.budget?.total || program.budget || 50000,
          fundingRaised: program.totalDonations || Math.floor(Math.random() * 30000),
          impactScore: program.impactScore || Math.floor(Math.random() * 3) + 8, // 8-10 score
          managedBy: program.managedBy || 'Program Manager'
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Programs API Error:', error);
      throw error;
    }
  }

  async updateProgramStatus(programId: string, status: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs/${programId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update program status');
      }
    } catch (error) {
      console.error('Update Program Status Error:', error);
      throw error;
    }
  }

  async updateProgramPriority(programId: string, priority: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs/${programId}/priority`, {
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
        throw new Error(result.error?.message || 'Failed to update program priority');
      }
    } catch (error) {
      console.error('Update Program Priority Error:', error);
      throw error;
    }
  }

  async createProgram(programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create program');
      }
      
      return result.data;
    } catch (error) {
      console.error('Create Program Error:', error);
      throw error;
    }
  }

  async updateProgram(programId: string, programData: Partial<Omit<Program, 'id' | 'createdAt'>>): Promise<Program> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update program');
      }
      
      return result.data;
    } catch (error) {
      console.error('Update Program Error:', error);
      throw error;
    }
  }

  async deleteProgram(programId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs/${programId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete program');
      }
    } catch (error) {
      console.error('Delete Program Error:', error);
      throw error;
    }
  }

  private convertFirestoreTimestamp(timestamp: { _seconds: number; _nanoseconds: number }): string {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
  }
}

export const programsApi = new ProgramsApiService();

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

// Helper function to format budget
export const formatBudget = (budget?: number | { total: number; currency: string; usdEquivalent: number }) => {
  if (!budget) return 'TBD';
  
  if (typeof budget === 'number') {
    return `$${budget.toLocaleString()}`;
  }
  
  return `${budget.currency} ${budget.total.toLocaleString()} ($${budget.usdEquivalent.toLocaleString()})`;
};
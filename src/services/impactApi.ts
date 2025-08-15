const API_BASE_URL = 'http://localhost:5000/api';

export interface ImpactMetric {
  id: string;
  number: string;
  label: string;
  category: 'lives_transformed' | 'success_rate' | 'communities' | 'programs';
  icon: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface SuccessStory {
  id: string;
  name: string;
  age: string;
  location: string;
  program: string;
  programId?: string;
  story: string;
  achievement: string;
  image: string;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface RegionalImpact {
  id: string;
  region: string;
  beneficiaries: string;
  programs: string;
  communities: string;
  keyAchievements: string[];
  color: string;
  description: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

class ImpactApiService {
  async getImpactMetrics(): Promise<ImpactMetric[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/impact/metrics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch impact metrics');
      }
      
      return result.data;
    } catch (error) {
      console.error('Impact Metrics API Error:', error);
      throw error;
    }
  }

  async getSuccessStories(limit?: number, featured?: boolean): Promise<SuccessStory[]> {
    try {
      let url = `${API_BASE_URL}/impact/stories`;
      const params = new URLSearchParams();
      
      if (limit) {
        params.append('limit', limit.toString());
      }
      
      if (featured) {
        params.append('featured', 'true');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch success stories');
      }
      
      return result.data;
    } catch (error) {
      console.error('Success Stories API Error:', error);
      throw error;
    }
  }

  async getRegionalImpact(): Promise<RegionalImpact[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/impact/regional`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch regional impact');
      }
      
      return result.data;
    } catch (error) {
      console.error('Regional Impact API Error:', error);
      throw error;
    }
  }
}

export const impactApi = new ImpactApiService();

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
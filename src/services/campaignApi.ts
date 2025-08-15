const API_BASE_URL = 'http://localhost:5000/api';

export interface Campaign {
  id?: string;
  subject: string;
  content: string;
  targetAudience: string;
  scheduledDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  template: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt?: string;
  updatedAt?: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
  recipientCount?: number;
  deliveredCount?: number;
  createdBy?: string;
}

export interface CampaignStats {
  totalCampaigns: number;
  draftCampaigns: number;
  scheduledCampaigns: number;
  sentCampaigns: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalRecipients: number;
}

class CampaignApiService {
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch campaigns');
      }
      
      return result.data;
    } catch (error) {
      console.error('Campaigns API Error:', error);
      throw error;
    }
  }

  async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create campaign');
      }

      return result.data;
    } catch (error) {
      console.error('Create Campaign Error:', error);
      throw error;
    }
  }

  async updateCampaign(campaignId: string, campaignData: Partial<Omit<Campaign, 'id' | 'createdAt'>>): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update campaign');
      }

      return result.data;
    } catch (error) {
      console.error('Update Campaign Error:', error);
      throw error;
    }
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Delete Campaign Error:', error);
      throw error;
    }
  }

  async sendCampaign(campaignId: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to send campaign');
      }

      return result.data;
    } catch (error) {
      console.error('Send Campaign Error:', error);
      throw error;
    }
  }

  async duplicateCampaign(campaignId: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to duplicate campaign');
      }

      return result.data;
    } catch (error) {
      console.error('Duplicate Campaign Error:', error);
      throw error;
    }
  }

  async getCampaignStats(): Promise<CampaignStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch campaign stats');
      }
      
      return result.data;
    } catch (error) {
      console.error('Campaign Stats API Error:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId: string): Promise<{
    openRate: number;
    clickRate: number;
    deliveredCount: number;
    bounceRate: number;
    unsubscribeRate: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}/performance`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch campaign performance');
      }
      
      return result.data;
    } catch (error) {
      console.error('Campaign Performance API Error:', error);
      throw error;
    }
  }
}

export const campaignApi = new CampaignApiService();

// Helper functions
export const getCampaignStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return 'text-gray-600 bg-gray-100';
    case 'scheduled': return 'text-blue-600 bg-blue-100';
    case 'sent': return 'text-green-600 bg-green-100';
    case 'failed': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getCampaignPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent': return 'text-red-600 bg-red-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-yellow-600 bg-yellow-100';
  }
};

export const formatCampaignDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
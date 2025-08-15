const API_BASE_URL = 'http://localhost:5000/api';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  preferences: {
    newsletter: boolean;
    events: boolean;
    programs: boolean;
    volunteering: boolean;
    donations?: boolean;
  };
  source: 'website' | 'social_media' | 'event' | 'referral' | 'manual' | 'import';
  subscribedAt: string | { _seconds: number; _nanoseconds: number; };
  unsubscribedAt?: string | { _seconds: number; _nanoseconds: number; };
  lastEmailSent?: string | { _seconds: number; _nanoseconds: number; };
  emailsSent?: number;
  bounceCount?: number;
  complaintCount?: number;
  tags?: string[];
  notes?: string;
  // Admin fields
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'active' | 'unsubscribed' | 'bounced' | 'complained' | 'suppressed';
  engagement?: 'high' | 'medium' | 'low' | 'inactive';
  lastActivity?: string;
  totalClicks?: number;
  totalOpens?: number;
  averageEngagement?: number;
}

export interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  htmlContent?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduledAt?: string;
  sentAt?: string;
  recipientCount?: number;
  openCount?: number;
  clickCount?: number;
  bounceCount?: number;
  complaintCount?: number;
  unsubscribeCount?: number;
  createdAt: string | { _seconds: number; _nanoseconds: number; };
  updatedAt?: string | { _seconds: number; _nanoseconds: number; };
  createdBy?: string;
  tags?: string[];
  targetAudience?: 'all' | 'active' | 'engaged' | 'new' | 'custom';
  customFilters?: any;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  bounced: number;
  complained: number;
  newThisMonth: number;
  engagementRate: number;
  averageOpenRate: number;
  averageClickRate: number;
  topSources: Array<{
    source: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: 'subscribe' | 'unsubscribe' | 'bounce' | 'complaint';
    email: string;
    date: string;
  }>;
}

class NewsletterApiService {
  async subscribeToNewsletter(subscriberData: Omit<NewsletterSubscriber, 'id' | 'subscribedAt' | 'isActive'>): Promise<{ subscriberId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriberData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to subscribe to newsletter');
      }

      return result.data;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  async unsubscribe(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch newsletter subscribers');
      }
      
      // Transform data for admin interface
      const transformedData = result.data.map((subscriber: any) => {
        const subscribedDate = subscriber.subscribedAt ? 
          (typeof subscriber.subscribedAt === 'string' ? subscriber.subscribedAt : this.convertFirestoreTimestamp(subscriber.subscribedAt)) : 
          new Date().toISOString();

        return {
          ...subscriber,
          subscribedAt: subscribedDate,
          status: subscriber.status || (subscriber.isActive ? 'active' : 'unsubscribed'),
          priority: subscriber.priority || 'medium',
          engagement: subscriber.engagement || this.calculateEngagement(subscriber),
          emailsSent: subscriber.emailsSent || 0,
          totalClicks: subscriber.totalClicks || 0,
          totalOpens: subscriber.totalOpens || 0,
          bounceCount: subscriber.bounceCount || 0,
          complaintCount: subscriber.complaintCount || 0,
          averageEngagement: subscriber.averageEngagement || Math.random() * 100, // Mock for demo
          source: subscriber.source || 'website'
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Newsletter Subscribers API Error:', error);
      throw error;
    }
  }

  async updateSubscriberStatus(subscriberId: string, status: string, notes?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers/${subscriberId}/status`, {
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
        throw new Error(result.error?.message || 'Failed to update subscriber status');
      }
    } catch (error) {
      console.error('Update Subscriber Status Error:', error);
      throw error;
    }
  }

  async updateSubscriberPriority(subscriberId: string, priority: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers/${subscriberId}/priority`, {
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
        throw new Error(result.error?.message || 'Failed to update subscriber priority');
      }
    } catch (error) {
      console.error('Update Subscriber Priority Error:', error);
      throw error;
    }
  }

  async deleteSubscriber(subscriberId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers/${subscriberId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Delete Subscriber Error:', error);
      throw error;
    }
  }

  async bulkAction(action: 'subscribe' | 'unsubscribe' | 'delete', subscriberIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/bulk-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, subscriberIds }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to perform bulk action');
      }
    } catch (error) {
      console.error('Bulk Action Error:', error);
      throw error;
    }
  }

  async exportSubscribers(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Export Subscribers Error:', error);
      throw error;
    }
  }

  async importSubscribers(file: File): Promise<{ imported: number; skipped: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/admin/newsletter/import`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to import subscribers');
      }

      return result.data;
    } catch (error) {
      console.error('Import Subscribers Error:', error);
      throw error;
    }
  }

  // Campaign methods
  async getCampaigns(): Promise<NewsletterCampaign[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/campaigns`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch campaigns');
      }
      
      return result.data;
    } catch (error) {
      console.error('Get Campaigns Error:', error);
      throw error;
    }
  }

  async createCampaign(campaignData: Omit<NewsletterCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ campaignId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/newsletter/campaigns`, {
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

  private calculateEngagement(subscriber: any): 'high' | 'medium' | 'low' | 'inactive' {
    if (!subscriber.emailsSent || subscriber.emailsSent === 0) return 'inactive';
    
    const openRate = (subscriber.totalOpens || 0) / subscriber.emailsSent;
    const clickRate = (subscriber.totalClicks || 0) / subscriber.emailsSent;
    
    if (openRate > 0.5 && clickRate > 0.1) return 'high';
    if (openRate > 0.25 && clickRate > 0.05) return 'medium';
    if (openRate > 0.1) return 'low';
    
    return 'inactive';
  }

  private convertFirestoreTimestamp(timestamp: { _seconds: number; _nanoseconds: number }): string {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
  }
}

export const newsletterApi = new NewsletterApiService();

// Helper function to convert Firestore timestamp to Date
export const convertFirestoreTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

// Helper function to format engagement score
export const formatEngagementScore = (score: number) => {
  return `${score.toFixed(1)}%`;
};

// Helper function to get engagement color
export const getEngagementColor = (engagement: string) => {
  switch (engagement) {
    case 'high': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-orange-600 bg-orange-100';
    case 'inactive': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Helper function to get source display name
export const getSourceDisplay = (source: string) => {
  const sources = {
    website: 'Website',
    social_media: 'Social Media',
    event: 'Event',
    referral: 'Referral',
    manual: 'Manual Entry',
    import: 'Import'
  };
  return sources[source as keyof typeof sources] || source;
};
const API_BASE_URL = 'http://localhost:5000/api';

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalBlogPosts: number;
  totalGalleryItems: number;
  totalDonations: number;
  totalContacts: number;
  monthlyGrowth: {
    users: number;
    events: number;
    donations: number;
    contacts: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user' | 'event' | 'donation' | 'contact' | 'blog';
    message: string;
    time: string;
    user?: string;
  }>;
}

class DashboardApiService {
  async getDashboardStats(timeframe: string = '7d'): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch dashboard stats');
      }
      
      return result.data;
    } catch (error) {
      console.error('Dashboard Stats API Error:', error);
      // Fallback to individual API calls if dashboard endpoint doesn't exist
      return this.fetchStatsFromIndividualAPIs();
    }
  }

  private async fetchStatsFromIndividualAPIs(): Promise<DashboardStats> {
    try {
      // Make parallel requests to get data from different endpoints
      const [blogs, events, donations, contacts] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/admin/blog-posts`).then(res => res.json()),
        fetch(`${API_BASE_URL}/events`).then(res => res.json()),
        fetch(`${API_BASE_URL}/admin/donations`).then(res => res.json()),
        fetch(`${API_BASE_URL}/admin/contacts`).then(res => res.json())
      ]);

      // Extract data safely
      const blogData = blogs.status === 'fulfilled' && blogs.value.success ? blogs.value.data : [];
      const eventData = events.status === 'fulfilled' && events.value.success ? events.value.data : [];
      const donationData = donations.status === 'fulfilled' && donations.value.success ? donations.value.data : [];
      const contactData = contacts.status === 'fulfilled' && contacts.value.success ? contacts.value.data : [];

      // Calculate recent activity from available data
      const recentActivity = this.generateRecentActivity(blogData, eventData, donationData, contactData);

      return {
        totalUsers: 0, // This would require a separate users endpoint
        totalEvents: eventData.length,
        totalBlogPosts: blogData.length,
        totalGalleryItems: 0, // This would require a gallery endpoint
        totalDonations: donationData.length,
        totalContacts: contactData.length,
        monthlyGrowth: {
          users: 0,
          events: this.calculateGrowth(eventData, 'eventDate'),
          donations: this.calculateGrowth(donationData, 'createdAt'),
          contacts: this.calculateGrowth(contactData, 'createdAt')
        },
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching stats from individual APIs:', error);
      // Return default values if all else fails
      return this.getDefaultStats();
    }
  }

  private generateRecentActivity(blogs: any[], events: any[], donations: any[], contacts: any[]): any[] {
    const activities: any[] = [];

    // Add recent donations
    donations.slice(0, 2).forEach(donation => {
      if (donation.createdAt) {
        activities.push({
          id: `donation-${donation.id}`,
          type: 'donation',
          message: `New donation of $${donation.amount} received`,
          time: this.getRelativeTime(donation.createdAt),
          user: donation.isAnonymous ? undefined : donation.donorName
        });
      }
    });

    // Add recent contacts
    contacts.slice(0, 2).forEach(contact => {
      if (contact.createdAt) {
        activities.push({
          id: `contact-${contact.id}`,
          type: 'contact',
          message: `New contact form submission: ${contact.subject}`,
          time: this.getRelativeTime(contact.createdAt),
          user: contact.name
        });
      }
    });

    // Add recent blog posts
    blogs.slice(0, 1).forEach(blog => {
      if (blog.publishedAt && blog.isPublished) {
        activities.push({
          id: `blog-${blog.id}`,
          type: 'blog',
          message: `Blog post "${blog.title}" published`,
          time: this.getRelativeTime(blog.publishedAt)
        });
      }
    });

    // Sort by most recent and limit to 5
    return activities.sort((a, b) => {
      const timeA = this.parseRelativeTime(a.time);
      const timeB = this.parseRelativeTime(b.time);
      return timeA - timeB;
    }).slice(0, 5);
  }

  private calculateGrowth(data: any[], dateField: string): number {
    if (!data || data.length === 0) return 0;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const thisMonthCount = data.filter(item => {
      if (!item[dateField]) return false;
      const date = this.parseDate(item[dateField]);
      return date >= thisMonth;
    }).length;

    const lastMonthCount = data.filter(item => {
      if (!item[dateField]) return false;
      const date = this.parseDate(item[dateField]);
      return date >= lastMonth && date < thisMonth;
    }).length;

    if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
    return ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
  }

  private parseDate(dateValue: any): Date {
    if (typeof dateValue === 'string') {
      return new Date(dateValue);
    } else if (dateValue && dateValue._seconds) {
      return new Date(dateValue._seconds * 1000);
    }
    return new Date();
  }

  private getRelativeTime(dateValue: any): string {
    const date = this.parseDate(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  }

  private parseRelativeTime(timeStr: string): number {
    const match = timeStr.match(/(\d+)\s+(minute|hour|day)/);
    if (!match) return 0;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'minute': return value;
      case 'hour': return value * 60;
      case 'day': return value * 60 * 24;
      default: return 0;
    }
  }

  private getDefaultStats(): DashboardStats {
    return {
      totalUsers: 0,
      totalEvents: 0,
      totalBlogPosts: 0,
      totalGalleryItems: 0,
      totalDonations: 0,
      totalContacts: 0,
      monthlyGrowth: {
        users: 0,
        events: 0,
        donations: 0,
        contacts: 0
      },
      recentActivity: []
    };
  }
}

export const dashboardApi = new DashboardApiService();
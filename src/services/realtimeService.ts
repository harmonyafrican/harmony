const API_BASE_URL = 'http://localhost:5000/api';

export interface RealtimeUpdate extends Record<string, unknown> {
  id: string;
  type: 'contact' | 'donation' | 'volunteer' | 'newsletter' | 'event' | 'blog' | 'gallery' | 'program';
  action: 'created' | 'updated' | 'deleted';
  data: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

export interface RealtimeStats {
  newContacts: number;
  newDonations: number;
  newVolunteers: number;
  newSubscribers: number;
  totalValue: number;
  lastUpdated: string;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private listeners: Map<string, Set<(data: Record<string, unknown>) => void>> = new Map();
  private isConnected = false;

  // Initialize SSE connection for real-time updates
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.eventSource) {
        this.disconnect();
      }

      try {
        this.eventSource = new EventSource(`${API_BASE_URL}/admin/realtime/events`);

        this.eventSource.onopen = () => {
          console.log('Real-time connection established');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          resolve();
        };

        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleRealtimeUpdate(data);
          } catch (error) {
            console.error('Error parsing real-time data:', error);
          }
        };

        this.eventSource.onerror = (error) => {
          console.error('Real-time connection error:', error);
          this.isConnected = false;
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.reconnectDelay *= 2; // Exponential backoff
              console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
              this.connect();
            }, this.reconnectDelay);
          } else {
            console.error('Max reconnection attempts reached');
            reject(new Error('Failed to establish real-time connection'));
          }
        };

        // Handle specific event types
        this.eventSource.addEventListener('contact', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          this.notifyListeners('contact', data);
        });

        this.eventSource.addEventListener('donation', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          this.notifyListeners('donation', data);
        });

        this.eventSource.addEventListener('volunteer', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          this.notifyListeners('volunteer', data);
        });

        this.eventSource.addEventListener('newsletter', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          this.notifyListeners('newsletter', data);
        });

        this.eventSource.addEventListener('stats', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          this.notifyListeners('stats', data);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
      console.log('Real-time connection closed');
    }
  }

  isConnectionActive(): boolean {
    return this.isConnected && this.eventSource?.readyState === EventSource.OPEN;
  }

  // Subscribe to specific event types
  subscribe(eventType: string, callback: (data: Record<string, unknown>) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  private notifyListeners(eventType: string, data: Record<string, unknown>): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in real-time listener:', error);
        }
      });
    }
  }

  private handleRealtimeUpdate(update: RealtimeUpdate): void {
    // Notify general update listeners
    this.notifyListeners('update', update);
    
    // Notify type-specific listeners
    this.notifyListeners(update.type, update);
  }

  // Fetch current real-time stats
  async getRealtimeStats(): Promise<RealtimeStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/realtime/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch real-time stats');
      }
      
      return result.data;
    } catch (error) {
      console.error('Real-time stats error:', error);
      throw error;
    }
  }

  // Trigger manual refresh of data
  async triggerRefresh(dataType?: string): Promise<void> {
    try {
      const endpoint = dataType 
        ? `${API_BASE_URL}/admin/realtime/refresh/${dataType}`
        : `${API_BASE_URL}/admin/realtime/refresh`;
        
      const response = await fetch(endpoint, { method: 'POST' });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to trigger refresh');
      }
    } catch (error) {
      console.error('Trigger refresh error:', error);
      throw error;
    }
  }

  // Get recent activity feed
  async getRecentActivity(limit: number = 20): Promise<RealtimeUpdate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/realtime/activity?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch recent activity');
      }
      
      return result.data;
    } catch (error) {
      console.error('Recent activity error:', error);
      throw error;
    }
  }

  // Send admin notification to other connected admins
  async sendAdminNotification(notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    targetAdmins?: string[];
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/realtime/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Send notification error:', error);
      throw error;
    }
  }
}

export const realtimeService = new RealtimeService();

// Helper function to format real-time update messages
export const formatUpdateMessage = (update: RealtimeUpdate): { title: string; message: string } => {
  const typeMap = {
    contact: 'Contact',
    donation: 'Donation',
    volunteer: 'Volunteer Application',
    newsletter: 'Newsletter Subscription',
    event: 'Event',
    blog: 'Blog Post',
    gallery: 'Gallery Item',
    program: 'Program'
  };

  const actionMap = {
    created: 'added',
    updated: 'updated',
    deleted: 'deleted'
  };

  const typeName = typeMap[update.type] || update.type;
  const actionName = actionMap[update.action] || update.action;

  let title = `${typeName} ${actionName}`;
  let message = '';

  switch (update.type) {
    case 'contact':
      if (update.action === 'created') {
        title = 'New Contact Message';
        message = `From: ${update.data.name || update.data.email}`;
      }
      break;
    case 'donation':
      if (update.action === 'created') {
        title = 'New Donation Received';
        message = `Amount: $${update.data.amount} from ${update.data.donorName || 'Anonymous'}`;
      }
      break;
    case 'volunteer':
      if (update.action === 'created') {
        title = 'New Volunteer Application';
        message = `From: ${update.data.firstName} ${update.data.lastName}`;
      }
      break;
    case 'newsletter':
      if (update.action === 'created') {
        title = 'New Newsletter Subscription';
        message = `Email: ${update.data.email}`;
      }
      break;
    default:
      message = `${typeName} has been ${actionName}`;
  }

  return { title, message };
};

// Hook for using real-time updates in components
export const useRealtimeUpdates = () => {
  return {
    service: realtimeService,
    formatMessage: formatUpdateMessage
  };
};
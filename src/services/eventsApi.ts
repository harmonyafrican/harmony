const API_BASE_URL = 'http://localhost:5000/api';

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  date: string; // Simplified date format for admin interface
  endDate?: string; // Optional end date
  time: string; // Time as string
  location: string;
  capacity?: number | string; // Max attendees
  registeredAttendees?: number;
  price?: number | string; // Ticket price
  eventType: string;
  isActive: boolean;
  image?: string; // Single image URL as returned by API
  images?: string[]; // For backward compatibility if API changes later
  // Keep original Firestore fields for backward compatibility
  eventDate?: {
    _seconds: number;
    _nanoseconds: number;
  };
  maxAttendees?: number;
  ticketPrice?: number;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

class EventsApiService {
  async getEvents(): Promise<EventRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch events');
      }
      
      // Transform the data to include simplified fields for admin interface
      const transformedData = result.data.map((event: any) => {
        const eventDate = event.eventDate ? convertFirestoreTimestamp(event.eventDate) : new Date();
        
        return {
          ...event,
          date: eventDate.toISOString().split('T')[0], // YYYY-MM-DD format
          time: eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          capacity: event.maxAttendees || event.capacity,
          price: event.ticketPrice || event.price
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Events API Error:', error);
      throw error;
    }
  }

  async createEvent(eventData: Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create event');
      }
      
      return result.data;
    } catch (error) {
      console.error('Create Event Error:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, eventData: Partial<EventRecord>): Promise<EventRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update event');
      }
      
      return result.data;
    } catch (error) {
      console.error('Update Event Error:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete Event Error:', error);
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
            events: true,
            programs: false,
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
}

export const eventsApi = new EventsApiService();

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
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to format time
export const formatTime = (dateString: string | { _seconds: number; _nanoseconds: number }) => {
  let date: Date;
  
  if (typeof dateString === 'string') {
    date = new Date(dateString);
  } else {
    date = convertFirestoreTimestamp(dateString);
  }
  
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};
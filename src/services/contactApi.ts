const API_BASE_URL = 'http://localhost:5000/api';

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'partnership' | 'volunteer' | 'donation' | 'media';
  phone?: string;
  status?: 'new' | 'in_progress' | 'resolved' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
  createdAt?: string | { _seconds: number; _nanoseconds: number; };
  updatedAt?: string | { _seconds: number; _nanoseconds: number; };
  submittedAt?: string;
  responseNeeded?: boolean;
}

export interface ContactResponse {
  id: string;
  status: 'received' | 'in_progress' | 'resolved';
  submittedAt: string;
}

export interface ContactStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  archived: number;
  responseNeeded: number;
}

class ContactApiService {
  async submitContactForm(contactData: ContactSubmission): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to submit contact form');
      }

      return result.data;
    } catch (error) {
      console.error('Contact Form Submission Error:', error);
      throw error;
    }
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch contact submissions');
      }
      
      return result.data;
    } catch (error) {
      console.error('Contact Submissions API Error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch all contact submissions');
      }
      
      // Transform data for admin interface
      const transformedData = result.data.map((contact: any) => {
        const createdDate = contact.createdAt ? 
          (typeof contact.createdAt === 'string' ? contact.createdAt : this.convertFirestoreTimestamp(contact.createdAt)) : 
          new Date().toISOString();

        return {
          ...contact,
          createdAt: createdDate,
          status: contact.status || 'new',
          priority: contact.priority || 'medium',
          responseNeeded: contact.responseNeeded !== false
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Contact Submissions API Error:', error);
      throw error;
    }
  }

  async updateContactStatus(contactId: string, status: string, notes?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${contactId}/status`, {
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
        throw new Error(result.error?.message || 'Failed to update contact status');
      }
    } catch (error) {
      console.error('Update Contact Status Error:', error);
      throw error;
    }
  }

  async updateContactPriority(contactId: string, priority: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${contactId}/priority`, {
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
        throw new Error(result.error?.message || 'Failed to update contact priority');
      }
    } catch (error) {
      console.error('Update Contact Priority Error:', error);
      throw error;
    }
  }

  async deleteContact(contactId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${contactId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Delete Contact Error:', error);
      throw error;
    }
  }

  private convertFirestoreTimestamp(timestamp: { _seconds: number; _nanoseconds: number }): string {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
  }
}

export const contactApi = new ContactApiService();

// Helper function to format contact type for display
export const formatContactType = (type: string): string => {
  const typeMap = {
    general: 'General Inquiry',
    partnership: 'Partnership',
    volunteer: 'Volunteer',
    donation: 'Donation',
    media: 'Media Inquiry'
  };
  
  return typeMap[type as keyof typeof typeMap] || 'General Inquiry';
};

// Helper function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
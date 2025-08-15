const API_BASE_URL = 'http://localhost:5000/api';

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  message?: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  paymentMethod: 'card' | 'bank_transfer' | 'mobile_money' | 'paypal' | 'crypto';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  transactionId?: string;
  programId?: string;
  programTitle?: string;
  donationType: 'general' | 'program' | 'emergency' | 'scholarship' | 'infrastructure';
  taxDeductible: boolean;
  receiptSent: boolean;
  thankYouSent: boolean;
  processingFee?: number;
  netAmount?: number;
  createdAt: string | { _seconds: number; _nanoseconds: number; };
  updatedAt?: string | { _seconds: number; _nanoseconds: number; };
  // Admin fields
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  assignedTo?: string;
  campaignId?: string;
  source?: 'website' | 'social_media' | 'email' | 'event' | 'referral' | 'direct';
  refundReason?: string;
  refundDate?: string;
}

export interface DonationStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  totalAmount: number;
  averageAmount: number;
  recurringDonations: number;
  totalDonors: number;
  recentDonations: Array<{
    amount: number;
    donorName: string;
    date: string;
    isAnonymous: boolean;
  }>;
}

class DonationsApiService {
  async getDonations(limit: number = 50): Promise<Donation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch donations');
      }
      
      return result.data;
    } catch (error) {
      console.error('Donations API Error:', error);
      throw error;
    }
  }

  async createDonation(donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ donationId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create donation');
      }

      return result.data;
    } catch (error) {
      console.error('Create Donation Error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch all donations');
      }
      
      // Transform data for admin interface
      const transformedData = result.data.map((donation: any) => {
        const createdDate = donation.createdAt ? 
          (typeof donation.createdAt === 'string' ? donation.createdAt : this.convertFirestoreTimestamp(donation.createdAt)) : 
          new Date().toISOString();

        return {
          ...donation,
          createdAt: createdDate,
          priority: donation.priority || 'medium',
          followUpRequired: donation.followUpRequired || false,
          processingFee: donation.processingFee || Math.round(donation.amount * 0.029 + 0.30), // Stripe-like fees
          netAmount: donation.netAmount || (donation.amount - (donation.processingFee || Math.round(donation.amount * 0.029 + 0.30))),
          source: donation.source || 'website',
          receiptSent: donation.receiptSent || false,
          thankYouSent: donation.thankYouSent || false
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Admin Donations API Error:', error);
      throw error;
    }
  }

  async updateDonationStatus(donationId: string, status: string, notes?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/status`, {
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
        throw new Error(result.error?.message || 'Failed to update donation status');
      }
    } catch (error) {
      console.error('Update Donation Status Error:', error);
      throw error;
    }
  }

  async updateDonationPriority(donationId: string, priority: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/priority`, {
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
        throw new Error(result.error?.message || 'Failed to update donation priority');
      }
    } catch (error) {
      console.error('Update Donation Priority Error:', error);
      throw error;
    }
  }

  async refundDonation(donationId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/refund`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to refund donation');
      }
    } catch (error) {
      console.error('Refund Donation Error:', error);
      throw error;
    }
  }

  async deleteDonation(donationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete donation');
      }
    } catch (error) {
      console.error('Delete Donation Error:', error);
      throw error;
    }
  }

  async sendReceipt(donationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/receipt`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to send receipt');
      }
    } catch (error) {
      console.error('Send Receipt Error:', error);
      throw error;
    }
  }

  async sendThankYou(donationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/thank-you`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to send thank you message');
      }
    } catch (error) {
      console.error('Send Thank You Error:', error);
      throw error;
    }
  }

  private convertFirestoreTimestamp(timestamp: { _seconds: number; _nanoseconds: number }): string {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
  }
}

export const donationsApi = new DonationsApiService();

// Helper function to convert Firestore timestamp to Date
export const convertFirestoreTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to get payment method display name
export const getPaymentMethodDisplay = (method: string) => {
  const methods = {
    card: 'Credit/Debit Card',
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    paypal: 'PayPal',
    crypto: 'Cryptocurrency'
  };
  return methods[method as keyof typeof methods] || method;
};

// Helper function to get donation type display name
export const getDonationTypeDisplay = (type: string) => {
  const types = {
    general: 'General Donation',
    program: 'Program Specific',
    emergency: 'Emergency Fund',
    scholarship: 'Scholarship Fund',
    infrastructure: 'Infrastructure'
  };
  return types[type as keyof typeof types] || type;
};
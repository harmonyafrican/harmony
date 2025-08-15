// Firestore collection names
export const COLLECTIONS = {
  CONTACTS: 'contacts',
  DONATIONS: 'donations',
  VOLUNTEERS: 'volunteers',
  VOLUNTEER_APPLICATIONS: 'volunteer_applications',
  PROGRAMS: 'programs',
  EVENTS: 'events',
  BLOG_POSTS: 'blog_posts',
  NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers',
  IMPACT_METRICS: 'impact_metrics',
  SUCCESS_STORIES: 'success_stories',
  REGIONAL_IMPACT: 'regional_impact',
  GALLERY: 'gallery',
  CAMPAIGNS: 'campaigns',
} as const;

// Contact form data structure
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: 'new' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

// Donation data structure
export interface DonationRecord {
  id?: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  message?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentMethod?: 'stripe' | 'paypal' | 'bank_transfer';
  createdAt: Date;
  updatedAt: Date;
}

// Volunteer application structure
export interface VolunteerApplicationRecord {
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
  status: 'pending' | 'approved' | 'rejected' | 'interview_scheduled';
  applicationDate: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

// Volunteer opportunity structure
export interface VolunteerOpportunity {
  id?: string;
  title: string;
  description: string;
  requirements: string[];
  timeCommitment: string;
  location: string;
  contactEmail: string;
  isActive: boolean;
  spotsAvailable?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Program structure
export interface Program {
  id?: string;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'community_development' | 'environment' | 'other';
  status: 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  beneficiaries?: number;
  location: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event structure
export interface EventRecord {
  id?: string;
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  maxAttendees?: number;
  registeredAttendees: number;
  ticketPrice?: number;
  eventType: 'fundraiser' | 'awareness' | 'volunteer' | 'community' | 'other';
  isActive: boolean;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Blog post structure
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter subscriber structure
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  preferences?: {
    newsletter: boolean;
    events: boolean;
    programs: boolean;
    volunteering: boolean;
  };
}

// Impact metrics structure
export interface ImpactMetric {
  id?: string;
  number: string;
  label: string;
  category: 'lives_transformed' | 'success_rate' | 'communities' | 'programs';
  icon: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Success stories structure
export interface SuccessStory {
  id?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// Regional impact structure
export interface RegionalImpact {
  id?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// Gallery item structure
export interface GalleryItem {
  id?: string;
  type: 'image' | 'video';
  src: string; // Main image URL or video thumbnail
  videoUrl?: string; // For video items - YouTube, Vimeo, or direct video URL
  title: string;
  description: string;
  category: 'education' | 'technology' | 'arts' | 'community' | 'events' | 'other';
  date: Date;
  location: string;
  participants: number;
  tags?: string[];
  photographer?: string; // Credit for the photo/video
  isActive: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Campaign structure
export interface Campaign {
  id?: string;
  subject: string;
  content: string;
  targetAudience: string;
  scheduledDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  template: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  openRate?: number;
  clickRate?: number;
  recipientCount?: number;
  deliveredCount?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
}
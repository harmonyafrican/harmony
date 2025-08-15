import { db } from '../config/firebase.js';
import { 
  COLLECTIONS, 
  ContactSubmission, 
  DonationRecord, 
  VolunteerApplicationRecord, 
  VolunteerOpportunity,
  Program,
  Campaign,
  EventRecord,
  BlogPost,
  NewsletterSubscriber,
  GalleryItem
} from '../models/index.js';
import { FieldValue } from 'firebase-admin/firestore';

export class FirebaseService {
  // Contact form operations
  static async createContact(contactData: Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await db.collection(COLLECTIONS.CONTACTS).add({
      ...contactData,
      status: 'new',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getContacts(limit: number = 50, status?: string) {
    let query = db.collection(COLLECTIONS.CONTACTS).orderBy('createdAt', 'desc').limit(limit);
    
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async updateContactStatus(contactId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await db.collection(COLLECTIONS.CONTACTS).doc(contactId).update(updateData);
      return true;
    } catch (error) {
      console.error('Error updating contact status:', error);
      return false;
    }
  }

  static async updateContactPriority(contactId: string, priority: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.CONTACTS).doc(contactId).update({
        priority,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating contact priority:', error);
      return false;
    }
  }

  static async deleteContact(contactId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.CONTACTS).doc(contactId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  }

  // Donation operations
  static async createDonation(donationData: Omit<DonationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await db.collection(COLLECTIONS.DONATIONS).add({
      ...donationData,
      paymentStatus: donationData.paymentStatus || 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getDonationStats() {
    const snapshot = await db.collection(COLLECTIONS.DONATIONS)
      .where('paymentStatus', '==', 'completed')
      .get();
    
    const donations = snapshot.docs.map(doc => doc.data() as DonationRecord);
    
    const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalDonors = donations.length;
    const averageDonation = totalDonors > 0 ? totalRaised / totalDonors : 0;
    
    // Get recent donations (last 10)
    const recentSnapshot = await db.collection(COLLECTIONS.DONATIONS)
      .where('paymentStatus', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    const recentDonations = recentSnapshot.docs.map(doc => {
      const data = doc.data() as DonationRecord;
      return {
        amount: data.amount,
        donorName: data.isAnonymous ? 'Anonymous' : data.donorName,
        date: data.createdAt || new Date()
      };
    });

    return {
      totalRaised,
      totalDonors,
      averageDonation: Math.round(averageDonation),
      recentDonations
    };
  }

  static async updateDonationStatus(donationId: string, status: DonationRecord['paymentStatus'], transactionId?: string) {
    const updateData: any = {
      paymentStatus: status,
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    
    await db.collection(COLLECTIONS.DONATIONS).doc(donationId).update(updateData);
  }

  // Volunteer operations
  static async createVolunteerApplication(applicationData: Omit<VolunteerApplicationRecord, 'id' | 'applicationDate'>): Promise<string> {
    const docRef = await db.collection(COLLECTIONS.VOLUNTEER_APPLICATIONS).add({
      ...applicationData,
      status: 'pending',
      applicationDate: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getVolunteerOpportunities() {
    const snapshot = await db.collection(COLLECTIONS.VOLUNTEERS)
      .where('isActive', '==', true)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createVolunteerOpportunity(opportunityData: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VolunteerOpportunity | null> {
    try {
      const docRef = await db.collection(COLLECTIONS.VOLUNTEERS).add({
        ...opportunityData,
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      
      // Get the created document
      const createdDoc = await docRef.get();
      
      if (createdDoc.exists) {
        return { id: createdDoc.id, ...createdDoc.data() } as VolunteerOpportunity;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating volunteer opportunity:', error);
      return null;
    }
  }

  // Program operations
  static async getPrograms(status?: Program['status']) {
    let query = db.collection(COLLECTIONS.PROGRAMS);
    
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createProgram(programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program | null> {
    try {
      const docRef = await db.collection(COLLECTIONS.PROGRAMS).add({
        ...programData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Get the created document
      const createdDoc = await docRef.get();
      
      if (createdDoc.exists) {
        return { id: createdDoc.id, ...createdDoc.data() } as Program;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating program:', error);
      return null;
    }
  }

  // Event operations
  static async getEvents(activeOnly: boolean = true) {
    let query = db.collection(COLLECTIONS.EVENTS);
    
    if (activeOnly) {
      query = query.where('isActive', '==', true) as any;
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createEvent(eventData: Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventRecord | null> {
    try {
      const docRef = await db.collection(COLLECTIONS.EVENTS).add({
        ...eventData,
        registeredAttendees: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Get the created document
      const createdDoc = await docRef.get();
      
      if (createdDoc.exists) {
        return { id: createdDoc.id, ...createdDoc.data() } as EventRecord;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.EVENTS).doc(eventId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  static async updateEvent(eventId: string, eventData: Partial<Omit<EventRecord, 'id' | 'createdAt'>>): Promise<EventRecord | null> {
    try {
      const updateData = {
        ...eventData,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection(COLLECTIONS.EVENTS).doc(eventId).update(updateData);
      
      // Get the updated document
      const updatedDoc = await db.collection(COLLECTIONS.EVENTS).doc(eventId).get();
      
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as EventRecord;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  // Blog operations
  static async getBlogPosts(publishedOnly: boolean = true, limit: number = 10) {
    let query = db.collection(COLLECTIONS.BLOG_POSTS).limit(limit);
    
    if (publishedOnly) {
      query = query.where('isPublished', '==', true) as any;
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost | null> {
    try {
      const docRef = await db.collection(COLLECTIONS.BLOG_POSTS).add({
        ...postData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        views: 0,
        likes: 0,
        comments: 0
      });
      
      // Get the created document
      const createdDoc = await docRef.get();
      
      if (createdDoc.exists) {
        return { id: createdDoc.id, ...createdDoc.data() } as BlogPost;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating blog post:', error);
      return null;
    }
  }

  static async deleteBlogPost(postId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.BLOG_POSTS).doc(postId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  static async updateBlogPostStatus(postId: string, isPublished: boolean): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.BLOG_POSTS).doc(postId).update({
        isPublished,
        updatedAt: FieldValue.serverTimestamp(),
        publishedAt: isPublished ? FieldValue.serverTimestamp() : null
      });
      return true;
    } catch (error) {
      console.error('Error updating blog post status:', error);
      return false;
    }
  }

  static async updateBlogPost(postId: string, postData: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<BlogPost | null> {
    try {
      const updateData = {
        ...postData,
        updatedAt: FieldValue.serverTimestamp(),
        // Only update publishedAt if isPublished changes to true
        ...(postData.isPublished && { publishedAt: FieldValue.serverTimestamp() })
      };
      
      await db.collection(COLLECTIONS.BLOG_POSTS).doc(postId).update(updateData);
      
      // Get the updated document
      const updatedDoc = await db.collection(COLLECTIONS.BLOG_POSTS).doc(postId).get();
      
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as BlogPost;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return null;
    }
  }

  // Newsletter operations
  static async subscribeToNewsletter(subscriberData: Omit<NewsletterSubscriber, 'id' | 'subscribedAt'>): Promise<string> {
    // Check if email already exists
    const existingSnapshot = await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
      .where('email', '==', subscriberData.email)
      .get();
    
    if (!existingSnapshot.empty) {
      // Update existing subscription
      const docId = existingSnapshot.docs[0]!.id;
      await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).doc(docId).update({
        ...subscriberData,
        isActive: true,
        subscribedAt: FieldValue.serverTimestamp(),
        unsubscribedAt: FieldValue.delete(),
      });
      return docId;
    }
    
    // Create new subscription
    const docRef = await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).add({
      ...subscriberData,
      isActive: true,
      subscribedAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  // Impact operations
  static async getImpactMetrics() {
    const snapshot = await db.collection(COLLECTIONS.IMPACT_METRICS)
      .where('isActive', '==', true)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getSuccessStories(limit: number = 10, status: string = 'published') {
    let query = db.collection(COLLECTIONS.SUCCESS_STORIES)
      .where('status', '==', status)
      .limit(limit);
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getRegionalImpact() {
    const snapshot = await db.collection(COLLECTIONS.REGIONAL_IMPACT)
      .where('isActive', '==', true)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getFeaturedSuccessStories() {
    const snapshot = await db.collection(COLLECTIONS.SUCCESS_STORIES)
      .where('isFeatured', '==', true)
      .where('status', '==', 'published')
      .limit(6)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Real-time listeners
  static listenToDonations(callback: (donations: any[]) => void) {
    return db.collection(COLLECTIONS.DONATIONS)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot(snapshot => {
        const donations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(donations);
      });
  }

  static listenToContactForms(callback: (contacts: any[]) => void) {
    return db.collection(COLLECTIONS.CONTACTS)
      .where('status', '==', 'new')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(contacts);
      });
  }

  // Gallery operations
  static async createGalleryItem(galleryData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryItem | null> {
    try {
      const docRef = await db.collection(COLLECTIONS.GALLERY).add({
        ...galleryData,
        views: 0,
        likes: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Get the created document
      const createdDoc = await docRef.get();
      
      if (createdDoc.exists) {
        return { id: createdDoc.id, ...createdDoc.data() } as GalleryItem;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      return null;
    }
  }

  static async updateGalleryItem(itemId: string, galleryData: Partial<Omit<GalleryItem, 'id' | 'createdAt'>>): Promise<GalleryItem | null> {
    try {
      const updateData = {
        ...galleryData,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection(COLLECTIONS.GALLERY).doc(itemId).update(updateData);
      
      // Get the updated document
      const updatedDoc = await db.collection(COLLECTIONS.GALLERY).doc(itemId).get();
      
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as GalleryItem;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return null;
    }
  }

  static async getGalleryItems(activeOnly: boolean = true) {
    try {
      // Simplified query without compound indexes
      const snapshot = await db.collection(COLLECTIONS.GALLERY).get();
      
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter in memory if needed
      if (activeOnly) {
        items = items.filter(item => item.isActive === true);
      }
      
      // Sort in memory by date (most recent first)
      items.sort((a, b) => {
        const dateA = a.date?.toDate?.() || new Date(a.date) || new Date();
        const dateB = b.date?.toDate?.() || new Date(b.date) || new Date();
        return dateB.getTime() - dateA.getTime();
      });
      
      return items;
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      throw error;
    }
  }

  static async getGalleryItemsByCategory(category: string, limit: number = 20) {
    const snapshot = await db.collection(COLLECTIONS.GALLERY)
      .where('category', '==', category)
      .where('isActive', '==', true)
      .orderBy('date', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getGalleryStats() {
    const snapshot = await db.collection(COLLECTIONS.GALLERY)
      .where('isActive', '==', true)
      .get();
    
    const items = snapshot.docs.map(doc => doc.data());
    
    const stats = {
      totalPhotos: items.filter(item => item.type === 'image').length,
      totalVideos: items.filter(item => item.type === 'video').length,
      totalEvents: items.filter(item => item.category === 'events').length,
      totalMemories: items.length
    };
    
    return stats;
  }

  static async likeGalleryItem(itemId: string): Promise<boolean> {
    try {
      const docRef = db.collection(COLLECTIONS.GALLERY).doc(itemId);
      await docRef.update({
        likes: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error liking gallery item:', error);
      return false;
    }
  }

  static async incrementGalleryViews(itemId: string): Promise<boolean> {
    try {
      const docRef = db.collection(COLLECTIONS.GALLERY).doc(itemId);
      await docRef.update({
        views: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error incrementing gallery views:', error);
      return false;
    }
  }

  static async deleteGalleryItem(itemId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.GALLERY).doc(itemId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return false;
    }
  }

  static async updateGalleryItemStatus(itemId: string, isActive: boolean): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.GALLERY).doc(itemId).update({
        isActive,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating gallery item status:', error);
      return false;
    }
  }

  // Program admin operations
  static async updateProgramStatus(programId: string, status: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.PROGRAMS).doc(programId).update({
        status,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating program status:', error);
      return false;
    }
  }

  static async updateProgramPriority(programId: string, priority: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.PROGRAMS).doc(programId).update({
        priority,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating program priority:', error);
      return false;
    }
  }

  static async updateProgram(programId: string, programData: Partial<Omit<Program, 'id' | 'createdAt'>>): Promise<Program | null> {
    try {
      const updateData = {
        ...programData,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection(COLLECTIONS.PROGRAMS).doc(programId).update(updateData);
      
      // Get the updated document
      const updatedDoc = await db.collection(COLLECTIONS.PROGRAMS).doc(programId).get();
      
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as Program;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating program:', error);
      return null;
    }
  }

  static async deleteProgram(programId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.PROGRAMS).doc(programId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting program:', error);
      return false;
    }
  }

  // Volunteer admin operations
  static async getVolunteerApplications() {
    const snapshot = await db.collection(COLLECTIONS.VOLUNTEER_APPLICATIONS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async updateVolunteerStatus(applicationId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await db.collection(COLLECTIONS.VOLUNTEER_APPLICATIONS).doc(applicationId).update(updateData);
      return true;
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      return false;
    }
  }

  static async updateVolunteerPriority(applicationId: string, priority: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.VOLUNTEER_APPLICATIONS).doc(applicationId).update({
        priority,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating volunteer priority:', error);
      return false;
    }
  }

  static async deleteVolunteerApplication(applicationId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.VOLUNTEER_APPLICATIONS).doc(applicationId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting volunteer application:', error);
      return false;
    }
  }

  // Donation admin operations
  static async getDonations() {
    const snapshot = await db.collection(COLLECTIONS.DONATIONS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async updateDonationStatus(donationId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        paymentStatus: status,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await db.collection(COLLECTIONS.DONATIONS).doc(donationId).update(updateData);
      return true;
    } catch (error) {
      console.error('Error updating donation status:', error);
      return false;
    }
  }

  static async updateDonationPriority(donationId: string, priority: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.DONATIONS).doc(donationId).update({
        priority,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating donation priority:', error);
      return false;
    }
  }

  static async refundDonation(donationId: string, reason: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.DONATIONS).doc(donationId).update({
        paymentStatus: 'refunded',
        refundReason: reason,
        refundDate: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error refunding donation:', error);
      return false;
    }
  }

  static async deleteDonation(donationId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.DONATIONS).doc(donationId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting donation:', error);
      return false;
    }
  }

  static async sendDonationReceipt(donationId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.DONATIONS).doc(donationId).update({
        receiptSent: true,
        receiptSentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error sending donation receipt:', error);
      return false;
    }
  }

  static async sendDonationThankYou(donationId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.DONATIONS).doc(donationId).update({
        thankYouSent: true,
        thankYouSentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error sending donation thank you:', error);
      return false;
    }
  }

  // Newsletter admin operations
  static async getNewsletterSubscribers() {
    const snapshot = await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async updateSubscriberStatus(subscriberId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        isActive: status === 'active',
        updatedAt: FieldValue.serverTimestamp()
      };
      
      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'unsubscribed') {
        updateData.unsubscribedAt = FieldValue.serverTimestamp();
      }
      
      await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).doc(subscriberId).update(updateData);
      return true;
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      return false;
    }
  }

  static async updateSubscriberPriority(subscriberId: string, priority: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).doc(subscriberId).update({
        priority,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating subscriber priority:', error);
      return false;
    }
  }

  static async deleteSubscriber(subscriberId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).doc(subscriberId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      return false;
    }
  }

  static async bulkUpdateSubscribers(action: string, subscriberIds: string[]): Promise<boolean> {
    try {
      const batch = db.batch();
      
      subscriberIds.forEach(subscriberId => {
        const docRef = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS).doc(subscriberId);
        
        if (action === 'delete') {
          batch.delete(docRef);
        } else if (action === 'subscribe') {
          batch.update(docRef, {
            status: 'active',
            isActive: true,
            updatedAt: FieldValue.serverTimestamp()
          });
        } else if (action === 'unsubscribe') {
          batch.update(docRef, {
            status: 'unsubscribed',
            isActive: false,
            unsubscribedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      return false;
    }
  }

  // Campaign operations
  static async getCampaigns(): Promise<Campaign[]> {
    try {
      const snapshot = await db.collection(COLLECTIONS.CAMPAIGNS)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Campaign[];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  static async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign | null> {
    try {
      const docRef = await db.collection(COLLECTIONS.CAMPAIGNS).add({
        ...campaignData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      
      // Get the created document
      const createdDoc = await docRef.get();
      
      if (createdDoc.exists) {
        return { id: createdDoc.id, ...createdDoc.data() } as Campaign;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  }

  static async updateCampaign(campaignId: string, campaignData: Partial<Omit<Campaign, 'id' | 'createdAt'>>): Promise<Campaign | null> {
    try {
      const updateData = {
        ...campaignData,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection(COLLECTIONS.CAMPAIGNS).doc(campaignId).update(updateData);
      
      // Get the updated document
      const updatedDoc = await db.collection(COLLECTIONS.CAMPAIGNS).doc(campaignId).get();
      
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as Campaign;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating campaign:', error);
      return null;
    }
  }

  static async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      await db.collection(COLLECTIONS.CAMPAIGNS).doc(campaignId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
  }

  static async sendCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const updateData = {
        status: 'sent',
        sentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection(COLLECTIONS.CAMPAIGNS).doc(campaignId).update(updateData);
      
      // Get the updated document
      const updatedDoc = await db.collection(COLLECTIONS.CAMPAIGNS).doc(campaignId).get();
      
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as Campaign;
      }
      
      return null;
    } catch (error) {
      console.error('Error sending campaign:', error);
      return null;
    }
  }

  // Utility method to clear a collection (for seeding)
  static async clearCollection(collectionName: string): Promise<void> {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
}
import { Router, Request, Response } from 'express';
import { FirebaseService } from '../services/firebaseService.js';

const router = Router();

// Get dashboard stats
router.get('/admin/dashboard/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const timeframe = req.query.timeframe as string || '7d';
    
    // Fetch data from all collections
    const [contacts, donations, events, blogPosts, volunteers, gallery, newsletters] = await Promise.allSettled([
      FirebaseService.getContacts(100),
      FirebaseService.getDonations(),
      FirebaseService.getEvents(false),
      FirebaseService.getBlogPosts(false, 50),
      FirebaseService.getVolunteerApplications(),
      FirebaseService.getGalleryItems(false),
      FirebaseService.getNewsletterSubscribers()
    ]);

    // Extract data safely
    const contactData = contacts.status === 'fulfilled' ? contacts.value : [];
    const donationData = donations.status === 'fulfilled' ? donations.value : [];
    const eventData = events.status === 'fulfilled' ? events.value : [];
    const blogData = blogPosts.status === 'fulfilled' ? blogPosts.value : [];
    const volunteerData = volunteers.status === 'fulfilled' ? volunteers.value : [];
    const galleryData = gallery.status === 'fulfilled' ? gallery.value : [];
    const newsletterData = newsletters.status === 'fulfilled' ? newsletters.value : [];

    // Calculate growth rates
    const calculateGrowth = (data: any[], dateField: string) => {
      if (!data || data.length === 0) return 0;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const thisMonthCount = data.filter(item => {
        if (!item[dateField]) return false;
        const date = item[dateField]._seconds ? 
          new Date(item[dateField]._seconds * 1000) : 
          new Date(item[dateField]);
        return date >= thisMonth;
      }).length;

      const lastMonthCount = data.filter(item => {
        if (!item[dateField]) return false;
        const date = item[dateField]._seconds ? 
          new Date(item[dateField]._seconds * 1000) : 
          new Date(item[dateField]);
        return date >= lastMonth && date < thisMonth;
      }).length;

      if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
      return Number(((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(1));
    };

    // Generate recent activity
    const recentActivity = [];
    
    // Recent donations
    donationData.slice(0, 2).forEach((donation: any) => {
      if (donation.createdAt) {
        const date = donation.createdAt._seconds ? 
          new Date(donation.createdAt._seconds * 1000) : 
          new Date(donation.createdAt);
        recentActivity.push({
          id: `donation-${donation.id}`,
          type: 'donation',
          message: `New donation of $${donation.amount} received`,
          time: getRelativeTime(date),
          user: donation.isAnonymous ? undefined : donation.donorName
        });
      }
    });

    // Recent contacts
    contactData.slice(0, 2).forEach((contact: any) => {
      if (contact.createdAt) {
        const date = contact.createdAt._seconds ? 
          new Date(contact.createdAt._seconds * 1000) : 
          new Date(contact.createdAt);
        recentActivity.push({
          id: `contact-${contact.id}`,
          type: 'contact',
          message: `New contact: ${contact.subject || 'General inquiry'}`,
          time: getRelativeTime(date),
          user: contact.name
        });
      }
    });

    // Recent blog posts
    blogData.slice(0, 1).forEach((blog: any) => {
      if (blog.publishedAt && blog.isPublished) {
        const date = blog.publishedAt._seconds ? 
          new Date(blog.publishedAt._seconds * 1000) : 
          new Date(blog.publishedAt);
        recentActivity.push({
          id: `blog-${blog.id}`,
          type: 'blog',
          message: `Blog post "${blog.title}" published`,
          time: getRelativeTime(date)
        });
      }
    });

    // Sort activity by most recent
    recentActivity.sort((a, b) => {
      const timeA = parseRelativeTime(a.time);
      const timeB = parseRelativeTime(b.time);
      return timeA - timeB;
    });

    const stats = {
      totalUsers: newsletterData.length, // Use newsletter subscribers as user count
      totalEvents: eventData.length,
      totalBlogPosts: blogData.length,
      totalGalleryItems: galleryData.length,
      totalDonations: donationData.length,
      totalContacts: contactData.length,
      monthlyGrowth: {
        users: calculateGrowth(newsletterData, 'createdAt'),
        events: calculateGrowth(eventData, 'createdAt'),
        donations: calculateGrowth(donationData, 'createdAt'),
        contacts: calculateGrowth(contactData, 'createdAt')
      },
      recentActivity: recentActivity.slice(0, 5)
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch dashboard stats'
      }
    });
  }
});

// Helper functions
function getRelativeTime(date: Date): string {
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

function parseRelativeTime(timeStr: string): number {
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

// Get all contact form submissions
router.get('/admin/contacts', async (_req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await FirebaseService.getContacts(100);
    
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Admin contacts error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch contact submissions'
      }
    });
  }
});

// Get programs
router.get('/admin/programs', async (_req: Request, res: Response): Promise<void> => {
  try {
    const programs = await FirebaseService.getPrograms();
    
    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Admin programs error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch programs'
      }
    });
  }
});

// Create program
router.post('/admin/programs', async (req: Request, res: Response): Promise<void> => {
  try {
    const programData = req.body;
    
    const newProgram = await FirebaseService.createProgram(programData);
    
    if (newProgram) {
      res.status(201).json({
        success: true,
        data: newProgram
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create program'
        }
      });
    }
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create program'
      }
    });
  }
});

// Update program
router.put('/admin/programs/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const programData = req.body;
    
    const updatedProgram = await FirebaseService.updateProgram(id, programData);
    
    if (updatedProgram) {
      res.status(200).json({
        success: true,
        data: updatedProgram
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update program'
        }
      });
    }
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update program'
      }
    });
  }
});

// Get events
router.get('/admin/events', async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await FirebaseService.getEvents(false); // Include inactive events
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Admin events error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch events'
      }
    });
  }
});

// Get blog posts
router.get('/admin/blog-posts', async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await FirebaseService.getBlogPosts(false, 50); // Include unpublished posts
    
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Admin blog posts error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch blog posts'
      }
    });
  }
});

// Create event
router.post('/admin/events', async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = req.body;
    
    const newEvent = await FirebaseService.createEvent(eventData);
    
    if (newEvent) {
      res.status(201).json({
        success: true,
        data: newEvent
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create event'
        }
      });
    }
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create event'
      }
    });
  }
});

// Update event
router.put('/admin/events/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    
    const updatedEvent = await FirebaseService.updateEvent(id, eventData);
    
    if (updatedEvent) {
      res.status(200).json({
        success: true,
        data: updatedEvent
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update event'
        }
      });
    }
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update event'
      }
    });
  }
});

// Delete event
router.delete('/admin/events/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteEvent(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Event deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete event'
        }
      });
    }
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete event'
      }
    });
  }
});

// Delete blog post
router.delete('/admin/blog-posts/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteBlogPost(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Blog post deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete blog post'
        }
      });
    }
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete blog post'
      }
    });
  }
});

// Create blog post
router.post('/admin/blog-posts', async (req: Request, res: Response): Promise<void> => {
  try {
    const postData = req.body;
    
    const newPost = await FirebaseService.createBlogPost(postData);
    
    if (newPost) {
      res.status(201).json({
        success: true,
        data: newPost
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create blog post'
        }
      });
    }
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create blog post'
      }
    });
  }
});

// Update blog post
router.put('/admin/blog-posts/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const postData = req.body;
    
    const updatedPost = await FirebaseService.updateBlogPost(id, postData);
    
    if (updatedPost) {
      res.status(200).json({
        success: true,
        data: updatedPost
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update blog post'
        }
      });
    }
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update blog post'
      }
    });
  }
});

// Toggle blog post publish status
router.patch('/admin/blog-posts/:id/publish', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    
    const success = await FirebaseService.updateBlogPostStatus(id, isPublished);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Blog post status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update blog post status'
        }
      });
    }
  } catch (error) {
    console.error('Update blog post status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update blog post status'
      }
    });
  }
});

// Get all gallery items
router.get('/admin/gallery', async (_req: Request, res: Response): Promise<void> => {
  try {
    const galleryItems = await FirebaseService.getGalleryItems(false); // Include inactive items
    
    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    console.error('Admin gallery error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch gallery items'
      }
    });
  }
});

// Create gallery item
router.post('/admin/gallery', async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryData = req.body;
    
    const newItem = await FirebaseService.createGalleryItem(galleryData);
    
    if (newItem) {
      res.status(201).json({
        success: true,
        data: newItem
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create gallery item'
        }
      });
    }
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create gallery item'
      }
    });
  }
});

// Update gallery item
router.put('/admin/gallery/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const galleryData = req.body;
    
    const updatedItem = await FirebaseService.updateGalleryItem(id, galleryData);
    
    if (updatedItem) {
      res.status(200).json({
        success: true,
        data: updatedItem
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update gallery item'
        }
      });
    }
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update gallery item'
      }
    });
  }
});

// Delete gallery item
router.delete('/admin/gallery/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteGalleryItem(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Gallery item deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete gallery item'
        }
      });
    }
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete gallery item'
      }
    });
  }
});

// Toggle gallery item status
router.patch('/admin/gallery/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const success = await FirebaseService.updateGalleryItemStatus(id, isActive);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Gallery item status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update gallery item status'
        }
      });
    }
  } catch (error) {
    console.error('Update gallery item status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update gallery item status'
      }
    });
  }
});

// Update contact status
router.patch('/admin/contacts/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const success = await FirebaseService.updateContactStatus(id, status, notes);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Contact status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update contact status'
        }
      });
    }
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update contact status'
      }
    });
  }
});

// Update contact priority
router.patch('/admin/contacts/:id/priority', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    const success = await FirebaseService.updateContactPriority(id, priority);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Contact priority updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update contact priority'
        }
      });
    }
  } catch (error) {
    console.error('Update contact priority error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update contact priority'
      }
    });
  }
});

// Delete contact
router.delete('/admin/contacts/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteContact(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Contact deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete contact'
        }
      });
    }
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete contact'
      }
    });
  }
});

// Update program status
router.patch('/admin/programs/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const success = await FirebaseService.updateProgramStatus(id, status);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Program status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update program status'
        }
      });
    }
  } catch (error) {
    console.error('Update program status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update program status'
      }
    });
  }
});

// Update program priority
router.patch('/admin/programs/:id/priority', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    const success = await FirebaseService.updateProgramPriority(id, priority);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Program priority updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update program priority'
        }
      });
    }
  } catch (error) {
    console.error('Update program priority error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update program priority'
      }
    });
  }
});

// Delete program
router.delete('/admin/programs/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteProgram(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Program deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete program'
        }
      });
    }
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete program'
      }
    });
  }
});

// Get all volunteer applications
router.get('/admin/volunteers', async (_req: Request, res: Response): Promise<void> => {
  try {
    const volunteers = await FirebaseService.getVolunteerApplications();
    
    res.status(200).json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    console.error('Admin volunteers error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch volunteer applications'
      }
    });
  }
});

// Update volunteer status
router.patch('/admin/volunteers/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const success = await FirebaseService.updateVolunteerStatus(id, status, notes);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Volunteer status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update volunteer status'
        }
      });
    }
  } catch (error) {
    console.error('Update volunteer status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update volunteer status'
      }
    });
  }
});

// Update volunteer priority
router.patch('/admin/volunteers/:id/priority', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    const success = await FirebaseService.updateVolunteerPriority(id, priority);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Volunteer priority updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update volunteer priority'
        }
      });
    }
  } catch (error) {
    console.error('Update volunteer priority error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update volunteer priority'
      }
    });
  }
});

// Delete volunteer application
router.delete('/admin/volunteers/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteVolunteerApplication(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Volunteer application deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete volunteer application'
        }
      });
    }
  } catch (error) {
    console.error('Delete volunteer application error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete volunteer application'
      }
    });
  }
});

// Get all donations
router.get('/admin/donations', async (_req: Request, res: Response): Promise<void> => {
  try {
    const donations = await FirebaseService.getDonations();
    
    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Admin donations error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch donations'
      }
    });
  }
});

// Update donation status
router.patch('/admin/donations/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const success = await FirebaseService.updateDonationStatus(id, status, notes);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Donation status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update donation status'
        }
      });
    }
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update donation status'
      }
    });
  }
});

// Update donation priority
router.patch('/admin/donations/:id/priority', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    const success = await FirebaseService.updateDonationPriority(id, priority);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Donation priority updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update donation priority'
        }
      });
    }
  } catch (error) {
    console.error('Update donation priority error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update donation priority'
      }
    });
  }
});

// Refund donation
router.patch('/admin/donations/:id/refund', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const success = await FirebaseService.refundDonation(id, reason);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Donation refunded successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to refund donation'
        }
      });
    }
  } catch (error) {
    console.error('Refund donation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to refund donation'
      }
    });
  }
});

// Delete donation
router.delete('/admin/donations/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteDonation(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Donation deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete donation'
        }
      });
    }
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete donation'
      }
    });
  }
});

// Send receipt
router.post('/admin/donations/:id/receipt', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.sendDonationReceipt(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Receipt sent successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to send receipt'
        }
      });
    }
  } catch (error) {
    console.error('Send receipt error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to send receipt'
      }
    });
  }
});

// Send thank you
router.post('/admin/donations/:id/thank-you', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.sendDonationThankYou(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Thank you message sent successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to send thank you message'
        }
      });
    }
  } catch (error) {
    console.error('Send thank you error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to send thank you message'
      }
    });
  }
});

// Get all newsletter subscribers
router.get('/admin/newsletter/subscribers', async (_req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await FirebaseService.getNewsletterSubscribers();
    
    res.status(200).json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    console.error('Admin newsletter subscribers error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch newsletter subscribers'
      }
    });
  }
});

// Update subscriber status
router.patch('/admin/newsletter/subscribers/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const success = await FirebaseService.updateSubscriberStatus(id, status, notes);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Subscriber status updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update subscriber status'
        }
      });
    }
  } catch (error) {
    console.error('Update subscriber status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update subscriber status'
      }
    });
  }
});

// Update subscriber priority
router.patch('/admin/newsletter/subscribers/:id/priority', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    const success = await FirebaseService.updateSubscriberPriority(id, priority);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Subscriber priority updated successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update subscriber priority'
        }
      });
    }
  } catch (error) {
    console.error('Update subscriber priority error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update subscriber priority'
      }
    });
  }
});

// Delete subscriber
router.delete('/admin/newsletter/subscribers/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.deleteSubscriber(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Subscriber deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to delete subscriber'
        }
      });
    }
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete subscriber'
      }
    });
  }
});

// Bulk action on subscribers
router.post('/admin/newsletter/bulk-action', async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, subscriberIds } = req.body;
    
    const success = await FirebaseService.bulkUpdateSubscribers(action, subscriberIds);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: `Bulk ${action} completed successfully` }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: `Failed to perform bulk ${action}`
        }
      });
    }
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to perform bulk action'
      }
    });
  }
});

// Create volunteer opportunity
router.post('/admin/volunteer-opportunities', async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunityData = req.body;
    
    const newOpportunity = await FirebaseService.createVolunteerOpportunity(opportunityData);
    
    if (newOpportunity) {
      res.status(201).json({
        success: true,
        data: newOpportunity
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create volunteer opportunity'
        }
      });
    }
  } catch (error) {
    console.error('Create volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create volunteer opportunity'
      }
    });
  }
});

// Campaign operations
router.get('/admin/campaigns', async (_req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await FirebaseService.getCampaigns();
    
    res.status(200).json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    console.error('Admin campaigns error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch campaigns'
      }
    });
  }
});

// Create campaign
router.post('/admin/campaigns', async (req: Request, res: Response): Promise<void> => {
  try {
    const campaignData = req.body;
    
    const newCampaign = await FirebaseService.createCampaign(campaignData);
    
    if (newCampaign) {
      res.status(201).json({
        success: true,
        data: newCampaign
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create campaign'
        }
      });
    }
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create campaign'
      }
    });
  }
});

// Update campaign
router.put('/admin/campaigns/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const campaignId = req.params.id;
    const campaignData = req.body;
    
    const updatedCampaign = await FirebaseService.updateCampaign(campaignId, campaignData);
    
    if (updatedCampaign) {
      res.status(200).json({
        success: true,
        data: updatedCampaign
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Campaign not found'
        }
      });
    }
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update campaign'
      }
    });
  }
});

// Delete campaign
router.delete('/admin/campaigns/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const campaignId = req.params.id;
    
    const success = await FirebaseService.deleteCampaign(campaignId);
    
    if (success) {
      res.status(200).json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Campaign not found'
        }
      });
    }
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete campaign'
      }
    });
  }
});

export default router;
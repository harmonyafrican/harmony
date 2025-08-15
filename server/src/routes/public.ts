import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validation.js';
import { FirebaseService } from '../services/firebaseService.js';
import { z } from 'zod';

const router = Router();

// Newsletter subscription schema
const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferences: z.object({
    newsletter: z.boolean().default(true),
    events: z.boolean().default(false),
    programs: z.boolean().default(false),
    volunteering: z.boolean().default(false),
  }).optional(),
});

// Get public programs
router.get('/programs', async (_req: Request, res: Response): Promise<void> => {
  try {
    const programs = await FirebaseService.getPrograms('active');
    
    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Public programs error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch programs'
      }
    });
  }
});

// Get public events
router.get('/events', async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await FirebaseService.getEvents(true);
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Public events error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch events'
      }
    });
  }
});

// Get published blog posts
router.get('/blog', async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await FirebaseService.getBlogPosts(true, 20);
    
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Public blog error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch blog posts'
      }
    });
  }
});

// Newsletter subscription
router.post('/newsletter/subscribe', validateBody(NewsletterSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const subscriberData = req.body;
    
    const subscriberId = await FirebaseService.subscribeToNewsletter(subscriberData);
    
    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: { subscriberId }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to subscribe to newsletter'
      }
    });
  }
});

// Get impact metrics
router.get('/impact/metrics', async (_req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await FirebaseService.getImpactMetrics();
    
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Impact metrics error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch impact metrics'
      }
    });
  }
});

// Get success stories
router.get('/impact/stories', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const featured = req.query.featured === 'true';
    
    const stories = featured 
      ? await FirebaseService.getFeaturedSuccessStories()
      : await FirebaseService.getSuccessStories(limit);
    
    res.status(200).json({
      success: true,
      data: stories
    });
  } catch (error) {
    console.error('Success stories error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch success stories'
      }
    });
  }
});

// Get regional impact
router.get('/impact/regional', async (_req: Request, res: Response): Promise<void> => {
  try {
    const regionalData = await FirebaseService.getRegionalImpact();
    
    res.status(200).json({
      success: true,
      data: regionalData
    });
  } catch (error) {
    console.error('Regional impact error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch regional impact data'
      }
    });
  }
});

// Get gallery items
router.get('/gallery', async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const limit = parseInt(req.query.limit as string) || undefined;
    
    let galleryItems;
    
    if (category && category !== 'all') {
      galleryItems = await FirebaseService.getGalleryItemsByCategory(category, limit);
    } else {
      galleryItems = await FirebaseService.getGalleryItems(true);
    }
    
    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch gallery items'
      }
    });
  }
});

// Get gallery statistics
router.get('/gallery/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await FirebaseService.getGalleryStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Gallery stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch gallery statistics'
      }
    });
  }
});

// Like a gallery item
router.post('/gallery/:id/like', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await FirebaseService.likeGalleryItem(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: { message: 'Gallery item liked successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to like gallery item'
        }
      });
    }
  } catch (error) {
    console.error('Gallery like error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to like gallery item'
      }
    });
  }
});

export default router;
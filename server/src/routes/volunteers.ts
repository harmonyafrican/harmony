import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validation.js';
import { VolunteerApplicationSchema } from '../types/index.js';
import { FirebaseService } from '../services/firebaseService.js';

const router = Router();

router.post('/volunteer/apply', validateBody(VolunteerApplicationSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteerData = req.body;
    
    // Save to Firestore
    const applicationId = await FirebaseService.createVolunteerApplication(volunteerData);
    
    console.log('Volunteer application saved with ID:', applicationId);
    
    // TODO: Send confirmation email to volunteer
    // TODO: Send notification email to admin
    
    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully! We will review your application and contact you soon.',
      data: {
        applicationId
      }
    });
  } catch (error) {
    console.error('Volunteer application error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit volunteer application'
      }
    });
  }
});

router.get('/volunteer/opportunities', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get opportunities from Firestore
    const opportunities = await FirebaseService.getVolunteerOpportunities();

    res.status(200).json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    console.error('Volunteer opportunities error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch volunteer opportunities'
      }
    });
  }
});

export default router;
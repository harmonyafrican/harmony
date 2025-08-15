import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validation.js';
import { ContactFormSchema } from '../types/index.js';
import { FirebaseService } from '../services/firebaseService.js';

const router = Router();

router.post('/contact', validateBody(ContactFormSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Save to Firestore
    const contactId = await FirebaseService.createContact({
      name,
      email,
      phone,
      subject,
      message
    });
    
    console.log('Contact form submission saved with ID:', contactId);
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      data: { contactId }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit contact form'
      }
    });
  }
});

export default router;
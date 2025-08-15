import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validation.js';
import { DonationSchema } from '../types/index.js';
import { FirebaseService } from '../services/firebaseService.js';

const router = Router();

router.post('/donate', validateBody(DonationSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, donorName, donorEmail, isAnonymous, message } = req.body;
    
    // Save to Firestore
    const donationId = await FirebaseService.createDonation({
      amount,
      currency,
      donorName,
      donorEmail,
      isAnonymous,
      message,
      paymentStatus: 'pending'
    });
    
    // TODO: Implement payment processing logic here (Stripe, PayPal, etc.)
    // For demo purposes, we'll mark as completed
    await FirebaseService.updateDonationStatus(donationId, 'completed', `TXN_${Date.now()}`);
    
    console.log('Donation saved with ID:', donationId);
    
    res.status(200).json({
      success: true,
      message: 'Thank you for your donation! Processing completed.',
      data: {
        donationId,
        transactionId: `TXN_${Date.now()}`,
        amount,
        currency
      }
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process donation'
      }
    });
  }
});

router.get('/donations/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get actual stats from Firestore
    const stats = await FirebaseService.getDonationStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Donation stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch donation statistics'
      }
    });
  }
});

export default router;
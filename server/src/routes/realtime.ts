import { Router, Request, Response } from 'express';
import { FirebaseService } from '../services/firebaseService.js';

const router = Router();

// Server-Sent Events endpoint for real-time donations
router.get('/realtime/donations', (req: Request, res: Response): void => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time donations feed connected' })}\n\n`);

  // Set up Firebase listener
  const unsubscribe = FirebaseService.listenToDonations((donations) => {
    const data = {
      type: 'donations',
      data: donations
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  // Clean up on client disconnect
  req.on('close', () => {
    unsubscribe();
    res.end();
  });

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000); // Every 30 seconds

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// Server-Sent Events endpoint for real-time contact forms
router.get('/realtime/contacts', (req: Request, res: Response): void => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time contacts feed connected' })}\n\n`);

  // Set up Firebase listener
  const unsubscribe = FirebaseService.listenToContactForms((contacts) => {
    const data = {
      type: 'contacts',
      data: contacts
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  // Clean up on client disconnect
  req.on('close', () => {
    unsubscribe();
    res.end();
  });

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000); // Every 30 seconds

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// WebSocket alternative for real-time stats
router.get('/realtime/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await FirebaseService.getDonationStats();
    
    res.status(200).json({
      success: true,
      data: {
        ...stats,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Real-time stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch real-time statistics'
      }
    });
  }
});

// Admin real-time events endpoint
router.get('/admin/realtime/events', (req: Request, res: Response): void => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ 
    type: 'connected', 
    message: 'Admin real-time events feed connected',
    timestamp: new Date().toISOString()
  })}\n\n`);

  // Set up listeners for different data types
  const unsubscribes: (() => void)[] = [];

  // Listen to donations
  const donationsUnsub = FirebaseService.listenToDonations((donations) => {
    res.write(`data: ${JSON.stringify({
      type: 'donations_update',
      data: donations,
      timestamp: new Date().toISOString()
    })}\n\n`);
  });
  unsubscribes.push(donationsUnsub);

  // Listen to contacts
  const contactsUnsub = FirebaseService.listenToContactForms((contacts) => {
    res.write(`data: ${JSON.stringify({
      type: 'contacts_update',
      data: contacts,
      timestamp: new Date().toISOString()
    })}\n\n`);
  });
  unsubscribes.push(contactsUnsub);

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ 
      type: 'heartbeat', 
      timestamp: new Date().toISOString() 
    })}\n\n`);
  }, 30000); // Every 30 seconds

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribes.forEach(unsub => unsub());
    res.end();
  });
});

export default router;
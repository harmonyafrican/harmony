import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../models/index.js';
import { FieldValue } from 'firebase-admin/firestore';

const eventsData = [
  {
    originalId: 1,
    title: 'Youth Innovation Challenge 2024',
    description: 'Annual competition where young innovators present solutions to community challenges using technology and creativity.',
    eventDate: new Date('2024-09-15'),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Kigali Convention Centre',
    address: 'KG 2 Roundabout, Kigali',
    eventType: 'competition',
    category: 'competition',
    tags: ['Innovation', 'Technology', 'Youth'],
    maxAttendees: 500,
    registeredAttendees: 347,
    ticketPrice: 0, // Free
    priceDisplay: 'Free',
    isActive: true,
    isFeatured: true,
    status: 'upcoming',
    image: 'https://i.postimg.cc/VsC4K8xG/innovation-challenge.jpg',
    organizer: 'Harmony Africa Foundation',
    highlights: [
      'Tech startup pitch competition',
      'Mentorship from industry leaders',
      'Prize pool of $10,000',
      'Networking opportunities',
      'Media coverage'
    ],
    registrationDeadline: new Date('2024-09-10'),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    originalId: 2,
    title: 'Digital Skills Workshop Series',
    description: 'Comprehensive 3-day workshop covering web development, digital marketing, and data analysis for aspiring tech professionals.',
    eventDate: new Date('2024-08-20'),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    location: 'Innovation Lab Rwanda',
    address: 'Nyarugenge District, Kigali',
    eventType: 'workshop',
    category: 'workshop',
    tags: ['Skills', 'Technology', 'Career'],
    maxAttendees: 50,
    registeredAttendees: 48,
    ticketPrice: 25,
    priceDisplay: '$25',
    isActive: true,
    isFeatured: false,
    status: 'upcoming',
    image: 'https://i.postimg.cc/DZRM7NgK/digital-skills-workshop.jpg',
    organizer: 'Tech Partners Rwanda',
    highlights: [
      'Hands-on coding sessions',
      'Industry expert instructors',
      'Certificate of completion',
      'Job placement assistance',
      'Take-home projects'
    ],
    registrationDeadline: new Date('2024-08-15'),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    originalId: 3,
    title: 'Annual Fundraising Gala',
    description: 'Join us for an elegant evening of music, dining, and inspiration as we raise funds for our educational programs.',
    eventDate: new Date('2024-10-12'),
    startTime: '06:00 PM',
    endTime: '11:00 PM',
    location: 'Marriott Hotel Kigali',
    address: 'KN 3 Ave, Kigali',
    eventType: 'fundraiser',
    category: 'fundraising',
    tags: ['Fundraising', 'Gala', 'Education'],
    maxAttendees: 300,
    registeredAttendees: 180,
    ticketPrice: 100,
    priceDisplay: '$100',
    isActive: true,
    isFeatured: true,
    status: 'upcoming',
    image: 'https://i.postimg.cc/BnRqMq7X/fundraising-gala.jpg',
    organizer: 'Harmony Africa Foundation',
    highlights: [
      'Live entertainment',
      'Silent auction',
      'Keynote speakers',
      'Gourmet dinner',
      'Award ceremony'
    ],
    registrationDeadline: new Date('2024-10-08'),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    originalId: 4,
    title: 'Women in Tech Networking Event',
    description: 'Empowering women in technology through mentorship, skill-building workshops, and professional networking.',
    eventDate: new Date('2024-09-05'),
    startTime: '05:30 PM',
    endTime: '08:30 PM',
    location: 'Impact Hub Kigali',
    address: 'Norrsken House, Kigali',
    eventType: 'networking',
    category: 'networking',
    tags: ['Women', 'Technology', 'Networking'],
    maxAttendees: 80,
    registeredAttendees: 65,
    ticketPrice: 0,
    priceDisplay: 'Free',
    isActive: true,
    isFeatured: true,
    status: 'upcoming',
    image: 'https://i.postimg.cc/MKcq3nLm/women-in-tech.jpg',
    organizer: 'Women Tech Network',
    highlights: [
      'Panel discussions',
      'Speed networking',
      'Mentorship matching',
      'Skill-building workshops',
      'Career opportunities'
    ],
    registrationDeadline: new Date('2024-09-01'),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  // TalentPulse Camp Registration Event
  {
    originalId: 5,
    title: 'TalentPulse Artist Development Camp - Application Open',
    description: 'Apply now for our intensive one-week Artist Development & Life Skills Camp! Limited to 10 selected young artists across music, dance, poetry, and visual arts. This flagship program offers mentorship, studio access, and public showcase opportunities.',
    eventDate: new Date('2025-10-06'), // Start date of the camp
    startTime: '08:00 AM',
    endTime: '08:00 PM',
    location: 'Live Life Freestyle Ltd, Kicukiro',
    address: 'Gatenga, Kicukiro District, Kigali',
    eventType: 'workshop',
    category: 'workshop',
    tags: ['Talent Development', 'Arts', 'Music', 'Life Skills'],
    maxAttendees: 10, // Very limited spots
    registeredAttendees: 0, // Just opened
    ticketPrice: 0, // Free to apply
    priceDisplay: 'Free Application',
    isActive: true,
    isFeatured: true,
    status: 'upcoming',
    image: 'https://i.postimg.cc/qqxBgd4D/talent-pulse-camp.jpg',
    organizer: 'Harmony Africa Foundation',
    highlights: [
      'Intensive artistic mentoring and masterclasses',
      'Life skills workshops (financial literacy, mental health)',
      'Studio sessions and production resources',
      'Public showcase and final exhibition',
      'Media asset production (videos, podcasts)',
      'Community engagement and sports activations',
      'Post-camp mentorship pathway integration',
      'Accommodation and meals provided'
    ],
    registrationDeadline: new Date('2025-09-15'), // Application deadline
    
    // TalentPulse specific details
    campDuration: '7 days (October 6-12, 2025)',
    selectionProcess: 'Application review, interviews, and skill assessments',
    partnerships: [
      'Live Life Freestyle Ltd - Venue & production partner',
      'Rafiki Club - Showcase partner',
      'Kigali Universe - Sports activations partner'
    ],
    applicationRequirements: [
      'Age 16-30 years',
      'Demonstrated artistic talent in music, dance, poetry, or visual arts',
      'Commitment to full week participation',
      'Available for post-camp mentorship programs',
      'Portfolio or demo submission required'
    ],
    campSchedule: {
      morning: '08:00-12:00 - Masterclasses, studio sessions, rehearsals',
      afternoon: '14:00-17:00 - Life-skills workshops, community service',
      evening: '18:30-20:00 - Open mic, talent exchange, mentor feedback'
    },
    
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];

export async function seedEvents() {
  try {
    console.log('🎪 Starting to seed events data...');
    
    // Check if events already exist
    const existingEvents = await db.collection(COLLECTIONS.EVENTS).get();
    
    if (!existingEvents.empty) {
      console.log('⚠️  Events already exist in the database. Skipping seeding.');
      console.log(`📊 Found ${existingEvents.size} existing events.`);
      return false;
    }

    // Seed each event
    const batch = db.batch();
    
    for (const event of eventsData) {
      const { originalId, ...eventWithoutId } = event;
      const docRef = db.collection(COLLECTIONS.EVENTS).doc();
      
      const eventDocument = {
        ...eventWithoutId,
        originalId: originalId,
      };
      
      batch.set(docRef, eventDocument);
    }
    
    await batch.commit();
    
    console.log('✅ Successfully seeded events data!');
    console.log(`📊 Added ${eventsData.length} events to the database.`);
    
    // Log each event
    eventsData.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   📅 Date: ${event.eventDate.toDateString()}`);
      console.log(`   📍 Location: ${event.location}`);
      console.log(`   💰 Price: ${event.priceDisplay}`);
      console.log(`   👥 Capacity: ${event.maxAttendees} attendees`);
      if (event.originalId === 5) {
        console.log(`   🎭 TalentPulse Camp: ${event.campDuration}`);
      }
    });
    
    // Verify the seeded data
    const verifySnapshot = await db.collection(COLLECTIONS.EVENTS).get();
    console.log(`🔍 Verification: Found ${verifySnapshot.size} events in database.`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding events data:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEvents()
    .then((success) => {
      if (success) {
        console.log('🎉 Events seeding completed!');
        process.exit(0);
      } else {
        console.log('⏭️  Events already exist, skipping seeding.');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('💥 Events seeding failed:', error);
      process.exit(1);
    });
}
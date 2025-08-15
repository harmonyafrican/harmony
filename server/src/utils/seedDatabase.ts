import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../models/index.js';
import { FieldValue } from 'firebase-admin/firestore';
import { volunteerOpportunities } from './seedVolunteers.js';

interface DonationTier {
  amount: number;
  impact: string;
  icon: string;
}

interface ProgramData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  ageGroup: string;
  location: string;
  features: string[];
  color: string;
  bgColor: string;
  participants: string;
  successRate: string;
  donationTiers: DonationTier[];
  requirements: string[];
  benefits: string[];
  status: 'active' | 'inactive';
  category: string;
}

const programsData: ProgramData[] = [
  {
    id: 1,
    title: 'Talent Development Program',
    subtitle: 'Discover & Nurture Hidden Talents',
    description: 'A comprehensive program designed to identify, nurture, and showcase the unique talents of children and youth across diverse fields including arts, technology, sports, and leadership.',
    duration: '6-12 months',
    ageGroup: '8-25 years',
    location: 'Multiple centers across Rwanda',
    features: [
      'Talent assessment and profiling',
      'Personalized development plans',
      'Mentorship from industry experts',
      'Performance opportunities',
      'Scholarship pathways'
    ],
    color: 'from-amber-400 to-orange-500',
    bgColor: 'from-amber-50 to-orange-50',
    participants: '500+',
    successRate: '95%',
    donationTiers: [
      { amount: 50, impact: 'Provides talent assessment for one youth', icon: '🎭' },
      { amount: 100, impact: 'Funds one month of mentorship sessions', icon: '👨‍🏫' },
      { amount: 250, impact: 'Sponsors performance showcase event', icon: '🎪' },
      { amount: 500, impact: 'Supports full program for one participant', icon: '🌟' }
    ],
    requirements: ['Age 8-25 years', 'Passion for learning', 'Commitment to program duration', 'Parental consent (if under 18)'],
    benefits: ['Professional mentorship', 'Skill development workshops', 'Performance opportunities', 'Networking with industry experts', 'Certificate of completion'],
    status: 'active',
    category: 'talent-development'
  },
  {
    id: 2,
    title: 'Educational Support Initiative',
    subtitle: 'Breaking Barriers to Quality Education',
    description: 'Providing scholarships, learning materials, digital literacy programs, and access to technological resources for underserved communities across Rwanda.',
    duration: 'Academic year',
    ageGroup: '6-18 years',
    location: 'Rural and urban communities',
    features: [
      'Full and partial scholarships',
      'Digital learning platforms',
      'Learning materials provision',
      'After-school tutoring',
      'Career guidance programs'
    ],
    color: 'from-blue-400 to-purple-500',
    bgColor: 'from-blue-50 to-purple-50',
    participants: '1200+',
    successRate: '92%',
    donationTiers: [
      { amount: 30, impact: 'Provides school supplies for one month', icon: '📚' },
      { amount: 75, impact: 'Funds digital learning materials', icon: '💻' },
      { amount: 200, impact: 'Sponsors full semester scholarship', icon: '🎓' },
      { amount: 400, impact: 'Supports complete academic year', icon: '🏆' }
    ],
    requirements: ['Age 6-18 years', 'Academic need demonstration', 'Regular attendance commitment', 'Community involvement'],
    benefits: ['Full/partial scholarships', 'Learning materials', 'Digital literacy training', 'Career guidance', 'Academic support'],
    status: 'active',
    category: 'education'
  },
  {
    id: 3,
    title: 'Innovation & Tech Labs',
    subtitle: 'Building Tomorrow\'s Tech Leaders',
    description: 'Hands-on technology training, coding bootcamps, innovation challenges, and entrepreneurship programs to prepare youth for the digital economy.',
    duration: '3-9 months',
    ageGroup: '12-30 years',
    location: 'Tech hubs in major cities',
    features: [
      'Coding and programming courses',
      'Innovation challenges',
      'Startup incubation support',
      'Industry partnerships',
      'Internship placements'
    ],
    color: 'from-purple-400 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
    participants: '800+',
    successRate: '88%',
    donationTiers: [
      { amount: 60, impact: 'Provides coding workshop materials', icon: '👩‍💻' },
      { amount: 150, impact: 'Funds innovation project startup kit', icon: '🚀' },
      { amount: 300, impact: 'Sponsors tech lab equipment', icon: '⚙️' },
      { amount: 600, impact: 'Supports complete bootcamp program', icon: '🏭' }
    ],
    requirements: ['Age 12-30 years', 'Basic computer skills', 'Innovation mindset', 'Project commitment'],
    benefits: ['Hands-on coding training', 'Innovation challenges', 'Startup mentorship', 'Industry connections', 'Job placement support'],
    status: 'active',
    category: 'technology'
  },
  {
    id: 4,
    title: 'Community Engagement Program',
    subtitle: 'Strengthening Communities Together',
    description: 'Mobilizing parents, local leaders, and youth mentors to foster a supportive environment for growth and development within communities.',
    duration: 'Ongoing',
    ageGroup: 'All ages',
    location: 'Community centers nationwide',
    features: [
      'Parent education workshops',
      'Community leader training',
      'Youth mentor programs',
      'Local partnership development',
      'Community impact projects'
    ],
    color: 'from-green-400 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    participants: '2000+',
    successRate: '90%',
    donationTiers: [
      { amount: 25, impact: 'Supports one family workshop session', icon: '👨‍👩‍👧‍👦' },
      { amount: 80, impact: 'Funds community center activities', icon: '🏢' },
      { amount: 180, impact: 'Sponsors mentor training program', icon: '🤝' },
      { amount: 350, impact: 'Establishes new community center', icon: '🌍' }
    ],
    requirements: ['Community involvement', 'Leadership potential', 'Commitment to service', 'Local residency'],
    benefits: ['Leadership training', 'Community project funding', 'Networking opportunities', 'Skill development', 'Social impact creation'],
    status: 'active',
    category: 'community'
  }
];

export async function seedPrograms() {
  try {
    console.log('🌱 Starting to seed programs data...');
    
    // Check if programs already exist
    const existingPrograms = await db.collection(COLLECTIONS.PROGRAMS).get();
    
    if (!existingPrograms.empty) {
      console.log('⚠️  Programs already exist in the database. Skipping seeding.');
      console.log(`📊 Found ${existingPrograms.size} existing programs.`);
      return;
    }

    // Seed each program
    const batch = db.batch();
    
    for (const program of programsData) {
      const { id, ...programWithoutId } = program;
      const docRef = db.collection(COLLECTIONS.PROGRAMS).doc();
      
      const programDocument = {
        ...programWithoutId,
        originalId: id,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        isActive: true,
        applicationCount: 0,
        donationCount: 0,
        totalDonations: 0
      };
      
      batch.set(docRef, programDocument);
    }
    
    await batch.commit();
    
    console.log('✅ Successfully seeded programs data!');
    console.log(`📊 Added ${programsData.length} programs to the database.`);
    
    // Verify the seeded data
    const verifySnapshot = await db.collection(COLLECTIONS.PROGRAMS).get();
    console.log(`🔍 Verification: Found ${verifySnapshot.size} programs in database.`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding programs data:', error);
    throw error;
  }
}

export async function seedSampleData() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Seed programs
    await seedPrograms();
    
    // Add comprehensive volunteer opportunities
    console.log('🌱 Seeding volunteer opportunities...');
    const enhancedVolunteerOpportunities = volunteerOpportunities.map(opportunity => ({
      ...opportunity,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }));
    
    const volunteerBatch = db.batch();
    enhancedVolunteerOpportunities.forEach(opportunity => {
      const docRef = db.collection(COLLECTIONS.VOLUNTEERS).doc();
      volunteerBatch.set(docRef, opportunity);
    });
    await volunteerBatch.commit();
    
    // Add sample events
    console.log('🌱 Seeding events...');
    const sampleEvents = [
      {
        title: 'Annual Talent Showcase',
        description: 'A celebration of youth talents across all our programs',
        eventDate: new Date('2025-09-15'),
        location: 'Kigali Convention Centre',
        maxAttendees: 500,
        registeredAttendees: 0,
        isActive: true,
        category: 'showcase',
        registrationDeadline: new Date('2025-09-01'),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      {
        title: 'Innovation Challenge Final',
        description: 'Youth present their innovative solutions to real-world problems',
        eventDate: new Date('2025-08-20'),
        location: 'kLab Rwanda',
        maxAttendees: 200,
        registeredAttendees: 0,
        isActive: true,
        category: 'competition',
        registrationDeadline: new Date('2025-08-10'),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      }
    ];
    
    const eventsBatch = db.batch();
    sampleEvents.forEach(event => {
      const docRef = db.collection(COLLECTIONS.EVENTS).doc();
      eventsBatch.set(docRef, event);
    });
    await eventsBatch.commit();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Seeded data includes:');
    console.log('   • 4 comprehensive programs');
    console.log(`   • ${volunteerOpportunities.length} comprehensive volunteer opportunities`);
    console.log('   • 2 upcoming events');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSampleData()
    .then(() => {
      console.log('🎉 Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}
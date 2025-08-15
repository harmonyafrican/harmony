import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../models/index.js';
import { FieldValue } from 'firebase-admin/firestore';

const programsData = [
  {
    originalId: 1,
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
    category: 'talent-development',
    isActive: true,
    applicationCount: 0,
    donationCount: 0,
    totalDonations: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    originalId: 2,
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
    category: 'education',
    isActive: true,
    applicationCount: 0,
    donationCount: 0,
    totalDonations: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    originalId: 3,
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
    category: 'technology',
    isActive: true,
    applicationCount: 0,
    donationCount: 0,
    totalDonations: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    originalId: 4,
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
    category: 'community',
    isActive: true,
    applicationCount: 0,
    donationCount: 0,
    totalDonations: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];

async function seedProgramsDirectly() {
  try {
    console.log('🌱 Starting direct seeding of programs...');
    
    // Seed programs one by one
    for (const program of programsData) {
      try {
        const docRef = await db.collection(COLLECTIONS.PROGRAMS).add(program);
        console.log(`✅ Added program: ${program.title} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`❌ Failed to add program: ${program.title}`, error);
      }
    }
    
    console.log('🎉 Program seeding completed!');
    
    // Try to verify the data
    try {
      const snapshot = await db.collection(COLLECTIONS.PROGRAMS).get();
      console.log(`🔍 Verification: Found ${snapshot.size} programs in database`);
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        console.log(`  - ${data.title}`);
      });
    } catch (verifyError) {
      console.log('⚠️  Could not verify seeded data, but programs should be added.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return false;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProgramsDirectly()
    .then((success) => {
      if (success) {
        console.log('🚀 Database seeded successfully!');
        process.exit(0);
      } else {
        console.log('💥 Seeding failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { seedProgramsDirectly };
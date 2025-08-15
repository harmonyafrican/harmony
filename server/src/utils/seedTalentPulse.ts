import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../models/index.js';
import { FieldValue } from 'firebase-admin/firestore';

const talentPulseProgram = {
  originalId: 5,
  title: 'TalentPulse — Artist Development & Life Skills Camp',
  subtitle: 'One-Week Intensive Artist Development Program',
  description: 'A focused, one-week Artist Development & Life Skills Camp designed to accelerate artistic skill, professionalism, and community impact for 10 selected young artists across music, dance, poetry, and visual arts. The camp serves as a pilot flagship activity under Harmony Africa\'s Champion Talent Empowerment program.',
  duration: '1 week (7 days)',
  ageGroup: 'Young artists (16-30 years)',
  location: 'Live Life Freestyle Ltd (Kicukiro, Gatenga) & Rafiki Club',
  features: [
    'Intensive artistic mentoring and masterclasses',
    'Life skills workshops (financial literacy, mental health)',
    'Studio sessions and production resources',
    'Public showcase and final exhibition',
    'Media asset production (videos, podcasts)',
    'Community engagement and sports activations',
    'Post-camp mentorship pathway integration'
  ],
  color: 'from-indigo-400 to-purple-600',
  bgColor: 'from-indigo-50 to-purple-50',
  participants: '10 selected artists',
  successRate: 'Pilot program',
  donationTiers: [
    { amount: 100, impact: 'Sponsors meals for one artist for the week', icon: '🍽️' },
    { amount: 250, impact: 'Funds workshop materials and equipment', icon: '🎨' },
    { amount: 500, impact: 'Covers accommodation for one artist', icon: '🏠' },
    { amount: 1000, impact: 'Sponsors full participation for one artist', icon: '🌟' },
    { amount: 2500, impact: 'Becomes a major program sponsor with branding', icon: '🎯' }
  ],
  requirements: [
    'Demonstrated artistic talent in music, dance, poetry, or visual arts',
    'Age 16-30 years',
    'Commitment to full week participation',
    'Available for post-camp mentorship programs',
    'Selection through talent detection events or interviews'
  ],
  benefits: [
    'Intensive artistic skill development',
    'Professional life skills training',
    'Studio access and production resources',
    'Public showcase opportunity',
    'Media content creation',
    'Industry mentorship connections',
    'Integration into ongoing Harmony Africa programs',
    'Certificates and awards recognition'
  ],
  status: 'active',
  category: 'talent-development',
  isActive: true,
  applicationCount: 0,
  donationCount: 0,
  totalDonations: 0,
  
  // Additional TalentPulse-specific details
  proposedDates: 'October 6-12, 2025 (tentative)',
  budget: {
    total: 8030000, // RWF
    currency: 'RWF',
    usdEquivalent: 6500,
    breakdown: {
      accommodationMeals: 2400000,
      trainersFacilitators: 2600000,
      venueLogistics: 1400000,
      productionShowcase: 900000,
      contingency: 730000
    }
  },
  
  partnerships: [
    'Live Life Freestyle Ltd - Venue, accommodation, production partner',
    'Rafiki Club (Nyamirambo Youth Center) - Showcase & sports partner',
    'Kigali Universe - Sports activations & audience engagement',
    'Local media partners - Radio, livestream platforms',
    'District and cultural authorities - Endorsement & outreach'
  ],
  
  dailySchedule: {
    morning: '08:00-12:00 - Masterclasses, studio sessions, rehearsals',
    afternoon: '14:00-17:00 - Life-skills workshops, community service, sports activation',
    evening: '18:30-20:00 - Open mic, talent exchange, mentor feedback',
    day6: 'Community engagement + sports activations at Rafiki/Kigali Universe',
    day7: 'Final rehearsal + Public TalentPulse Showcase & Exhibition'
  },
  
  objectives: [
    'Deliver high-quality artistic mentoring and final public showcase',
    'Teach practical life skills and digital promotion',
    'Produce media assets for communications and sponsor ROI',
    'Secure sponsorships and create repeatable sponsor packages',
    'Integrate participants into ongoing mentorship pathways',
    'Promote Harmony Africa\'s mission of youth empowerment'
  ],
  
  kpis: [
    'On-site attendees at showcase',
    'Social and media reach (impressions, views)',
    'Number of media assets produced',
    'Youth engaged through community outreach',
    'Sponsor deliverables completed',
    'Follow-up mentorship placements'
  ],
  
  projectManager: {
    name: 'Jean Marie Irakoze',
    organization: 'Harmony Africa',
    email: 'info@harmonyafrica.org',
    phone: '+250785300820'
  },
  
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp()
};

export async function seedTalentPulse() {
  try {
    console.log('🎭 Starting to seed TalentPulse program...');
    
    // Check if TalentPulse already exists
    const existingSnapshot = await db.collection(COLLECTIONS.PROGRAMS)
      .where('title', '==', 'TalentPulse — Artist Development & Life Skills Camp')
      .get();
    
    if (!existingSnapshot.empty) {
      console.log('⚠️  TalentPulse program already exists in the database.');
      console.log(`📊 Found existing TalentPulse program with ID: ${existingSnapshot.docs[0]?.id}`);
      return false;
    }
    
    // Add TalentPulse program
    const docRef = await db.collection(COLLECTIONS.PROGRAMS).add(talentPulseProgram);
    
    console.log(`✅ Successfully added TalentPulse program with ID: ${docRef.id}`);
    console.log('📊 Program details:');
    console.log(`   • Title: ${talentPulseProgram.title}`);
    console.log(`   • Duration: ${talentPulseProgram.duration}`);
    console.log(`   • Participants: ${talentPulseProgram.participants}`);
    console.log(`   • Budget: RWF ${talentPulseProgram.budget.total.toLocaleString()} (USD ${talentPulseProgram.budget.usdEquivalent})`);
    console.log(`   • Proposed dates: ${talentPulseProgram.proposedDates}`);
    
    // Verify the addition
    const verifySnapshot = await db.collection(COLLECTIONS.PROGRAMS).get();
    console.log(`🔍 Total programs in database: ${verifySnapshot.size}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding TalentPulse program:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTalentPulse()
    .then((success) => {
      if (success) {
        console.log('🎉 TalentPulse program seeding completed!');
        process.exit(0);
      } else {
        console.log('⏭️  TalentPulse program already exists, skipping.');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('💥 TalentPulse seeding failed:', error);
      process.exit(1);
    });
}
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../models/index.js';
import { FieldValue } from 'firebase-admin/firestore';

// Impact Metrics Data
const impactMetricsData = [
  {
    number: '1,551',
    label: 'Lives Transformed',
    category: 'lives_transformed',
    icon: 'heart',
    color: 'from-pink-400 to-rose-500',
    description: 'Total number of youth whose lives have been positively transformed through our programs',
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    number: '91%',
    label: 'Success Rate',
    category: 'success_rate',
    icon: 'trending-up',
    color: 'from-green-400 to-emerald-500',
    description: 'Overall success rate across all our programs and initiatives',
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    number: '91',
    label: 'Communities Reached',
    category: 'communities',
    icon: 'globe',
    color: 'from-blue-400 to-cyan-500',
    description: 'Number of communities across Rwanda where we have active programs',
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    number: '38',
    label: 'Active Programs',
    category: 'programs',
    icon: 'award',
    color: 'from-amber-400 to-orange-500',
    description: 'Number of currently active programs running across all provinces',
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];

// Success Stories Data - aligned with our programs
const successStoriesData = [
  {
    name: 'Marie Claire Uwimana',
    age: '19',
    location: 'Western Province, Rusizi',
    program: 'Innovation & Tech Labs',
    programId: null, // Will be linked after program seeding
    story: 'From a rural community in Western Rwanda, Marie Claire learned web development through our coding bootcamp. She now works as a junior developer and mentors other young women in tech.',
    achievement: 'Now earning 3x minimum wage and supporting her family',
    image: 'https://i.postimg.cc/JnnwXjCg/marie-story.jpg',
    isFeatured: true,
    status: 'published',
    tags: ['Technology', 'Web Development', 'Women in Tech', 'Rural Development'],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    name: 'Jean Claude Niyonzima',
    age: '16',
    location: 'Northern Province, Musanze',
    program: 'Educational Support Initiative',
    programId: null,
    story: 'Thanks to our scholarship program, Jean Claude continued his education despite family financial challenges. He excelled in mathematics and sciences, earning a spot at university.',
    achievement: 'Scored 85% in national exams, secured university placement',
    image: 'https://i.postimg.cc/m2n34pCP/jean-story.jpg',
    isFeatured: true,
    status: 'published',
    tags: ['Education', 'Scholarship', 'Mathematics', 'University'],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    name: 'Grace Mukamana',
    age: '22',
    location: 'Kigali City, Gasabo',
    program: 'Innovation & Tech Labs',
    programId: null,
    story: 'Grace developed a mobile app to help farmers access weather information. Her innovation won national recognition and secured funding for her startup.',
    achievement: 'Startup now serves 2,000+ farmers across Rwanda',
    image: 'https://i.postimg.cc/76xZhvw4/grace-story.jpg',
    isFeatured: true,
    status: 'published',
    tags: ['Innovation', 'Mobile App', 'Agriculture', 'Startup'],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    name: 'Emmanuel Habimana',
    age: '20',
    location: 'Eastern Province, Nyagatare',
    program: 'Innovation & Tech Labs',
    programId: null,
    story: 'Emmanuel learned drone technology and precision farming techniques. He now helps local farmers optimize their crop yields using modern agricultural technology.',
    achievement: 'Increased farm productivity by 40% in his district',
    image: 'https://i.postimg.cc/d1xfmqjG/emmanuel-story.jpg',
    isFeatured: true,
    status: 'published',
    tags: ['Technology', 'Agriculture', 'Drones', 'Innovation'],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    name: 'Josephine Mukamana',
    age: '18',
    location: 'Southern Province, Huye',
    program: 'Community Engagement Program',
    programId: null,
    story: 'Josephine created an eco-friendly waste management system for her community using recycled materials and solar power, reducing environmental impact.',
    achievement: 'Solution adopted by 12 communities in Southern Province',
    image: 'https://i.postimg.cc/MKcq3nLm/josephine-story.jpg',
    isFeatured: true,
    status: 'published',
    tags: ['Environment', 'Innovation', 'Community', 'Sustainability'],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    name: 'David Uwimana',
    age: '17',
    location: 'Western Province, Karongi',
    program: 'Talent Development Program',
    programId: null,
    story: 'David combined traditional Rwandan art with digital media, creating cultural preservation content and earning income through digital art sales.',
    achievement: 'Art featured in national cultural exhibitions',
    image: 'https://i.postimg.cc/DZRM7NgK/david-story.jpg',
    isFeatured: true,
    status: 'published',
    tags: ['Arts', 'Culture', 'Digital Media', 'Traditional Arts'],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];

// Regional Impact Data
const regionalImpactData = [
  {
    region: 'Kigali City',
    beneficiaries: '485',
    programs: '12',
    communities: '15',
    keyAchievements: ['5 Innovation Labs', '8 Tech Training Centers', 'University Partnerships'],
    color: 'from-blue-500 to-cyan-500',
    description: 'Urban innovation hub with focus on technology and entrepreneurship',
    coordinates: {
      latitude: -1.9441,
      longitude: 30.0619
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    region: 'Western Province',
    beneficiaries: '312',
    programs: '8',
    communities: '22',
    keyAchievements: ['Rural Internet Access', 'Agritech Programs', 'Women Empowerment'],
    color: 'from-green-500 to-emerald-500',
    description: 'Agricultural communities with digital transformation initiatives',
    coordinates: {
      latitude: -2.3852,
      longitude: 29.3355
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    region: 'Northern Province',
    beneficiaries: '267',
    programs: '6',
    communities: '18',
    keyAchievements: ['Mobile Learning Units', 'Solar-Powered Centers', 'Youth Cooperatives'],
    color: 'from-purple-500 to-pink-500',
    description: 'Mountainous regions with mobile education and renewable energy focus',
    coordinates: {
      latitude: -1.5084,
      longitude: 29.6368
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    region: 'Eastern Province',
    beneficiaries: '298',
    programs: '7',
    communities: '20',
    keyAchievements: ['Digital Health Solutions', 'Remote Learning', 'Skills Development'],
    color: 'from-amber-500 to-orange-500',
    description: 'Border communities with cross-cultural exchange programs',
    coordinates: {
      latitude: -1.9794,
      longitude: 30.9091
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    region: 'Southern Province',
    beneficiaries: '189',
    programs: '5',
    communities: '16',
    keyAchievements: ['Environmental Tech', 'Conservation Programs', 'Eco-Innovation'],
    color: 'from-teal-500 to-cyan-500',
    description: 'Forest regions focusing on environmental technology and conservation',
    coordinates: {
      latitude: -2.6111,
      longitude: 29.7378
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];

export async function seedImpactMetrics() {
  try {
    console.log('📊 Starting to seed impact metrics...');
    
    const existingMetrics = await db.collection(COLLECTIONS.IMPACT_METRICS).get();
    if (!existingMetrics.empty) {
      console.log('⚠️  Impact metrics already exist. Skipping seeding.');
      return false;
    }

    const batch = db.batch();
    
    for (const metric of impactMetricsData) {
      const docRef = db.collection(COLLECTIONS.IMPACT_METRICS).doc();
      batch.set(docRef, metric);
    }
    
    await batch.commit();
    
    console.log(`✅ Successfully seeded ${impactMetricsData.length} impact metrics`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding impact metrics:', error);
    throw error;
  }
}

export async function seedSuccessStories() {
  try {
    console.log('📖 Starting to seed success stories...');
    
    const existingStories = await db.collection(COLLECTIONS.SUCCESS_STORIES).get();
    if (!existingStories.empty) {
      console.log('⚠️  Success stories already exist. Skipping seeding.');
      return false;
    }

    const batch = db.batch();
    
    for (const story of successStoriesData) {
      const docRef = db.collection(COLLECTIONS.SUCCESS_STORIES).doc();
      batch.set(docRef, story);
    }
    
    await batch.commit();
    
    console.log(`✅ Successfully seeded ${successStoriesData.length} success stories`);
    
    // Log each story
    successStoriesData.forEach((story, index) => {
      console.log(`${index + 1}. ${story.name} - ${story.program}`);
      console.log(`   📍 ${story.location}`);
      console.log(`   🏆 ${story.achievement}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding success stories:', error);
    throw error;
  }
}

export async function seedRegionalImpact() {
  try {
    console.log('🗺️  Starting to seed regional impact data...');
    
    const existingRegional = await db.collection(COLLECTIONS.REGIONAL_IMPACT).get();
    if (!existingRegional.empty) {
      console.log('⚠️  Regional impact data already exists. Skipping seeding.');
      return false;
    }

    const batch = db.batch();
    
    for (const region of regionalImpactData) {
      const docRef = db.collection(COLLECTIONS.REGIONAL_IMPACT).doc();
      batch.set(docRef, region);
    }
    
    await batch.commit();
    
    console.log(`✅ Successfully seeded ${regionalImpactData.length} regional impact records`);
    
    // Log each region
    regionalImpactData.forEach((region, index) => {
      console.log(`${index + 1}. ${region.region}`);
      console.log(`   👥 ${region.beneficiaries} beneficiaries`);
      console.log(`   📋 ${region.programs} programs`);
      console.log(`   🏘️  ${region.communities} communities`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding regional impact:', error);
    throw error;
  }
}

export async function seedAllImpactData() {
  try {
    console.log('🌟 Starting comprehensive impact data seeding...');
    
    // Seed impact metrics
    await seedImpactMetrics();
    
    // Seed success stories
    await seedSuccessStories();
    
    // Seed regional impact
    await seedRegionalImpact();
    
    console.log('🎉 All impact data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${impactMetricsData.length} impact metrics`);
    console.log(`   • ${successStoriesData.length} success stories`);
    console.log(`   • ${regionalImpactData.length} regional impact records`);
    
    return true;
  } catch (error) {
    console.error('❌ Error during comprehensive impact seeding:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllImpactData()
    .then((success) => {
      if (success) {
        console.log('🚀 Impact data seeding process completed!');
        process.exit(0);
      } else {
        console.log('⏭️  Impact data already exists, skipping seeding.');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('💥 Impact data seeding failed:', error);
      process.exit(1);
    });
}
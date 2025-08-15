import { FieldValue } from 'firebase-admin/firestore';
import { FirebaseService } from '../services/firebaseService.js';
import { GalleryItem, COLLECTIONS } from '../models/index.js';

const galleryItems: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>[] = [
  {
    type: 'image',
    src: 'https://i.postimg.cc/FH49rFHd/uk-black-tech-Ib3oc-AKccy-I-unsplash.jpg',
    title: 'Digital Learning Initiative',
    description: 'Students engage with laptops in our technology education program, learning essential digital skills for the future',
    category: 'technology',
    date: new Date('2024-03-15'),
    location: 'Kigali Tech Hub',
    participants: 45,
    tags: ['digital-literacy', 'laptops', 'students', 'technology'],
    photographer: 'UK Black Tech',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/N0PqHQBx/zach-wear-jgu6-Dkd0f-CM-unsplash.jpg',
    title: 'Collaborative Learning Session',
    description: 'Youth working together on innovative projects, fostering teamwork and creative problem-solving skills',
    category: 'education',
    date: new Date('2024-02-20'),
    location: 'Community Center Kigali',
    participants: 32,
    tags: ['collaboration', 'teamwork', 'innovation', 'education'],
    photographer: 'Zach Wear',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/NMScWBn0/randy-fath-Cbl-JCxw-Pjx0-unsplash.jpg',
    title: 'Scholarship Recipients Graduation',
    description: 'Celebrating academic achievements of our scholarship students who have completed their educational programs',
    category: 'education',
    date: new Date('2024-04-10'),
    location: 'University of Rwanda',
    participants: 120,
    tags: ['graduation', 'scholarship', 'celebration', 'achievement'],
    photographer: 'Randy Fath',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/5yzVJDcS/jaron-mobley-bi-O8-ZY7-Byqo-unsplash.jpg',
    title: 'Coding Bootcamp Workshop',
    description: 'Intensive programming training for aspiring developers, covering web development and software engineering',
    category: 'technology',
    date: new Date('2024-03-05'),
    location: 'Innovation Lab Rwanda',
    participants: 28,
    tags: ['coding', 'programming', 'bootcamp', 'web-development'],
    photographer: 'Jaron Mobley',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/N0QmHwpL/Screenshot-2025-08-07-at-21-01-43.png',
    title: 'Cultural Arts Festival',
    description: 'Youth showcase traditional and modern artistic expressions, celebrating Rwandan culture and creativity',
    category: 'arts',
    date: new Date('2024-05-12'),
    location: 'Cultural Center Kigali',
    participants: 200,
    tags: ['arts', 'culture', 'festival', 'creativity', 'traditional'],
    photographer: 'Harmony Africa Team',
    isActive: true
  },
  {
    type: 'video',
    src: 'https://i.postimg.cc/3WMDJMk8/Screenshot-2025-08-07-at-21-01-07.png',
    videoUrl: 'https://youtu.be/5_XYnlrtM8A?si=zKJyMQ0SdB0rAkf9',
    title: 'Innovation Challenge 2024 - Rutsiro',
    description: 'Highlights from our annual youth innovation competition showcasing creative solutions to local challenges',
    category: 'events',
    date: new Date('2024-06-20'),
    location: 'Convention Center Rutsiro',
    participants: 300,
    tags: ['innovation', 'competition', 'youth', 'challenge', 'solutions'],
    photographer: 'Harmony Africa Media Team',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/MKcq3nLm/women-in-tech.jpg',
    title: 'Women in Tech Workshop',
    description: 'Empowering women with technical skills and leadership opportunities in the technology sector',
    category: 'technology',
    date: new Date('2024-07-15'),
    location: 'Tech Hub Kigali',
    participants: 60,
    tags: ['women-in-tech', 'empowerment', 'leadership', 'skills'],
    photographer: 'Tech Hub Rwanda',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/BnRqMq7X/fundraising-gala.jpg',
    title: 'Annual Fundraising Gala',
    description: 'Community leaders and supporters gather to celebrate achievements and raise funds for future programs',
    category: 'events',
    date: new Date('2024-08-05'),
    location: 'Kigali Convention Center',
    participants: 500,
    tags: ['fundraising', 'gala', 'community', 'celebration'],
    photographer: 'Event Photography Rwanda',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/VsC4K8xG/innovation-challenge.jpg',
    title: 'Youth Innovation Showcase',
    description: 'Young innovators present their technological solutions to address community challenges',
    category: 'technology',
    date: new Date('2024-07-28'),
    location: 'Innovation Hub Kigali',
    participants: 85,
    tags: ['innovation', 'youth', 'technology', 'solutions', 'showcase'],
    photographer: 'Innovation Hub Team',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/DZRM7NgK/digital-skills-workshop.jpg',
    title: 'Digital Skills Workshop',
    description: 'Comprehensive training in digital literacy, online safety, and basic computer skills for rural communities',
    category: 'education',
    date: new Date('2024-06-10'),
    location: 'Rural Community Center',
    participants: 75,
    tags: ['digital-skills', 'literacy', 'rural', 'training'],
    photographer: 'Community Outreach Team',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/yYP3359D/talent-pulse.jpg',
    title: 'TalentPulse Creative Workshop',
    description: 'Young artists and creators develop their talents in music, dance, visual arts, and digital content creation',
    category: 'arts',
    date: new Date('2024-08-01'),
    location: 'Creative Arts Center',
    participants: 40,
    tags: ['talent', 'creative', 'arts', 'music', 'dance'],
    photographer: 'TalentPulse Media',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/KjNm2YQt/community-engagement.jpg',
    title: 'Community Engagement Forum',
    description: 'Local leaders and youth collaborate to identify community needs and develop sustainable solutions',
    category: 'community',
    date: new Date('2024-05-25'),
    location: 'Community Hall Gasabo',
    participants: 120,
    tags: ['community', 'engagement', 'collaboration', 'solutions'],
    photographer: 'Community Development Team',
    isActive: true
  },
  {
    type: 'video',
    src: 'https://i.postimg.cc/3WMDJMk8/scholarship-video-thumb.jpg',
    videoUrl: 'https://youtu.be/example-scholarship-video',
    title: 'Scholarship Success Stories',
    description: 'Inspiring testimonials from scholarship recipients sharing their educational journey and achievements',
    category: 'education',
    date: new Date('2024-07-20'),
    location: 'Various Locations',
    participants: 25,
    tags: ['scholarship', 'success-stories', 'testimonials', 'education'],
    photographer: 'Harmony Africa Media',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/FH49rFHd/mentorship-session.jpg',
    title: 'Mentorship Program Launch',
    description: 'Professional mentors meet with young participants to provide guidance and career development support',
    category: 'education',
    date: new Date('2024-04-18'),
    location: 'Business Incubator Kigali',
    participants: 50,
    tags: ['mentorship', 'career-development', 'guidance', 'professionals'],
    photographer: 'Business Hub Rwanda',
    isActive: true
  },
  {
    type: 'image',
    src: 'https://i.postimg.cc/N0PqHQBx/environmental-project.jpg',
    title: 'Environmental Conservation Project',
    description: 'Youth participate in tree planting and environmental awareness activities to protect local ecosystems',
    category: 'community',
    date: new Date('2024-06-05'),
    location: 'Nyungwe Forest',
    participants: 90,
    tags: ['environment', 'conservation', 'tree-planting', 'awareness'],
    photographer: 'Environmental Team',
    isActive: true
  }
];

export async function seedGallery() {
  console.log('🎨 Starting to seed gallery items...');
  
  try {
    // Clear existing gallery items
    await FirebaseService.clearCollection(COLLECTIONS.GALLERY);
    console.log('✅ Cleared existing gallery items');
    
    // Add gallery items
    for (const item of galleryItems) {
      const galleryData: Omit<GalleryItem, 'id'> = {
        ...item,
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 200) + 10,
        createdAt: FieldValue.serverTimestamp() as any,
        updatedAt: FieldValue.serverTimestamp() as any,
      };
      
      await FirebaseService.createGalleryItem(galleryData);
    }
    
    console.log(`✅ Successfully seeded ${galleryItems.length} gallery items`);
    
    // Display statistics
    const stats = galleryItems.reduce((acc, item) => {
      acc.total++;
      acc.byType[item.type] = (acc.byType[item.type] || 0) + 1;
      acc.byCategory[item.category] = (acc.byCategory[item.category] || 0) + 1;
      return acc;
    }, { 
      total: 0, 
      byType: {} as Record<string, number>, 
      byCategory: {} as Record<string, number> 
    });
    
    console.log('📊 Gallery Statistics:');
    console.log(`   Total Items: ${stats.total}`);
    console.log('   By Type:');
    Object.entries(stats.byType).forEach(([type, count]) => {
      console.log(`     ${type}: ${count}`);
    });
    console.log('   By Category:');
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`     ${category}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding gallery:', error);
    throw error;
  }
}

// Export for standalone execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedGallery()
    .then(() => {
      console.log('🎨 Gallery seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Gallery seeding failed:', error);
      process.exit(1);
    });
}
import { VolunteerOpportunity } from '../models/index.js';

// Enhanced volunteer opportunities based on existing programs and events
export const volunteerOpportunities: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Education Support Volunteers
  {
    title: 'Educational Support Tutor',
    description: 'Provide academic tutoring and homework assistance to students in our Educational Support Initiative. Help bridge learning gaps in mathematics, sciences, languages, and digital literacy.',
    requirements: [
      'Background in education or relevant subject area (mathematics, sciences, languages)',
      'Patience and excellent communication skills',
      'Ability to work with students aged 6-18 years',
      'Commitment of 4-6 hours per week for minimum 3 months',
      'Available during after-school hours (4-7 PM)',
      'Bilingual preferred (Kinyarwanda/English)'
    ],
    timeCommitment: '4-6 hours per week, minimum 3 months',
    location: 'Kigali Education Centers and Rural Schools',
    contactEmail: 'volunteers@harmony-africa.org',
    isActive: true,
    spotsAvailable: 15
  },
  {
    title: 'Scholarship Program Mentor',
    description: 'Guide scholarship recipients through their academic journey, providing mentorship, career guidance, and personal development support within our Educational Support Initiative.',
    requirements: [
      'University degree or equivalent professional experience',
      'Experience in mentoring or coaching youth',
      'Strong interpersonal and communication skills',
      'Commitment of 3-4 hours per week for academic year',
      'Available for monthly one-on-one sessions',
      'Understanding of academic and career pathways'
    ],
    timeCommitment: '3-4 hours per week, academic year commitment',
    location: 'Multiple locations across Rwanda',
    contactEmail: 'mentorship@harmony-africa.org',
    isActive: true,
    spotsAvailable: 20
  },

  // Technology & Innovation Volunteers
  {
    title: 'Tech Skills Instructor',
    description: 'Teach coding, web development, and digital literacy skills to youth in our Innovation & Tech Labs program. Help prepare the next generation for the digital economy.',
    requirements: [
      'Proficiency in programming languages (Python, JavaScript, HTML/CSS)',
      'Experience in teaching or training (formal or informal)',
      'Passion for technology education and youth development',
      'Commitment of 6-8 hours per week for minimum 6 months',
      'Weekend availability preferred',
      'Ability to work with youth aged 12-30 years'
    ],
    timeCommitment: '6-8 hours per week, minimum 6 months',
    location: 'Innovation Hubs in Kigali and major cities',
    contactEmail: 'tech@harmony-africa.org',
    isActive: true,
    spotsAvailable: 10
  },
  {
    title: 'Startup Incubation Mentor',
    description: 'Support young entrepreneurs in our Innovation & Tech Labs program with business development, pitch preparation, and startup strategy guidance.',
    requirements: [
      'Entrepreneurship or business development experience',
      'Knowledge of startup ecosystem and funding landscape',
      'Excellent communication and coaching skills',
      'Commitment of 4-5 hours per week for program duration',
      'Flexible schedule for mentoring sessions',
      'Understanding of local and regional business environment'
    ],
    timeCommitment: '4-5 hours per week, flexible schedule',
    location: 'Tech hubs and innovation centers',
    contactEmail: 'startup@harmony-africa.org',
    isActive: true,
    spotsAvailable: 8
  },

  // Arts & Culture Volunteers
  {
    title: 'Creative Arts Facilitator',
    description: 'Lead workshops in music, dance, visual arts, and creative expression as part of our Talent Development Program. Help nurture artistic talents and cultural preservation.',
    requirements: [
      'Background in arts, music, dance, or creative fields',
      'Experience working with children and youth',
      'Cultural sensitivity and appreciation for Rwandan arts',
      'Commitment of 3-5 hours per week for minimum 4 months',
      'Flexible schedule for workshops and performances',
      'Ability to inspire and motivate young artists'
    ],
    timeCommitment: '3-5 hours per week, minimum 4 months',
    location: 'Community Centers and Cultural Venues',
    contactEmail: 'arts@harmony-africa.org',
    isActive: true,
    spotsAvailable: 12
  },
  {
    title: 'TalentPulse Camp Assistant',
    description: 'Support our intensive TalentPulse Artist Development & Life Skills Camp, assisting with music, dance, poetry, and visual arts workshops for selected young artists.',
    requirements: [
      'Background in performing arts, music production, or creative industries',
      'Experience working with young artists (16-30 years)',
      'High energy and enthusiasm for intensive workshop environment',
      'Full week availability (October 6-12, 2025)',
      'Ability to assist with masterclasses and studio sessions',
      'Collaboration skills for team-based camp environment'
    ],
    timeCommitment: 'Full week intensive (October 6-12, 2025)',
    location: 'Kigali - TalentPulse Camp Venue',
    contactEmail: 'talentpulse@harmony-africa.org',
    isActive: true,
    spotsAvailable: 6
  },

  // Community Development Volunteers
  {
    title: 'Community Outreach Coordinator',
    description: 'Help connect families with resources and support services through our Community Engagement Program. Build bridges between communities and available opportunities.',
    requirements: [
      'Strong interpersonal and communication skills',
      'Knowledge of local communities and cultural dynamics',
      'Experience in social work, community development, or outreach',
      'Commitment of 5-7 hours per week for minimum 6 months',
      'Transportation available or reimbursement provided',
      'Fluency in Kinyarwanda and English'
    ],
    timeCommitment: '5-7 hours per week, minimum 6 months',
    location: 'Various communities across all provinces',
    contactEmail: 'community@harmony-africa.org',
    isActive: true,
    spotsAvailable: 18
  },
  {
    title: 'Parent Workshop Facilitator',
    description: 'Lead parent education workshops as part of our Community Engagement Program, helping families support their children\'s development and access available resources.',
    requirements: [
      'Experience in adult education or community training',
      'Understanding of family dynamics and child development',
      'Strong presentation and facilitation skills',
      'Commitment of 4-6 hours per month for ongoing workshops',
      'Cultural sensitivity and respect for diverse backgrounds',
      'Ability to create engaging and practical learning experiences'
    ],
    timeCommitment: '4-6 hours per month, ongoing commitment',
    location: 'Community centers nationwide',
    contactEmail: 'workshops@harmony-africa.org',
    isActive: true,
    spotsAvailable: 10
  },

  // Event Support Volunteers
  {
    title: 'Event Management Assistant',
    description: 'Assist with organizing and executing workshops, innovation challenges, fundraising galas, and community events that support our various programs.',
    requirements: [
      'Enthusiasm for community engagement and event execution',
      'Strong organizational and time management skills',
      'Ability to work well under pressure and meet deadlines',
      'Flexible availability for events (evenings and weekends)',
      'Team player attitude with strong communication skills',
      'Previous event planning experience preferred but not required'
    ],
    timeCommitment: '10-15 hours per event, seasonal commitment',
    location: 'Event venues across Kigali and major cities',
    contactEmail: 'events@harmony-africa.org',
    isActive: true,
    spotsAvailable: 25
  },
  {
    title: 'Youth Innovation Challenge Coordinator',
    description: 'Support our annual Youth Innovation Challenge by mentoring participants, managing competition logistics, and facilitating networking opportunities.',
    requirements: [
      'Experience in innovation, entrepreneurship, or technology',
      'Strong project management and coordination skills',
      'Ability to mentor and guide young innovators',
      'Commitment throughout competition cycle (3-4 months)',
      'Excellent communication and networking abilities',
      'Understanding of innovation and startup ecosystem'
    ],
    timeCommitment: '8-12 hours per week during competition season',
    location: 'Kigali Convention Centre and Innovation Hubs',
    contactEmail: 'innovation@harmony-africa.org',
    isActive: true,
    spotsAvailable: 8
  },

  // Communications & Media Volunteers
  {
    title: 'Digital Media Content Creator',
    description: 'Create compelling content for social media, document program activities, and help amplify our impact through digital storytelling and visual media.',
    requirements: [
      'Experience with social media platforms and content creation',
      'Basic photography, videography, or graphic design skills',
      'Understanding of nonprofit storytelling and impact communication',
      'Commitment of 5-10 hours per week for ongoing content needs',
      'Access to smartphone/camera and basic editing software',
      'Creative mindset with attention to visual aesthetics'
    ],
    timeCommitment: '5-10 hours per week, ongoing commitment',
    location: 'Flexible - remote and on-site documentation',
    contactEmail: 'media@harmony-africa.org',
    isActive: true,
    spotsAvailable: 6
  },
  {
    title: 'Translation & Communication Support',
    description: 'Support multilingual communications by translating materials, interpreting at events, and ensuring accessibility across language barriers for all our programs.',
    requirements: [
      'Fluency in multiple languages (Kinyarwanda, English, French)',
      'Strong written communication skills',
      'Experience in translation or interpretation preferred',
      'Cultural awareness and sensitivity',
      'Flexible availability for translation projects and events',
      'Attention to detail and accuracy'
    ],
    timeCommitment: 'Flexible, project-based (5-15 hours per month)',
    location: 'Remote and on-site as needed',
    contactEmail: 'translation@harmony-africa.org',
    isActive: true,
    spotsAvailable: 8
  },

  // Administrative & Operations Support
  {
    title: 'Grant Writing & Research Assistant',
    description: 'Support funding applications, impact reporting, and research initiatives that help sustain and expand our programs across all focus areas.',
    requirements: [
      'Strong research and writing skills',
      'Experience with grant writing or fundraising preferred',
      'Data analysis and report writing capabilities',
      'Commitment of 10-15 hours per week for ongoing projects',
      'Attention to detail and ability to meet deadlines',
      'Understanding of nonprofit sector and social impact measurement'
    ],
    timeCommitment: '10-15 hours per week, flexible schedule',
    location: 'Remote work with occasional office visits',
    contactEmail: 'grants@harmony-africa.org',
    isActive: true,
    spotsAvailable: 4
  },
  {
    title: 'Regional Program Support Specialist',
    description: 'Provide administrative and logistical support for programs across different provinces, helping coordinate activities and maintain program quality standards.',
    requirements: [
      'Strong organizational and administrative skills',
      'Experience with program management or coordination',
      'Ability to travel to different provinces as needed',
      'Commitment of 15-20 hours per week for minimum 6 months',
      'Excellent communication skills and cultural sensitivity',
      'Flexibility to adapt to different regional needs and contexts'
    ],
    timeCommitment: '15-20 hours per week, minimum 6 months',
    location: 'Multiple provinces (travel required)',
    contactEmail: 'regional@harmony-africa.org',
    isActive: true,
    spotsAvailable: 12
  }
];
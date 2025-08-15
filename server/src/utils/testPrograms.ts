import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../models/index.js';

async function testProgramsData() {
  try {
    console.log('🔍 Testing programs data...');
    
    // Get all programs without filtering
    const snapshot = await db.collection(COLLECTIONS.PROGRAMS).get();
    
    if (snapshot.empty) {
      console.log('⚠️  No programs found in database');
      return false;
    }
    
    console.log(`✅ Found ${snapshot.size} programs in database:`);
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n${index + 1}. ${data.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Category: ${data.category}`);
      console.log(`   Active: ${data.isActive}`);
      console.log(`   Participants: ${data.participants}`);
      console.log(`   Success Rate: ${data.successRate}`);
    });
    
    // Test filtering by status 'active'
    console.log('\n🔍 Testing status filter...');
    const activeSnapshot = await db.collection(COLLECTIONS.PROGRAMS)
      .where('status', '==', 'active')
      .get();
    
    console.log(`✅ Found ${activeSnapshot.size} active programs`);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing programs:', error);
    return false;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  testProgramsData()
    .then((success) => {
      if (success) {
        console.log('\n🎉 Programs data test completed successfully!');
        process.exit(0);
      } else {
        console.log('\n💥 Programs data test failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}
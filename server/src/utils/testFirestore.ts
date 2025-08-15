import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

async function testFirestoreConnection() {
  try {
    console.log('🔍 Testing Firestore connection...');
    
    // Test basic connection by trying to add a test document
    const testDocRef = await db.collection('test').add({
      message: 'Hello from Harmony Africa!',
      timestamp: FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Successfully connected to Firestore!');
    console.log(`📝 Test document created with ID: ${testDocRef.id}`);
    
    // Clean up test document
    await testDocRef.delete();
    console.log('🧹 Test document cleaned up');
    
    return true;
  } catch (error: any) {
    console.error('❌ Firestore connection failed:', error);
    
    if (error.code === 7) {
      console.log('💡 Solution: The Firestore API needs to be enabled.');
      console.log('   Visit: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=harmony-africa-3e243');
    } else if (error.code === 5) {
      console.log('💡 Possible solutions:');
      console.log('   1. Check if Firestore database exists in Firebase Console');
      console.log('   2. Verify your project ID is correct: harmony-africa-3e243');
      console.log('   3. Ensure your service account has proper permissions');
      console.log('   4. Check if Firestore security rules allow writes');
    } else if (error.code === 3) {
      console.log('💡 Solution: Firestore security rules are blocking the operation.');
      console.log('   Temporarily set rules to allow all operations:');
      console.log('   rules_version = \'2\';');
      console.log('   service cloud.firestore {');
      console.log('     match /databases/{database}/documents {');
      console.log('       match /{document=**} {');
      console.log('         allow read, write: if true;');
      console.log('       }');
      console.log('     }');
      console.log('   }');
    }
    
    return false;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  testFirestoreConnection()
    .then((success) => {
      if (success) {
        console.log('🎉 Firestore is ready for seeding!');
        process.exit(0);
      } else {
        console.log('💥 Please fix the Firestore configuration before seeding.');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}
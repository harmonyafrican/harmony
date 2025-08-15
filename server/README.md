# Harmony Africa Backend API

Firebase-powered backend API for the Harmony Africa charitable organization website.

## Features

- **Contact Forms**: Handle contact form submissions
- **Donations**: Process and track donations with real-time statistics
- **Volunteer Management**: Applications and opportunities
- **Content Management**: Programs, events, and blog posts
- **Real-time Updates**: Server-Sent Events for live data
- **Newsletter**: Subscription management

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Validation**: Zod
- **Security**: Helmet, CORS

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   - Create a Firebase project
   - Enable Firestore Database
   - Generate a service account key
   - Copy `.env.example` to `.env` and fill in your Firebase credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact form
- `POST /api/donate` - Process donation
- `GET /api/donations/stats` - Get donation statistics
- `POST /api/volunteer/apply` - Submit volunteer application
- `GET /api/volunteer/opportunities` - List volunteer opportunities
- `GET /api/programs` - Get active programs
- `GET /api/events` - Get upcoming events
- `GET /api/blog` - Get published blog posts
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Real-time Endpoints

- `GET /api/realtime/donations` - Server-Sent Events for live donations
- `GET /api/realtime/contacts` - Server-Sent Events for new contact forms
- `GET /api/realtime/stats` - Get real-time statistics

### Admin Endpoints

- `GET /api/admin/contacts` - Get all contact submissions
- `GET /api/admin/programs` - Get all programs
- `GET /api/admin/events` - Get all events
- `GET /api/admin/blog-posts` - Get all blog posts

## Firestore Collections

- `contacts` - Contact form submissions
- `donations` - Donation records
- `volunteer_applications` - Volunteer applications
- `volunteers` - Volunteer opportunities
- `programs` - Organization programs
- `events` - Events and fundraisers
- `blog_posts` - Blog articles
- `newsletter_subscribers` - Newsletter subscribers

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

## Real-time Features

The API provides real-time updates using Server-Sent Events:

### Frontend Example (JavaScript):
```javascript
// Listen to real-time donations
const eventSource = new EventSource('/api/realtime/donations');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'donations') {
    // Update UI with new donations
    console.log('New donations:', data.data);
  }
};
```

## Security Features

- CORS protection
- Helmet security headers
- Request validation with Zod
- Environment variable configuration
- Error handling middleware

## Firebase Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents
    // Configure these rules based on your security requirements
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Validate all inputs with Zod schemas
4. Add logging for debugging
5. Test all endpoints

## License

MIT License - see LICENSE file for details.
# Aqbobek Lyceum Portal - Setup & Deployment Guide

## Project Overview

This MVP implements a unified school portal with the following components:
- **Role-Based Access Control**: Student, Teacher, Parent, and Admin dashboards
- **Grade Management**: Track academic performance with BilimClass integration
- **AI Mentor**: Personalized coaching powered by Vercel AI SDK 6
- **Kiosk Mode**: Auto-scrolling bulletin board for hallway displays
- **Events & Achievements**: Centralized event management and recognition system
- **Real-time Sync**: Supabase for instant data updates with RLS security

## Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for project initialization

### Step 3: Setup Database Schema
1. Open your Supabase project
2. Go to SQL Editor
3. Copy entire contents of `supabase-schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" to execute

### Step 4: Configure Environment
1. Copy `.env.example` to `.env.local`
2. From Supabase, get your credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API Keys → anon (public)
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the Portal

### Demo Accounts
Use these credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Student | student1@aqbobek.edu | password123 |
| Teacher | teacher1@aqbobek.edu | password123 |
| Parent | parent1@aqbobek.edu | password123 |
| Admin | admin@aqbobek.edu | password123 |

### Test Each Role

**Student Dashboard**: 
- View personal grades and trends
- Check achievements and points
- Access AI Mentor for personalized guidance
- View upcoming school events

**Teacher Dashboard**:
- View class performance
- Record new grades for students
- Identify at-risk students
- Award achievements to students
- Manage class events

**Parent Dashboard**:
- Monitor child's grades
- View achievements and awards
- Track school event participation
- Check performance trends

**Admin Dashboard**:
- View school-wide analytics
- Manage events and announcements
- Monitor student and teacher performance
- System administration

### Kiosk Mode
- Access at `/kiosk` (no login required)
- Auto-scrolls through top students, events, and achievements
- Displays large fonts and animations suitable for hallway display
- Refreshes data every 5 minutes

### AI Mentor
- Navigate to "AI Mentor" in student/parent dashboards
- Ask about grades, study tips, career guidance
- Currently uses MOCK responses for demo
- See "AI Integration Setup" section below to enable real AI

## AI Integration Setup

The AI Mentor currently uses mock responses for demonstration. To enable real AI:

### Step 1: Choose an AI Provider
Supported providers via Vercel AI Gateway:
- **OpenAI**: Set `OPENAI_API_KEY` (uses gpt-4o-mini by default)
- **Anthropic**: Set `ANTHROPIC_API_KEY`
- **Other providers**: Set `AI_GATEWAY_API_KEY`

### Step 2: Set Environment Variable
Add to your `.env.local`:
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### Step 3: Enable AI in Frontend
Edit `app/dashboard/ai-mentor/page.tsx`:
1. Uncomment the `useChat` hook imports at the top
2. Uncomment the useChat implementation (lines 79-92)
3. Remove or comment out the mock response `setTimeout` blocks

### Step 4: Enable AI in Backend
Edit `app/api/ai-mentor/route.ts`:
1. Uncomment the imports at the top
2. Remove or comment out the "not configured" response
3. Uncomment the entire AI implementation block

### Files to Modify:
- `app/dashboard/ai-mentor/page.tsx` - Frontend chat interface
- `app/api/ai-mentor/route.ts` - Backend AI streaming endpoint

### Testing AI Integration
After enabling, the AI Mentor will:
- Analyze the student's actual grades and achievements
- Provide personalized study recommendations
- Offer career guidance based on academic strengths
- Stream responses in real-time

## Project Architecture

### Frontend Structure
```
app/
├── page.tsx              # Landing page
├── login/               # Authentication
├── dashboard/           # Main dashboard
│   ├── page.tsx        # Role-based router
│   ├── grades/         # View grades
│   ├── ai-mentor/      # AI coaching
│   ├── achievements/   # View achievements
│   └── ...
└── kiosk/              # Bulletin board mode

components/
├── dashboard/          # Layout components
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── views/          # Role-specific dashboards
└── cards/              # Reusable UI cards
```

### Backend Structure
```
lib/
├── supabase/          # Client setup
├── types/             # TypeScript definitions
├── services/          # Business logic
│   ├── data-service.ts
│   ├── bilimclass-api.ts
│   └── auth-service.ts
├── mock/              # Mock data
└── context/           # React context

app/api/
├── ai-mentor/         # AI streaming endpoint
└── bilimclass/        # Grade API
```

## Database Schema Summary

### Tables Created
- **users**: User profiles with roles and metadata
- **grades**: Academic performance records
- **events**: School events and announcements
- **achievements**: Student accomplishments

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Row-level security policies
- Performance indexes

## Key Features Explained

### 1. Authentication
- Uses Supabase Auth with email/password
- User roles stored in database
- Auth context provides role-based access control
- Session management via Supabase client

### 2. Role-Based Access
- Middleware checks user role on dashboard
- Different components render based on role
- RLS policies enforce database-level security
- Protected API routes validate permissions

### 3. AI Mentor
- Uses Vercel AI SDK 6 with streaming
- Analyzes student grades, achievements, trends
- Provides career guidance and study tips
- Works with any LLM provider via AI Gateway

### 4. BilimClass Integration
- Mock API service in `lib/services/bilimclass-api.ts`
- Can be replaced with real API endpoint
- Endpoint structure designed for easy integration
- Mock data provided for testing

### 5. Kiosk Mode
- No authentication required
- Auto-scrolling displays
- Large fonts and bold colors
- Data refreshes every 5 minutes
- Suitable for hallway interactive displays

## Deployment to Vercel

### Push to GitHub
```bash
git add .
git commit -m "Initial commit: Aqbobek School Portal MVP"
git push origin main
```

### Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. Custom domain setup optional

## Environment Variables Explained

### Required for Development
```bash
NEXT_PUBLIC_SUPABASE_URL     # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public anon key for client-side
```

### Optional (for production)
```bash
SUPABASE_SERVICE_ROLE_KEY     # Server-side operations only
AI_GATEWAY_API_KEY            # If using non-default AI providers
```

## Customization Guide

### Change School Branding
1. Update colors in `app/globals.css` (CSS variables section)
2. Change school name in components
3. Update logo/images in `public/`

### Add New Subjects
1. Update `mockGrades` in `lib/mock/data.ts`
2. Data service will automatically include them
3. Grade visualization adapts automatically

### Modify AI Mentor Prompts
1. Edit system prompt in `app/api/ai-mentor/route.ts`
2. Customize behavior and guidance style
3. Update suggested questions in `app/dashboard/ai-mentor/page.tsx`

### Connect Real BilimClass API
1. Replace mock service in `lib/services/bilimclass-api.ts`
2. Add real API credentials to `.env.local`
3. Update API endpoint URLs
4. Implement actual authentication

## Troubleshooting

### "Supabase connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check anon key in environment variables
- Ensure Supabase project is active

### "Authentication not working"
- Check that users table has correct structure
- Verify RLS policies are enabled
- Check browser console for errors

### "AI Mentor not responding"
- Verify AI Gateway credentials if using custom provider
- Check browser dev tools for API error responses
- Ensure student data is loaded before sending messages

### "Grades not loading"
- Verify mock data exists in `lib/mock/data.ts`
- Check that database schema migration was successful
- Review RLS policies for grade visibility

## Performance Optimization

### Already Implemented
- Image optimization with Next.js
- Server-side rendering for initial load
- Component lazy loading
- Efficient database queries with indexes
- Caching patterns ready for integration

### Future Optimizations
- Add SWR caching for student data
- Implement pagination for large datasets
- Optimize kiosk mode for continuous display
- Add service worker for offline support

## Security Best Practices

### Current Implementation
- Row-Level Security (RLS) in Supabase
- Role-based access control
- Protected API routes
- Secure session management
- Input validation

### Recommendations
- Use HTTPS in production
- Enable CORS only for trusted domains
- Implement rate limiting for API endpoints
- Add audit logging for sensitive operations
- Regular security audits

## Support & Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Common Issues
Check `README.md` for feature documentation and API endpoint details.

### Getting Help
1. Check browser console for errors
2. Review Supabase logs in project dashboard
3. Verify all environment variables are set correctly
4. Check that database schema was created successfully

## Version Information

- **Next.js**: 16.2.0
- **React**: 19.2.4
- **Supabase**: 2.100.1
- **AI SDK**: 6.0.141
- **Tailwind CSS**: 4.2.0
- **TypeScript**: 5.7.3

## Next Steps

1. **Customize Branding**: Update colors and school information
2. **Add Real Authentication**: Replace with your school's auth system
3. **Connect BilimClass**: Implement real API integration
4. **Add More Features**: Implement student goal tracking, messaging
5. **Deploy**: Push to production on Vercel

## Support Contact

For issues or questions about the portal setup, refer to the comprehensive README.md or check the codebase comments for implementation details.

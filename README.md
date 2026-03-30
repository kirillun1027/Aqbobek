# Aqbobek Lyceum Unified School Portal

A modern, feature-rich MVP for a unified school management system that brings together grades, achievements, events, and AI-powered mentoring.

## Features

### Core Features
- **Role-Based Dashboards**: Separate interfaces for students, teachers, parents, and administrators
- **Grade Management**: Track and visualize student performance across subjects
- **Achievements System**: Record extracurricular accomplishments with tiered recognition
- **School Events**: Centralized event management and announcements
- **AI Mentor**: Personalized AI assistant that analyzes student progress and provides career guidance
- **At-Risk Detection**: Teachers can identify students who need intervention
- **Kiosk Mode**: Auto-scrolling bulletin board display for hallway screens

### Technical Highlights
- **Scalable Architecture**: Clean separation of concerns with hooks, components, and services
- **Real-time Data**: Supabase integration for instant data synchronization
- **Role-Based Access Control**: Row-level security with Supabase RLS policies
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **AI Integration**: Vercel AI SDK 6 for advanced mentoring capabilities

## Quick Start

### 1. Clone and Install
```bash
git clone <repo>
cd <project>
npm install
```

### 2. Setup Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL editor, copy and paste the entire contents of `supabase-schema.sql`
4. Execute the SQL to create all tables and policies

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL from Supabase settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key from API settings

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials (Mock Data)

The system uses mock data by default. You can test different roles:

**Student:**
- Email: `student1@aqbobek.edu`
- Password: `password123`

**Teacher:**
- Email: `teacher1@aqbobek.edu`
- Password: `password123`

**Parent:**
- Email: `parent1@aqbobek.edu`
- Password: `password123`

**Admin:**
- Email: `admin@aqbobek.edu`
- Password: `password123`

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   └── ai-mentor/         # AI mentor endpoint
│   ├── dashboard/             # Dashboard pages
│   │   ├── page.tsx          # Main dashboard router
│   │   ├── grades/           # View grades
│   │   ├── achievements/     # View achievements
│   │   ├── events/           # View events
│   │   └── ...
│   ├── kiosk/                # Bulletin board kiosk mode
│   ├── login/                # Authentication page
│   └── page.tsx              # Landing page
│
├── components/
│   ├── dashboard/            # Dashboard components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── views/            # Role-specific dashboards
│   ├── cards/                # Reusable card components
│   │   ├── grade-card.tsx
│   │   ├── achievement-card.tsx
│   │   ├── event-card.tsx
│   │   └── student-risk-card.tsx
│   └── notifications/        # Notification components
│
├── lib/
│   ├── supabase/             # Supabase client setup
│   ├── context/              # Auth context
│   ├── types/                # TypeScript definitions
│   ├── mock/                 # Mock data
│   └── services/             # Business logic
│
├── hooks/
│   ├── use-auth.ts           # Auth hook
│   └── use-fetch.ts          # Fetch wrapper hook
│
└── supabase-schema.sql       # Database schema
```

## Key Pages

### Student Dashboard
- View grades and performance trends
- See achievements and awards
- Check upcoming events
- Access AI Mentor for personalized guidance
- Track progress toward goals

### Teacher Dashboard
- View all students and their grades
- Record new grades
- Identify at-risk students
- Award achievements
- Manage class events

### Parent Dashboard
- Monitor child's grades and progress
- View achievements
- See event participation
- Check attendance

### Admin Dashboard
- Analytics and school-wide statistics
- Manage events and announcements
- Monitor teacher and student performance
- System administration

### Kiosk Mode
- Auto-scrolling bulletin board
- Large fonts for visibility
- Top student rankings
- Upcoming events display
- Performance highlights

## AI Mentor

The AI Mentor feature uses Vercel AI SDK to provide:
- **Progress Analysis**: Detailed review of student performance
- **Career Guidance**: Recommendations based on strengths
- **Study Tips**: Personalized learning strategies
- **Area Improvement**: Identification of weak areas with suggestions

The AI Mentor analyzes:
- Grade trends and patterns
- Subject strengths and weaknesses
- Achievement history
- Attendance and participation

## Authentication

The app uses Supabase Auth with the following flow:
1. User logs in on `/login` page
2. Credentials are validated against Supabase auth
3. User role is stored in the `users` table
4. Auth context provides user data throughout the app
5. Role-based routing controls access to features

## Database Schema

### Tables
- **users**: User profiles with roles (student, teacher, parent, admin)
- **grades**: Student grades recorded by teachers
- **events**: School events and announcements
- **achievements**: Student achievements and awards

All tables include:
- UUID primary keys
- Created/updated timestamps
- Row-level security policies
- Appropriate indexes for performance

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Development Tips

### Adding a New Feature
1. Create components in `components/` directory
2. Add service logic in `lib/services/`
3. Create new page in `app/dashboard/` if needed
4. Use existing hooks (`useAuth`, `useFetch`)
5. Follow the card component pattern for consistency

### Working with the AI Mentor
- The AI Mentor API endpoint is at `/api/ai-mentor`
- It expects student data in the request body
- Uses Vercel AI Gateway by default (no additional setup needed)
- Can be customized with different AI providers

### Styling
- Uses Tailwind CSS with custom design tokens in `globals.css`
- Primary color: Deep blue (#1e3a8a range)
- Secondary color: Blue (#3b82f6 range)
- Accent color: Amber (#facc15 range)
- All colors defined as CSS variables for easy customization

## Deployment

### Deploy to Vercel
```bash
npm run build
# Push to GitHub, connect to Vercel
```

### Deploy Environment Variables
1. Go to Vercel project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

## Performance Optimizations

- Server-side rendering where possible
- Optimized images with Next.js Image component
- Data caching with SWR patterns
- Efficient database queries with proper indexes
- Lazy loading of dashboard components

## Security Features

- Row-level security (RLS) in Supabase
- Role-based access control
- Secure session management
- Protected API routes
- Input validation and sanitization

## Future Enhancements

- Real-time notifications for grade updates
- Parent-teacher messaging system
- Advanced reporting and analytics
- Mobile app version
- Integration with external BilimClass API
- Student goal-setting and tracking
- Peer comparison (anonymized rankings)
- Homework submission system

## Contributing

To add new features:
1. Follow the existing code structure
2. Use TypeScript for type safety
3. Create reusable components
4. Add proper error handling
5. Test across different roles

## Support

For issues or questions:
1. Check the database schema in `supabase-schema.sql`
2. Review environment variable setup in `.env.example`
3. Check browser console for client-side errors
4. Review server logs for API errors

## License

MIT

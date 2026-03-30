# Architecture & Developer Guide

## System Design

The Aqbobek Lyceum Portal follows a scalable, modular architecture designed for easy feature expansion.

### Core Principles

1. **Separation of Concerns**: UI, business logic, and data layer are completely separated
2. **Type Safety**: Full TypeScript implementation with strict typing
3. **Scalability**: Mock data easily replaced with real APIs
4. **Performance**: Server-side rendering, optimized queries, caching ready
5. **Security**: RLS at database level, role-based access control, input validation

## Directory Structure Deep Dive

```
app/
├── api/                           # API routes (Next.js 16 app router)
│   ├── ai-mentor/route.ts         # Streaming AI responses
│   └── bilimclass/grades/route.ts # Mock BilimClass integration
│
├── dashboard/                     # Protected dashboard routes
│   ├── page.tsx                   # Role-based router
│   ├── layout.tsx                 # Dashboard wrapper
│   ├── ai-mentor/page.tsx         # AI coaching interface
│   ├── grades/page.tsx            # View grades
│   ├── achievements/page.tsx      # View achievements
│   ├── events/page.tsx            # View events
│   ├── students/page.tsx          # Teacher: view class
│   ├── at-risk/page.tsx           # Teacher: identify at-risk
│   ├── record-grade/page.tsx      # Teacher: add grades
│   ├── record-achievement/page.tsx # Teacher: add achievements
│   ├── manage-events/page.tsx      # Admin: manage events
│   └── analytics/page.tsx         # Admin: view stats
│
├── kiosk/page.tsx                 # Bulletin board (no auth)
├── login/page.tsx                 # Authentication
├── page.tsx                       # Landing page
├── layout.tsx                     # Root layout with auth provider
└── globals.css                    # Design tokens and base styles

components/
├── dashboard/
│   ├── header.tsx                 # Top navigation
│   ├── sidebar.tsx                # Desktop sidebar
│   ├── mobile-sidebar.tsx         # Mobile navigation
│   └── views/
│       ├── student-dashboard.tsx  # Student overview
│       ├── teacher-dashboard.tsx  # Teacher overview
│       ├── parent-dashboard.tsx   # Parent overview
│       └── admin-dashboard.tsx    # Admin overview
│
├── cards/                         # Reusable card components
│   ├── grade-card.tsx             # Display single grade
│   ├── achievement-card.tsx       # Display achievement
│   ├── event-card.tsx             # Display event
│   ├── student-risk-card.tsx      # Show at-risk indicator
│   └── stat-card.tsx              # Display statistics
│
├── notifications/
│   └── notification.tsx           # Alert/notification
│
└── ui/                            # shadcn/ui components (pre-installed)

lib/
├── supabase/
│   └── client.ts                  # Supabase client instance
│
├── context/
│   └── auth-context.tsx           # Global auth state
│
├── types/
│   └── database.ts                # Database type definitions
│
├── services/
│   ├── data-service.ts            # Database queries wrapper
│   ├── bilimclass-api.ts          # Mock grade API
│   └── auth-service.ts            # Authentication logic
│
└── mock/
    └── data.ts                    # Mock data for development

hooks/
├── use-auth.ts                    # Auth context hook
└── use-fetch.ts                   # Fetch wrapper with loading

public/                            # Static assets
styles/                            # Global styles

Configuration Files:
├── next.config.mjs                # Next.js configuration
├── tailwind.config.js             # (In globals.css v4)
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
└── .env.example                   # Environment template
```

## Data Flow Architecture

### Authentication Flow
```
User Input (login page)
    ↓
auth-service.ts (validation)
    ↓
Supabase Auth
    ↓
auth-context.tsx (store user + role)
    ↓
Dashboard Router (redirect based on role)
    ↓
Role-specific dashboard (student/teacher/parent/admin)
```

### Grade Management Flow
```
Teacher Records Grade
    ↓
record-grade/page.tsx (form)
    ↓
POST /api/bilimclass/grades
    ↓
bilimclass-api.ts (validation)
    ↓
Supabase: INSERT into grades table
    ↓
RLS Policy: Check teacher_id matches
    ↓
Database updated
    ↓
Student's grades page refreshes (via SWR pattern)
```

### AI Mentor Flow
```
Student Message
    ↓
ai-mentor/page.tsx (client chat)
    ↓
POST /api/ai-mentor (with student data)
    ↓
data-service.ts (fetch grades/achievements)
    ↓
AI Route Handler (build system prompt)
    ↓
Vercel AI SDK (streaming response)
    ↓
StreamResponse back to client
    ↓
Display in chat interface
```

### Kiosk Auto-Scroll Flow
```
Page Load (/kiosk)
    ↓
Load: Events, Rankings, Achievements
    ↓
setInterval (10s) → switch slide
    ↓
setInterval (50ms) → scroll events
    ↓
setInterval (5min) → refresh data
    ↓
Display updates on screen
```

## Component Hierarchy

### Dashboard Layout Structure
```
app/dashboard/layout.tsx (wrapper)
    ├── Header (title, user info, logout)
    ├── Sidebar / Mobile Sidebar (nav)
    └── Main Content
        ├── dashboard/page.tsx (router)
        └── [specific-page]
            └── Role-specific dashboard
                ├── StatCard
                ├── GradeCard / AchievementCard / EventCard
                └── Charts/Lists
```

### Reusable Components Pattern
```
Card Component (props-based)
    ├── Props: data, onAction callbacks
    ├── Render: UI with data
    └── Export: Used in multiple pages

Example: GradeCard
    Props: { subject, grade, trend, description }
    Used in: grades/page.tsx, student-dashboard.tsx, parent-dashboard.tsx
```

## Type System

### Key Types (lib/types/database.ts)
```typescript
User {
  id: UUID
  role: 'student' | 'teacher' | 'parent' | 'admin'
  class?: string
  student_id?: string
}

Grade {
  id: UUID
  student_id: UUID
  score: number (0-100)
  max_score: number
  subject: string
  date: Date
}

Achievement {
  id: UUID
  student_id: UUID
  title: string
  category: string
  points: number
  level: 'gold' | 'silver' | 'bronze'
}

Event {
  id: UUID
  title: string
  start_date: Date
  end_date?: Date
  category: string
  location?: string
}
```

## Authentication & Authorization

### User Roles & Permissions

| Feature | Student | Teacher | Parent | Admin |
|---------|---------|---------|--------|-------|
| View own grades | ✓ | - | ✓ | ✓ |
| View all grades | - | ✓ | - | ✓ |
| Record grades | - | ✓ | - | ✓ |
| View rankings | ✓ | ✓ | ✓ | ✓ |
| Award achievements | - | ✓ | - | ✓ |
| Manage events | - | - | - | ✓ |
| View analytics | - | - | - | ✓ |
| Access AI Mentor | ✓ | - | ✓ | - |

### RLS Policies
- **grades table**: Students see own, teachers/admins see all
- **achievements table**: Students/teachers/admins see all
- **events table**: Everyone sees public events
- **users table**: Users see own profile, admins see all

## Adding New Features

### Example: Add Assignment Submission Feature

1. **Update Database Schema**
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  student_id UUID REFERENCES users(id),
  submission_date TIMESTAMP,
  grade NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);
```

2. **Add Types** (lib/types/database.ts)
```typescript
export interface Assignment {
  id: string
  title: string
  student_id: string
  submission_date: Date
  grade?: number
}
```

3. **Create Service** (lib/services/assignment-service.ts)
```typescript
export async function getStudentAssignments(studentId: string) {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', studentId)
  
  if (error) throw error
  return data
}
```

4. **Create Component** (components/cards/assignment-card.tsx)
```typescript
export function AssignmentCard({ assignment, onSubmit }) {
  return (
    <Card>
      <CardHeader><CardTitle>{assignment.title}</CardTitle></CardHeader>
      <CardContent>
        {/* Assignment UI */}
      </CardContent>
    </Card>
  )
}
```

5. **Create Page** (app/dashboard/assignments/page.tsx)
```typescript
export default function AssignmentsPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  
  useEffect(() => {
    getStudentAssignments(user.id).then(setAssignments)
  }, [user])
  
  return (
    <div>
      {assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)}
    </div>
  )
}
```

6. **Add Navigation** (components/dashboard/sidebar.tsx)
- Add link to assignments page

## Performance Considerations

### Current Optimizations
- Components split into multiple files (tree-shaking)
- Server-side rendering for initial load
- Efficient database queries with indexes
- Card components designed for reusability

### Potential Future Optimizations
- Implement SWR for client-side caching
- Add pagination for large datasets
- Optimize kiosk mode for continuous display
- Service worker for offline support
- Image optimization with Next.js Image

## Testing Strategy

### Unit Tests (Services)
```typescript
// test: data-service.ts
describe('getGradesForStudent', () => {
  it('returns grades for valid student', async () => {
    const grades = await getGradesForStudent('student-1')
    expect(grades.length).toBeGreaterThan(0)
  })
})
```

### Integration Tests (Pages)
```typescript
// test: dashboard page
describe('Student Dashboard', () => {
  it('displays student grades', async () => {
    render(<StudentDashboard user={mockStudent} />)
    expect(screen.getByText('Your Grades')).toBeInTheDocument()
  })
})
```

## Deployment Checklist

- [ ] All environment variables set
- [ ] Database schema migrated
- [ ] RLS policies verified
- [ ] Supabase backups enabled
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Security headers set
- [ ] SSL/TLS enabled

## Common Development Tasks

### Add a New Subject
1. Update `mockGrades` in `lib/mock/data.ts`
2. Data services automatically include it
3. Grade components adapt dynamically

### Change AI Model
1. Edit `app/api/ai-mentor/route.ts`
2. Change `model: 'openai/gpt-4o-mini'` to desired model
3. Update system prompt if needed

### Add New Role
1. Update role enum in `lib/types/database.ts`
2. Add RLS policies in database schema
3. Create new dashboard view
4. Update routing logic in `dashboard/page.tsx`

### Connect Real API
1. Create new service file in `lib/services/`
2. Replace mock implementation
3. Add error handling and retries
4. Add environment variables as needed

## Debugging Tips

### Check Authentication
```typescript
// In any page
const { user } = useAuth()
console.log('Current user:', user)
```

### Verify Database Connection
```typescript
// In lib/supabase/client.ts context
const { data, error } = await supabase.from('users').select('*').limit(1)
console.log('DB Connection:', { data, error })
```

### Monitor AI Requests
- Open browser DevTools → Network tab
- Look for requests to `/api/ai-mentor`
- Check request/response bodies

### Check RLS Policies
- Supabase Dashboard → Authentication → Policies
- Verify policies allow intended access
- Check user role matches policy conditions
